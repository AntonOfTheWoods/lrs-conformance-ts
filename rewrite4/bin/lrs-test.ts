#!/usr/bin/env bun

"use strict";

type CaptureExecutionState = {
  suitePath: string[];
  testTitle: string | null;
};

type ChildProcessShape = NodeJS.Process & {
  postMessage?: (action: string, payload?: unknown) => void;
  send?: (message: { action: string; payload?: unknown }) => void;
};

type SpecConfig = {
  defaultVersion: string;
  getSpecFromFolder(folder: string): string | undefined;
  specToFolder: Record<string, string | undefined>;
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

type ResolvedOptions = {
  xapiVersion: string;
  directory: string[];
  endpoint: string;
  basicAuth: boolean | string | undefined;
  authUser: string | undefined;
  authPass: string | undefined;
  reporter: string | undefined;
  grep: string | undefined;
  optional: string[] | undefined;
  file: string[] | undefined;
  bail: boolean | undefined;
  consumer_key: string | undefined;
  consumer_secret: string | undefined;
  token: string | undefined;
  token_secret: string | undefined;
  verifier: string | undefined;
  oAuth1: boolean | string | undefined;
  errors: boolean | undefined;
};

const specConfig = require("../specConfig") as SpecConfig;

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

  let endpointSpecified = _options.endpoint != undefined;
  let versionSpecified = _options.xapiVersion != undefined;

  let directorySpecified = Array.isArray(_options.directory) && _options.directory.length > 0;
  let defaultDirectory = specConfig.specToFolder[specConfig.defaultVersion];

  if (!endpointSpecified) {
    console.error(`You must specify an endpoint (-e or --endpoint) for your LRS.`);
    console.error(`LRS endpoints typically have the form: https://lrs.net/xapi.`);
    process.exit(1);
  }

  if (versionSpecified && directorySpecified) {
    console.error(`Cannot specify both an xAPI Version and a Directory.`);
    process.exit(1);
  }

  if (versionSpecified) {
    let versionFolder = _options.xapiVersion ? specConfig.specToFolder[_options.xapiVersion] : undefined;
    if (versionFolder != undefined) _options.directory = [versionFolder];
    else {
      console.error(
        `Unknown version of the xAPI spec: ${_options.xapiVersion}.  Unable to find appropriate test suite.`,
      );
      process.exit(1);
    }
  } else if (directorySpecified) {
    let matchingSpec = undefined as string | undefined;
    for (let dir of _options.directory ?? []) {
      let spec = specConfig.getSpecFromFolder(dir);
      if (spec != matchingSpec) {
        if (matchingSpec == undefined) matchingSpec = spec;
        else {
          console.error(
            `Multiple directories specified which refer to different versions of the xAPI spec: ${spec} vs. ${matchingSpec}`,
          );
          process.exit(1);
        }
      }
    }

    if (matchingSpec == undefined) {
      console.error(
        `Unable to determine which version of xAPI to test against with diectories: ${(_options.directory ?? []).join(", ")}`,
      );
      process.exit(1);
    }

    _options.xapiVersion = matchingSpec;
  }

  if (!versionSpecified && !directorySpecified) {
    _options.xapiVersion = specConfig.defaultVersion;
    _options.directory = defaultDirectory ? [defaultDirectory] : [];
    console.warn(`No xAPI version or manual path specified -- defaulting to ${specConfig.defaultVersion}.`);
  }

  var options: ResolvedOptions = {
    xapiVersion: _options.xapiVersion ?? specConfig.defaultVersion,
    directory: _options.directory ?? [],
    endpoint: _options.endpoint ?? "",
    basicAuth: _options.basicAuth,
    authUser: _options.authUser,
    authPass: _options.authPass,
    reporter: _options.reporter,
    grep: _options.grep,
    optional: _options.optional,
    file: _options.file,
    bail: _options.bail,
    consumer_key: _options.consumer_key,
    consumer_secret: _options.consumer_secret,
    token: _options.token,
    token_secret: _options.token_secret,
    verifier: _options.verifier,
    oAuth1: _options.oAuth1,
    errors: _options.errors,
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
  process.env.DIRECTORY = options.directory[0] ?? "";

  if (options.optional) {
    options.optional.reverse().forEach(function (dir) {
      options.directory.unshift(dir);
    });
  }

  process.env.LRS_ENDPOINT = options.endpoint;
  process.env.BASIC_AUTH_ENABLED = String(options.basicAuth);
  process.env.BASIC_AUTH_USER = options.authUser;
  process.env.BASIC_AUTH_PASSWORD = options.authPass;
  process.env.OAUTH1_ENABLED = String(options.oAuth1);
  process.env.XAPI_VERSION = options.xapiVersion;

  if (options.oAuth1) {
    (globalThis as typeof globalThis & { OAUTH?: Record<string, string | undefined> }).OAUTH = {
      consumer_key: _options.consumer_key,
      consumer_secret: _options.consumer_secret,
      token: _options.token,
      token_secret: _options.token_secret,
      verifier: _options.verifier,
    };
  }

  var selectedFiles =
    Array.isArray(options.file) && options.file.length > 0
      ? options.file.map(function (filePath) {
          return path.normalize(filePath).replace(/\\/g, "/");
        })
      : null;
  require("chai").use(require("chai-things"));
  var timeMarginSetupFiles = [
    "test/v1_0_3/Data2.2-FormattingRequirements.js",
    "test/v2_0/Data2.2-FormattingRequirements.js",
  ];
  var timeMarginDependentFiles = [
    "test/v1_0_3/H.Communication2.1-StatementResource.js",
    "test/v1_0_3/H.Communication2.3-StateResource.js",
    "test/v1_0_3/H.Communication2.6-AgentProfileResource.js",
    "test/v1_0_3/H.Communication2.7-ActivityProfileResource.js",
    "test/v2_0/4.1.6.1-Statement-Resource.js",
    "test/v2_0/4.1.6.2-State-Resource.js",
    "test/v2_0/4.1.6.5-Agent-Profile-Resource.js",
    "test/v2_0/4.1.6.6-Activity-Profile-Resource.js",
  ];
  var needsTimeMarginBootstrap =
    !!selectedFiles &&
    selectedFiles.some(function (filePath) {
      return timeMarginDependentFiles.indexOf(filePath) !== -1;
    }) &&
    !selectedFiles.some(function (filePath) {
      return timeMarginSetupFiles.indexOf(filePath) !== -1;
    });
  if (needsTimeMarginBootstrap) {
    mocha.suite.beforeAll(
      "Accounting for time differential between test suite and lrs",
      function (done: (error?: unknown, ...ignored: unknown[]) => void) {
        require(path.join(__dirname, "..", "test", "helper.js")).setTimeMargin(done);
      },
    );
  }
  options.directory.forEach(function (dir) {
    var testDirectory = __dirname + "/../test/" + dir;
    fs.readdirSync(testDirectory)
      .filter(function (file) {
        var relativeFilePath = path.join("test", dir, file).replace(/\\/g, "/");
        return file.substr(-3) === ".js" && (!selectedFiles || selectedFiles.indexOf(relativeFilePath) !== -1);
      })
      .forEach(function (file) {
        mocha.addFile(path.join(testDirectory, file));
      });
  });

  mocha.run(function () {
    childProcessHandle.postMessage?.("log", "Test Suite Complete");
    process.exit();
  });
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
