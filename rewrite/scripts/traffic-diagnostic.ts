import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

import { captureOwnerHeaderName, type CaptureExecutionMetadata } from "../../src/describe-runtime/execution-owner.ts";
import { getMigrationLedgerUnitByUnitKey } from "../../src/describe-runtime/migration-ledger.ts";

import { compareFingerprints, type ComparisonResult, type FingerprintArtifact } from "./compare-db-fingerprints.ts";
import { exportDbFingerprint } from "./export-db-fingerprint.ts";

import {
  createExchangeSignature,
  compareNormalizedTrafficRuns,
  normalizeTrafficArtifact,
  renderTrafficComparisonReport,
  startTrafficRecorder,
  type NormalizedExchange,
  type NormalizedTrafficArtifact,
  type RawTrafficArtifact,
  type RawTrafficExchange,
  type TrafficComparisonCountMismatch,
  type TrafficCompareMode,
  type TrafficComparisonResult,
} from "../traffic.ts";

const repoRoot = resolve(import.meta.dir, "../..");
const allowedArtifactsRoot = resolve(repoRoot, "tmp/agents");
const defaultCandidateSuiteDir = resolve(repoRoot, "rewrite4");
const hopByHopReplayHeaders = new Set([
  "connection",
  "host",
  "content-length",
  "transfer-encoding",
  "accept-encoding",
  captureOwnerHeaderName,
]);

type SupportedVersion = "1.0.3" | "2.0.0";

type RunnerScope = {
  directory?: string;
  grep?: string;
  optional?: string;
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

  return {
    directory: versionDirectory,
    optional: optionalSegments.length > 0 ? optionalSegments.join(",") : undefined,
    grep: combineGreps(grep, createDirectoryScopeGrep(fallbackSegments)),
  };
}

interface DiagnosticConfig {
  candidateDir: string;
  compareMode: TrafficCompareMode;
  dbStateMode: TraceDbStateMode;
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
type TraceDbStateMode = "all" | "none" | "unit";

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
  dbStateManifestPath?: string;
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

export interface TraceDbStateBoundary {
  entryKinds: TraceNodeEntryKind[];
  nodeKeys: string[];
  rawSequenceEnd: number;
  unitKeys: string[];
}

export interface TraceNodeDbStateManifestEntry {
  entryKind: TraceNodeEntryKind;
  fingerprintPath: string;
  nodeKey: string;
  rawSequenceEnd: number;
  runner: RawTrafficArtifact["runner"];
  selectionMode: TraceSelectionMode;
  unitKey: string;
}

export interface TraceDbReplayIssue {
  actualStatus: number | null;
  error?: string;
  expectedStatus: number;
  method: string;
  rawSequence: number;
  targetUrl: string;
}

export interface TraceNodeDbStateManifest {
  capturedExchangeCount: number;
  completedRawSequenceEnd: number | null;
  entries: TraceNodeDbStateManifestEntry[];
  mode: TraceDbStateMode;
  rawArtifactPath: string;
  replayIssues: TraceDbReplayIssue[];
  runner: RawTrafficArtifact["runner"];
  schemaVersion: "trace-node-db-state-manifest.v1";
  selectedUnitKeys: string[];
  traceNodeIndexPath: string;
  version: SupportedVersion;
}

export interface TraceDbStateBoundarySnapshot {
  entryKinds: TraceNodeEntryKind[];
  fingerprintPath: string;
  nodeKeys: string[];
  rawSequenceEnd: number;
  unitKeys: string[];
}

export interface TraceDbStateBoundaryComparison {
  candidate: TraceDbStateBoundarySnapshot | null;
  different: boolean;
  fingerprintComparison: ComparisonResult | null;
  rawSequenceEnd: number;
  upstream: TraceDbStateBoundarySnapshot | null;
}

export interface TraceDbStateComparisonReport {
  candidateCapturedExchangeCount: number;
  candidateCompletedRawSequenceEnd: number | null;
  candidateManifestPath: string;
  candidateReplayIssues: TraceDbReplayIssue[];
  comparedBoundaryCount: number;
  different: boolean;
  divergentBoundaries: TraceDbStateBoundaryComparison[];
  firstDivergentBoundary: TraceDbStateBoundaryComparison | null;
  firstReplayIssue: {
    issue: TraceDbReplayIssue;
    runner: "candidate" | "upstream";
  } | null;
  upstreamCapturedExchangeCount: number;
  upstreamCompletedRawSequenceEnd: number | null;
  upstreamManifestPath: string;
  upstreamReplayIssues: TraceDbReplayIssue[];
}

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/traffic-diagnostic.ts [--version 1.0.3|2.0.0|all] [--compare-mode bag|ordered] [--db-state-mode none|unit|all] [--candidate-dir <path>] [--grep <pattern>] [--directory <csv>] [--unitKey <ledger-id>] [--target-base-url <url>] [--username <user>] [--password <pass>] [--out-dir <path>] [--keep-clone]",
    "",
    "Defaults:",
    "  --version all",
    "  --compare-mode bag",
    "  --db-state-mode all for --unitKey runs, otherwise none",
    "  --candidate-dir rewrite4",
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
  const candidateDirArg = getFlagValue(args, "--candidate-dir");
  const version = (getFlagValue(args, "--version") ?? "all") as DiagnosticConfig["version"];
  const compareMode = (getFlagValue(args, "--compare-mode") ?? "bag") as TrafficCompareMode;
  const unitKeys = parseCsvFlag(args, "--unitKey");
  const dbStateMode = (getFlagValue(args, "--db-state-mode") ?? (unitKeys ? "all" : "none")) as TraceDbStateMode;
  const targetBaseUrl = getFlagValue(args, "--target-base-url") ?? "http://localhost:8080/xapi";
  const username = getFlagValue(args, "--username") ?? "janedoe";
  const password = getFlagValue(args, "--password") ?? "supersecret";
  const outDirArg = getFlagValue(args, "--out-dir") ?? resolve(repoRoot, "tmp/agents/traffic", `${Date.now()}`);
  const grep = getFlagValue(args, "--grep");
  const directory = getFlagValue(args, "--directory");
  const keepClone = args.includes("--keep-clone");

