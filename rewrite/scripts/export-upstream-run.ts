import { existsSync, mkdirSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, posix, relative, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "../..");
const defaultNodeImage = "docker.io/library/node:22";
const defaultUpstreamRepoUrl = "https://github.com/adlnet/lrs-conformance-test-suite.git";
const defaultUpstreamRef = "5bc232d349c60faded8240da698f195106091638";
const defaultCloneDepth = 1;
const repoMountTarget = "/workspace";
const suiteMountTarget = "/adl-suite-src";
const allowedArtifactsRoot = resolve(repoRoot, "tmp/agents");

type SuiteLocation = {
  suiteDir: string;
};

interface ExportUpstreamConfig {
  baseUrl: string;
  username: string;
  password: string;
  version: "2.0.0" | "1.0.3";
  outputPath: string;
  logDir: string;
  nodeImage: string;
  upstreamRepoUrl: string;
  upstreamRef: string;
  cloneDepth: number;
  cloneBaseDir: string;
  keepClone: boolean;
  allowUnsafeOutputPath: boolean;
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
    "  bun run rewrite:export:upstream:lrsql -- [--base-url <url>] [--username <user>] [--password <pass>] [--version 2.0.0|1.0.3] [--out <path>] [--grep <pattern>] [--directory <csv>] [--log-dir <path>] [--node-image <ref>] [--upstream-repo-url <url>] [--upstream-ref <ref>] [--clone-depth <n>] [--clone-base-dir <path>] [--keep-clone]",
    "",
    "Defaults:",
    "  --base-url http://localhost:8080/xapi",
    "  --username janedoe",
    "  --password supersecret",
    "  --version 2.0.0",
    "  --out tmp/agents/upstream-run.json",
    "  --log-dir tmp/agents/lrs-conformance",
    `  --upstream-repo-url ${defaultUpstreamRepoUrl}`,
    `  --upstream-ref ${defaultUpstreamRef}`,
    `  --clone-depth ${defaultCloneDepth}`,
    "  --clone-base-dir tmp/agents/upstream-clones",
    `  --node-image ${defaultNodeImage}`,
    "",
    "Notes:",
    "  The upstream suite source is always fetched from GitHub by shallow clone.",
    "  Local suite source paths are intentionally unsupported.",
  ].join("\n");
}

