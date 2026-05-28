import { resolve } from "node:path";

import { parseConsoleRunnerArgv, type ConsoleRunnerOptions } from "./cli-args.ts";
import { normalizeRunnerOptions, type NormalizedRunnerOptions } from "./options.ts";

export interface LegacyConsoleRunnerInvocation {
  cwd: string;
  env: Record<string, string>;
  execPath: string;
  forwardedArgv: string[];
  legacyConsoleRunnerPath: string;
}

export interface BunConsoleRunnerDependencies {
  cwd?: string;
  execPath?: string;
  logger?: {
    error: (...args: unknown[]) => void;
    log: (...args: unknown[]) => void;
  };
  runLegacyConsoleRunner?: (invocation: LegacyConsoleRunnerInvocation) => Promise<number>;
}

export interface BunConsoleRunnerExecution {
  exitCode: number;
  forwardedArgv: string[];
  normalizedOptions: NormalizedRunnerOptions;
  parsedOptions: ConsoleRunnerOptions;
}

function pushValueArg(argv: string[], flag: string, value: string | undefined): void {
  if (typeof value === "undefined") {
    return;
  }

  argv.push(flag, value);
}

function pushBooleanArg(argv: string[], flag: string, enabled: boolean | undefined): void {
  if (!enabled) {
    return;
  }

  argv.push(flag);
}

function sanitizeEnv(environment: NodeJS.ProcessEnv): Record<string, string> {
  return Object.fromEntries(
    Object.entries(environment).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

export function buildForwardedConsoleRunnerArgv(
  parsedOptions: ConsoleRunnerOptions,
  normalizedOptions: NormalizedRunnerOptions,
): string[] {
  const argv: string[] = [];

  if (parsedOptions.xapiVersion) {
    pushValueArg(argv, "--xapiVersion", normalizedOptions.xapiVersion);
  } else if (parsedOptions.directory) {
    pushValueArg(argv, "--directory", normalizedOptions.directory.join(","));
  }

  pushValueArg(argv, "--endpoint", normalizedOptions.endpoint);
  pushValueArg(argv, "--authUser", normalizedOptions.authUser);
  pushValueArg(argv, "--authPassword", normalizedOptions.authPass);
  pushBooleanArg(argv, "--basicAuth", normalizedOptions.basicAuth);
  pushBooleanArg(argv, "--oAuth1", normalizedOptions.oAuth1);
  pushValueArg(argv, "--consumer_key", normalizedOptions.consumer_key);
  pushValueArg(argv, "--consumer_secret", normalizedOptions.consumer_secret);
  pushValueArg(argv, "--request_token_path", normalizedOptions.request_token_path);
  pushValueArg(argv, "--auth_token_path", normalizedOptions.auth_token_path);
  pushValueArg(argv, "--authorization_path", normalizedOptions.authorization_path);
  pushValueArg(argv, "--grep", normalizedOptions.grep);
  pushBooleanArg(argv, "--bail", normalizedOptions.bail);
  pushBooleanArg(argv, "--errors", normalizedOptions.errors);
  pushValueArg(argv, "--optional", normalizedOptions.optional?.join(","));
  pushValueArg(argv, "--file", normalizedOptions.file?.join(","));

  return argv;
}

function resolveRuntimeRoot(cwd: string | undefined): string {
  return cwd ?? resolve(import.meta.dir, "..");
}

function resolveLegacyConsoleRunnerPath(runtimeRoot: string): string {
  return resolve(runtimeRoot, "bin", "console_runner_legacy.js");
}

async function defaultRunLegacyConsoleRunner(invocation: LegacyConsoleRunnerInvocation): Promise<number> {
  const processHandle = Bun.spawn(
    [invocation.execPath, invocation.legacyConsoleRunnerPath, ...invocation.forwardedArgv],
    {
      cwd: invocation.cwd,
      env: invocation.env,
      stdio: ["inherit", "inherit", "inherit"],
    },
  );

  return await processHandle.exited;
}

export async function runConsoleRunnerArgv(
  argv: string[],
  dependencies: BunConsoleRunnerDependencies = {},
): Promise<BunConsoleRunnerExecution> {
  const parsedOptions = parseConsoleRunnerArgv(argv);
  const normalizedOptions = normalizeRunnerOptions(parsedOptions);
  const forwardedArgv = buildForwardedConsoleRunnerArgv(parsedOptions, normalizedOptions);
  const runtimeRoot = resolveRuntimeRoot(dependencies.cwd);
  const legacyConsoleRunnerPath = resolveLegacyConsoleRunnerPath(runtimeRoot);
  const runLegacyConsoleRunner = dependencies.runLegacyConsoleRunner ?? defaultRunLegacyConsoleRunner;
  const executionEnvironment = sanitizeEnv({
    ...process.env,
    LRS_CANDIDATE_RUNTIME_MODE: "legacy-node",
  });
  const execPath = dependencies.execPath ?? process.env.LRS_LEGACY_CONSOLE_RUNNER_EXEC_PATH ?? process.execPath;
  const exitCode = await runLegacyConsoleRunner({
    cwd: runtimeRoot,
    env: executionEnvironment,
    execPath,
    forwardedArgv,
    legacyConsoleRunnerPath,
  });

  return {
    exitCode,
    forwardedArgv,
    normalizedOptions,
    parsedOptions,
  };
}

export async function main(argv: string[], dependencies: BunConsoleRunnerDependencies = {}): Promise<number> {
  const logger = dependencies.logger ?? console;

  try {
    const execution = await runConsoleRunnerArgv(argv, dependencies);
    return execution.exitCode;
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}