  if (version !== "all" && version !== "1.0.3" && version !== "2.0.0") {
    throw new Error("Unsupported --version value.");
  }

  if (compareMode !== "bag" && compareMode !== "ordered") {
    throw new Error("Unsupported --compare-mode value.");
  }

  if (dbStateMode !== "none" && dbStateMode !== "unit" && dbStateMode !== "all") {
    throw new Error("Unsupported --db-state-mode value.");
  }

  if (unitKeys && (directory || grep)) {
    throw new Error("--unitKey cannot be combined with --grep or --directory.");
  }

  if (directory && version === "all") {
    throw new Error("--directory requires an explicit --version so both runners use the same versioned scope.");
  }

  return {
    candidateDir: candidateDirArg
      ? isAbsolute(candidateDirArg)
        ? candidateDirArg
        : resolve(repoRoot, candidateDirArg)
      : defaultCandidateSuiteDir,
    compareMode,
    dbStateMode,
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

async function readJson<T>(pathValue: string): Promise<T> {
  const raw = await readFile(pathValue, "utf8");
  return JSON.parse(raw) as T;
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
  runner: "candidate" | "upstream",
  versionDir: string,
  wrapperExitCode: number,
): Promise<number> {
  if (wrapperExitCode !== 0) {
    return wrapperExitCode;
  }

  try {
    const raw = await readFile(resolve(versionDir, `${runner}-run.json`), "utf8");
    const parsed = JSON.parse(raw) as { suiteExitCode?: unknown; upstreamExitCode?: unknown };
    if (typeof parsed.suiteExitCode === "number") {
      return parsed.suiteExitCode;
    }

    return typeof parsed.upstreamExitCode === "number" ? parsed.upstreamExitCode : wrapperExitCode;
  } catch {
    return wrapperExitCode;
  }
}

export function buildCandidateArgs(config: DiagnosticConfig, endpoint: string, version: SupportedVersion): string[] {
  if (config.unitKeys) {
    return [
      "./rewrite/scripts/export-upstream-run.ts",
      "--suite-dir",
      config.candidateDir,
      "--base-url",
      endpoint,
      "--username",
      config.username,
      "--password",
      config.password,
      "--version",
      version,
      "--out",
      resolve(config.outDir, version, "candidate-run.json"),
      "--log-dir",
      resolve(config.outDir, version, "candidate-logs"),
      "--unitKey",
      config.unitKeys.join(","),
    ];
  }

  const scope = resolveRunnerScope(config.directory, config.grep, version);
  const args = [
    "./rewrite/scripts/export-upstream-run.ts",
    "--suite-dir",
    config.candidateDir,
    "--base-url",
    endpoint,
    "--username",
    config.username,
    "--password",
    config.password,
    "--version",
    version,
    "--out",
    resolve(config.outDir, version, "candidate-run.json"),
    "--log-dir",
    resolve(config.outDir, version, "candidate-logs"),
  ];

  if (scope.grep) {
    args.push("--grep", scope.grep);
  }

  if (scope.directory) {
    args.push("--directory", scope.directory);
  }

  if (scope.optional) {
    args.push("--optional", scope.optional);
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

  if (scope.directory) {
    args.push("--directory", scope.directory);
  }

  if (scope.optional) {
    args.push("--optional", scope.optional);
  }

  if (config.keepClone) {
    args.push("--keep-clone");
  }

  return args;
}

function getRequestedUnitFallback(unitKeys: string[] | undefined): string | null {
  return unitKeys?.length === 1 ? (unitKeys[0] ?? null) : null;
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

export function buildTraceDbStateReplayPlan(
  nodeIndex: TraceNodeIndexArtifact,
  mode: TraceDbStateMode,
): TraceDbStateBoundary[] {
  if (mode === "none") {
    return [];
  }

  const entriesBySequence = new Map<number, TraceNodeIndexEntry[]>();
  for (const entry of nodeIndex.entries) {
    if (entry.rawSequenceEnd === null) {
      continue;
    }

    if (mode === "unit" && entry.entryKind !== "unit") {
      continue;
    }

    const sequenceEntries = entriesBySequence.get(entry.rawSequenceEnd) ?? [];
    sequenceEntries.push(entry);
    entriesBySequence.set(entry.rawSequenceEnd, sequenceEntries);
  }

  return [...entriesBySequence.entries()]
    .sort(([left], [right]) => left - right)
    .map(([rawSequenceEnd, entries]) => ({
      entryKinds: [...new Set(entries.map((entry) => entry.entryKind))],
      nodeKeys: entries.map((entry) => entry.nodeKey).sort((left, right) => left.localeCompare(right)),
      rawSequenceEnd,
      unitKeys: [...new Set(entries.map((entry) => entry.unitKey))].sort((left, right) => left.localeCompare(right)),
    }));
}

function decodeReplayBody(bodyBase64: string): Uint8Array | undefined {
  if (!bodyBase64) {
    return undefined;
  }

  const buffer = Buffer.from(bodyBase64, "base64");
  if (buffer.byteLength === 0) {
    return undefined;
  }

  return new Uint8Array(buffer);
}

function mapReplayTargetUrl(originalUrl: string, targetBaseUrl: string): string {
  const original = new URL(originalUrl);
  const targetBase = new URL(targetBaseUrl);
  const targetPrefix = targetBase.pathname.replace(/\/$/, "");
  const relativePath = original.pathname.startsWith(targetPrefix)
    ? original.pathname.slice(targetPrefix.length)
    : original.pathname;
  const finalPath = `${targetPrefix}${relativePath.startsWith("/") ? relativePath : `/${relativePath}`}`;
  const mapped = new URL(targetBase.origin);
  mapped.pathname = finalPath;
  mapped.search = original.search;
  return mapped.toString();
}

function normalizeReplayHeaders(entries: Array<[string, string]>): Headers {
  const headers = new Headers();
  for (const [nameRaw, value] of entries) {
    const name = nameRaw.toLowerCase();
    if (hopByHopReplayHeaders.has(name)) {
      continue;
    }

    headers.set(name, value);
  }

  return headers;
}

export async function writeTraceDbStateArtifacts(options: {
  mode: TraceDbStateMode;
  nodeIndex: TraceNodeIndexArtifact;
  nodeIndexPath: string;
  rawArtifact: RawTrafficArtifact;
  rawArtifactPath: string;
  selectedUnitKeys?: string[];
  versionDir: string;
}): Promise<{
  manifest: TraceNodeDbStateManifest;
  manifestPath: string;
} | null> {
  const replayPlan = buildTraceDbStateReplayPlan(options.nodeIndex, options.mode);
  if (replayPlan.length === 0) {
    return null;
  }

  const manifestPath = resolve(options.versionDir, `${options.rawArtifact.runner}-db-state-manifest.json`);
  const dbStateDir = resolve(options.versionDir, `${options.rawArtifact.runner}-db-states`);
  const entriesBySequence = new Map<number, TraceNodeIndexEntry[]>();

  for (const entry of options.nodeIndex.entries) {
    if (entry.rawSequenceEnd === null) {
      continue;
    }

    const sequenceEntries = entriesBySequence.get(entry.rawSequenceEnd) ?? [];
    sequenceEntries.push(entry);
    entriesBySequence.set(entry.rawSequenceEnd, sequenceEntries);
  }

  const boundarySequences = new Set(replayPlan.map((entry) => entry.rawSequenceEnd));
  const manifestEntries: TraceNodeDbStateManifestEntry[] = [];
  const replayIssues: TraceDbReplayIssue[] = [];
  const exchanges = [...options.rawArtifact.exchanges].sort((left, right) => left.sequence - right.sequence);
  let completedRawSequenceEnd: number | null = null;

  const manifest: TraceNodeDbStateManifest = {
    capturedExchangeCount: exchanges.length,
    completedRawSequenceEnd,
    entries: manifestEntries,
    mode: options.mode,
    rawArtifactPath: options.rawArtifactPath,
    replayIssues,
    runner: options.rawArtifact.runner,
    schemaVersion: "trace-node-db-state-manifest.v1",
    selectedUnitKeys: options.selectedUnitKeys ? [...options.selectedUnitKeys] : [],
    traceNodeIndexPath: options.nodeIndexPath,
    version: options.rawArtifact.version,
  };

  await writeJson(manifestPath, manifest);

  await ensureLrsql(options.rawArtifact.version);

  for (const exchange of exchanges) {
    const targetUrl = mapReplayTargetUrl(exchange.request.targetUrl, options.rawArtifact.targetBaseUrl);
    let response: Response;
    try {
      response = await fetch(targetUrl, {
        body: decodeReplayBody(exchange.request.bodyBase64),
        headers: normalizeReplayHeaders(exchange.request.headers),
        method: exchange.request.method.toUpperCase(),
        redirect: "manual",
      });
    } catch (error) {
      replayIssues.push({
        actualStatus: null,
        error: error instanceof Error ? error.message : String(error),
        expectedStatus: exchange.response.status,
        method: exchange.request.method.toUpperCase(),
        rawSequence: exchange.sequence,
        targetUrl,
      });
      await writeJson(manifestPath, manifest);
      break;
    }

    completedRawSequenceEnd = exchange.sequence;
    manifest.completedRawSequenceEnd = completedRawSequenceEnd;
    let shouldWriteManifest = false;

    if (response.status !== exchange.response.status) {
      replayIssues.push({
        actualStatus: response.status,
        expectedStatus: exchange.response.status,
        method: exchange.request.method.toUpperCase(),
        rawSequence: exchange.sequence,
        targetUrl,
      });
      shouldWriteManifest = true;
    }

    if (!boundarySequences.has(exchange.sequence)) {
      if (shouldWriteManifest) {
        await writeJson(manifestPath, manifest);
      }
      continue;
    }

    const fingerprintPath = resolve(dbStateDir, `sequence-${String(exchange.sequence).padStart(6, "0")}.json`);
    await exportDbFingerprint({ outPath: fingerprintPath });

    for (const entry of entriesBySequence.get(exchange.sequence) ?? []) {
      if (options.mode === "unit" && entry.entryKind !== "unit") {
        continue;
      }

      manifestEntries.push({
        entryKind: entry.entryKind,
        fingerprintPath,
        nodeKey: entry.nodeKey,
        rawSequenceEnd: exchange.sequence,
        runner: options.rawArtifact.runner,
        selectionMode: entry.selectionMode,
        unitKey: entry.unitKey,
      });
    }

    await writeJson(manifestPath, manifest);
  }

  await writeJson(manifestPath, manifest);
  return {
    manifest,
    manifestPath,
  };
}

function compareStringArrays(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

type DiagnosticTrafficComparisonResult = TrafficComparisonResult & {
  ignoredSignatureMismatches?: TrafficComparisonCountMismatch[];
};

type SignatureOwnerAttempts = {
  count: number;
  exchanges: NormalizedExchange[];
};

const signedStatementAttachmentUsageType = "http://adlnet.gov/expapi/attachments/signature";
const signedStatementFingerprintTables = new Set(["attachment", "xapi_statement"]);

type NormalizedMultipartPart = {
  body: {
    body?: unknown;
    byteLength?: number;
    kind: "binary" | "empty" | "form" | "json" | "multipart" | "text";
    sha256?: string;
  };
  headers: Record<string, string>;
};

function hasSignedStatementAttachment(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  const attachments = (value as { attachments?: unknown }).attachments;
  return (
    Array.isArray(attachments) &&
    attachments.some(
      (attachment) =>
        attachment &&
        typeof attachment === "object" &&
        (attachment as Record<string, unknown>).usageType === signedStatementAttachmentUsageType,
    )
  );
}

function stripSignedStatementAttachmentDigests<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => stripSignedStatementAttachmentDigests(entry)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if ((value as Record<string, unknown>).usageType === signedStatementAttachmentUsageType) {
    const { sha2: _sha2, ...attachment } = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(attachment).map(([key, entry]) => [key, stripSignedStatementAttachmentDigests(entry)]),
    ) as T;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      stripSignedStatementAttachmentDigests(entry),
    ]),
  ) as T;
}

function stabilizeSignedStatementRequestBody(
  body: NormalizedExchange["request"]["body"],
): NormalizedExchange["request"]["body"] {
  if (body.kind !== "multipart" || !Array.isArray(body.body)) {
    return body;
  }

  const parts = body.body as NormalizedMultipartPart[];
  if (!parts.some((part) => part.body.kind === "json" && hasSignedStatementAttachment(part.body.body))) {
    return body;
  }

  return {
    ...body,
    body: parts.map((part) => {
      if (part.body.kind === "json") {
        return {
          ...part,
          body: {
            ...part.body,
            body: stripSignedStatementAttachmentDigests(part.body.body),
          },
        };
      }

      if (part.body.kind === "binary") {
        return {
          ...part,
          body: {
            ...part.body,
            sha256: "<signed-statement-attachment>",
          },
        };
      }

      if (part.body.kind === "text") {
        return {
          ...part,
          body: {
            ...part.body,
            body: "<signed-statement-attachment>",
          },
        };
      }

      return part;
    }),
  };
}

export function stabilizeSignedStatementAttachments(artifact: NormalizedTrafficArtifact): NormalizedTrafficArtifact {
  return {
    ...artifact,
    exchanges: artifact.exchanges.map((exchange) => {
      if (exchange.method !== "POST" || exchange.path !== "/xapi/statements") {
        return exchange;
      }

      const requestBody = stabilizeSignedStatementRequestBody(exchange.request.body);
      if (requestBody === exchange.request.body) {
        return exchange;
      }

      return {
        ...exchange,
        request: {
          ...exchange.request,
          body: requestBody,
        },
      };
    }),
  };
}

function stripVolatileStatementPollFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => stripVolatileStatementPollFields(entry)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "stored" && key !== "timestamp")
        .map(([key, entry]) => [key, stripVolatileStatementPollFields(entry)]),
    ) as T;
  }

  return value;
}

