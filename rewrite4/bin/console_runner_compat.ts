#!/usr/bin/env bun

"use strict";

type RunnerMessage = {
  action?: string;
  payload?: unknown;
};

type CleanLogRecord = {
  title: string;
  name: string;
  requirement: string;
  log: string;
  status: string;
  error?: string;
  tests: CleanLogRecord[];
};

type CleanRunRecord = {
  name: string | null;
  owner: string | null;
  flags: Record<string, unknown>;
  options: Record<string, unknown>;
  rollupRule: string;
  uuid: string;
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  state: string;
  summary: {
    total: number | null;
    passed: number | null;
    failed: number | null;
    version?: string;
  };
  log?: CleanLogRecord;
};

type RunnerInstance = {
  cancel(): void;
  duration: number | null;
  getCleanRecord(): CleanRunRecord;
  on(event: "message", listener: (msg: RunnerMessage) => void): void;
  start(): void;
  summary: {
    total: number | null;
    passed: number | null;
    failed: number | null;
    version?: string;
  };
  uuid: string;
};

type TestRunnerConstructor = new (
  name: string | null,
  owner: string | null,
  flags: Record<string, unknown>,
) => RunnerInstance;

type OAuthConfig = {
  auth_token_path: string;
  authorization_path: string;
  consumer_key?: string;
  consumer_secret?: string;
  endpoint?: string;
  request_token_path: string;
};

type OAuthResponse = {
  token: string;
  token_secret: string;
  verifier: string;
};

const program = require("commander") as any;
const TestRunner = require("./testRunner.ts").testRunner as TestRunnerConstructor;
const oAuthModule = require("./OAuth.ts") as {
  auth(config: OAuthConfig, callback: (error: unknown, oAuth: OAuthResponse) => void): void;
};
const libpath = require("path") as typeof import("path");
const fs = require("fs") as typeof import("fs");

function cleanDir(value: string, directory: string[]): string[] {
  value.split(",").forEach(function (segment) {
    directory.push(segment);
  });
  return directory;
}

program
  .version("0.0.2")
  .option("-x, --xapiVersion [string]", "🌟 New: Version of the xAPI spec to test against")
  .option("-e, --endpoint [url]", "xAPI Endpoint")
  .option("-u, --authUser [string]", "Basic Auth Username")
  .option("-p, --authPassword [string]", "Basic Auth Password")
  .option("-a, --basicAuth", "Enable Basic Auth")
  .option("-o, --oAuth1", "Enable oAuth 1")
  .option("-c, --consumer_key [string]", "oAuth 1 Consumer Key")
  .option("-s, --consumer_secret [string]", "oAuth 1 Consumer Secret")
  .option("-r, --request_token_path [string]", "Path to OAuth request token endpoint (relative to endpoint).")
  .option("-t, --auth_token_path [string]", "Path to OAuth authorization token endpoint (relative to endpoint).")
  .option("-l, --authorization_path [string]", "Path to OAuth user authorization endpoint (relative to endpoint).")
  .option("-g, --grep [string]", "Only run tests that match the given pattern.")
  .option("-b, --bail", "Abort the battery if one test fails.")
  .option(
    "-d, --directory [value]",
    "Specific directories of tests (as a comma-separated list with no spaces).",
    cleanDir,
    [...[]],
  )
  .option(
    "-m, --optional [value]",
    "Optional directories of tests (as a comma-separated list with no spaces).",
    cleanDir,
    [...[]],
  )
  .option("-f, --file [value]", "Specific suite files (as a comma-separated list with no spaces).", cleanDir, [...[]])
  .option("-z, --errors", "Results log of failing tests only.")
  .parse(process.argv);

const options: Record<string, unknown> = {
  xapiVersion: program.xapiVersion,
  endpoint: program.endpoint,
  authUser: program.authUser,
  authPass: program.authPassword,
  basicAuth: program.basicAuth,
  oAuth1: program.oAuth1,
  consumer_key: program.consumer_key,
  consumer_secret: program.consumer_secret,
  request_token_path: program.request_token_path,
  auth_token_path: program.auth_token_path,
  authorization_path: program.authorization_path,
  grep: program.grep,
  bail: program.bail,
  directory: program.directory,
  optional: Array.isArray(program.optional) && program.optional.length > 0 ? program.optional : undefined,
  file: Array.isArray(program.file) && program.file.length > 0 ? program.file : undefined,
  errors: program.errors,
};

