import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

import type { CaptureExecutionMetadata } from "../../src/describe-runtime/execution-owner.ts";
import { getMigrationLedgerUnitByUnitKey } from "../../src/describe-runtime/migration-ledger.ts";

import {
  compareNormalizedTrafficRuns,
  normalizeTrafficArtifact,
  renderTrafficComparisonReport,
  startTrafficRecorder,
  type NormalizedExchange,
  type NormalizedTrafficArtifact,
  type RawTrafficArtifact,
  type RawTrafficExchange,
  type TrafficCompareMode,
} from "../traffic.ts";

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactsRoot = resolve(repoRoot, "tmp/agents");

type SupportedVersion = "1.0.3" | "2.0.0";

type RunnerScope = {
  grep?: string;
  rewriteDirectory?: string;
  upstreamDirectory?: string;
  upstreamOptional?: string;
};

const optionalDirectoryNames = new Set(["Multiplicity"]);

function getVersionDirectory(version: SupportedVersion): "v1_0_3" | "v2_0" {
  return version === "1.0.3" ? "v1_0_3" : "v2_0";
}

function isVersionDirectory(value: string): value is "v1_0_3" | "v2_0" {
  return value === "v1_0_3" || value === "v2_0";
}

function escapeRegex(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function combineGreps(left: string | undefined, right: string | undefined): string | undefined {
  if (left && right) {
    return `(?=.*(?:${left}))(?=.*(?:${right}))`;
  }

  return left ?? right;
}

function createDirectoryScopeGrep(directoryNames: string[]): string | undefined {
  if (directoryNames.length === 0) {
    return undefined;
  }

  return `\\b(?:${directoryNames.map((directoryName) => escapeRegex(directoryName)).join("|")})\\b`;
}

function parseDirectorySegments(directory: string): string[] {
  return directory
    .split(",")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

export function resolveRunnerScope(
  directory: string | undefined,
  grep: string | undefined,
  version: SupportedVersion,
): RunnerScope {
  if (!directory) {
    return { grep };
  }

  const versionDirectory = getVersionDirectory(version);
  const parsedSegments = parseDirectorySegments(directory);
  const nonVersionSegments = parsedSegments.filter((segment) => !isVersionDirectory(segment));
  const optionalSegments = nonVersionSegments.filter((segment) => optionalDirectoryNames.has(segment));
  const fallbackSegments = nonVersionSegments.filter((segment) => !optionalDirectoryNames.has(segment));
  const rewriteSegments = [...nonVersionSegments, versionDirectory].filter(
    (segment, index, list) => list.indexOf(segment) === index,
  );

  return {
    rewriteDirectory: rewriteSegments.join(","),
    upstreamDirectory: versionDirectory,
    upstreamOptional: optionalSegments.length > 0 ? optionalSegments.join(",") : undefined,
    grep: combineGreps(grep, createDirectoryScopeGrep(fallbackSegments)),
  };
}

interface DiagnosticConfig {
  compareMode: TrafficCompareMode;
  directory?: string;
  grep?: string;
  keepClone: boolean;
  outDir: string;
  password: string;
  targetBaseUrl: string;
  unitKeys?: string[];
  username: string;
  version: SupportedVersion | "all";
}

type TraceSelectionMode = "captured-execution" | "requested-unit-fallback";

type TraceNodeEntryKind = "case" | "hook" | "unit";

export interface TraceNodeIndexEntry {
  attemptCount: number;
  casePath: string[] | null;
  entryKind: TraceNodeEntryKind;
  hookTitle: string | null;
  nodeKey: string;
  normalizedExchangeCount: number;
  normalizedIndexEnd: number | null;
  normalizedIndexStart: number | null;
  ownerLabel: string | null;
  rawExchangeCount: number;
  rawSequenceEnd: number | null;
  rawSequenceStart: number | null;
  runner: RawTrafficArtifact["runner"];
  selectionMode: TraceSelectionMode;
  suitePath: string[] | null;
  unitKey: string;
}

export interface TraceNodeIndexArtifact {
  entries: TraceNodeIndexEntry[];
  runner: RawTrafficArtifact["runner"];
  schemaVersion: "trace-node-index.v1";
  selectedUnitKeys: string[];
  version: SupportedVersion;
}

export interface TraceUnitManifest {
  attemptCount: number;
  manifestPath: string;
  nodeIndexPath: string;
  nodeKeys: string[];
  normalizedArtifactPath: string;
  normalizedExchangeCount: number;
  rawArtifactPath: string;
  rawExchangeCount: number;
  runner: RawTrafficArtifact["runner"];
  schemaVersion: "trace-unit-manifest.v1";
  selectionMode: TraceSelectionMode;
  unitKey: string;
  version: SupportedVersion;
}

export interface TraceRunManifest {
  nodeIndexPath: string;
  normalizedArtifactPath: string;
  rawArtifactPath: string;
  runner: RawTrafficArtifact["runner"];
  schemaVersion: "trace-run-manifest.v1";
  selectedUnitKeys: string[];
  unitManifests: Array<{
    manifestPath: string;
    selectionMode: TraceSelectionMode;
    unitKey: string;
  }>;
  version: SupportedVersion;
}

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/traffic-diagnostic.ts [--version 1.0.3|2.0.0|all] [--compare-mode bag|ordered] [--grep <pattern>] [--directory <csv>] [--unitKey <ledger-id>] [--target-base-url <url>] [--username <user>] [--password <pass>] [--out-dir <path>] [--keep-clone]",
    "",
    "Defaults:",
    "  --version all",
    "  --compare-mode bag",
    "  --target-base-url http://localhost:8080/xapi",
    "  --username janedoe",
    "  --password supersecret",
    "  --out-dir tmp/agents/traffic/<timestamp>",
    "  --unitKey is single-unit only and is mutually exclusive with --grep and --directory.",
  ].join("\n");
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function parseCsvFlag(args: string[], flag: string): string[] | undefined {
  const value = getFlagValue(args, flag);
  if (!value) {
    return undefined;
  }

  const parsed = value
    .split(",")
    .map((segment) => segment.trim())
    .filter((segment, index, list) => segment.length > 0 && list.indexOf(segment) === index);

  return parsed.length > 0 ? parsed : undefined;
}

function validateDiagnosticUnitSelection(unitKeys: string[], version: SupportedVersion | "all"): string[] {
  if (version === "all") {
    throw new Error("--unitKey requires an explicit --version so both runners stay on one migration unit.");
  }

  if (unitKeys.length !== 1) {
    throw new Error("--unitKey in traffic-diagnostic currently accepts exactly one migration ledger unit key.");
  }

  for (const unitKey of unitKeys) {
    const unit = getMigrationLedgerUnitByUnitKey(unitKey);
    if (!unit) {
      throw new Error(`Unknown --unitKey value: ${unitKey}`);
    }

    if (unit.version && unit.version !== version) {
      throw new Error(`Unit key ${unitKey} does not belong to xAPI version ${version}.`);
    }
  }

  return unitKeys;
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

function parseConfig(args: string[]): DiagnosticConfig {
  const version = (getFlagValue(args, "--version") ?? "all") as DiagnosticConfig["version"];
  const compareMode = (getFlagValue(args, "--compare-mode") ?? "bag") as TrafficCompareMode;
  const targetBaseUrl = getFlagValue(args, "--target-base-url") ?? "http://localhost:8080/xapi";
  const username = getFlagValue(args, "--username") ?? "janedoe";
  const password = getFlagValue(args, "--password") ?? "supersecret";
  const outDirArg = getFlagValue(args, "--out-dir") ?? resolve(repoRoot, "tmp/agents/traffic", `${Date.now()}`);
  const grep = getFlagValue(args, "--grep");
  const directory = getFlagValue(args, "--directory");
  const unitKeys = parseCsvFlag(args, "--unitKey");
  const keepClone = args.includes("--keep-clone");

  if (version !== "all" && version !== "1.0.3" && version !== "2.0.0") {
    throw new Error("Unsupported --version value.");
  }

  if (compareMode !== "bag" && compareMode !== "ordered") {
    throw new Error("Unsupported --compare-mode value.");
  }

  if (unitKeys && (directory || grep)) {
    throw new Error("--unitKey cannot be combined with --grep or --directory.");
  }

  if (directory && version === "all") {
    throw new Error("--directory requires an explicit --version so both runners use the same versioned scope.");
  }

  return {
    compareMode,
    directory,
    grep,
    keepClone,
    outDir: resolveSafeArtifactPath(outDirArg),
    password,
    targetBaseUrl,
    unitKeys: unitKeys ? validateDiagnosticUnitSelection(unitKeys, version) : undefined,
    username,
    version,
  };
}

function createVersionEnvironment(version: SupportedVersion): Record<string, string> {
  if (version === "1.0.3") {
    return {
      LRSQL_ENABLE_STRICT_VERSION: "true",
      LRSQL_SUPPORTED_VERSIONS: "1.0.3",
      XAPI_VERSION: version,
    };
  }

  return {
    LRSQL_ENABLE_STRICT_VERSION: "false",
    LRSQL_SUPPORTED_VERSIONS: "1.0.3,2.0.0",
    XAPI_VERSION: version,
  };
}

async function runCommand(command: string, args: string[], env: Record<string, string>): Promise<number> {
  const subprocess = Bun.spawn({
    cmd: [command, ...args],
    cwd: repoRoot,
    env: {
      ...process.env,
      ...env,
    },
    stderr: "inherit",
    stdin: "inherit",
    stdout: "inherit",
  });

  return await subprocess.exited;
}

async function runRequiredCommand(
  command: string,
  args: string[],
  env: Record<string, string>,
  context: string,
): Promise<void> {
  const exitCode = await runCommand(command, args, env);
  if (exitCode !== 0) {
    throw new Error(`${context} exited with status ${exitCode}`);
  }
}

async function ensureLrsql(version: SupportedVersion): Promise<void> {
  const env = createVersionEnvironment(version);
  await runRequiredCommand("bash", ["./scripts/lrsql-reset-best-effort.sh"], env, "LRSQL reset");
  await runRequiredCommand("bash", ["./scripts/lrsql-wait.sh"], env, "LRSQL wait");
  await runRequiredCommand("bash", ["./scripts/lrsql-auth-check.sh"], env, "LRSQL auth check");
}

async function writeJson(pathValue: string, value: unknown): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeText(pathValue: string, value: string): Promise<void> {
  await mkdir(dirname(pathValue), { recursive: true });
  await writeFile(pathValue, value, "utf8");
}

export async function readEffectiveRunnerExitCode(
  runner: "rewrite" | "upstream",
  versionDir: string,
  wrapperExitCode: number,
): Promise<number> {
  if (runner !== "upstream" || wrapperExitCode !== 0) {
    return wrapperExitCode;
  }

  try {
    const raw = await readFile(resolve(versionDir, "upstream-run.json"), "utf8");
    const parsed = JSON.parse(raw) as { upstreamExitCode?: unknown };
    return typeof parsed.upstreamExitCode === "number" ? parsed.upstreamExitCode : wrapperExitCode;
  } catch {
    return wrapperExitCode;
  }
}

export function buildRewriteArgs(config: DiagnosticConfig, endpoint: string, version: SupportedVersion): string[] {
  if (config.unitKeys) {
    return [
      "./src/describe-runtime/describe-run.ts",
      "--endpoint",
      endpoint,
      "--basicAuth",
      "--authUser",
      config.username,
      "--authPassword",
      config.password,
      "--xapiVersion",
      version,
      "--unitKey",
      config.unitKeys.join(","),
    ];
  }

  const scope = resolveRunnerScope(config.directory, config.grep, version);
  const args = [
    "./src/describe-runtime/describe-run.ts",
    "--endpoint",
    endpoint,
    "--basicAuth",
    "--authUser",
    config.username,
    "--authPassword",
    config.password,
  ];

  if (!scope.rewriteDirectory) {
    args.push("--xapiVersion", version);
  }

  if (scope.grep) {
    args.push("--grep", scope.grep);
  }

  if (scope.rewriteDirectory) {
    args.push("--directory", scope.rewriteDirectory);
  }

  return args;
}

export function buildUpstreamArgs(
  config: DiagnosticConfig,
  endpoint: string,
  version: SupportedVersion,
  versionDir: string,
): string[] {
  if (config.unitKeys) {
    return [
      "./rewrite/scripts/export-upstream-run.ts",
      "--base-url",
      endpoint,
      "--username",
      config.username,
      "--password",
      config.password,
      "--version",
      version,
      "--out",
      resolve(versionDir, "upstream-run.json"),
      "--log-dir",
      resolve(versionDir, "upstream-logs"),
      "--unitKey",
      config.unitKeys.join(","),
      ...(config.keepClone ? ["--keep-clone"] : []),
    ];
  }

  const scope = resolveRunnerScope(config.directory, config.grep, version);
  const args = [
    "./rewrite/scripts/export-upstream-run.ts",
    "--base-url",
    endpoint,
    "--username",
    config.username,
    "--password",
    config.password,
    "--version",
    version,
    "--out",
    resolve(versionDir, "upstream-run.json"),
    "--log-dir",
    resolve(versionDir, "upstream-logs"),
  ];

  if (scope.grep) {
    args.push("--grep", scope.grep);
  }

  if (scope.upstreamDirectory) {
    args.push("--directory", scope.upstreamDirectory);
  }

  if (scope.upstreamOptional) {
    args.push("--optional", scope.upstreamOptional);
  }

  if (config.keepClone) {
    args.push("--keep-clone");
  }

  return args;
}

function getRequestedUnitFallback(unitKeys: string[] | undefined): string | null {
  return unitKeys?.length === 1 ? unitKeys[0] : null;
}

function resolveExchangeUnitKey(
  execution: CaptureExecutionMetadata | null,
  fallbackUnitKey: string | null,
): string | null {
  return execution?.unitKey ?? fallbackUnitKey;
}

function buildExecutionNodeKey(
  unitKey: string,
  execution: CaptureExecutionMetadata,
): { entryKind: "case" | "hook"; nodeKey: string } {
  if (execution.phase === "before") {
    return {
      entryKind: "hook",
      nodeKey: `hook:${unitKey}:${execution.suitePath.join(" > ")}:${execution.hookTitle ?? ""}`,
    };
  }

  return {
    entryKind: "case",
    nodeKey: `case:${unitKey}:${(execution.casePath ?? execution.suitePath).join(" > ")}`,
  };
}

function createTraceSelectionMode(
  execution: CaptureExecutionMetadata | null,
  fallbackUnitKey: string | null,
): TraceSelectionMode | null {
  if (execution) {
    return "captured-execution";
  }

  if (fallbackUnitKey) {
    return "requested-unit-fallback";
  }

  return null;
}

function mergeTraceSelectionMode(current: TraceSelectionMode, next: TraceSelectionMode): TraceSelectionMode {
  return current === "captured-execution" || next === "captured-execution"
    ? "captured-execution"
    : "requested-unit-fallback";
}

function noteRawBounds(entry: TraceNodeIndexEntry, exchange: RawTrafficExchange): void {
  entry.rawExchangeCount += 1;
  entry.rawSequenceStart =
    entry.rawSequenceStart === null ? exchange.sequence : Math.min(entry.rawSequenceStart, exchange.sequence);
  entry.rawSequenceEnd =
    entry.rawSequenceEnd === null ? exchange.sequence : Math.max(entry.rawSequenceEnd, exchange.sequence);
}

function noteNormalizedBounds(entry: TraceNodeIndexEntry, exchange: NormalizedExchange, index: number): void {
  entry.attemptCount += exchange.attempts;
  entry.normalizedExchangeCount += 1;
  entry.normalizedIndexStart =
    entry.normalizedIndexStart === null ? index : Math.min(entry.normalizedIndexStart, index);
  entry.normalizedIndexEnd = entry.normalizedIndexEnd === null ? index : Math.max(entry.normalizedIndexEnd, index);
}

function createBaseTraceNodeEntry(options: {
  entryKind: TraceNodeEntryKind;
  execution: CaptureExecutionMetadata | null;
  nodeKey: string;
  runner: RawTrafficArtifact["runner"];
  selectionMode: TraceSelectionMode;
  unitKey: string;
}): TraceNodeIndexEntry {
  return {
    attemptCount: 0,
    casePath:
      options.entryKind === "case" ? [...(options.execution?.casePath ?? options.execution?.suitePath ?? [])] : null,
    entryKind: options.entryKind,
    hookTitle: options.entryKind === "hook" ? (options.execution?.hookTitle ?? null) : null,
    nodeKey: options.nodeKey,
    normalizedExchangeCount: 0,
    normalizedIndexEnd: null,
    normalizedIndexStart: null,
    ownerLabel: options.entryKind === "unit" ? null : (options.execution?.ownerLabel ?? null),
    rawExchangeCount: 0,
    rawSequenceEnd: null,
    rawSequenceStart: null,
    runner: options.runner,
    selectionMode: options.selectionMode,
    suitePath: options.execution ? [...options.execution.suitePath] : null,
    unitKey: options.unitKey,
  };
}

function getOrCreateTraceNodeEntry(
  entries: Map<string, TraceNodeIndexEntry>,
  options: {
    entryKind: TraceNodeEntryKind;
    execution: CaptureExecutionMetadata | null;
    nodeKey: string;
    runner: RawTrafficArtifact["runner"];
    selectionMode: TraceSelectionMode;
    unitKey: string;
  },
): TraceNodeIndexEntry {
  const existing = entries.get(options.nodeKey);
  if (existing) {
    existing.selectionMode = mergeTraceSelectionMode(existing.selectionMode, options.selectionMode);
    if (!existing.suitePath && options.execution) {
      existing.suitePath = [...options.execution.suitePath];
    }
    return existing;
  }

  const entry = createBaseTraceNodeEntry(options);
  entries.set(options.nodeKey, entry);
  return entry;
}

function sortTraceNodeEntries(left: TraceNodeIndexEntry, right: TraceNodeIndexEntry): number {
  const kindOrder: Record<TraceNodeEntryKind, number> = {
    unit: 0,
    case: 1,
    hook: 2,
  };

  return (
    left.unitKey.localeCompare(right.unitKey) ||
    kindOrder[left.entryKind] - kindOrder[right.entryKind] ||
    (left.rawSequenceStart ?? Number.MAX_SAFE_INTEGER) - (right.rawSequenceStart ?? Number.MAX_SAFE_INTEGER) ||
    (left.normalizedIndexStart ?? Number.MAX_SAFE_INTEGER) - (right.normalizedIndexStart ?? Number.MAX_SAFE_INTEGER) ||
    left.nodeKey.localeCompare(right.nodeKey)
  );
}

export function createTraceNodeIndex(
  rawArtifact: RawTrafficArtifact,
  normalizedArtifact: NormalizedTrafficArtifact,
  selectedUnitKeys?: string[],
): TraceNodeIndexArtifact {
  const fallbackUnitKey = getRequestedUnitFallback(selectedUnitKeys);
  const entries = new Map<string, TraceNodeIndexEntry>();

  for (const exchange of rawArtifact.exchanges) {
    const unitKey = resolveExchangeUnitKey(exchange.execution, fallbackUnitKey);
    const selectionMode = createTraceSelectionMode(exchange.execution, fallbackUnitKey);
    if (!unitKey || !selectionMode) {
      continue;
    }

    const unitEntry = getOrCreateTraceNodeEntry(entries, {
      entryKind: "unit",
      execution: exchange.execution,
      nodeKey: `unit:${unitKey}`,
      runner: rawArtifact.runner,
      selectionMode,
      unitKey,
    });
    noteRawBounds(unitEntry, exchange);

    if (!exchange.execution) {
      continue;
    }

    const executionNode = buildExecutionNodeKey(unitKey, exchange.execution);
    const executionEntry = getOrCreateTraceNodeEntry(entries, {
      entryKind: executionNode.entryKind,
      execution: exchange.execution,
      nodeKey: executionNode.nodeKey,
      runner: rawArtifact.runner,
      selectionMode,
      unitKey,
    });
    noteRawBounds(executionEntry, exchange);
  }

  normalizedArtifact.exchanges.forEach((exchange, index) => {
    const unitKey = resolveExchangeUnitKey(exchange.execution, fallbackUnitKey);
    const selectionMode = createTraceSelectionMode(exchange.execution, fallbackUnitKey);
    if (!unitKey || !selectionMode) {
      return;
    }

    const unitEntry = getOrCreateTraceNodeEntry(entries, {
      entryKind: "unit",
      execution: exchange.execution,
      nodeKey: `unit:${unitKey}`,
      runner: normalizedArtifact.runner,
      selectionMode,
      unitKey,
    });
    noteNormalizedBounds(unitEntry, exchange, index);

    if (!exchange.execution) {
      return;
    }

    const executionNode = buildExecutionNodeKey(unitKey, exchange.execution);
    const executionEntry = getOrCreateTraceNodeEntry(entries, {
      entryKind: executionNode.entryKind,
      execution: exchange.execution,
      nodeKey: executionNode.nodeKey,
      runner: normalizedArtifact.runner,
      selectionMode,
      unitKey,
    });
    noteNormalizedBounds(executionEntry, exchange, index);
  });

  return {
    entries: [...entries.values()].sort(sortTraceNodeEntries),
    runner: rawArtifact.runner,
    schemaVersion: "trace-node-index.v1",
    selectedUnitKeys: selectedUnitKeys ? [...selectedUnitKeys] : [],
    version: rawArtifact.version,
  };
}

function encodeArtifactPathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

function resolveUnitArtifactDirectory(
  versionDir: string,
  runner: RawTrafficArtifact["runner"],
  unitKey: string,
): string {
  return resolve(versionDir, `${runner}-units`, ...unitKey.split("/").map(encodeArtifactPathSegment));
}

function filterRawArtifactByUnitKey(
  rawArtifact: RawTrafficArtifact,
  unitKey: string,
  fallbackUnitKey: string | null,
): RawTrafficArtifact {
  return {
    ...rawArtifact,
    exchanges: rawArtifact.exchanges.filter(
      (exchange) => resolveExchangeUnitKey(exchange.execution, fallbackUnitKey) === unitKey,
    ),
  };
}

function filterNormalizedArtifactByUnitKey(
  normalizedArtifact: NormalizedTrafficArtifact,
  unitKey: string,
  fallbackUnitKey: string | null,
): NormalizedTrafficArtifact {
  return {
    ...normalizedArtifact,
    exchanges: normalizedArtifact.exchanges.filter(
      (exchange) => resolveExchangeUnitKey(exchange.execution, fallbackUnitKey) === unitKey,
    ),
  };
}

export async function writeTraceArtifacts(
  versionDir: string,
  rawArtifact: RawTrafficArtifact,
  normalizedArtifact: NormalizedTrafficArtifact,
  selectedUnitKeys?: string[],
): Promise<{
  nodeIndex: TraceNodeIndexArtifact;
  nodeIndexPath: string;
  traceManifest: TraceRunManifest;
  traceManifestPath: string;
}> {
  const fallbackUnitKey = getRequestedUnitFallback(selectedUnitKeys);
  const nodeIndex = createTraceNodeIndex(rawArtifact, normalizedArtifact, selectedUnitKeys);
  const nodeIndexPath = resolve(versionDir, `${rawArtifact.runner}-node-index.json`);
  const rawArtifactPath = resolve(versionDir, `${rawArtifact.runner}-raw.json`);
  const normalizedArtifactPath = resolve(versionDir, `${rawArtifact.runner}-normalized.json`);
  const unitEntries = nodeIndex.entries.filter((entry) => entry.entryKind === "unit");
  const unitManifests: TraceRunManifest["unitManifests"] = [];

  await writeJson(nodeIndexPath, nodeIndex);

  for (const unitEntry of unitEntries) {
    const unitDir = resolveUnitArtifactDirectory(versionDir, rawArtifact.runner, unitEntry.unitKey);
    const unitRawArtifactPath = resolve(unitDir, "raw.json");
    const unitNormalizedArtifactPath = resolve(unitDir, "normalized.json");
    const manifestPath = resolve(unitDir, "manifest.json");
    const unitManifest: TraceUnitManifest = {
      attemptCount: unitEntry.attemptCount,
      manifestPath,
      nodeIndexPath,
      nodeKeys: nodeIndex.entries.filter((entry) => entry.unitKey === unitEntry.unitKey).map((entry) => entry.nodeKey),
      normalizedArtifactPath: unitNormalizedArtifactPath,
      normalizedExchangeCount: unitEntry.normalizedExchangeCount,
      rawArtifactPath: unitRawArtifactPath,
      rawExchangeCount: unitEntry.rawExchangeCount,
      runner: rawArtifact.runner,
      schemaVersion: "trace-unit-manifest.v1",
      selectionMode: unitEntry.selectionMode,
      unitKey: unitEntry.unitKey,
      version: rawArtifact.version,
    };

    await writeJson(unitRawArtifactPath, filterRawArtifactByUnitKey(rawArtifact, unitEntry.unitKey, fallbackUnitKey));
    await writeJson(
      unitNormalizedArtifactPath,
      filterNormalizedArtifactByUnitKey(normalizedArtifact, unitEntry.unitKey, fallbackUnitKey),
    );
    await writeJson(manifestPath, unitManifest);

    unitManifests.push({
      manifestPath,
      selectionMode: unitManifest.selectionMode,
      unitKey: unitManifest.unitKey,
    });
  }

  const traceManifest: TraceRunManifest = {
    nodeIndexPath,
    normalizedArtifactPath,
    rawArtifactPath,
    runner: rawArtifact.runner,
    schemaVersion: "trace-run-manifest.v1",
    selectedUnitKeys: selectedUnitKeys ? [...selectedUnitKeys] : [],
    unitManifests,
    version: rawArtifact.version,
  };
  const traceManifestPath = resolve(versionDir, `${rawArtifact.runner}-trace-manifest.json`);

  await writeJson(traceManifestPath, traceManifest);

  return {
    nodeIndex,
    nodeIndexPath,
    traceManifest,
    traceManifestPath,
  };
}

async function captureRunner(
  runner: "rewrite" | "upstream",
  config: DiagnosticConfig,
  version: SupportedVersion,
  versionDir: string,
): Promise<RawTrafficArtifact> {
  await ensureLrsql(version);

  const recorder = await startTrafficRecorder({
    targetBaseUrl: config.targetBaseUrl,
  });

  let exitCode = 0;
  try {
    const args =
      runner === "rewrite"
        ? buildRewriteArgs(config, recorder.captureBaseUrl, version)
        : buildUpstreamArgs(config, recorder.captureBaseUrl, version, versionDir);

    exitCode = await runCommand("bun", args, createVersionEnvironment(version));
    exitCode = await readEffectiveRunnerExitCode(runner, versionDir, exitCode);
  } finally {
    await recorder.stop();
  }

  return recorder.takeArtifact({
    compareMode: config.compareMode,
    exitCode,
    runner,
    version,
  });
}

async function runVersion(config: DiagnosticConfig, version: SupportedVersion): Promise<void> {
  const versionDir = resolve(config.outDir, version);
  await mkdir(versionDir, { recursive: true });

  const rewriteRaw = await captureRunner("rewrite", config, version, versionDir);
  const rewriteNormalized = normalizeTrafficArtifact(rewriteRaw);
  await writeJson(resolve(versionDir, "rewrite-raw.json"), rewriteRaw);
  await writeJson(resolve(versionDir, "rewrite-normalized.json"), rewriteNormalized);
  await writeTraceArtifacts(versionDir, rewriteRaw, rewriteNormalized, config.unitKeys);

  const upstreamRaw = await captureRunner("upstream", config, version, versionDir);
  const upstreamNormalized = normalizeTrafficArtifact(upstreamRaw);
  await writeJson(resolve(versionDir, "upstream-raw.json"), upstreamRaw);
  await writeJson(resolve(versionDir, "upstream-normalized.json"), upstreamNormalized);
  await writeTraceArtifacts(versionDir, upstreamRaw, upstreamNormalized, config.unitKeys);

  const comparison = compareNormalizedTrafficRuns(rewriteNormalized, upstreamNormalized, config.compareMode);
  await writeJson(resolve(versionDir, "compare.json"), comparison);
  await writeText(
    resolve(versionDir, "compare.md"),
    renderTrafficComparisonReport(rewriteNormalized, upstreamNormalized, comparison),
  );

  console.log(
    JSON.stringify(
      {
        version,
        mode: comparison.mode,
        rewriteExitCode: rewriteRaw.exitCode,
        upstreamExitCode: upstreamRaw.exitCode,
        rewriteCount: comparison.leftCount,
        upstreamCount: comparison.rightCount,
        matchedCount: comparison.matchedCount,
        mismatches:
          comparison.mode === "ordered" ? comparison.orderedMismatches.length : comparison.signatureMismatches.length,
        outputDir: versionDir,
      },
      null,
      2,
    ),
  );
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return 0;
  }

  const config = parseConfig(args);
  const versions: SupportedVersion[] = config.version === "all" ? ["1.0.3", "2.0.0"] : [config.version];

  for (const version of versions) {
    await runVersion(config, version);
  }

  return 0;
}

if (import.meta.main) {
  const exitCode = await main();
  process.exit(exitCode);
}
