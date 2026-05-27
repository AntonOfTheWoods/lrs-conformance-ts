import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, isAbsolute, relative, resolve } from "node:path";

type FingerprintTable = {
  columnNames: string[];
  rowCount: number;
  rowHash: string;
};

type FingerprintArtifact = {
  tables: Record<string, FingerprintTable>;
};

type RawTrafficMessage = {
  bodyBase64: string;
  headers: Array<[string, string]>;
};

type RawTrafficExchange = {
  durationMs: number;
  endedAt: string;
  request: RawTrafficMessage & {
    method: string;
    targetUrl: string;
  };
  response: RawTrafficMessage & {
    status: number;
  };
  sequence: number;
  startedAt: string;
};

type RawTrafficArtifact = {
  exchanges: RawTrafficExchange[];
  runner: "rewrite" | "upstream";
  version: "1.0.3" | "2.0.0";
};

type ProbeRecord = {
  leftFingerprintPath: string;
  prefix: number;
  rightFingerprintPath: string;
  unequal: boolean;
};

type BisectReport = {
  firstDivergentPrefix: number | null;
  leftArtifactPath: string;
  maxPrefix: number;
  probes: ProbeRecord[];
  rightArtifactPath: string;
  verifiedFullPrefixDiverges: boolean;
  verifiedZeroPrefixEqual: boolean;
};

type TableDifference = {
  left?: FingerprintTable;
  right?: FingerprintTable;
  table: string;
};

type ComparisonResult = {
  different: boolean;
  onlyLeft: string[];
  onlyRight: string[];
  rowHashOrCountDifferences: TableDifference[];
};

type ExchangeSummary = {
  endedAt: string;
  index: number;
  method: string;
  owner: string | null;
  path: string;
  query: string;
  requestBody: unknown;
  requestContentType: string | null;
  responseBody: unknown;
  responseContentType: string | null;
  responseStatus: number;
  sequence: number;
  startedAt: string;
  targetUrl: string;
};

type AttributionReport = {
  classification: string;
  divergenceAtFirstDivergentPrefix: ComparisonResult;
  exchangeIndex: number;
  firstDivergentPrefix: number;
  intervalIsSingleAction: boolean;
  left: {
    deltaFromPriorEqualPrefix: ComparisonResult;
    exchange: ExchangeSummary;
    runner: "rewrite" | "upstream";
    version: "1.0.3" | "2.0.0";
  };
  priorEqualPrefix: number;
  right: {
    deltaFromPriorEqualPrefix: ComparisonResult;
    exchange: ExchangeSummary;
    runner: "rewrite" | "upstream";
    version: "1.0.3" | "2.0.0";
  };
  sourceReportPath: string;
};

