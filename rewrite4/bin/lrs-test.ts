#!/usr/bin/env bun

"use strict";

import {
  normalizeRunnerOptions,
  RunnerOptionsError,
  type NormalizedRunnerOptions,
  type RunnerInputOptions,
} from "../bun-runtime/options.ts";
import { defaultXapiVersion } from "../bun-runtime/spec-config.ts";
import {
  getDirectoriesToLoad,
  installAssertionPlugins,
  installRunnerEnvironment,
  needsTimeMarginBootstrap,
  normalizeSelectedFiles,
  toPosixPath,
} from "../bun-runtime/suite-loader.ts";

type CaptureExecutionState = {
  suitePath: string[];
  testTitle: string | null;
};

type ChildProcessShape = NodeJS.Process & {
  postMessage?: (action: string, payload?: unknown) => void;
  send?: (message: { action: string; payload?: unknown }) => void;
};

type RawOptions = {
  xapiVersion?: string;
  directory?: string[];
  endpoint?: string;
  grep?: string;
  optional?: string[];
  file?: string[];
  basicAuth?: boolean | string;
  oAuth1?: boolean | string;
  authUser?: string;
  authPass?: string;
  consumer_key?: string;
  consumer_secret?: string;
  token?: string;
  token_secret?: string;
  verifier?: string;
  reporter?: string;
  bail?: boolean;
  errors?: boolean;
  [key: string]: unknown;
};

function coerceBooleanOption(value: boolean | string | undefined): boolean | undefined {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return undefined;
}

function hasExplicitSuiteSelection(options: RawOptions): boolean {
  return typeof options.xapiVersion === "string" || (Array.isArray(options.directory) && options.directory.length > 0);
}

export function normalizeLrsTestOptions(options: RawOptions): NormalizedRunnerOptions {
  const runnerInputOptions: RunnerInputOptions = {
    xapiVersion: options.xapiVersion,
    directory: options.directory,
    endpoint: typeof options.endpoint === "string" ? options.endpoint : undefined,
    grep: options.grep,
    optional: options.optional,
    file: options.file,
    basicAuth: coerceBooleanOption(options.basicAuth),
    authUser: options.authUser,
    authPass: options.authPass,
    oAuth1: coerceBooleanOption(options.oAuth1),
    consumer_key: options.consumer_key,
    consumer_secret: options.consumer_secret,
    token: options.token,
    token_secret: options.token_secret,
    verifier: options.verifier,
    bail: options.bail,
    errors: options.errors,
  };

  return normalizeRunnerOptions(runnerInputOptions);
}

export function buildLrsTestLoadPlan(normalizedOptions: NormalizedRunnerOptions): {
  directoriesToLoad: string[];
  needsTimeMarginBootstrap: boolean;
  selectedFiles: Set<string> | null;
} {
  const selectedFiles = normalizeSelectedFiles(normalizedOptions.file);

  return {
    directoriesToLoad: getDirectoriesToLoad(normalizedOptions),
    needsTimeMarginBootstrap: needsTimeMarginBootstrap(selectedFiles),
    selectedFiles,
  };
}

function getOrCreateCaptureExecutionState(): CaptureExecutionState {
  const globalState = globalThis as typeof globalThis & {
    __lrsConformanceCaptureExecutionState?: CaptureExecutionState;
  };

  if (!globalState.__lrsConformanceCaptureExecutionState) {
    globalState.__lrsConformanceCaptureExecutionState = {
      suitePath: [],
      testTitle: null,
    };
  }

  return globalState.__lrsConformanceCaptureExecutionState;
}

function processMessageReporter(processHandle: ChildProcessShape) {
  return function (runner: any) {
    runner.on("test", function (test: { title: string }) {
      getOrCreateCaptureExecutionState().testTitle = test.title;
      processHandle.postMessage?.("test start", test.title);
    });
    runner.on("test end", function (test: { title: string }) {
      var executionState = getOrCreateCaptureExecutionState();
      if (executionState.testTitle === test.title) {
        executionState.testTitle = null;
      }
      processHandle.postMessage?.("test end", test.title);
    });
    runner.on("pass", function (test: { title: string }) {
      processHandle.postMessage?.("test pass", test.title);
    });
    runner.on("fail", function (test: { title: string }, err: { toString(): string }) {
      processHandle.postMessage?.("test fail", { title: test.title, message: err.toString() });
    });
    runner.on("end", function () {
      var executionState = getOrCreateCaptureExecutionState();
      executionState.suitePath = [];
      executionState.testTitle = null;
      processHandle.postMessage?.("end", "All done");
    });
    runner.on("pending", function (test: { title: string }) {
      processHandle.postMessage?.("pending", test.title);
    });
    runner.on("start", function () {
      processHandle.postMessage?.("start", runner.total);
    });
    runner.on("suite", function (suite: { title?: string }) {
      var executionState = getOrCreateCaptureExecutionState();
      if (suite.title) {
        executionState.suitePath.push(suite.title);
      }
      processHandle.postMessage?.("suite start", suite.title);
    });
    runner.on("suite end", function (suite: { title?: string }) {
      var executionState = getOrCreateCaptureExecutionState();
      if (suite.title && executionState.suitePath[executionState.suitePath.length - 1] === suite.title) {
        executionState.suitePath.pop();
      }
      processHandle.postMessage?.("suite end", suite.title);
    });
  };
}

