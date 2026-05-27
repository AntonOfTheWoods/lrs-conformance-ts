import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

import {
  compareNormalizedTrafficRuns,
  normalizeTrafficArtifact,
  renderTrafficComparisonReport,
  startTrafficRecorder,
  type RawTrafficArtifact,
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
  username: string;
  version: SupportedVersion | "all";
}

function usage(): string {
  return [
    "Usage:",
    "  bun ./rewrite/scripts/traffic-diagnostic.ts [--version 1.0.3|2.0.0|all] [--compare-mode bag|ordered] [--grep <pattern>] [--directory <csv>] [--target-base-url <url>] [--username <user>] [--password <pass>] [--out-dir <path>] [--keep-clone]",
    "",
    "Defaults:",
    "  --version all",
    "  --compare-mode bag",
    "  --target-base-url http://localhost:8080/xapi",
    "  --username janedoe",
    "  --password supersecret",
    "  --out-dir tmp/agents/traffic/<timestamp>",
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

function parseConfig(args: string[]): DiagnosticConfig {
  const version = (getFlagValue(args, "--version") ?? "all") as DiagnosticConfig["version"];
  const compareMode = (getFlagValue(args, "--compare-mode") ?? "bag") as TrafficCompareMode;
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

  const upstreamRaw = await captureRunner("upstream", config, version, versionDir);
  const upstreamNormalized = normalizeTrafficArtifact(upstreamRaw);
  await writeJson(resolve(versionDir, "upstream-raw.json"), upstreamRaw);
  await writeJson(resolve(versionDir, "upstream-normalized.json"), upstreamNormalized);

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
