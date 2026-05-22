import { existsSync, mkdirSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, isAbsolute, posix, relative, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "..");
const require = createRequire(import.meta.url);
const installedSuitePackageName = "adl-lrs-conformance-tests";
const defaultNodeImage = "docker.io/library/node:22";
const repoMountTarget = "/workspace";
const externalSuiteMountTarget = "/adl-suite";

type SuiteLocation = {
  suiteDir: string;
  consoleRunnerPath: string;
};

interface ExportUpstreamConfig {
  baseUrl: string;
  username: string;
  password: string;
  version: "2.0.0" | "1.0.3";
  outputPath: string;
  suiteDirOverride?: string;
  logDir: string;
  nodeImage: string;
  grep?: string;
  directory?: string;
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function usage(): string {
  return [
    "Usage:",
    "  bun run rewrite:export:upstream:lrsql -- [--base-url <url>] [--username <user>] [--password <pass>] [--version 2.0.0|1.0.3] [--out <path>] [--grep <pattern>] [--directory <csv>] [--suite-dir <path>] [--log-dir <path>] [--node-image <ref>]",
    "",
    "Defaults:",
    "  --base-url http://localhost:8080/xapi",
    "  --username janedoe",
    "  --password supersecret",
    "  --version 2.0.0",
    "  --out tmp/agents/upstream-run.json",
    "  --log-dir tmp/agents/lrs-conformance",
    `  --node-image ${defaultNodeImage}`,
  ].join("\n");
}

function parseConfig(args: string[]): ExportUpstreamConfig {
  const baseUrl = getFlagValue(args, "--base-url") ?? "http://localhost:8080/xapi";
  const username = getFlagValue(args, "--username") ?? "janedoe";
  const password = getFlagValue(args, "--password") ?? "supersecret";
  const versionFlag = getFlagValue(args, "--version") ?? "2.0.0";
  const outputPath = getFlagValue(args, "--out") ?? "tmp/agents/upstream-run.json";
  const suiteDirOverride = getFlagValue(args, "--suite-dir");
  const logDirArg = getFlagValue(args, "--log-dir") ?? "tmp/agents/lrs-conformance";
  const nodeImage = getFlagValue(args, "--node-image") ?? defaultNodeImage;
  const grep = getFlagValue(args, "--grep");
  const directory = getFlagValue(args, "--directory");

  if (versionFlag !== "2.0.0" && versionFlag !== "1.0.3") {
    throw new Error(`Unsupported --version value: ${versionFlag}`);
  }

  const version: ExportUpstreamConfig["version"] = versionFlag;

  return {
    baseUrl,
    username,
    password,
    version,
    outputPath,
    suiteDirOverride: suiteDirOverride
      ? isAbsolute(suiteDirOverride)
        ? suiteDirOverride
        : resolve(repoRoot, suiteDirOverride)
      : undefined,
    logDir: isAbsolute(logDirArg) ? logDirArg : resolve(repoRoot, logDirArg),
    nodeImage,
    grep,
    directory,
  };
}

function ensureSuiteReady(suiteDir: string, missingMessage: string): string {
  const consoleRunnerPath = resolve(suiteDir, "bin/console_runner.js");
  if (!existsSync(consoleRunnerPath)) {
    throw new Error(`${missingMessage} Expected ${consoleRunnerPath}.`);
  }

  return consoleRunnerPath;
}

function isWithinRepo(path: string): boolean {
  const relativePath = relative(repoRoot, path);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function resolveInstalledSuiteLocation(): SuiteLocation | null {
  try {
    const packageJsonPath = require.resolve(`${installedSuitePackageName}/package.json`);
    const suiteDir = dirname(packageJsonPath);
    return {
      suiteDir,
      consoleRunnerPath: ensureSuiteReady(
        suiteDir,
        `The installed ADL conformance suite could not be executed from ${suiteDir}.`,
      ),
    };
  } catch {
    return null;
  }
}

function resolveSuiteLocation(suiteDirOverride?: string): SuiteLocation {
  if (suiteDirOverride) {
    return {
      suiteDir: suiteDirOverride,
      consoleRunnerPath: ensureSuiteReady(
        suiteDirOverride,
        `The ADL conformance suite was not found at the configured suite directory ${suiteDirOverride}.`,
      ),
    };
  }

  const installedSuiteLocation = resolveInstalledSuiteLocation();
  if (installedSuiteLocation) {
    return installedSuiteLocation;
  }

  throw new Error(
    `The ADL conformance suite is not installed. Add ${installedSuitePackageName} with bun install or pass --suite-dir.`,
  );
}

function ensurePodmanAvailable(): void {
  const result = spawnSync("podman", ["--version"], {
    stdio: "ignore",
  });

  if (result.error || result.status !== 0) {
    throw new Error("podman is required to run the ADL conformance suite in the Node 22 container path.");
  }
}

function toPosixRelativePath(path: string): string {
  return path.replaceAll("\\", "/");
}

function resolvePodmanExecutionPaths(suiteLocation: SuiteLocation): {
  mountSource: string;
  mountTarget: string;
  suiteDir: string;
  consoleRunnerPath: string;
} {
  if (isWithinRepo(suiteLocation.suiteDir) && isWithinRepo(suiteLocation.consoleRunnerPath)) {
    return {
      mountSource: repoRoot,
      mountTarget: repoMountTarget,
      suiteDir: posix.resolve(repoMountTarget, toPosixRelativePath(relative(repoRoot, suiteLocation.suiteDir))),
      consoleRunnerPath: posix.resolve(
        repoMountTarget,
        toPosixRelativePath(relative(repoRoot, suiteLocation.consoleRunnerPath)),
      ),
    };
  }

  return {
    mountSource: suiteLocation.suiteDir,
    mountTarget: externalSuiteMountTarget,
    suiteDir: externalSuiteMountTarget,
    consoleRunnerPath: posix.resolve(
      externalSuiteMountTarget,
      toPosixRelativePath(relative(suiteLocation.suiteDir, suiteLocation.consoleRunnerPath)),
    ),
  };
}

function shellEscape(value: string): string {
  return `'${value.replaceAll("'", `"'"'"`)}'`;
}

function buildSuiteBootstrapCommand(
  executionPaths: ReturnType<typeof resolvePodmanExecutionPaths>,
  upstreamArgs: string[],
  logDirInContainer: string,
): string {
  const shellQuotedUpstreamArgs = upstreamArgs.map(shellEscape).join(" ");
  const runtimePrefixDir = "/tmp/adl-suite-runtime";
  const runtimeNodeModulesDir = posix.resolve(runtimePrefixDir, "node_modules");
  const runtimeSuiteDir = posix.resolve(runtimeNodeModulesDir, "adl-lrs-conformance-tests");
  const runtimeSuiteNodeModulesDir = posix.resolve(runtimeSuiteDir, "node_modules");
  const runtimeSuiteLogsDir = posix.resolve(runtimeSuiteDir, "logs");
  const runtimeConsoleRunnerPath = posix.resolve(runtimeSuiteDir, "bin/console_runner.js");

  return [
    "set -eu",
    `real_console_runner_path=$(realpath ${shellEscape(executionPaths.consoleRunnerPath)})`,
    'package_root_dir=$(dirname "$(dirname "$(dirname "$real_console_runner_path")")")',
    `artifact_dir=${shellEscape(logDirInContainer)}`,
    `runtime_prefix_dir=${shellEscape(runtimePrefixDir)}`,
    `runtime_node_modules_dir=${shellEscape(runtimeNodeModulesDir)}`,
    `runtime_suite_dir=${shellEscape(runtimeSuiteDir)}`,
    `runtime_suite_node_modules_dir=${shellEscape(runtimeSuiteNodeModulesDir)}`,
    `runtime_suite_logs_dir=${shellEscape(runtimeSuiteLogsDir)}`,
    'rm -rf "$runtime_prefix_dir"',
    'mkdir -p "$runtime_node_modules_dir"',
    'mkdir -p "$artifact_dir"',
    'cp -LR "$package_root_dir"/. "$runtime_node_modules_dir"',
    'rm -rf "$runtime_suite_logs_dir"',
    'ln -s "$artifact_dir" "$runtime_suite_logs_dir"',
    'cd "$runtime_suite_dir"',
    'if [ ! -f "$runtime_suite_node_modules_dir/pretty-error/package.json" ]; then',
    '  echo "[conformance] hydrating ADL suite runtime dependencies"',
    '  npm install --prefix "$runtime_suite_dir" --omit=dev --no-save --no-package-lock --ignore-scripts --no-audit --no-fund',
    "fi",
    'export NODE_PATH="$runtime_suite_node_modules_dir:$runtime_node_modules_dir${NODE_PATH:+:$NODE_PATH}"',
    "set +e",
    `node ${shellEscape(runtimeConsoleRunnerPath)}${
      shellQuotedUpstreamArgs.length > 0 ? ` ${shellQuotedUpstreamArgs}` : ""
    }`,
    "status=$?",
    'latest_log=$(ls -1t "$artifact_dir"/*.log 2>/dev/null | head -n 1 || true)',
    'if [ -n "$latest_log" ]; then',
    '  echo "[conformance] latest run log available at $latest_log"',
    "fi",
    'exit "$status"',
  ].join("\n");
}

function runConsoleRunnerInContainer(config: ExportUpstreamConfig, suiteLocation: SuiteLocation): number {
  ensurePodmanAvailable();

  const upstreamArgs = [
    "--endpoint",
    config.baseUrl,
    "--authUser",
    config.username,
    "--authPassword",
    config.password,
    "--basicAuth",
  ];

  if (!config.directory) {
    upstreamArgs.push("--xapiVersion", config.version);
  }

  if (config.grep) {
    upstreamArgs.push("--grep", config.grep);
  }

  if (config.directory) {
    upstreamArgs.push("--directory", config.directory);
  }

  mkdirSync(config.logDir, { recursive: true });

  const executionPaths = resolvePodmanExecutionPaths(suiteLocation);
  const logDirInContainer = posix.resolve(repoMountTarget, toPosixRelativePath(relative(repoRoot, config.logDir)));
  const suiteBootstrapCommand = buildSuiteBootstrapCommand(executionPaths, upstreamArgs, logDirInContainer);
  const mountSuffix = process.platform === "linux" ? ":Z" : "";
  const podmanArgs = ["run", "--rm", "--network", "host"];

  if (process.platform === "linux") {
    podmanArgs.push("--userns", "keep-id");
  }

  podmanArgs.push("--volume", `${executionPaths.mountSource}:${executionPaths.mountTarget}${mountSuffix}`);

  if (executionPaths.mountSource !== repoRoot || executionPaths.mountTarget !== repoMountTarget) {
    podmanArgs.push("--volume", `${repoRoot}:${repoMountTarget}${mountSuffix}`);
  }

  podmanArgs.push("--workdir", executionPaths.suiteDir, "--env", "HOME=/tmp");

  if (process.platform !== "linux" && typeof process.getuid === "function" && typeof process.getgid === "function") {
    podmanArgs.push("--user", `${process.getuid()}:${process.getgid()}`);
  }

  podmanArgs.push(config.nodeImage, "sh", "-lc", suiteBootstrapCommand);

  const result = spawnSync("podman", podmanArgs, {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

async function listLogFiles(logDir: string): Promise<string[]> {
  try {
    const entries = await readdir(logDir, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".log")).map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function selectLatestLogFile(logDir: string, previousFiles: Set<string>): Promise<string | undefined> {
  const currentFiles = await listLogFiles(logDir);
  const candidates = currentFiles.filter((name) => !previousFiles.has(name));
  const pool = candidates.length > 0 ? candidates : currentFiles;

  if (pool.length === 0) {
    return undefined;
  }

  const withTimes = await Promise.all(
    pool.map(async (name) => {
      const filePath = resolve(logDir, name);
      const fileStat = await stat(filePath);
      return {
        name,
        mtimeMs: fileStat.mtimeMs,
      };
    }),
  );

  withTimes.sort((left, right) => right.mtimeMs - left.mtimeMs);
  return withTimes[0]?.name;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return 0;
  }

  const config = parseConfig(args);
  const suiteLocation = resolveSuiteLocation(config.suiteDirOverride);
  const existingFiles = new Set(await listLogFiles(config.logDir));

  const exitCode = runConsoleRunnerInContainer(config, suiteLocation);
  const latestLogName = await selectLatestLogFile(config.logDir, existingFiles);

  if (!latestLogName) {
    throw new Error(
      `Upstream run finished but no log artifact was found in ${config.logDir}. Ensure upstream dependencies are installed.`,
    );
  }

  const latestLogPath = resolve(config.logDir, latestLogName);
  const raw = await readFile(latestLogPath, "utf8");
  const parsed = JSON.parse(raw) as {
    summary?: { failed?: number; total?: number; passed?: number; version?: string };
    log?: { tests?: unknown[] };
  };

  if (typeof parsed.summary?.total !== "number") {
    throw new Error(
      "Upstream run did not execute test cases (summary.total is null). Remove conflicting flags and try again.",
    );
  }

  if (parsed.summary.total <= 0) {
    throw new Error(
      "Upstream run completed with zero tests. Remove or broaden --grep/--directory so at least one upstream test executes.",
    );
  }

  if (!Array.isArray(parsed.log?.tests) || parsed.log.tests.length === 0) {
    throw new Error(
      "Upstream run did not produce a usable test tree (log.tests is empty). Re-run after stabilizing the target LRS and try export again.",
    );
  }

  const absoluteOutputPath = resolve(config.outputPath);
  await mkdir(dirname(absoluteOutputPath), { recursive: true });
  await writeFile(absoluteOutputPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath: absoluteOutputPath,
        sourceLogPath: latestLogPath,
        upstreamExitCode: exitCode,
        summary: parsed.summary ?? null,
      },
      null,
      2,
    ),
  );

  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