function parseConfig(args: string[]): ExportUpstreamConfig {
  const baseUrl = getFlagValue(args, "--base-url") ?? "http://localhost:8080/xapi";
  const username = getFlagValue(args, "--username") ?? "janedoe";
  const password = getFlagValue(args, "--password") ?? "supersecret";
  const versionFlag = getFlagValue(args, "--version") ?? "2.0.0";
  const outputPath = getFlagValue(args, "--out") ?? "tmp/agents/upstream-run.json";
  const logDirArg = getFlagValue(args, "--log-dir") ?? "tmp/agents/lrs-conformance";
  const nodeImage = getFlagValue(args, "--node-image") ?? defaultNodeImage;
  const upstreamRepoUrl =
    getFlagValue(args, "--upstream-repo-url") ?? process.env.UPSTREAM_REPO_URL ?? defaultUpstreamRepoUrl;
  const upstreamRef = getFlagValue(args, "--upstream-ref") ?? process.env.UPSTREAM_REF ?? defaultUpstreamRef;
  const cloneDepthValue =
    getFlagValue(args, "--clone-depth") ?? process.env.UPSTREAM_CLONE_DEPTH ?? `${defaultCloneDepth}`;
  const cloneBaseDirArg =
    getFlagValue(args, "--clone-base-dir") ?? process.env.UPSTREAM_CLONE_BASE_DIR ?? "tmp/agents/upstream-clones";
  const keepClone = args.includes("--keep-clone") || process.env.UPSTREAM_KEEP_CLONE === "1";
  const allowUnsafeOutputPath =
    args.includes("--allow-unsafe-output-path") || process.env.ALLOW_UNSAFE_OUTPUT_PATH === "1";
  const grep = getFlagValue(args, "--grep");
  const directory = getFlagValue(args, "--directory");
  const cloneDepth = Number.parseInt(cloneDepthValue, 10);

  if (versionFlag !== "2.0.0" && versionFlag !== "1.0.3") {
    throw new Error(`Unsupported --version value: ${versionFlag}`);
  }

  if (!Number.isInteger(cloneDepth) || cloneDepth <= 0) {
    throw new Error(`Invalid --clone-depth value: ${cloneDepthValue}`);
  }

  if (upstreamRef.trim().length === 0) {
    throw new Error("--upstream-ref must not be empty");
  }

  const version: ExportUpstreamConfig["version"] = versionFlag;

  return {
    baseUrl,
    username,
    password,
    version,
    outputPath,
    logDir: isAbsolute(logDirArg) ? logDirArg : resolve(repoRoot, logDirArg),
    nodeImage,
    upstreamRepoUrl,
    upstreamRef,
    cloneDepth,
    cloneBaseDir: isAbsolute(cloneBaseDirArg) ? cloneBaseDirArg : resolve(repoRoot, cloneBaseDirArg),
    keepClone,
    allowUnsafeOutputPath,
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

function isWithinPath(basePath: string, candidatePath: string): boolean {
  const relativePath = relative(basePath, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function resolveSafeArtifactPath(pathValue: string, kind: string, allowUnsafe: boolean): string {
  const absolutePath = resolve(pathValue);
  if (allowUnsafe) {
    return absolutePath;
  }

  if (!isWithinPath(allowedArtifactsRoot, absolutePath)) {
    throw new Error(
      `${kind} path ${absolutePath} is outside ${allowedArtifactsRoot}. Set ALLOW_UNSAFE_OUTPUT_PATH=1 or pass --allow-unsafe-output-path to override.`,
    );
  }

  return absolutePath;
}

function ensureCommandAvailable(command: string, missingMessage: string): void {
  const result = spawnSync(command, ["--version"], {
    stdio: "ignore",
  });

  if (result.error || result.status !== 0) {
    throw new Error(missingMessage);
  }
}

function runCommand(command: string, args: string[], errorContext: string): void {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${errorContext} exited with status ${result.status ?? 1}`);
  }
}

function looksLikeCommitRef(value: string): boolean {
  return /^[0-9a-f]{7,40}$/i.test(value);
}

function cloneUpstreamSuite(config: ExportUpstreamConfig): SuiteLocation {
  mkdirSync(config.cloneBaseDir, { recursive: true });

  const cloneDir = resolve(
    config.cloneBaseDir,
    `upstream-suite-${Date.now()}-${process.pid}-${Math.random().toString(16).slice(2, 10)}`,
  );
  const cloneDepth = `${config.cloneDepth}`;

  console.log(
    `[upstream-clone] cloning ${config.upstreamRepoUrl} ref=${config.upstreamRef} depth=${cloneDepth} into ${cloneDir}`,
  );

  if (looksLikeCommitRef(config.upstreamRef)) {
    runCommand("git", ["init", cloneDir], "git init");
    runCommand("git", ["-C", cloneDir, "remote", "add", "origin", config.upstreamRepoUrl], "git remote add");
    runCommand("git", ["-C", cloneDir, "fetch", "--depth", cloneDepth, "origin", config.upstreamRef], "git fetch");
    runCommand("git", ["-C", cloneDir, "checkout", "--detach", "FETCH_HEAD"], "git checkout");
  } else {
    runCommand(
      "git",
      ["clone", "--depth", cloneDepth, "--branch", config.upstreamRef, config.upstreamRepoUrl, cloneDir],
      "git clone",
    );
  }

  ensureSuiteReady(cloneDir, `The cloned ADL conformance suite at ${cloneDir} is incomplete.`);

  return {
    suiteDir: cloneDir,
  };
}

function ensurePodmanAvailable(): void {
  ensureCommandAvailable(
    "podman",
    "podman is required to run the ADL conformance suite in the Node 22 container path.",
  );
}

function toPosixRelativePath(path: string): string {
  return path.replaceAll("\\", "/");
}

function shellEscape(value: string): string {
  return `'${value.replaceAll("'", `"'"'"`)}'`;
}

function buildSuiteBootstrapCommand(
  upstreamArgs: string[],
  logDirInContainer: string,
  suiteSourceDirInContainer: string,
): string {
  const shellQuotedUpstreamArgs = upstreamArgs.map(shellEscape).join(" ");
  const runtimePrefixDir = "/tmp/adl-suite-runtime";
  const runtimeSuiteDir = posix.resolve(runtimePrefixDir, "adl-lrs-conformance-tests");
  const runtimeSuiteNodeModulesDir = posix.resolve(runtimeSuiteDir, "node_modules");
  const runtimeSuiteLogsDir = posix.resolve(runtimeSuiteDir, "logs");
  const runtimeConsoleRunnerPath = posix.resolve(runtimeSuiteDir, "bin/console_runner.js");

  return [
    "set -eu",
    `suite_source_dir=${shellEscape(suiteSourceDirInContainer)}`,
    `artifact_dir=${shellEscape(logDirInContainer)}`,
    `runtime_prefix_dir=${shellEscape(runtimePrefixDir)}`,
    `runtime_suite_dir=${shellEscape(runtimeSuiteDir)}`,
    `runtime_suite_node_modules_dir=${shellEscape(runtimeSuiteNodeModulesDir)}`,
    `runtime_suite_logs_dir=${shellEscape(runtimeSuiteLogsDir)}`,
    'if [ -z "$suite_source_dir" ] || [ "$suite_source_dir" = "/" ]; then',
    '  echo "[conformance] refusing unsafe suite source path: $suite_source_dir"',
    "  exit 1",
    "fi",
    'if [ ! -f "$suite_source_dir/bin/console_runner.js" ] || [ ! -f "$suite_source_dir/package.json" ]; then',
    '  echo "[conformance] cloned suite is missing expected files in $suite_source_dir"',
    "  exit 1",
    "fi",
    'rm -rf "$runtime_prefix_dir"',
    'mkdir -p "$runtime_suite_dir"',
    'mkdir -p "$artifact_dir"',
    'cp -LR "$suite_source_dir"/. "$runtime_suite_dir"',
    'rm -rf "$runtime_suite_logs_dir"',
    'ln -s "$artifact_dir" "$runtime_suite_logs_dir"',
    'cd "$runtime_suite_dir"',
    'if [ ! -f "$runtime_suite_node_modules_dir/pretty-error/package.json" ]; then',
    '  echo "[conformance] hydrating ADL suite runtime dependencies"',
    '  npm install --prefix "$runtime_suite_dir" --omit=dev --no-save --no-package-lock --ignore-scripts --no-audit --no-fund',
    "fi",
    'export NODE_PATH="$runtime_suite_node_modules_dir${NODE_PATH:+:$NODE_PATH}"',
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

  const logDirInContainer = posix.resolve(repoMountTarget, toPosixRelativePath(relative(repoRoot, config.logDir)));
  const suiteBootstrapCommand = buildSuiteBootstrapCommand(upstreamArgs, logDirInContainer, suiteMountTarget);
  const mountSuffix = process.platform === "linux" ? ":Z" : "";
  const podmanArgs = ["run", "--rm", "--network", "host"];

  if (process.platform === "linux") {
    podmanArgs.push("--userns", "keep-id");
  }

  podmanArgs.push("--volume", `${suiteLocation.suiteDir}:${suiteMountTarget}${mountSuffix}`);
  podmanArgs.push("--volume", `${repoRoot}:${repoMountTarget}${mountSuffix}`);

  podmanArgs.push("--workdir", suiteMountTarget, "--env", "HOME=/tmp");

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
  ensureCommandAvailable("git", "git is required to clone the upstream conformance suite.");

  const safeLogDir = resolveSafeArtifactPath(config.logDir, "Log directory", config.allowUnsafeOutputPath);
  const safeOutputPath = resolveSafeArtifactPath(config.outputPath, "Output", config.allowUnsafeOutputPath);
  config.logDir = safeLogDir;
  config.outputPath = safeOutputPath;

  const suiteLocation = cloneUpstreamSuite(config);
  const existingFiles = new Set(await listLogFiles(config.logDir));

  let exitCode = 1;
  try {
    exitCode = runConsoleRunnerInContainer(config, suiteLocation);
  } finally {
    if (config.keepClone) {
      console.log(`[upstream-clone] preserved clone directory at ${suiteLocation.suiteDir}`);
    } else {
      await rm(suiteLocation.suiteDir, { recursive: true, force: true });
    }
  }

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

  const absoluteOutputPath = config.outputPath;
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