export function stabilizeTimingDrivenStatementPolls(artifact: NormalizedTrafficArtifact): NormalizedTrafficArtifact {
  return {
    ...artifact,
    exchanges: artifact.exchanges.map((exchange) => {
      if (
        exchange.method !== "GET" ||
        exchange.path !== "/xapi/statements" ||
        exchange.response.status !== 200 ||
        exchange.attempts <= 1 ||
        exchange.response.body.kind !== "json"
      ) {
        return exchange;
      }

      return {
        ...exchange,
        attempts: 1,
        response: {
          ...exchange.response,
          body: {
            ...exchange.response.body,
            body: stripVolatileStatementPollFields(exchange.response.body.body),
          },
        },
      };
    }),
  };
}

function groupSignatureAttemptsByOwnerLabel(
  artifact: NormalizedTrafficArtifact,
  key: string,
): Map<string, SignatureOwnerAttempts> {
  const counts = new Map<string, SignatureOwnerAttempts>();

  for (const exchange of artifact.exchanges) {
    if (createExchangeSignature(exchange) !== key) {
      continue;
    }

    const ownerLabel = exchange.execution?.ownerLabel;
    if (!ownerLabel) {
      continue;
    }

    const current = counts.get(ownerLabel) ?? { count: 0, exchanges: [] };
    current.count += exchange.attempts;
    current.exchanges.push(exchange);
    counts.set(ownerLabel, current);
  }

  return counts;
}

