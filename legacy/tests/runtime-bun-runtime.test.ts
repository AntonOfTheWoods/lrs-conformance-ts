import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseConsoleRunnerArgv } from "../../runtime/bun-runtime/cli-args.ts";
import {
  buildForwardedConsoleRunnerArgv,
  runConsoleRunnerArgv,
  startNativeSummaryHeartbeat,
} from "../../runtime/bun-runtime/console-runner.ts";
import { normalizeRunnerOptions } from "../../runtime/bun-runtime/options.ts";
import { createOutputRunRecord, type RuntimeRunRecord } from "../../runtime/bun-runtime/run-record.ts";
import { registerSuiteFiles } from "../../runtime/bun-runtime/suite-loader.ts";
import { createDescribeRuntime, type DescribeRuntime } from "../../runtime/bun-runtime/runtime.ts";
import { resolveAuthorizationLaunchCommand } from "../../runtime/bin/OAuth.ts";
import { listSuiteDefinitionFiles } from "../../runtime/bin/update-batteries.ts";
import {
  buildLrsTestLoadPlan,
  normalizeLegacyRequireResult,
  normalizeLrsTestOptions,
  shouldUseCommonJsCompatibleTsLoader,
} from "../../runtime/bin/lrs-test.ts";
import { resolveLrsTestEntryPath } from "../../runtime/bin/testRunner.ts";

type GlobalTestShape = typeof globalThis & {
  __suiteLoadTrace?: string[];
};

type TimeoutCapableContext = {
  timeout(ms: number): void;
};

function createSuiteLoaderRuntimeMock(beforeImpl?: DescribeRuntime["before"]): DescribeRuntime {
  return {
    before: beforeImpl ?? ((() => {}) as DescribeRuntime["before"]),
    describe: (() => {}) as DescribeRuntime["describe"],
    getSummary: () => undefined,
    it: (() => {}) as DescribeRuntime["it"],
    run: async () => {
      throw new Error("run should not be called during suite registration");
    },
  };
}

