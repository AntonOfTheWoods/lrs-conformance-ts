import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { runRegistryVersion } from "../src/execution/runner";
import {
  compareParityTrees,
  getRuntimeRunRoot,
  normalizeParityTree,
  type NormalizedParityRecord,
  type ParityComparisonResult,
} from "../src/parity/comparison";
import { createV103ProofSliceRegistry } from "../src/specs/v1_0_3/proof-slice";
import { createProofSliceRegistry } from "../src/specs/v2_0/proof-slice";

type SupportedSpecVersion = "2.0.0" | "1.0.3";

interface CompareLiveConfig {
  baseUrl: string;
  upstreamPath: string;
  version: SupportedSpecVersion;
  outputPath: string;
  username?: string;
  password?: string;
  leftIncludeRoot?: boolean;
  rightIncludeRoot?: boolean;
  allowPartialUpstream: boolean;
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function getOptionalBooleanFlag(args: string[], flag: string): boolean | undefined {
  const value = getFlagValue(args, flag);
  if (value === undefined) {
    return undefined;
  }

  return value !== "false";
}

function readSummary(value: unknown): { total?: number; passed?: number; failed?: number } | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const summary = (value as { summary?: unknown }).summary;
  if (typeof summary !== "object" || summary === null) {
    return undefined;
  }

  const typed = summary as { total?: unknown; passed?: unknown; failed?: unknown };
  return {
    total: typeof typed.total === "number" ? typed.total : undefined,
    passed: typeof typed.passed === "number" ? typed.passed : undefined,
    failed: typeof typed.failed === "number" ? typed.failed : undefined,
  };
}

function toTreeNodeLike(value: unknown): { title?: string; name?: string } | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  return value as { title?: string; name?: string };
}

function autoRightIncludeRoot(root: unknown): boolean {
  const node = toTreeNodeLike(root);
  if (!node) {
    return false;
  }

  const title = (node.title ?? node.name ?? "").trim();
  return title.length > 0;
}

function normalizeTitleOnlyKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\brequirements?\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "of",
  "for",
  "with",
  "without",
  "using",
  "use",
  "when",
  "where",
  "that",
  "this",
  "is",
  "are",
  "be",
  "as",
  "on",
  "in",
  "by",
  "from",
  "at",
  "it",
  "its",
  "must",
  "should",
  "can",
  "has",
  "have",
  "upon",
  "processing",
]);

const PHRASE_ALIASES: Array<[RegExp, string]> = [
  [
    /concurrency \/ xapi uses http 1\.1 entity tags to implement optimistic concurrency control in the following resources, where put, post or delete are allowed to overwrite or remove existing data\./g,
    "communication concurrency",
  ],
  [
    /content type \/ an lrs rejects with error code 400 bad request, a request which uses attachments and does not have a content-type header with value application \/json or multipart \/mixed/g,
    "communication content types attachments",
  ],
  [/content type \/ an lrs rejects with error code 400 bad request/g, "communication content types"],
  [/statement resource \/ an lrss? statement resource/g, "statements statement query"],
  [
    /statement resource \/ an lrs has a statement resource with endpoint base iri\+ \/statements/g,
    "statements statement query",
  ],
  [
    /statement resource \/ an lrs cannot modify a statement, state, or object in the event it receives a statement with statementid equal to a statement in the lrs already\./g,
    "statements statement id immutability",
  ],
  [/accept-language header/g, "language"],
  [/voidedstatementid/g, "voided statement id"],
  [/statementid/g, "statement id"],
  [/related_activities/g, "related activities"],
];