function shouldIgnoreTimingDrivenStatementPollMismatch(
  candidate: NormalizedTrafficArtifact,
  upstream: NormalizedTrafficArtifact,
  mismatch: TrafficComparisonCountMismatch,
): boolean {
  if (mismatch.sample.method !== "GET" || mismatch.sample.path !== "/xapi/statements") {
    return false;
  }

  const candidateOwners = groupSignatureAttemptsByOwnerLabel(candidate, mismatch.key);
  const upstreamOwners = groupSignatureAttemptsByOwnerLabel(upstream, mismatch.key);
  const ownerLabels = [...new Set([...candidateOwners.keys(), ...upstreamOwners.keys()])];
  let differingOwnerCount = 0;

  for (const ownerLabel of ownerLabels) {
    const candidateEntry = candidateOwners.get(ownerLabel);
    const upstreamEntry = upstreamOwners.get(ownerLabel);
    const candidateCount = candidateEntry?.count ?? 0;
    const upstreamCount = upstreamEntry?.count ?? 0;

    if (candidateCount === upstreamCount) {
      continue;
    }

    differingOwnerCount += 1;
    if (differingOwnerCount > 1) {
      return false;
    }

    if (!candidateEntry || !upstreamEntry) {
      return false;
    }

    if (candidateEntry.exchanges.length !== 1 || upstreamEntry.exchanges.length !== 1) {
      return false;
    }

    if (candidateEntry.exchanges[0].attempts <= 1 && upstreamEntry.exchanges[0].attempts <= 1) {
      return false;
    }
  }

  return differingOwnerCount === 1;
}