test("runtime bun runtime parses optional and file selection flags", () => {
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

test("runtime bun runtime normalizes directory and file selections", () => {
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

test("runtime bun lrs-test normalizes legacy child-runner options through shared runtime options", () => {
  expect(
    normalizeLrsTestOptions({
      basicAuth: "true",
      directory: ["v1_0_3"],
      endpoint: "http://localhost:8080/xapi",
      file: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
      oAuth1: "false",
      optional: ["Multiplicity"],
    }),
  ).toEqual(
    normalizeRunnerOptions({
      basicAuth: true,
      directory: ["v1_0_3"],
      endpoint: "http://localhost:8080/xapi",
      file: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
      oAuth1: false,
      optional: ["Multiplicity"],
    }),
  );
});

test("runtime bun lrs-test reuses suite-loader load-plan semantics", () => {
  const loadPlan = buildLrsTestLoadPlan(
    normalizeLrsTestOptions({
      directory: ["v1_0_3"],
      endpoint: "http://localhost:8080/xapi",
      file: ["test\\v1_0_3\\H.Communication2.1-StatementResource.js"],
      optional: ["Parameters"],
    }),
  );

  expect(loadPlan.directoriesToLoad).toEqual(["Parameters", "v1_0_3"]);
  expect(loadPlan.needsTimeMarginBootstrap).toBe(true);
  expect(loadPlan.selectedFiles ? [...loadPlan.selectedFiles] : null).toEqual([
    "test/v1_0_3/H.Communication2.1-StatementResource.js",
  ]);
});

test("runtime bun lrs-test does not force mixed ESM/CommonJS TS helpers through CJS transpile path", () => {
  const mixedModuleSource = ['import fs from "node:fs";', "const helper = {};", "module.exports = helper;"].join("\n");

  const pureCommonJsSource = ["const helper = {};", "module.exports = helper;"].join("\n");

  expect(shouldUseCommonJsCompatibleTsLoader(mixedModuleSource)).toBe(false);
  expect(shouldUseCommonJsCompatibleTsLoader(pureCommonJsSource)).toBe(true);
});

test("runtime bun lrs-test legacy require bridge unwraps default exports", () => {
  const helperLike = { buildDocument: () => ({}) };
  const namespaceLike = { default: helperLike };
  const unwrapped = normalizeLegacyRequireResult<typeof helperLike>(namespaceLike as unknown as typeof helperLike);

  expect(unwrapped).toBe(helperLike);
  expect(normalizeLegacyRequireResult(helperLike)).toBe(helperLike);
});

test("runtime bun runtime preserves caller selection mode when forwarding to legacy runner", () => {
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

test("runtime bun runtime defaults to native mode", async () => {
  let nativeInvocationCount = 0;

  const execution = await runConsoleRunnerArgv(
    [
      "--endpoint",
      "http://localhost:8080/xapi",
      "--directory",
      "v1_0_3",
      "--file",
      "test/v1_0_3/Data2.2-FormattingRequirements.js",
    ],
    {
      cwd: "/tmp/runtime-suite",
      runNativeConsoleRunner: async () => {
        nativeInvocationCount += 1;
        return 0;
      },
    },
  );

  expect(execution.exitCode).toBe(0);
  expect(execution.runnerMode).toBe("native");
  expect(nativeInvocationCount).toBe(1);
});

test("runtime bun test runner prefers the TypeScript lrs-test entry under Bun", () => {
  expect(resolveLrsTestEntryPath("/tmp/runtime-suite/bin")).toBe("/tmp/runtime-suite/bin/lrs-test.ts");
});

test("runtime bun OAuth helper resolves Linux browser launch commands", () => {
  expect(resolveAuthorizationLaunchCommand("linux", "https://example.com/callback")).toEqual({
    args: ["https://example.com/callback"],
    command: "xdg-open",
  });
});

test("runtime bun OAuth helper resolves Windows browser launch commands", () => {
  expect(resolveAuthorizationLaunchCommand("win32", "https://example.com/callback")).toEqual({
    args: ["/c", "start", "", "https://example.com/callback"],
    command: "cmd",
  });
});

test("runtime bun runtime dispatches native mode without forwarding to the legacy runner", async () => {
  let nativeInvocation:
    | {
        normalizedOptions: ReturnType<typeof normalizeRunnerOptions>;
        parsedOptions: ReturnType<typeof parseConsoleRunnerArgv>;
        runtimeRoot: string;
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
    ],
    {
      cwd: "/tmp/runtime-suite",
      runNativeConsoleRunner: async (invocation) => {
        nativeInvocation = {
          normalizedOptions: invocation.normalizedOptions,
          parsedOptions: invocation.parsedOptions,
          runtimeRoot: invocation.runtimeRoot,
        };
        return 0;
      },
      runnerMode: "native",
    },
  );

  expect(execution.exitCode).toBe(0);
  expect(execution.runnerMode).toBe("native");
  expect(nativeInvocation).toEqual({
    normalizedOptions: {
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
      optional: undefined,
      request_token_path: undefined,
      auth_token_path: undefined,
      token: undefined,
      token_secret: undefined,
      verifier: undefined,
      xapiVersion: "1.0.3",
    },
    parsedOptions: {
      basicAuth: true,
      directory: ["v1_0_3"],
      endpoint: "http://localhost:8080/xapi",
      file: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
    },
    runtimeRoot: "/tmp/runtime-suite",
  });
});

test("runtime describe runtime supports top-level before hooks and timeout calls", async () => {
  let setupSeen = false;
  const runtime = createDescribeRuntime({ rootTitle: "", version: "1.0.3" });

  runtime.before("setup", function (this: TimeoutCapableContext, done) {
    this.timeout(0);
    setupSeen = true;
    done();
  });

  runtime.describe("Sample Suite", function (this: TimeoutCapableContext) {
    this.timeout(0);
    runtime.it("runs after setup", function () {
      if (!setupSeen) {
        throw new Error("setup missing");
      }
    });
  });

  const result = await runtime.run();

  expect(result.summary.total).toBe(1);
  expect(result.summary.passed).toBe(1);
  expect(result.summary.failed).toBe(0);
});

test("runtime describe runtime executes sibling cases before nested suites to match legacy suite ordering", async () => {
  const events: string[] = [];
  const runtime = createDescribeRuntime({ rootTitle: "", version: "1.0.3" });

  runtime.describe("Mixed Suite", function () {
    runtime.describe("Nested A", function () {
      runtime.before("setup A", function (done) {
        events.push("before-a");
        done();
      });

      runtime.it("case a", function () {
        events.push("case-a");
      });
    });

    runtime.it("case one", function () {
      events.push("case-one");
    });

    runtime.describe("Nested B", function () {
      runtime.before("setup B", function (done) {
        events.push("before-b");
        done();
      });

      runtime.it("case b", function () {
        events.push("case-b");
      });
    });

    runtime.it("case two", function () {
      events.push("case-two");
    });
  });

  const result = await runtime.run();

  expect(result.summary.total).toBe(4);
  expect(result.summary.passed).toBe(4);
  expect(events).toEqual(["case-one", "case-two", "before-a", "case-a", "before-b", "case-b"]);
});

test("runtime describe runtime captures hook and case output on the active node", async () => {
  const runtime = createDescribeRuntime({ rootTitle: "", version: "1.0.3" });

  runtime.describe("Logged Suite", function () {
    runtime.before("setup", function (done) {
      console.log("hook output");
      done(null, "ignored");
    });

    runtime.it("logs output", function () {
      console.error("case output");
    });
  });

  const result = await runtime.run();
  const suite = result.root.children[0];
  if (!suite || suite.kind !== "suite") {
    throw new Error("Expected a suite result.");
  }

  const caseResult = suite.children[0];
  if (!caseResult || caseResult.kind !== "case") {
    throw new Error("Expected a case result.");
  }

  expect(suite.log.join("")).toContain("hook output");
  expect(caseResult.log.join("")).toContain("case output");
});

test("runtime describe runtime exposes live summary only while running", async () => {
  let releaseRun: (() => void) | undefined;
  const runtime = createDescribeRuntime({ rootTitle: "", version: "1.0.3" });

  runtime.describe("Summary Suite", function () {
    runtime.it("waits", async function () {
      await new Promise<void>((resolve) => {
        releaseRun = resolve;
      });
    });
  });

  const runPromise = runtime.run();
  const liveSummary = runtime.getSummary();

  expect(liveSummary).toBeDefined();
  expect(liveSummary).toEqual({
    cancelled: 0,
    failed: 0,
    passed: 0,
    skipped: 0,
    total: 1,
    version: "1.0.3",
  });

  if (!releaseRun) {
    throw new Error("Expected the test body to block.");
  }

  releaseRun();
  await runPromise;

  expect(runtime.getSummary()).toBeUndefined();
});

test("runtime describe runtime converts uncaught async callback errors into test failures", async () => {
  const runtime = createDescribeRuntime({ rootTitle: "", version: "1.0.3" });

  runtime.describe("Async Failure Suite", function () {
    runtime.it("captures async callback throws", function (_done) {
      queueMicrotask(() => {
        process.emit("uncaughtException", new Error("async callback boom"));
      });
    });
  });

  const result = await runtime.run();
  const suite = result.root.children[0];
  if (!suite || suite.kind !== "suite") {
    throw new Error("Expected a suite result.");
  }

  const caseResult = suite.children[0];
  if (!caseResult || caseResult.kind !== "case") {
    throw new Error("Expected a case result.");
  }

  expect(result.summary.total).toBe(1);
  expect(result.summary.failed).toBe(1);
  expect(caseResult.status).toBe("failed");
  expect(caseResult.error).toContain("async callback boom");
});

test("runtime describe runtime normalizes invalid date RangeErrors to legacy wording", async () => {
  const runtime = createDescribeRuntime({ rootTitle: "", version: "1.0.3" });

  runtime.describe("Date Failure Suite", function () {
    runtime.it("normalizes invalid date errors", function () {
      new Date(Number.NaN).toISOString();
    });
  });

  const result = await runtime.run();
  const suite = result.root.children[0];
  if (!suite || suite.kind !== "suite") {
    throw new Error("Expected a suite result.");
  }

  const caseResult = suite.children[0];
  if (!caseResult || caseResult.kind !== "case") {
    throw new Error("Expected a case result.");
  }

  expect(caseResult.status).toBe("failed");
  expect(caseResult.error).toBe("RangeError: Invalid time value");
});

test("runtime bun runtime emits periodic native progress summaries for long runs", async () => {
  const loggedLines: string[] = [];
  const summary = {
    failed: 0,
    passed: 1,
    total: 3,
    version: "1.0.3",
  };
  const heartbeat = startNativeSummaryHeartbeat({
    getSummary: () => summary,
    intervalMs: 10,
    logger: {
      log: (message: unknown) => {
        loggedLines.push(String(message));
      },
    },
  });

  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 25));
  } finally {
    clearInterval(heartbeat);
  }

  expect(loggedLines.length).toBeGreaterThan(0);
  expect(loggedLines[0]).toContain('"total":3');
  expect(loggedLines[0]).toContain('"passed":1');
});

test("runtime suite loader prioritizes optional directories and selected files", async () => {
  const runtimeRoot = await mkdtemp(join(tmpdir(), "runtime-suite-loader-"));
  const globalState = globalThis as GlobalTestShape;

  try {
    await mkdir(join(runtimeRoot, "bin"), { recursive: true });
    await mkdir(join(runtimeRoot, "test", "Parameters"), { recursive: true });
    await mkdir(join(runtimeRoot, "test", "v1_0_3"), { recursive: true });
    await writeFile(
      join(runtimeRoot, "test", "Parameters", "testing.js"),
      'global.__suiteLoadTrace.push("Parameters/testing.js");\n',
      "utf8",
    );
    await writeFile(
      join(runtimeRoot, "test", "Parameters", "ignored.js"),
      'global.__suiteLoadTrace.push("Parameters/ignored.js");\n',
      "utf8",
    );
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "selected.js"),
      'global.__suiteLoadTrace.push("v1_0_3/selected.js");\n',
      "utf8",
    );
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "ignored.js"),
      'global.__suiteLoadTrace.push("v1_0_3/ignored.js");\n',
      "utf8",
    );

    globalState.__suiteLoadTrace = [];

    const loadedFiles = await registerSuiteFiles({
      normalizedOptions: normalizeRunnerOptions({
        directory: ["v1_0_3"],
        endpoint: "http://localhost:8080/xapi",
        file: ["test/Parameters/testing.js", "test/v1_0_3/selected.js"],
        optional: ["Parameters"],
      }),
      runtime: createSuiteLoaderRuntimeMock(),
      runtimeRoot,
    });

    expect(globalState.__suiteLoadTrace).toEqual(["Parameters/testing.js", "v1_0_3/selected.js"]);
    expect(loadedFiles).toEqual(["test/Parameters/testing.js", "test/v1_0_3/selected.js"]);
  } finally {
    delete globalState.__suiteLoadTrace;
    await rm(runtimeRoot, { force: true, recursive: true });
  }
});

