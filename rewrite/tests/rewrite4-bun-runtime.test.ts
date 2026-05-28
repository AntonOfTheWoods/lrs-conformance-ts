import { expect, test } from "bun:test";

import { parseConsoleRunnerArgv } from "../../rewrite4/bun-runtime/cli-args.ts";
import { buildForwardedConsoleRunnerArgv, runConsoleRunnerArgv } from "../../rewrite4/bun-runtime/console-runner.ts";
import { normalizeRunnerOptions } from "../../rewrite4/bun-runtime/options.ts";
import { createOutputRunRecord, type RuntimeRunRecord } from "../../rewrite4/bun-runtime/run-record.ts";

test("rewrite4 bun runtime parses optional and file selection flags", () => {
  expect(
    parseConsoleRunnerArgv([
      "--endpoint",
      "http://localhost:8080/xapi",
      "--directory",
      "v1_0_3",
      "--optional",
      "Multiplicity,Parameters",
      "--file",
      "test/v1_0_3/Data2.2-FormattingRequirements.js,test/v1_0_3/Data2.3-StatementLifecycle.js",
      "--basicAuth",
    ]),
  ).toEqual({
    basicAuth: true,
    directory: ["v1_0_3"],
    endpoint: "http://localhost:8080/xapi",
    file: ["test/v1_0_3/Data2.2-FormattingRequirements.js", "test/v1_0_3/Data2.3-StatementLifecycle.js"],
    optional: ["Multiplicity", "Parameters"],
  });
});

test("rewrite4 bun runtime normalizes directory and file selections", () => {
  expect(
    normalizeRunnerOptions({
      basicAuth: true,
      directory: ["v1_0_3"],
      endpoint: "http://localhost:8080/xapi",
      file: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
      optional: ["Multiplicity"],
    }),
  ).toEqual({
    authPass: undefined,
    authUser: undefined,
    authorization_path: undefined,
    bail: false,
    basicAuth: true,
    consumer_key: undefined,
    consumer_secret: undefined,
    directory: ["v1_0_3"],
    endpoint: "http://localhost:8080/xapi",
    errors: false,
    file: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
    grep: undefined,
    oAuth1: false,
    optional: ["Multiplicity"],
    request_token_path: undefined,
    auth_token_path: undefined,
    token: undefined,
    token_secret: undefined,
    verifier: undefined,
    xapiVersion: "1.0.3",
  });
});

test("rewrite4 bun runtime preserves caller selection mode when forwarding to legacy runner", () => {
  const parsedOptions = parseConsoleRunnerArgv([
    "--endpoint",
    "http://localhost:8080/xapi",
    "--directory",
    "v1_0_3",
    "--optional",
    "Multiplicity",
    "--file",
    "test/v1_0_3/Data2.2-FormattingRequirements.js",
    "--basicAuth",
    "--authUser",
    "janedoe",
    "--authPassword",
    "supersecret",
  ]);
  const normalizedOptions = normalizeRunnerOptions(parsedOptions);

  expect(buildForwardedConsoleRunnerArgv(parsedOptions, normalizedOptions)).toEqual([
    "--directory",
    "v1_0_3",
    "--endpoint",
    "http://localhost:8080/xapi",
    "--authUser",
    "janedoe",
    "--authPassword",
    "supersecret",
    "--basicAuth",
    "--optional",
    "Multiplicity",
    "--file",
    "test/v1_0_3/Data2.2-FormattingRequirements.js",
  ]);
});