export function suppressTimingDrivenStatementPollMismatches(
  candidate: NormalizedTrafficArtifact,
  upstream: NormalizedTrafficArtifact,
  comparison: TrafficComparisonResult,
): DiagnosticTrafficComparisonResult {
  if (comparison.mode !== "bag" || comparison.signatureMismatches.length === 0) {
    return comparison;
  }

  const ignoredSignatureMismatches = comparison.signatureMismatches.filter((mismatch) =>
    shouldIgnoreTimingDrivenStatementPollMismatch(candidate, upstream, mismatch),
  );

  if (ignoredSignatureMismatches.length === 0) {
    return comparison;
  }

  let leftCount = comparison.leftCount;
  let rightCount = comparison.rightCount;
  for (const mismatch of ignoredSignatureMismatches) {
    if (mismatch.leftCount > mismatch.rightCount) {
      leftCount -= mismatch.leftCount - mismatch.rightCount;
    } else if (mismatch.rightCount > mismatch.leftCount) {
      rightCount -= mismatch.rightCount - mismatch.leftCount;
    }
  }

  return {
    ...comparison,
    leftCount,
    rightCount,
    signatureMismatches: comparison.signatureMismatches.filter(
      (mismatch) => !ignoredSignatureMismatches.includes(mismatch),
    ),
    ignoredSignatureMismatches,
  };
}

function createTraceDbStateBoundaryKey(nodeKeys: string[]): string {
  return JSON.stringify(nodeKeys);
}

function createTraceDbStateBoundarySnapshot(
  rawSequenceEnd: number,
  entries: TraceNodeDbStateManifestEntry[],
): TraceDbStateBoundarySnapshot {
  const fingerprintPaths = [...new Set(entries.map((entry) => entry.fingerprintPath))];
  const fingerprintPath = fingerprintPaths[0];
  if (!fingerprintPath || fingerprintPaths.length !== 1) {
    throw new Error(`Expected exactly one fingerprint path for raw sequence ${rawSequenceEnd}.`);
  }

  const entryKindOrder: Record<TraceNodeEntryKind, number> = {
    unit: 0,
    case: 1,
    hook: 2,
  };

  const nodeKeys = [...new Set(entries.map((entry) => entry.nodeKey))].sort((left, right) => left.localeCompare(right));

  return {
    entryKinds: [...new Set(entries.map((entry) => entry.entryKind))].sort(
      (left, right) => entryKindOrder[left] - entryKindOrder[right],
    ),
    fingerprintPath,
    nodeKeys,
    rawSequenceEnd,
    unitKeys: [...new Set(entries.map((entry) => entry.unitKey))].sort((left, right) => left.localeCompare(right)),
  };
}

function buildTraceDbStateBoundaryMap(manifest: TraceNodeDbStateManifest): Map<string, TraceDbStateBoundarySnapshot> {
  const entriesBySequence = new Map<number, TraceNodeDbStateManifestEntry[]>();

  for (const entry of manifest.entries) {
    const boundaryEntries = entriesBySequence.get(entry.rawSequenceEnd) ?? [];
    boundaryEntries.push(entry);
    entriesBySequence.set(entry.rawSequenceEnd, boundaryEntries);
  }

  const boundaries = new Map<string, TraceDbStateBoundarySnapshot>();
  for (const [rawSequenceEnd, entries] of [...entriesBySequence.entries()].sort(([left], [right]) => left - right)) {
    const snapshot = createTraceDbStateBoundarySnapshot(rawSequenceEnd, entries);
    const boundaryKey = createTraceDbStateBoundaryKey(snapshot.nodeKeys);
    if (boundaries.has(boundaryKey)) {
      throw new Error(`Duplicate DB-state boundary for node set ${snapshot.nodeKeys.join(", ")}.`);
    }

    boundaries.set(boundaryKey, snapshot);
  }

  return boundaries;
}