test("runtime suite loader loads selected files without assertion plugin bootstrap", async () => {
  const runtimeRoot = await mkdtemp(join(tmpdir(), "runtime-suite-loader-"));
  const globalState = globalThis as GlobalTestShape;

  try {
    await mkdir(join(runtimeRoot, "bin"), { recursive: true });
    await mkdir(join(runtimeRoot, "test", "v1_0_3"), { recursive: true });
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "selected.js"),
      "global.__suiteLoadTrace.push('v1_0_3/selected.js');\n",
      "utf8",
    );

    globalState.__suiteLoadTrace = [];

    const loadedFiles = await registerSuiteFiles({
      normalizedOptions: normalizeRunnerOptions({
        directory: ["v1_0_3"],
        endpoint: "http://localhost:8080/xapi",
        file: ["test/v1_0_3/selected.js"],
      }),
      runtime: createSuiteLoaderRuntimeMock(),
      runtimeRoot,
    });

    expect(globalState.__suiteLoadTrace).toEqual(["v1_0_3/selected.js"]);
    expect(loadedFiles).toEqual(["test/v1_0_3/selected.js"]);
  } finally {
    delete globalState.__suiteLoadTrace;
    await rm(runtimeRoot, { force: true, recursive: true });
  }
});

test("runtime suite loader accepts TypeScript suite files for legacy .js selections", async () => {
  const runtimeRoot = await mkdtemp(join(tmpdir(), "runtime-suite-loader-"));
  const globalState = globalThis as GlobalTestShape;

  try {
    await mkdir(join(runtimeRoot, "bin"), { recursive: true });
    await mkdir(join(runtimeRoot, "test", "v1_0_3"), { recursive: true });
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "selected.ts"),
      'global.__suiteLoadTrace.push("v1_0_3/selected.ts");\n',
      "utf8",
    );
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "ignored.js"),
      'global.__suiteLoadTrace.push("v1_0_3/ignored.js");\n',
      "utf8",
    );

    globalState.__suiteLoadTrace = [];

    const loadedFiles = await registerSuiteFiles({
      normalizedOptions: normalizeRunnerOptions({
        directory: ["v1_0_3"],
        endpoint: "http://localhost:8080/xapi",
        file: ["test/v1_0_3/selected.js"],
      }),
      runtime: createSuiteLoaderRuntimeMock(),
      runtimeRoot,
    });

    expect(globalState.__suiteLoadTrace).toEqual(["v1_0_3/selected.ts"]);
    expect(loadedFiles).toEqual(["test/v1_0_3/selected.ts"]);
  } finally {
    delete globalState.__suiteLoadTrace;
    await rm(runtimeRoot, { force: true, recursive: true });
  }
});

