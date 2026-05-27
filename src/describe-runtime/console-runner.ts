import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { parseConsoleRunnerArgv, type ConsoleRunnerOptions } from "./cli-args.ts";
import { normalizeRunnerOptions, type NormalizedRunnerOptions } from "./options.ts";
import { registerDirectorySuites } from "./registry.ts";
import { createRunRecord, type RuntimeLogRecord, type RuntimeRunRecord } from "./run-record.ts";
import { createDescribeRuntime } from "./runtime.ts";

export interface ConsoleRunnerLogger {
  error: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
}

export interface ConsoleRunnerDependencies {
  createUuid?: () => string;
  logDirectory?: string;
  logger?: ConsoleRunnerLogger;
  now?: () => number;
}

export type SerializableRunRecord = Omit<RuntimeRunRecord, "log"> & { log?: RuntimeLogRecord };

export interface ConsoleRunnerExecution {
  logPath: string;
  normalizedOptions: NormalizedRunnerOptions;
  outputRecord: SerializableRunRecord;
  parsedOptions: ConsoleRunnerOptions;
  runRecord: RuntimeRunRecord;
}

function createRootTitle(xapiVersion: string): string {
  return `xAPI ${xapiVersion}`;
}

function createGrepPattern(grep: string | undefined): RegExp | undefined {
  return grep ? new RegExp(grep) : undefined;
}

function getDefaultLogDirectory(): string {
  return resolve(import.meta.dir, "..", "..", "logs");
}

function createRecordFlags(options: NormalizedRunnerOptions): RuntimeRunRecord["flags"] {
  return {
    endpoint: options.endpoint,
    basicAuth: options.basicAuth,
    authUser: options.authUser,
    oAuth1: options.oAuth1,
    consumer_key: options.consumer_key,
    grep: options.grep,
    unitKeys: options.unitKeys,
    optional: options.optional,
  };
}

function filterFailedLogRecord(log: RuntimeLogRecord | undefined): RuntimeLogRecord | undefined {
  if (!log || log.status !== "failed") {
    return undefined;
  }

  return {
    ...log,
    tests: log.tests.map(filterFailedLogRecord).filter((child): child is RuntimeLogRecord => Boolean(child)),
  };
}

function createOutputRecord(record: RuntimeRunRecord, errorsOnly: boolean): SerializableRunRecord {
  if (!errorsOnly) {
    return record;
  }

  return {
    ...record,
    log: filterFailedLogRecord(record.log),
  };
}

async function writeRunRecord(logPath: string, record: SerializableRunRecord): Promise<void> {
  mkdirSync(dirname(logPath), { recursive: true });
  await Bun.write(logPath, `${JSON.stringify(record, null, 4)}\n`);
}

export async function runNormalizedConsoleRunner(
  normalizedOptions: NormalizedRunnerOptions,
  dependencies: ConsoleRunnerDependencies = {},
): Promise<Omit<ConsoleRunnerExecution, "parsedOptions">> {
  const logger = dependencies.logger ?? console;

  const runtime = createDescribeRuntime({
    rootTitle: createRootTitle(normalizedOptions.xapiVersion),
    version: normalizedOptions.xapiVersion,
    bail: normalizedOptions.bail,
    grep: createGrepPattern(normalizedOptions.grep),
    now: dependencies.now,
  });

  registerDirectorySuites(runtime, normalizedOptions);

  const runResult = await runtime.run();
  const runRecord = createRunRecord(runResult, {
    name: "console",
    flags: createRecordFlags(normalizedOptions),
    options: {
      bail: normalizedOptions.bail,
      directory: normalizedOptions.directory,
      errors: normalizedOptions.errors,
    },
    rollupRule: "mustPassAll",
    uuid: dependencies.createUuid?.(),
  });

  const outputRecord = createOutputRecord(runRecord, normalizedOptions.errors);
  const logPath = join(dependencies.logDirectory ?? getDefaultLogDirectory(), `${runRecord.uuid}.log`);

  await writeRunRecord(logPath, outputRecord);

  logger.log(JSON.stringify(runRecord.summary));
  logger.log(`Tests completed in ${runRecord.duration / 1000} seconds`);
  logger.log(`Full run log written to ${logPath}`);

  return {
    logPath,
    normalizedOptions,
    outputRecord,
    runRecord,
  };
}

export async function runConsoleRunnerArgv(
  argv: string[],
  dependencies: ConsoleRunnerDependencies = {},
): Promise<ConsoleRunnerExecution> {
  const parsedOptions = parseConsoleRunnerArgv(argv);
  const normalizedOptions = normalizeRunnerOptions(parsedOptions);
  const execution = await runNormalizedConsoleRunner(normalizedOptions, dependencies);

  return {
    ...execution,
    parsedOptions,
  };
}

export async function main(argv: string[], dependencies: ConsoleRunnerDependencies = {}): Promise<number> {
  const logger = dependencies.logger ?? console;

  try {
    const execution = await runConsoleRunnerArgv(argv, dependencies);
    return execution.runRecord.summary.failed;
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.main) {
  const exitCode = await main(process.argv.slice(2));
  process.exit(exitCode);
}