const PREFIX_ALIASES: Array<[RegExp, string]> = [
  [/^concurrency\s*\//, "communication / concurrency /"],
  [/^content type\s*\//, "communication / content types /"],
  [/^statement resource\s*\//, "statements / statement query /"],
];

function applyPhraseAliases(value: string): string {
  let normalized = value;
  for (const [pattern, replacement] of PHRASE_ALIASES) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

function applyPrefixAliases(value: string): string {
  let normalized = value;
  for (const [pattern, replacement] of PREFIX_ALIASES) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

function canonicalMatchKey(record: NormalizedParityRecord): string {
  const base = record.key.toLowerCase();
  // Upstream trees use different top-level suite taxonomies; normalize them first.
  const withPrefixes = record.source === "upstream" ? applyPrefixAliases(base) : base;
  return applyPhraseAliases(withPrefixes);
}

function normalizeSimilarityText(value: string): string {
  return applyPhraseAliases(value.toLowerCase())
    .replace(/["']/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\blrss\b/g, "lrs")
    .replace(/\bxapi\b/g, "xapi")
    .replace(/\bstatementresult\b/g, "statement result")
    .replace(/\bmultipart\s*\/\s*mixed\b/g, "multipart mixed")
    .replace(/\bapplication\s*\/\s*json\b/g, "application json")
    .replace(/\bif-match\b/g, "if match")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeToken(token: string): string {
  if (token.endsWith("ies") && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }

  if (token.endsWith("es") && token.length > 4) {
    return token.slice(0, -2);
  }

  if (token.endsWith("s") && token.length > 3) {
    return token.slice(0, -1);
  }

  return token;
}

function tokenizeSimilarity(value: string): Set<string> {
  const normalized = normalizeSimilarityText(value);
  if (!normalized) {
    return new Set();
  }

  const tokens = normalized
    .split(" ")
    .map((token) => normalizeToken(token))
    .filter((token) => token.length > 1)
    .filter((token) => !STOP_WORDS.has(token));

  return new Set(tokens);
}

function jaccardSimilarity(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) {
      intersection += 1;
    }
  }

  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function overlapCount(left: Set<string>, right: Set<string>): number {
  let overlap = 0;
  for (const token of left) {
    if (right.has(token)) {
      overlap += 1;
    }
  }

  return overlap;
}

function similarityScore(left: NormalizedParityRecord, right: NormalizedParityRecord): number {
  const scoreForKeys = (leftKey: string, rightKey: string): number => {
    const leftText = normalizeSimilarityText(leftKey);
    const rightText = normalizeSimilarityText(rightKey);
    const leftTokens = tokenizeSimilarity(leftKey);
    const rightTokens = tokenizeSimilarity(rightKey);
    const jaccard = jaccardSimilarity(leftTokens, rightTokens);
    const overlap = overlapCount(leftTokens, rightTokens);
    const phraseBoost = leftText.includes(rightText) || rightText.includes(leftText) ? 0.2 : 0;
    const overlapBoost = overlap >= 4 ? 0.1 : 0;
    return jaccard + phraseBoost + overlapBoost;
  };

  const rawScore = scoreForKeys(left.key, right.key);
  const canonicalScore = scoreForKeys(canonicalMatchKey(left), canonicalMatchKey(right));
  return Math.max(rawScore, canonicalScore);
}

function compareByCaseSimilarity(
  leftRoot: unknown,
  rightRoot: unknown,
  leftIncludeRoot: boolean,
  rightIncludeRoot: boolean,
): ParityComparisonResult {
  const leftRecords = normalizeParityTree(leftRoot, "rewrite", { includeRoot: leftIncludeRoot }).filter(
    (record) => record.kind === "case",
  );
  const rightRecords = normalizeParityTree(rightRoot, "upstream", { includeRoot: rightIncludeRoot }).filter(
    (record) => record.kind === "case",
  );

  const candidatePairs: Array<{ leftIndex: number; rightIndex: number; score: number }> = [];
  for (let leftIndex = 0; leftIndex < leftRecords.length; leftIndex += 1) {
    const left = leftRecords[leftIndex];
    if (!left) {
      continue;
    }

    for (let rightIndex = 0; rightIndex < rightRecords.length; rightIndex += 1) {
      const right = rightRecords[rightIndex];
      if (!right) {
        continue;
      }

      const score = similarityScore(left, right);
      if (score >= 0.5) {
        candidatePairs.push({ leftIndex, rightIndex, score });
      }
    }
  }

  candidatePairs.sort((a, b) => b.score - a.score);

  const usedLeft = new Set<number>();
  const usedRight = new Set<number>();
  const matched: ParityComparisonResult["matched"] = [];
  const statusMismatches: ParityComparisonResult["statusMismatches"] = [];

  for (const pair of candidatePairs) {
    if (usedLeft.has(pair.leftIndex) || usedRight.has(pair.rightIndex)) {
      continue;
    }

    const left = leftRecords[pair.leftIndex];
    const right = rightRecords[pair.rightIndex];
    if (!left || !right) {
      continue;
    }

    usedLeft.add(pair.leftIndex);
    usedRight.add(pair.rightIndex);

    const match = {
      key: `${left.key} ~= ${right.key}`,
      left,
      right,
    };
    matched.push(match);

    if (left.status !== right.status) {
      statusMismatches.push({
        ...match,
        leftStatus: left.status,
        rightStatus: right.status,
      });
    }
  }

  const leftOnly = leftRecords.filter((_, index) => !usedLeft.has(index));
  const rightOnly = rightRecords.filter((_, index) => !usedRight.has(index));

  return {
    matched,
    statusMismatches,
    leftOnly,
    rightOnly,
  };
}

function compareByCaseTitle(
  leftRoot: unknown,
  rightRoot: unknown,
  leftIncludeRoot: boolean,
  rightIncludeRoot: boolean,
): ParityComparisonResult {
  const leftRecords = normalizeParityTree(leftRoot, "rewrite", { includeRoot: leftIncludeRoot }).filter(
    (record) => record.kind === "case",
  );
  const rightRecords = normalizeParityTree(rightRoot, "upstream", { includeRoot: rightIncludeRoot }).filter(
    (record) => record.kind === "case",
  );

  const leftByKey = new Map<string, NormalizedParityRecord[]>();
  const rightByKey = new Map<string, NormalizedParityRecord[]>();

  for (const record of leftRecords) {
    const key = normalizeTitleOnlyKey(record.title);
    const bucket = leftByKey.get(key) ?? [];
    bucket.push(record);
    leftByKey.set(key, bucket);
  }

  for (const record of rightRecords) {
    const key = normalizeTitleOnlyKey(record.title);
    const bucket = rightByKey.get(key) ?? [];
    bucket.push(record);
    rightByKey.set(key, bucket);
  }

  const allKeys = [...new Set([...leftByKey.keys(), ...rightByKey.keys()])].sort();
  const matched: ParityComparisonResult["matched"] = [];
  const statusMismatches: ParityComparisonResult["statusMismatches"] = [];
  const leftOnly: NormalizedParityRecord[] = [];
  const rightOnly: NormalizedParityRecord[] = [];

  for (const key of allKeys) {
    const leftBucket = leftByKey.get(key) ?? [];
    const rightBucket = rightByKey.get(key) ?? [];
    const pairCount = Math.min(leftBucket.length, rightBucket.length);

    for (let index = 0; index < pairCount; index += 1) {
      const left = leftBucket[index];
      const right = rightBucket[index];
      if (!left || !right) {
        continue;
      }

      const match = {
        key,
        left,
        right,
      };
      matched.push(match);

      if (left.status !== right.status) {
        statusMismatches.push({
          ...match,
          leftStatus: left.status,
          rightStatus: right.status,
        });
      }
    }

    if (leftBucket.length > pairCount) {
      leftOnly.push(...leftBucket.slice(pairCount));
    }

    if (rightBucket.length > pairCount) {
      rightOnly.push(...rightBucket.slice(pairCount));
    }
  }

  return {
    matched,
    statusMismatches,
    leftOnly,
    rightOnly,
  };
}

function usage(): string {
  return [
    "Usage:",
    "  bun run compare:live -- --base-url <url> --upstream <upstream-run.json> [--version 2.0.0|1.0.3] [--out <path>] [--username <user> --password <pass>]",
    "",
    "Defaults:",
    "  --version 2.0.0",
    "  --out tmp/agents/live-run.json",
    "  --left-include-root false",
    "  --right-include-root false (auto-enabled only when upstream root has a non-empty title)",
    "  --allow-partial-upstream false",
    "",
    "Example:",
    "  bun run compare:live -- --base-url http://localhost:8100/xAPI --username janedoe --password supersecret --upstream tmp/agents/upstream-run.json",
  ].join("\n");
}

function parseConfig(args: string[]): CompareLiveConfig | undefined {
  const baseUrl = getFlagValue(args, "--base-url");
  const upstreamPath = getFlagValue(args, "--upstream");
  const versionFlag = getFlagValue(args, "--version") ?? "2.0.0";
  const outputPath = getFlagValue(args, "--out") ?? "tmp/agents/live-run.json";
  const username = getFlagValue(args, "--username");
  const password = getFlagValue(args, "--password");
  const leftIncludeRoot = getOptionalBooleanFlag(args, "--left-include-root");
  const rightIncludeRoot = getOptionalBooleanFlag(args, "--right-include-root");
  const allowPartialUpstream = getOptionalBooleanFlag(args, "--allow-partial-upstream") ?? false;

  if (!baseUrl || !upstreamPath) {
    return undefined;
  }

  if (versionFlag !== "2.0.0" && versionFlag !== "1.0.3") {
    throw new Error(`Unsupported --version value: ${versionFlag}`);
  }

  if ((username && !password) || (!username && password)) {
    throw new Error("Provide both --username and --password together.");
  }

  return {
    baseUrl,
    upstreamPath,
    version: versionFlag,
    outputPath,
    username,
    password,
    leftIncludeRoot,
    rightIncludeRoot,
    allowPartialUpstream,
  };
}

function buildRegistry(version: SupportedSpecVersion) {
  if (version === "2.0.0") {
    return createProofSliceRegistry();
  }

  return createV103ProofSliceRegistry();
}

async function loadJson(path: string): Promise<unknown> {
  try {
    const text = await readFile(path, "utf8");
    return JSON.parse(text);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "ENOENT") {
      throw new Error(
        `Upstream artifact not found at ${path}. Run \`bun run export:upstream:lrsql\` first or set --upstream to an existing file.`,
      );
    }

    throw error;
  }
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const config = parseConfig(args);

  if (!config) {
    console.error(usage());
    return 1;
  }

  const registry = buildRegistry(config.version);
  const run = await runRegistryVersion(registry, config.version, {
    baseUrl: config.baseUrl,
    auth:
      config.username && config.password
        ? {
            basic: {
              username: config.username,
              password: config.password,
            },
          }
        : undefined,
  });

  const absoluteOutputPath = resolve(config.outputPath);
  await mkdir(dirname(absoluteOutputPath), { recursive: true });

  const livePayload = {
    generatedAt: new Date().toISOString(),
    target: {
      baseUrl: config.baseUrl,
      version: config.version,
      authMode: config.username && config.password ? "basic" : "default",
    },
    run,
  };

  await writeFile(absoluteOutputPath, `${JSON.stringify(livePayload, null, 2)}\n`, "utf8");

  const upstreamPayload = await loadJson(config.upstreamPath);
  const upstreamRoot = getRuntimeRunRoot(
    upstreamPayload as {
      root?: unknown;
      log?: unknown;
      run?: { root?: unknown; log?: unknown };
    },
  );
  const leftIncludeRoot = config.leftIncludeRoot ?? false;
  const rightIncludeRoot = config.rightIncludeRoot ?? autoRightIncludeRoot(upstreamRoot);

  const upstreamSummary = readSummary(upstreamPayload);
  const upstreamTotal = upstreamSummary?.total;
  const upstreamExecuted =
    typeof upstreamSummary?.passed === "number" && typeof upstreamSummary?.failed === "number"
      ? upstreamSummary.passed + upstreamSummary.failed
      : undefined;
  if (
    !config.allowPartialUpstream &&
    typeof upstreamTotal === "number" &&
    typeof upstreamExecuted === "number" &&
    upstreamTotal > 0 &&
    upstreamExecuted < upstreamTotal
  ) {
    const executedPct = ((upstreamExecuted / upstreamTotal) * 100).toFixed(2);
    throw new Error(
      [
        "Upstream run appears partial and is unsafe for parity comparison.",
        `upstream summary: executed=${upstreamExecuted}, total=${upstreamTotal} (${executedPct}%).`,
        "Re-run upstream until execution is complete, or pass --allow-partial-upstream true to force a partial comparison.",
      ].join(" "),
    );
  }

  const strictComparison = compareParityTrees(getRuntimeRunRoot(livePayload), upstreamRoot, {
    leftIncludeRoot,
    rightIncludeRoot,
  });

  const shouldUseTitleFallback = strictComparison.matched.length === 0 && strictComparison.rightOnly.length > 0;
  const titleFallbackComparison = shouldUseTitleFallback
    ? compareByCaseTitle(getRuntimeRunRoot(livePayload), upstreamRoot, leftIncludeRoot, rightIncludeRoot)
    : strictComparison;
  const shouldUseSimilarityFallback =
    shouldUseTitleFallback &&
    titleFallbackComparison.matched.length === 0 &&
    titleFallbackComparison.rightOnly.length > 0;
  const comparison = shouldUseSimilarityFallback
    ? compareByCaseSimilarity(getRuntimeRunRoot(livePayload), upstreamRoot, leftIncludeRoot, rightIncludeRoot)
    : titleFallbackComparison;

  const summary = {
    exportedRun: {
      outputPath: absoluteOutputPath,
      version: run.version,
      status: run.status,
      events: run.events.length,
    },
    comparison: {
      strategy: shouldUseSimilarityFallback
        ? "token-similarity-fallback"
        : shouldUseTitleFallback
          ? "title-only-fallback"
          : "strict-path",
      matched: comparison.matched.length,
      statusMismatches: comparison.statusMismatches.length,
      leftOnly: comparison.leftOnly.length,
      rightOnly: comparison.rightOnly.length,
    },
  };

  console.log(JSON.stringify(summary, null, 2));

  if (comparison.statusMismatches.length > 0) {
    console.log("\nStatus mismatches:");
    for (const mismatch of comparison.statusMismatches) {
      console.log(`- ${mismatch.key}: ${mismatch.leftStatus} vs ${mismatch.rightStatus}`);
    }
  }

  if (comparison.leftOnly.length > 0) {
    console.log("\nLeft-only cases:");
    for (const record of comparison.leftOnly) {
      console.log(`- ${record.key}`);
    }
  }

  if (comparison.rightOnly.length > 0) {
    console.log("\nRight-only cases:");
    for (const record of comparison.rightOnly) {
      console.log(`- ${record.key}`);
    }
  }

  return comparison.statusMismatches.length === 0 &&
    comparison.leftOnly.length === 0 &&
    comparison.rightOnly.length === 0
    ? 0
    : 1;
}

try {
  process.exitCode = await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