test("runtime suite loader prefers TypeScript over duplicate JavaScript suite variants", async () => {
  const runtimeRoot = await mkdtemp(join(tmpdir(), "runtime-suite-loader-"));
  const globalState = globalThis as GlobalTestShape;

  try {
    await mkdir(join(runtimeRoot, "bin"), { recursive: true });
    await mkdir(join(runtimeRoot, "test", "v1_0_3"), { recursive: true });
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "selected.js"),
      'global.__suiteLoadTrace.push("v1_0_3/selected.js");\n',
      "utf8",
    );
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "selected.ts"),
      'global.__suiteLoadTrace.push("v1_0_3/selected.ts");\n',
      "utf8",
    );

    globalState.__suiteLoadTrace = [];

    const loadedFiles = await registerSuiteFiles({
      normalizedOptions: normalizeRunnerOptions({
        directory: ["v1_0_3"],
        endpoint: "http://localhost:8080/xapi",
        file: ["test/v1_0_3/selected.js"],
      }),
      runtime: createSuiteLoaderRuntimeMock(),
      runtimeRoot,
    });

    expect(globalState.__suiteLoadTrace).toEqual(["v1_0_3/selected.ts"]);
    expect(loadedFiles).toEqual(["test/v1_0_3/selected.ts"]);
  } finally {
    delete globalState.__suiteLoadTrace;
    await rm(runtimeRoot, { force: true, recursive: true });
  }
});