test("rewrite4 bun runtime delegates to the legacy console runner with a legacy-node override", async () => {
  let invocation:
    | {
        cwd: string;
        env: Record<string, string>;
        execPath: string;
        forwardedArgv: string[];
        legacyConsoleRunnerPath: string;
      }
    | undefined;

  const execution = await runConsoleRunnerArgv(
    [
      "--endpoint",
      "http://localhost:8080/xapi",
      "--directory",
      "v1_0_3",
      "--file",
      "test/v1_0_3/Data2.2-FormattingRequirements.js",
      "--basicAuth",
      "--authUser",
      "janedoe",
      "--authPassword",
      "supersecret",
    ],
    {
      cwd: "/tmp/rewrite4-suite",
      execPath: "/usr/bin/bun",
      runLegacyConsoleRunner: async (nextInvocation) => {
        invocation = nextInvocation;
        return 7;
      },
    },
  );

  expect(execution.exitCode).toBe(7);
  expect(invocation).toBeDefined();
  expect(invocation?.cwd).toBe("/tmp/rewrite4-suite");
  expect(invocation?.env.LRS_CANDIDATE_RUNTIME_MODE).toBe("legacy-node");
  expect(invocation?.execPath).toBe("/usr/bin/bun");
  expect(invocation?.forwardedArgv).toEqual([
    "--directory",
    "v1_0_3",
    "--endpoint",
    "http://localhost:8080/xapi",
    "--authUser",
    "janedoe",
    "--authPassword",
    "supersecret",
    "--basicAuth",
    "--file",
    "test/v1_0_3/Data2.2-FormattingRequirements.js",
  ]);
  expect(invocation?.legacyConsoleRunnerPath).toBe("/tmp/rewrite4-suite/bin/console_runner_legacy.js");
});

test("rewrite4 bun runtime prefers the legacy exec-path override from the environment", async () => {
  const originalExecPathOverride = process.env.LRS_LEGACY_CONSOLE_RUNNER_EXEC_PATH;
  let invocation:
    | {
        cwd: string;
        env: Record<string, string>;
        execPath: string;
        forwardedArgv: string[];
        legacyConsoleRunnerPath: string;
      }
    | undefined;

  process.env.LRS_LEGACY_CONSOLE_RUNNER_EXEC_PATH = "node";

  try {
    await runConsoleRunnerArgv(
      [
        "--endpoint",
        "http://localhost:8080/xapi",
        "--directory",
        "v1_0_3",
        "--file",
        "test/v1_0_3/Data2.2-FormattingRequirements.js",
      ],
      {
        cwd: "/tmp/rewrite4-suite",
        runLegacyConsoleRunner: async (nextInvocation) => {
          invocation = nextInvocation;
          return 0;
        },
      },
    );
  } finally {
    if (typeof originalExecPathOverride === "undefined") {
      delete process.env.LRS_LEGACY_CONSOLE_RUNNER_EXEC_PATH;
    } else {
      process.env.LRS_LEGACY_CONSOLE_RUNNER_EXEC_PATH = originalExecPathOverride;
    }
  }

  expect(invocation?.execPath).toBe("node");
});

test("rewrite4 bun runtime can emit errors-only run records", () => {
  const runRecord: RuntimeRunRecord = {
    duration: 20,
    endTime: 30,
    flags: {
      endpoint: "http://localhost:8080/xapi",
    },
    log: {
      error: undefined,
      log: "",
      name: "root",
      requirement: "",
      status: "failed",
      tests: [
        {
          error: undefined,
          log: "",
          name: "passing child",
          requirement: "",
          status: "passed",
          tests: [],
          title: "passing child",
        },
        {
          error: "boom",
          log: "failure",
          name: "failing child",
          requirement: "XAPI-00001",
          status: "failed",
          tests: [],
          title: "failing child",
        },
      ],
      title: "root",
    },
    lrsSettingsUUID: null,
    name: "console",
    options: {},
    owner: null,
    rollupRule: "mustPassAll",
    startTime: 10,
    state: "finished",
    summary: {
      failed: 1,
      passed: 1,
      total: 2,
      version: "1.0.3",
    },
    uuid: "run-1",
  };

  expect(createOutputRunRecord(runRecord, true)).toEqual({
    ...runRecord,
    log: {
      error: undefined,
      log: "",
      name: "root",
      requirement: "",
      status: "failed",
      tests: [
        {
          error: "boom",
          log: "failure",
          name: "failing child",
          requirement: "XAPI-00001",
          status: "failed",
          tests: [],
          title: "failing child",
        },
      ],
      title: "root",
    },
  });
});