function getTraceDbStateBoundarySortSequence(
  candidate: TraceDbStateBoundarySnapshot | null,
  upstream: TraceDbStateBoundarySnapshot | null,
): number {
  return Math.min(
    candidate?.rawSequenceEnd ?? Number.MAX_SAFE_INTEGER,
    upstream?.rawSequenceEnd ?? Number.MAX_SAFE_INTEGER,
  );
}

function normalizeReplayIssueTargetUrl(targetUrl: string): string {
  return targetUrl.replaceAll(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "{{uuid}}");
}

function createReplayIssueSignature(issue: TraceDbReplayIssue): string {
  return JSON.stringify({
    actualStatus: issue.actualStatus,
    error: issue.error ?? null,
    expectedStatus: issue.expectedStatus,
    method: issue.method,
    rawSequence: issue.rawSequence,
    targetUrl: normalizeReplayIssueTargetUrl(issue.targetUrl),
  });
}

function haveEquivalentReplayIssues(candidate: TraceDbReplayIssue[], upstream: TraceDbReplayIssue[]): boolean {
  const counts = new Map<string, number>();

  for (const issue of candidate) {
    const signature = createReplayIssueSignature(issue);
    counts.set(signature, (counts.get(signature) ?? 0) + 1);
  }

  for (const issue of upstream) {
    const signature = createReplayIssueSignature(issue);
    counts.set(signature, (counts.get(signature) ?? 0) - 1);
  }

  return [...counts.values()].every((count) => count === 0);
}

function pickFirstReplayIssue(report: {
  candidateReplayIssues: TraceDbReplayIssue[];
  upstreamReplayIssues: TraceDbReplayIssue[];
}): TraceDbStateComparisonReport["firstReplayIssue"] {
  const ordered = [
    ...report.candidateReplayIssues.map((issue) => ({ issue, runner: "candidate" as const })),
    ...report.upstreamReplayIssues.map((issue) => ({ issue, runner: "upstream" as const })),
  ].sort((left, right) => left.issue.rawSequence - right.issue.rawSequence || left.runner.localeCompare(right.runner));

  return ordered[0] ?? null;
}

async function readFingerprintWithCache(
  fingerprintPath: string,
  cache: Map<string, FingerprintArtifact>,
): Promise<FingerprintArtifact> {
  const cached = cache.get(fingerprintPath);
  if (cached) {
    return cached;
  }

  const fingerprint = await readJson<FingerprintArtifact>(fingerprintPath);
  cache.set(fingerprintPath, fingerprint);
  return fingerprint;
}

export async function compareTraceDbStateManifests(options: {
  candidateManifestPath: string;
  upstreamManifestPath: string;
}): Promise<TraceDbStateComparisonReport> {
  const candidateManifest = await readJson<TraceNodeDbStateManifest>(options.candidateManifestPath);
  const upstreamManifest = await readJson<TraceNodeDbStateManifest>(options.upstreamManifestPath);
  const replayIssuesDifferent = !haveEquivalentReplayIssues(
    candidateManifest.replayIssues,
    upstreamManifest.replayIssues,
  );
  const candidateBoundaries = buildTraceDbStateBoundaryMap(candidateManifest);
  const upstreamBoundaries = buildTraceDbStateBoundaryMap(upstreamManifest);
  const boundaryKeys = [...new Set([...candidateBoundaries.keys(), ...upstreamBoundaries.keys()])].sort(
    (left, right) =>
      getTraceDbStateBoundarySortSequence(candidateBoundaries.get(left) ?? null, upstreamBoundaries.get(left) ?? null) -
        getTraceDbStateBoundarySortSequence(
          candidateBoundaries.get(right) ?? null,
          upstreamBoundaries.get(right) ?? null,
        ) || left.localeCompare(right),
  );
  const fingerprintCache = new Map<string, FingerprintArtifact>();
  const divergentBoundaries: TraceDbStateBoundaryComparison[] = [];

  for (const boundaryKey of boundaryKeys) {
    const candidate = candidateBoundaries.get(boundaryKey) ?? null;
    const upstream = upstreamBoundaries.get(boundaryKey) ?? null;
    const rawSequenceEnd = getTraceDbStateBoundarySortSequence(candidate, upstream);
    let fingerprintComparison: ComparisonResult | null = null;
    let different = candidate === null || upstream === null;

    if (candidate && upstream) {
      if (
        !compareStringArrays(candidate.entryKinds, upstream.entryKinds) ||
        !compareStringArrays(candidate.nodeKeys, upstream.nodeKeys) ||
        !compareStringArrays(candidate.unitKeys, upstream.unitKeys)
      ) {
        different = true;
      }

      fingerprintComparison = compareFingerprints(
        await readFingerprintWithCache(candidate.fingerprintPath, fingerprintCache),
        await readFingerprintWithCache(upstream.fingerprintPath, fingerprintCache),
      );
      if (fingerprintComparison.different) {
        different = true;
      }
    }

    if (different) {
      divergentBoundaries.push({
        candidate,
        different,
        fingerprintComparison,
        rawSequenceEnd,
        upstream,
      });
    }
  }

  const report: TraceDbStateComparisonReport = {
    candidateCapturedExchangeCount: candidateManifest.capturedExchangeCount,
    candidateCompletedRawSequenceEnd: candidateManifest.completedRawSequenceEnd,
    candidateManifestPath: options.candidateManifestPath,
    candidateReplayIssues: candidateManifest.replayIssues,
    comparedBoundaryCount: boundaryKeys.length,
    different:
      divergentBoundaries.length > 0 ||
      replayIssuesDifferent ||
      candidateManifest.capturedExchangeCount !== upstreamManifest.capturedExchangeCount ||
      candidateManifest.completedRawSequenceEnd !== upstreamManifest.completedRawSequenceEnd,
    divergentBoundaries,
    firstDivergentBoundary: divergentBoundaries[0] ?? null,
    firstReplayIssue: pickFirstReplayIssue({
      candidateReplayIssues: candidateManifest.replayIssues,
      upstreamReplayIssues: upstreamManifest.replayIssues,
    }),
    upstreamCapturedExchangeCount: upstreamManifest.capturedExchangeCount,
    upstreamCompletedRawSequenceEnd: upstreamManifest.completedRawSequenceEnd,
    upstreamManifestPath: options.upstreamManifestPath,
    upstreamReplayIssues: upstreamManifest.replayIssues,
  };

  return report;
}