function runTests(_options: RawOptions): void {
  const Joi = require("joi") as any;
  const fs = require("fs") as typeof import("fs");
  const path = require("path") as typeof import("path");
  const Mocha = require("mocha") as any;
  const childProcessHandle = process as ChildProcessShape;

  var optionsValidator = Joi.object({
    xapiVersion: Joi.string(),
    directory: Joi.array().items(Joi.string()),
    endpoint: Joi.string()
      .regex(/^[a-zA-Z][a-zA-Z0-9+\.-]*:.+/, "URI")
      .required(),
    grep: Joi.string(),
    optional: Joi.array().items(Joi.string().required()),
    file: Joi.array().items(Joi.string().required()),
    basicAuth: Joi.any(true, false),
    oAuth1: Joi.any(true, false),
    authUser: Joi.string().when("basicAuth", {
      is: "true",
      then: Joi.required(),
    }),
    authPass: Joi.string().when("basicAuth", {
      is: "true",
      then: Joi.required(),
    }),
    consumer_key: Joi.string().when("oAuth1", {
      is: "true",
      then: Joi.required(),
    }),
    consumer_secret: Joi.string().when("oAuth1", {
      is: "true",
      then: Joi.required(),
    }),
    token: Joi.string().when("oAuth1", {
      is: "true",
      then: Joi.required(),
    }),
    token_secret: Joi.string().when("oAuth1", {
      is: "true",
      then: Joi.required(),
    }),
    verifier: Joi.string().when("oAuth1", {
      is: "true",
      then: Joi.required(),
    }),
    reporter: Joi.string()
      .regex(/^((dot)|(spec)|(nyan)|(tap)|(List)|(progress)|(min)|(doc))$/)
      .default("nyan"),
    bail: Joi.boolean(),
    errors: Joi.boolean(),
  }).unknown(false);

  var validOptions = Joi.validate(_options, optionsValidator);
  if (validOptions.error) {
    childProcessHandle.postMessage?.("log", "Options not valid " + validOptions.error);
    process.exit();
  }
  const shouldWarnAboutDefaultVersion = !hasExplicitSuiteSelection(_options);

  let normalizedOptions: NormalizedRunnerOptions;
  try {
    normalizedOptions = normalizeLrsTestOptions(_options);
  } catch (error) {
    const message = error instanceof RunnerOptionsError ? error.message : String(error);
    console.error(message);
    if (message === "You must specify an endpoint (-e or --endpoint) for your LRS.") {
      console.error("LRS endpoints typically have the form: https://lrs.net/xapi.");
    }
    process.exit(1);
    return;
  }

  if (shouldWarnAboutDefaultVersion) {
    console.warn(`No xAPI version or manual path specified -- defaulting to ${defaultXapiVersion}.`);
  }

  var options = {
    xapiVersion: normalizedOptions.xapiVersion,
    directory: normalizedOptions.directory,
    endpoint: normalizedOptions.endpoint,
    basicAuth: normalizedOptions.basicAuth,
    authUser: normalizedOptions.authUser,
    authPass: normalizedOptions.authPass,
    reporter: _options.reporter,
    grep: normalizedOptions.grep,
    optional: normalizedOptions.optional,
    file: normalizedOptions.file,
    bail: normalizedOptions.bail,
    consumer_key: normalizedOptions.consumer_key,
    consumer_secret: normalizedOptions.consumer_secret,
    token: normalizedOptions.token,
    token_secret: normalizedOptions.token_secret,
    verifier: normalizedOptions.verifier,
    oAuth1: normalizedOptions.oAuth1,
    errors: normalizedOptions.errors,
  };

  var grep;
  if (options.grep) {
    grep = new RegExp(options.grep);
  }

  var mocha = new Mocha({
    uii: "bdd",
    reporter: processMessageReporter(childProcessHandle),
    timeout: "15000",
    grep: grep,
    bail: options.bail,
  });

  console.log(`
            \r\bAttempting xAPI Conformance Suite Against:
            \r\r    xAPI Version: ${options.xapiVersion}
            \r\r    Test Path(s): ${options.directory}
            \r\r    LRS Endpoint: ${options.endpoint}
        `);

  console.log("Grep is " + grep);
  const restoreRunnerEnvironment = installRunnerEnvironment(normalizedOptions);
  const loadPlan = buildLrsTestLoadPlan(normalizedOptions);
  try {
    installAssertionPlugins(require as NodeJS.Require);
    if (loadPlan.needsTimeMarginBootstrap) {
      mocha.suite.beforeAll(
        "Accounting for time differential between test suite and lrs",
        function (done: (error?: unknown, ...ignored: unknown[]) => void) {
          require(path.join(__dirname, "..", "test", "helper.ts")).setTimeMargin(done);
        },
      );
    }
    loadPlan.directoriesToLoad.forEach(function (dir) {
      var testDirectory = __dirname + "/../test/" + dir;
      fs.readdirSync(testDirectory)
        .filter(function (file) {
          var relativeFilePath = toPosixPath(path.join("test", dir, file));
          return file.substr(-3) === ".js" && (!loadPlan.selectedFiles || loadPlan.selectedFiles.has(relativeFilePath));
        })
        .forEach(function (file) {
          mocha.addFile(path.join(testDirectory, file));
        });
    });

    mocha.run(function () {
      childProcessHandle.postMessage?.("log", "Test Suite Complete");
      restoreRunnerEnvironment();
      process.exit();
    });
  } catch (error) {
    restoreRunnerEnvironment();
    throw error;
  }
}

function hookupIPC(): void {
  var childProcessHandle = process as ChildProcessShape;
  childProcessHandle.postMessage = function (action, payload) {
    childProcessHandle.send?.({
      action: action,
      payload: payload,
    });
  };
  process.on("message", function (message: { action?: string; payload?: RawOptions }) {
    if (message.action == "ping") {
      childProcessHandle.postMessage?.("log", "pong");
    } else if (message.action == "runTests") {
      childProcessHandle.postMessage?.("log", "runTests starting");
      runTests(message.payload ?? {});
    }
  });
  childProcessHandle.postMessage?.("ready");
}

hookupIPC();
