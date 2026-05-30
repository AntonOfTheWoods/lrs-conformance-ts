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
  isSuiteDefinitionFile,
  matchesSelectedSuiteFile,
  needsTimeMarginBootstrap,
  normalizeSelectedFiles,
  toPosixPath,
} from "../bun-runtime/suite-loader.ts";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeRequire = createRequire(import.meta.url);

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

const legacyTsTranspiler = new Bun.Transpiler({ loader: "ts" });
const legacyJsTranspiler = new Bun.Transpiler({ loader: "js" });

function shouldLoadLegacySuiteFile(sourceText: string): boolean {
  if (/^\s*(import|export)\s/m.test(sourceText)) {
    return false;
  }
  return /\bmodule\b/.test(sourceText) || /\brequire\s*\(/.test(sourceText);
}

export function shouldUseCommonJsCompatibleTsLoader(sourceText: string): boolean {
  return /module\.exports/.test(sourceText) && !/^\s*(import|export)\s/m.test(sourceText);
}

export function normalizeLegacyRequireResult<T>(value: T): T {
  if (value && typeof value === "object" && "default" in (value as Record<string, unknown>)) {
    const defaultValue = (value as Record<string, unknown>)["default"];
    if (typeof defaultValue !== "undefined") {
      return defaultValue as T;
    }
  }

  return value;
}

function normalizeCommonJsCompatibleModuleSource(sourceText: string): string {
  return sourceText.replace(/^\s*export default .*;\s*$/gm, "");
}

function loadCommonJsCompatibleTsModule(absoluteFilePath: string): unknown {
  const sourceText = normalizeCommonJsCompatibleModuleSource(fs.readFileSync(absoluteFilePath, "utf8") as string);
  const transpiledSource = legacyTsTranspiler.transformSync(sourceText);
  const moduleRecord = { exports: {} as unknown };
  const moduleRequire = createRequire(absoluteFilePath) as NodeJS.Require;

  const executeModule = new Function(
    "module",
    "exports",
    "require",
    "__filename",
    "__dirname",
    `${transpiledSource}\n//# sourceURL=${absoluteFilePath}`,
  ) as (
    module: { exports: unknown },
    exports: unknown,
    require: NodeJS.Require,
    filename: string,
    dirnameValue: string,
  ) => void;

  executeModule(moduleRecord, moduleRecord.exports, moduleRequire, absoluteFilePath, path.dirname(absoluteFilePath));
  return moduleRecord.exports;
}

function loadLegacySuiteFile(absoluteFilePath: string, sourceText: string): void {
  const transpiler = absoluteFilePath.endsWith(".ts") ? legacyTsTranspiler : legacyJsTranspiler;
  const transpiledSource = transpiler.transformSync(sourceText);
  const suiteModule = { exports: {} as unknown };
  const suiteRequire = createRequire(absoluteFilePath) as NodeJS.Require;
  const legacyRequire = ((specifier: string) => {
    const resolvedPath = suiteRequire.resolve(specifier);
    if (resolvedPath.endsWith(".ts")) {
      const requiredSource = fs.readFileSync(resolvedPath, "utf8") as string;
      if (shouldUseCommonJsCompatibleTsLoader(requiredSource)) {
        return normalizeLegacyRequireResult(loadCommonJsCompatibleTsModule(resolvedPath));
      }

      return normalizeLegacyRequireResult(suiteRequire(specifier));
    }

    return suiteRequire(specifier);
  }) as NodeJS.Require;

  const executeLegacySuite = new Function(
    "module",
    "exports",
    "require",
    "__filename",
    "__dirname",
    `${transpiledSource}\n//# sourceURL=${absoluteFilePath}`,
  ) as (
    module: { exports: unknown },
    exports: unknown,
    require: NodeJS.Require,
    filename: string,
    dirnameValue: string,
  ) => void;

  try {
    executeLegacySuite(
      suiteModule,
      suiteModule.exports,
      legacyRequire,
      absoluteFilePath,
      path.dirname(absoluteFilePath),
    );
  } catch (error) {
    const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
    throw new Error(`Failed to load legacy suite file ${absoluteFilePath}: ${message}`);
  }
}

async function loadNativeSuiteFile(absoluteFilePath: string): Promise<void> {
  await import(`${pathToFileURL(absoluteFilePath).href}?v=${Date.now()}`);
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
      const executionState = getOrCreateCaptureExecutionState();
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
      const executionState = getOrCreateCaptureExecutionState();
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
      const executionState = getOrCreateCaptureExecutionState();
      if (suite.title) {
        executionState.suitePath.push(suite.title);
      }
      processHandle.postMessage?.("suite start", suite.title);
    });
    runner.on("suite end", function (suite: { title?: string }) {
      const executionState = getOrCreateCaptureExecutionState();
      if (suite.title && executionState.suitePath[executionState.suitePath.length - 1] === suite.title) {
        executionState.suitePath.pop();
      }
      processHandle.postMessage?.("suite end", suite.title);
    });
  };
}