type Config = {
  outPath: string;
  reportPath: string;
};

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactsRoot = resolve(repoRoot, "tmp/agents");
const ownerHeaderName = "x-lrs-conformance-owner";

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/attribute-db-divergence.ts --report <bisect-report.json> [--out <path>]",
    "",
    "Notes:",
    "  Requires the bisect report to reference probe fingerprint artifacts for the prior equal prefix and first divergent prefix.",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function isWithinPath(basePath: string, candidatePath: string): boolean {
  const relativePath = relative(basePath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function resolveSafeArtifactPath(pathValue: string): string {
  const absolutePath = resolve(pathValue);
  if (!isWithinPath(allowedArtifactsRoot, absolutePath)) {
    throw new Error(`Output path ${absolutePath} is outside ${allowedArtifactsRoot}.`);
  }

  return absolutePath;
}

function parseConfig(args: string[]): Config {
  if (args.includes("--help") || args.includes("-h")) {
    throw new Error(usage());
  }

  const reportPath = getFlagValue(args, "--report");
  if (!reportPath) {
    throw new Error(`--report is required.\n\n${usage()}`);
  }

  return {
    outPath: resolveSafeArtifactPath(
      getFlagValue(args, "--out") ?? resolve(repoRoot, "tmp/agents/db-bisect", `${Date.now()}-attribution.json`),
    ),
    reportPath: resolve(reportPath),
  };
}

async function readJson<T>(pathValue: string): Promise<T> {
  const raw = await readFile(pathValue, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function compareFingerprints(left: FingerprintArtifact, right: FingerprintArtifact): ComparisonResult {
  const leftTables = Object.keys(left.tables).sort();
  const rightTables = Object.keys(right.tables).sort();
  const leftSet = new Set(leftTables);
  const rightSet = new Set(rightTables);

  const onlyLeft = leftTables.filter((tableName) => !rightSet.has(tableName));
  const onlyRight = rightTables.filter((tableName) => !leftSet.has(tableName));
  const sharedTables = leftTables.filter((tableName) => rightSet.has(tableName));
  const rowHashOrCountDifferences: TableDifference[] = [];

  for (const tableName of sharedTables) {
    const leftTable = left.tables[tableName];
    const rightTable = right.tables[tableName];
    if (!leftTable || !rightTable) {
      continue;
    }

    if (leftTable.rowCount !== rightTable.rowCount || leftTable.rowHash !== rightTable.rowHash) {
      rowHashOrCountDifferences.push({
        left: leftTable,
        right: rightTable,
        table: tableName,
      });
    }
  }

  return {
    different: onlyLeft.length > 0 || onlyRight.length > 0 || rowHashOrCountDifferences.length > 0,
    onlyLeft,
    onlyRight,
    rowHashOrCountDifferences,
  };
}

function getHeaderValue(headers: Array<[string, string]>, name: string): string | null {
  const match = headers.find(([headerName]) => headerName.toLowerCase() === name.toLowerCase());
  return match?.[1] ?? null;
}

function decodeOwnerHeaderValue(value: string | null): string | null {
  if (!value) {
    return value;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isPrintableAsciiText(value: string): boolean {
  return Array.from(value).every((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d || (codePoint >= 0x20 && codePoint <= 0x7e);
  });
}

function decodeBody(bodyBase64: string, contentType: string | null): unknown {
  if (!bodyBase64) {
    return null;
  }

  const buffer = Buffer.from(bodyBase64, "base64");
  if (buffer.byteLength === 0) {
    return null;
  }

  const text = buffer.toString("utf8");
  if (contentType?.toLowerCase().includes("json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  if (isPrintableAsciiText(text)) {
    return text;
  }

  return {
    byteLength: buffer.byteLength,
    kind: "binary",
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}

function getSortedExchange(artifact: RawTrafficArtifact, index: number): RawTrafficExchange {
  const exchanges = [...artifact.exchanges].sort((left, right) => left.sequence - right.sequence);
  const exchange = exchanges[index];
  if (!exchange) {
    throw new Error(`Missing exchange at sorted index ${index}.`);
  }

  return exchange;
}

function summarizeExchange(exchange: RawTrafficExchange, index: number): ExchangeSummary {
  const requestContentType = getHeaderValue(exchange.request.headers, "content-type");
  const responseContentType = getHeaderValue(exchange.response.headers, "content-type");
  const requestUrl = new URL(exchange.request.targetUrl);

  return {
    endedAt: exchange.endedAt,
    index,
    method: exchange.request.method,
    owner: decodeOwnerHeaderValue(getHeaderValue(exchange.request.headers, ownerHeaderName)),
    path: requestUrl.pathname,
    query: requestUrl.searchParams.toString(),
    requestBody: decodeBody(exchange.request.bodyBase64, requestContentType),
    requestContentType,
    responseBody: decodeBody(exchange.response.bodyBase64, responseContentType),
    responseContentType,
    responseStatus: exchange.response.status,
    sequence: exchange.sequence,
    startedAt: exchange.startedAt,
    targetUrl: exchange.request.targetUrl,
  };
}

function getProbe(report: BisectReport, prefix: number): ProbeRecord | undefined {
  return report.probes.find((probe) => probe.prefix === prefix);
}

function classifyDivergence(
  leftExchange: ExchangeSummary,
  rightExchange: ExchangeSummary,
  leftDelta: ComparisonResult,
  rightDelta: ComparisonResult,
): string {
  const leftAccepted = leftExchange.responseStatus >= 200 && leftExchange.responseStatus < 300;
  const rightAccepted = rightExchange.responseStatus >= 200 && rightExchange.responseStatus < 300;

  if (leftAccepted && !rightAccepted && leftDelta.different && !rightDelta.different) {
    return "left accepted a state-changing write that right rejected without mutating state";
  }

  if (!leftAccepted && rightAccepted && !leftDelta.different && rightDelta.different) {
    return "right accepted a state-changing write that left rejected without mutating state";
  }

  if (leftDelta.different && rightDelta.different) {
    return "both sides mutated state at the divergent action, but to different resulting states";
  }

  if (leftExchange.responseStatus !== rightExchange.responseStatus) {
    return "response status diverged at the causal action, but state deltas were not asymmetric enough for a narrower classification";
  }

  return "first divergent prefix identified, but the causal classification remains ambiguous from status and fingerprint deltas alone";
}

async function main(): Promise<void> {
  const config = parseConfig(process.argv.slice(2));
  const bisectReport = await readJson<BisectReport>(config.reportPath);
  const firstDivergentPrefix = bisectReport.firstDivergentPrefix;
  if (firstDivergentPrefix === null) {
    throw new Error("The bisect report does not contain a divergent prefix.");
  }

  if (firstDivergentPrefix <= 0) {
    throw new Error("Cannot attribute a divergence at prefix 0.");
  }

  const priorEqualPrefix = Math.max(
    ...bisectReport.probes
      .filter((probe) => !probe.unequal && probe.prefix < firstDivergentPrefix)
      .map((probe) => probe.prefix),
  );
  if (!Number.isFinite(priorEqualPrefix)) {
    throw new Error("The bisect report does not contain a prior equal prefix to compare against.");
  }

  const priorProbe = getProbe(bisectReport, priorEqualPrefix);
  const divergentProbe = getProbe(bisectReport, firstDivergentPrefix);
  if (!priorProbe || !divergentProbe) {
    throw new Error("Missing probe artifacts for the prior equal or first divergent prefix.");
  }

  const [
    leftBeforeFingerprint,
    leftAtFingerprint,
    rightBeforeFingerprint,
    rightAtFingerprint,
    leftArtifact,
    rightArtifact,
  ] = await Promise.all([
    readJson<FingerprintArtifact>(priorProbe.leftFingerprintPath),
    readJson<FingerprintArtifact>(divergentProbe.leftFingerprintPath),
    readJson<FingerprintArtifact>(priorProbe.rightFingerprintPath),
    readJson<FingerprintArtifact>(divergentProbe.rightFingerprintPath),
    readJson<RawTrafficArtifact>(bisectReport.leftArtifactPath),
    readJson<RawTrafficArtifact>(bisectReport.rightArtifactPath),
  ]);

  const exchangeIndex = firstDivergentPrefix - 1;
  const leftExchange = summarizeExchange(getSortedExchange(leftArtifact, exchangeIndex), exchangeIndex);
  const rightExchange = summarizeExchange(getSortedExchange(rightArtifact, exchangeIndex), exchangeIndex);
  const leftDelta = compareFingerprints(leftBeforeFingerprint, leftAtFingerprint);
  const rightDelta = compareFingerprints(rightBeforeFingerprint, rightAtFingerprint);
  const divergenceAtFirstDivergentPrefix = compareFingerprints(leftAtFingerprint, rightAtFingerprint);

  const attributionReport: AttributionReport = {
    classification: classifyDivergence(leftExchange, rightExchange, leftDelta, rightDelta),
    divergenceAtFirstDivergentPrefix,
    exchangeIndex,
    firstDivergentPrefix,
    intervalIsSingleAction: priorEqualPrefix === exchangeIndex,
    left: {
      deltaFromPriorEqualPrefix: leftDelta,
      exchange: leftExchange,
      runner: leftArtifact.runner,
      version: leftArtifact.version,
    },
    priorEqualPrefix,
    right: {
      deltaFromPriorEqualPrefix: rightDelta,
      exchange: rightExchange,
      runner: rightArtifact.runner,
      version: rightArtifact.version,
    },
    sourceReportPath: config.reportPath,
  };

  await writeJson(config.outPath, attributionReport);
  console.log(
    JSON.stringify(
      {
        classification: attributionReport.classification,
        exchangeIndex: attributionReport.exchangeIndex,
        firstDivergentPrefix: attributionReport.firstDivergentPrefix,
        intervalIsSingleAction: attributionReport.intervalIsSingleAction,
        outPath: config.outPath,
        priorEqualPrefix: attributionReport.priorEqualPrefix,
      },
      null,
      2,
    ),
  );
}

await main();