test("runtime batteries generator discovers both JavaScript and TypeScript suite files", async () => {
  const runtimeRoot = await mkdtemp(join(tmpdir(), "runtime-batteries-"));

  try {
    await writeFile(join(runtimeRoot, "selected.ts"), "export {};\n", "utf8");
    await writeFile(join(runtimeRoot, "selected.js"), "module.exports = {};\n", "utf8");
    await writeFile(join(runtimeRoot, "ignored.json"), "{}\n", "utf8");

    expect(listSuiteDefinitionFiles(runtimeRoot)).toEqual(["selected.js", "selected.ts"]);
  } finally {
    await rm(runtimeRoot, { force: true, recursive: true });
  }
});

test("runtime suite loader registers time margin bootstrap for selected time-sensitive files", async () => {
  const runtimeRoot = await mkdtemp(join(tmpdir(), "runtime-suite-loader-"));
  const globalState = globalThis as GlobalTestShape;
  const beforeHookTitles: string[] = [];

  try {
    await mkdir(join(runtimeRoot, "bin"), { recursive: true });
    await mkdir(join(runtimeRoot, "test", "v1_0_3"), { recursive: true });
    await writeFile(join(runtimeRoot, "test", "helper.ts"), "module.exports = { setTimeMargin() {} };\n", "utf8");
    await writeFile(
      join(runtimeRoot, "test", "v1_0_3", "H.Communication2.1-StatementResource.js"),
      'global.__suiteLoadTrace.push("v1_0_3/H.Communication2.1-StatementResource.js");\n',
      "utf8",
    );

    globalState.__suiteLoadTrace = [];

    const loadedFiles = await registerSuiteFiles({
      normalizedOptions: normalizeRunnerOptions({
        directory: ["v1_0_3"],
        endpoint: "http://localhost:8080/xapi",
        file: ["test/v1_0_3/H.Communication2.1-StatementResource.js"],
      }),
      runtime: createSuiteLoaderRuntimeMock(((titleOrFn) => {
        if (typeof titleOrFn === "string") {
          beforeHookTitles.push(titleOrFn);
        }
      }) as DescribeRuntime["before"]),
      runtimeRoot,
    });

    expect(beforeHookTitles).toEqual(["Accounting for time differential between test suite and lrs"]);
    expect(globalState.__suiteLoadTrace).toEqual(["v1_0_3/H.Communication2.1-StatementResource.js"]);
    expect(loadedFiles).toEqual(["test/v1_0_3/H.Communication2.1-StatementResource.js"]);
  } finally {
    delete globalState.__suiteLoadTrace;
    await rm(runtimeRoot, { force: true, recursive: true });
  }
});