async function runTests(_options: RawOptions): Promise<void> {
  const Joi = runtimeRequire("joi") as any;
  const Mocha = runtimeRequire("mocha") as any;
  const childProcessHandle = process as ChildProcessShape;

  const optionsValidator = Joi.object({
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

  const validOptions = Joi.validate(_options, optionsValidator);
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

  const options = {
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

  let grep: RegExp | undefined;
  if (options.grep) {
    grep = new RegExp(options.grep);
  }

  const mocha = new Mocha({
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
    installAssertionPlugins(runtimeRequire as NodeJS.Require);
    if (loadPlan.needsTimeMarginBootstrap) {
      mocha.suite.beforeAll(
        "Accounting for time differential between test suite and lrs",
        function (done: (error?: unknown, ...ignored: unknown[]) => void) {
          const helperModule = runtimeRequire(path.join(__dirname, "..", "test", "helper.ts")) as {
            default?: { setTimeMargin?: (callback?: (error?: unknown) => void) => unknown };
            setTimeMargin?: (callback?: (error?: unknown) => void) => unknown;
          };
          const helperExports = typeof helperModule.setTimeMargin === "function" ? helperModule : helperModule.default;

          if (helperExports && typeof helperExports.setTimeMargin === "function") {
            helperExports.setTimeMargin(done);
          } else {
            done();
          }
        },
      );
    }
    for (const dir of loadPlan.directoriesToLoad) {
      const testDirectory = __dirname + "/../test/" + dir;
      const files = fs.readdirSync(testDirectory).filter(function (file) {
        const relativeFilePath = toPosixPath(path.join("test", dir, file));
        return isSuiteDefinitionFile(file) && matchesSelectedSuiteFile(loadPlan.selectedFiles, relativeFilePath);
      });

      for (const file of files) {
        const absoluteFilePath = path.join(testDirectory, file);
        const sourceText = fs.readFileSync(absoluteFilePath, "utf8");
        console.log(`[suite-load] ${absoluteFilePath} legacy=${shouldLoadLegacySuiteFile(sourceText)}`);

        mocha.suite.emit("pre-require", globalThis, absoluteFilePath, mocha);
        if (shouldLoadLegacySuiteFile(sourceText)) {
          loadLegacySuiteFile(absoluteFilePath, sourceText);
        } else {
          await loadNativeSuiteFile(absoluteFilePath);
        }

        mocha.suite.emit("post-require", globalThis, absoluteFilePath, mocha);
      }
    }

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
  const childProcessHandle = process as ChildProcessShape;
  childProcessHandle.postMessage = function (action, payload) {
    childProcessHandle.send?.({
      action: action,
      payload: payload,
    });
  };
  process.on("message", function (message: { action?: string; payload?: RawOptions }) {
    if (message.action === "ping") {
      childProcessHandle.postMessage?.("log", "pong");
    } else if (message.action === "runTests") {
      childProcessHandle.postMessage?.("log", "runTests starting");
      void runTests(message.payload ?? {}).catch((error) => {
        console.error(error);
        process.exit(1);
      });
    }
  });
  childProcessHandle.postMessage?.("ready");
}

hookupIPC();