var testRunner: RunnerInstance | null = null;

process.on("SIGINT", function () {
  console.log("Aborting tests.");
  testRunner?.cancel();
});

process.on("exit", function () {
  console.log("Closed");
});

function removeNulls(log: CleanLogRecord | undefined): CleanLogRecord | undefined {
  if (!log || log.status !== "failed") {
    return undefined;
  }

  const tests = log.tests.map(removeNulls).filter((entry): entry is CleanLogRecord => typeof entry !== "undefined");

  return {
    title: log.title,
    name: log.name,
    requirement: log.requirement,
    log: log.log,
    status: log.status,
    error: log.error,
    tests,
  };
}

function start(runnerOptions: Record<string, unknown>): void {
  delete runnerOptions.request_token_path;
  delete runnerOptions.auth_token_path;
  delete runnerOptions.authorization_path;

  testRunner = new TestRunner("console", null, runnerOptions);
  testRunner.start();

  var interval = setInterval(function () {
    if (testRunner) {
      console.log(JSON.stringify(testRunner.summary));
    }
  }, 2000);

  testRunner.on("message", function (msg) {
    if (!testRunner) {
      return;
    }

    if (msg.action === "log") {
      console.log(msg.payload);
    } else if (msg.action === "end") {
      clearInterval(interval);
      console.log(JSON.stringify(testRunner.summary));
      console.log(`Tests completed in ${Number(testRunner.duration ?? 0) / 1000} seconds`);

      const cleanLog = testRunner.getCleanRecord();
      const output = runnerOptions.errors
        ? JSON.stringify(
            {
              name: cleanLog.name,
              owner: cleanLog.owner,
              flags: cleanLog.flags,
              options: cleanLog.options,
              rollupRule: cleanLog.rollupRule,
              uuid: cleanLog.uuid,
              startTime: cleanLog.startTime,
              endTime: cleanLog.endTime,
              duration: cleanLog.duration,
              state: cleanLog.state,
              summary: cleanLog.summary,
              log: removeNulls(cleanLog.log),
            },
            null,
            "    ",
          )
        : JSON.stringify(cleanLog, null, "    ");

      const outDir = libpath.join(__dirname, "../logs");

      fs.mkdir(outDir, { mode: 0o775 }, function () {
        if (!testRunner) {
          process.exit(1);
          return;
        }

        const outPath = libpath.join(outDir, testRunner.uuid + ".log");
        fs.writeFile(outPath, output, (error) => {
          if (error) {
            console.log(error);
            process.exit(1);
            return;
          }

          console.log("Full run log written to", outPath);
          process.exit(typeof testRunner?.summary.failed === "number" ? testRunner.summary.failed : 1);
        });
      });
    }
  });
}

if (!program.oAuth1) {
  start(options);
} else {
  const config: OAuthConfig = {
    consumer_key: typeof options.consumer_key === "string" ? options.consumer_key : undefined,
    consumer_secret: typeof options.consumer_secret === "string" ? options.consumer_secret : undefined,
    request_token_path: typeof options.request_token_path === "string" ? options.request_token_path : "/OAuth/initiate",
    auth_token_path: typeof options.auth_token_path === "string" ? options.auth_token_path : "/OAuth/token",
    authorization_path:
      typeof options.authorization_path === "string"
        ? options.authorization_path
        : "/../accounts/login?next=/XAPI/OAuth/authorize",
    endpoint: typeof options.endpoint === "string" ? options.endpoint : undefined,
  };

  oAuthModule.auth(config, function (error: unknown, oAuth: OAuthResponse) {
    if (error) {
      console.log(error);
      return;
    }

    options.token = oAuth.token;
    options.token_secret = oAuth.token_secret;
    options.verifier = oAuth.verifier;
    start(options);
  });
}