test("legacy compat suites keep explicit shared runtime locals instead of relying on ambient shims", async () => {
  const expectedDeclarations = [
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "H.Communication2.1-StatementResource.ts"),
      patterns: [/(?:let|const) data:\s*any;/, /(?:let|const) txtAtt1:\s*any,[\s\S]*t2attHash:\s*any;/],
    },
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "Data2.4.1-IDProperty.ts"),
      patterns: [/(?:let|const) data:\s*any;/],
    },
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "Data2.4.4-ObjectProperty.ts"),
      patterns: [/(?:let|const) id:\s*any,[\s\S]*\btf:\s*any;/],
    },
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "Data2.4.8-StoredProperty.ts"),
      patterns: [/(?:let|const) param:\s*any;/],
    },
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "H.Communication1.5-ContentTypes.ts"),
      patterns: [/(?:let|const) data:\s*any;/],
    },
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "H.Communication2.6-AgentProfileResource.ts"),
      patterns: [/(?:let|const) document:\s*any;/],
    },
    {
      filePath: join(process.cwd(), "runtime", "test", "v1_0_3", "H.Communication2.7-ActivityProfileResource.ts"),
      patterns: [/(?:let|const) document:\s*any;/],
    },
  ];

  const missingExpectations: string[] = [];

  for (const expectation of expectedDeclarations) {
    const sourceText = await readFile(expectation.filePath, "utf8");

    for (const pattern of expectation.patterns) {
      if (!pattern.test(sourceText)) {
        missingExpectations.push(`${expectation.filePath} missing ${pattern}`);
      }
    }
  }

  expect(missingExpectations).toEqual([]);
});

test("runtime bun runtime can emit errors-only run records", () => {
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