export function suppressSequenceOnlyDbStateDifferences(
  report: TraceDbStateComparisonReport,
): TraceDbStateComparisonReport {
  if (
    report.divergentBoundaries.length > 0 ||
    report.firstReplayIssue !== null ||
    report.candidateReplayIssues.length > 0 ||
    report.upstreamReplayIssues.length > 0
  ) {
    return report;
  }

  return {
    ...report,
    different: false,
  };
}

function isSignedStatementBoundary(nodeKeys: string[]): boolean {
  return nodeKeys.length > 0 && nodeKeys.every((nodeKey) => nodeKey.includes("E.Data2.6-SignedStatements"));
}

function shouldSuppressSignedStatementBoundaryDifference(boundary: TraceDbStateBoundaryComparison): boolean {
  const comparison = boundary.fingerprintComparison;
  if (!boundary.candidate || !boundary.upstream || !comparison) {
    return false;
  }

  if (
    !isSignedStatementBoundary(boundary.candidate.nodeKeys) ||
    !isSignedStatementBoundary(boundary.upstream.nodeKeys)
  ) {
    return false;
  }

  if (
    comparison.onlyLeft.length > 0 ||
    comparison.onlyRight.length > 0 ||
    comparison.rowHashOrCountDifferences.length === 0
  ) {
    return false;
  }

  return comparison.rowHashOrCountDifferences.every(
    (difference) =>
      signedStatementFingerprintTables.has(difference.table) &&
      difference.left?.rowCount === difference.right?.rowCount,
  );
}

export function suppressSignedStatementAttachmentDbDifferences(
  report: TraceDbStateComparisonReport,
): TraceDbStateComparisonReport {
  if (
    report.firstReplayIssue !== null ||
    report.candidateReplayIssues.length > 0 ||
    report.upstreamReplayIssues.length > 0 ||
    report.divergentBoundaries.length === 0
  ) {
    return report;
  }

  if (!report.divergentBoundaries.every((boundary) => shouldSuppressSignedStatementBoundaryDifference(boundary))) {
    return report;
  }

  return {
    ...report,
    different: false,
    divergentBoundaries: [],
    firstDivergentBoundary: null,
  };
}

export async function writeTraceDbStateComparisonReport(options: {
  candidateManifestPath: string;
  outPath: string;
  upstreamManifestPath: string;
}): Promise<TraceDbStateComparisonReport> {
  const rawReport = await compareTraceDbStateManifests({
    candidateManifestPath: options.candidateManifestPath,
    upstreamManifestPath: options.upstreamManifestPath,
  });
  const report = suppressSignedStatementAttachmentDbDifferences(suppressSequenceOnlyDbStateDifferences(rawReport));
  await writeJson(options.outPath, report);
  return report;
}

function renderTraceDbStateComparisonReport(report: TraceDbStateComparisonReport): string {
  const lines = [
    "# DB State Comparison",
    "",
    `Different: ${report.different ? "yes" : "no"}`,
    `Compared boundaries: ${report.comparedBoundaryCount}`,
    `Candidate replay issues: ${report.candidateReplayIssues.length}`,
    `Upstream replay issues: ${report.upstreamReplayIssues.length}`,
    `Candidate completed sequence: ${report.candidateCompletedRawSequenceEnd ?? "n/a"}`,
    `Upstream completed sequence: ${report.upstreamCompletedRawSequenceEnd ?? "n/a"}`,
  ];

  if (report.firstReplayIssue) {
    lines.push(
      "",
      `First replay issue: ${report.firstReplayIssue.runner} sequence ${report.firstReplayIssue.issue.rawSequence}`,
      `Expected status: ${report.firstReplayIssue.issue.expectedStatus}`,
      `Actual status: ${report.firstReplayIssue.issue.actualStatus ?? "error"}`,
      `Target: ${report.firstReplayIssue.issue.method} ${report.firstReplayIssue.issue.targetUrl}`,
    );
  }

  if (report.firstDivergentBoundary) {
    lines.push(
      "",
      `First divergent boundary: sequence ${report.firstDivergentBoundary.rawSequenceEnd}`,
      `Candidate nodes: ${report.firstDivergentBoundary.candidate?.nodeKeys.join(", ") ?? "missing"}`,
      `Upstream nodes: ${report.firstDivergentBoundary.upstream?.nodeKeys.join(", ") ?? "missing"}`,
    );

    const fingerprintComparison = report.firstDivergentBoundary.fingerprintComparison;
    if (fingerprintComparison) {
      lines.push(
        `Only candidate tables: ${fingerprintComparison.onlyLeft.length}`,
        `Only upstream tables: ${fingerprintComparison.onlyRight.length}`,
        `Changed shared tables: ${fingerprintComparison.rowHashOrCountDifferences.length}`,
      );
    }
  } else if (report.different) {
    lines.push("", "Aligned DB boundary divergence: none");
  }

  return `${lines.join("\n")}\n`;
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
  runner: "candidate" | "upstream",
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
      runner === "candidate"
        ? buildCandidateArgs(config, recorder.captureBaseUrl, version)
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

  const candidateRaw = await captureRunner("candidate", config, version, versionDir);
  const candidateNormalized = normalizeTrafficArtifact(candidateRaw);
  const candidateRawPath = resolve(versionDir, "candidate-raw.json");
  const candidateNormalizedPath = resolve(versionDir, "candidate-normalized.json");
  await writeJson(candidateRawPath, candidateRaw);
  await writeJson(candidateNormalizedPath, candidateNormalized);
  const candidateTraceArtifacts = await writeTraceArtifacts(
    versionDir,
    candidateRaw,
    candidateNormalized,
    config.unitKeys,
  );
  const candidateDbStateArtifacts = await writeTraceDbStateArtifacts({
    mode: config.dbStateMode,
    nodeIndex: candidateTraceArtifacts.nodeIndex,
    nodeIndexPath: candidateTraceArtifacts.nodeIndexPath,
    rawArtifact: candidateRaw,
    rawArtifactPath: candidateRawPath,
    selectedUnitKeys: config.unitKeys,
    versionDir,
  });
  if (candidateDbStateArtifacts) {
    await writeJson(candidateTraceArtifacts.traceManifestPath, {
      ...candidateTraceArtifacts.traceManifest,
      dbStateManifestPath: candidateDbStateArtifacts.manifestPath,
    } satisfies TraceRunManifest);
  }

  const upstreamRaw = await captureRunner("upstream", config, version, versionDir);
  const upstreamNormalized = normalizeTrafficArtifact(upstreamRaw);
  const upstreamRawPath = resolve(versionDir, "upstream-raw.json");
  const upstreamNormalizedPath = resolve(versionDir, "upstream-normalized.json");
  await writeJson(upstreamRawPath, upstreamRaw);
  await writeJson(upstreamNormalizedPath, upstreamNormalized);
  const upstreamTraceArtifacts = await writeTraceArtifacts(
    versionDir,
    upstreamRaw,
    upstreamNormalized,
    config.unitKeys,
  );
  const upstreamDbStateArtifacts = await writeTraceDbStateArtifacts({
    mode: config.dbStateMode,
    nodeIndex: upstreamTraceArtifacts.nodeIndex,
    nodeIndexPath: upstreamTraceArtifacts.nodeIndexPath,
    rawArtifact: upstreamRaw,
    rawArtifactPath: upstreamRawPath,
    selectedUnitKeys: config.unitKeys,
    versionDir,
  });
  if (upstreamDbStateArtifacts) {
    await writeJson(upstreamTraceArtifacts.traceManifestPath, {
      ...upstreamTraceArtifacts.traceManifest,
      dbStateManifestPath: upstreamDbStateArtifacts.manifestPath,
    } satisfies TraceRunManifest);
  }

  const dbStateComparisonReport =
    candidateDbStateArtifacts && upstreamDbStateArtifacts
      ? await writeTraceDbStateComparisonReport({
          candidateManifestPath: candidateDbStateArtifacts.manifestPath,
          outPath: resolve(versionDir, "compare-db-state.json"),
          upstreamManifestPath: upstreamDbStateArtifacts.manifestPath,
        })
      : null;
  if (dbStateComparisonReport) {
    await writeText(
      resolve(versionDir, "compare-db-state.md"),
      renderTraceDbStateComparisonReport(dbStateComparisonReport),
    );
  }

  const stableCandidateNormalized = stabilizeSignedStatementAttachments(
    stabilizeTimingDrivenStatementPolls(candidateNormalized),
  );
  const stableUpstreamNormalized = stabilizeSignedStatementAttachments(
    stabilizeTimingDrivenStatementPolls(upstreamNormalized),
  );
  const rawComparison = compareNormalizedTrafficRuns(
    stableCandidateNormalized,
    stableUpstreamNormalized,
    config.compareMode,
  );
  const comparison = suppressTimingDrivenStatementPollMismatches(
    stableCandidateNormalized,
    stableUpstreamNormalized,
    rawComparison,
  );
  await writeJson(resolve(versionDir, "compare.json"), comparison);
  await writeText(
    resolve(versionDir, "compare.md"),
    renderTrafficComparisonReport(stableCandidateNormalized, stableUpstreamNormalized, comparison),
  );

  console.log(
    JSON.stringify(
      {
        version,
        mode: comparison.mode,
        candidateExitCode: candidateRaw.exitCode,
        upstreamExitCode: upstreamRaw.exitCode,
        candidateCount: comparison.leftCount,
        upstreamCount: comparison.rightCount,
        matchedCount: comparison.matchedCount,
        dbStateDifferent: dbStateComparisonReport?.different ?? null,
        firstDbStateDivergenceSequence: dbStateComparisonReport?.firstDivergentBoundary?.rawSequenceEnd ?? null,
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
