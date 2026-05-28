import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

import type { DescribeRuntime } from "./runtime.ts";
import type { NormalizedRunnerOptions } from "./options.ts";

export interface SuiteLoaderOptions {
  normalizedOptions: NormalizedRunnerOptions;
  runtime: DescribeRuntime;
  runtimeRoot: string;
}

type SuiteDescribe = ((title: string, build: () => void) => void) & {
  skip?: (title: string, build: () => void) => void;
};

type SuiteIt = ((title: string, fn?: ((done?: (error?: unknown) => void) => unknown) | (() => unknown)) => void) & {
  skip?: (title: string, fn?: ((done?: (error?: unknown) => void) => unknown) | (() => unknown)) => void;
};

type SuiteBefore = {
  (title: string, fn: (done?: (error?: unknown) => void) => unknown): void;
  (fn: (done?: (error?: unknown) => void) => unknown): void;
};

type SuiteGlobalShape = typeof globalThis & {
  context?: SuiteDescribe;
  describe?: SuiteDescribe;
  specify?: SuiteIt;
  it?: SuiteIt;
  before?: SuiteBefore;
  OAUTH?: Record<string, string>;
};

const timeMarginSetupFiles = new Set<string>([
  "test/v1_0_3/Data2.2-FormattingRequirements.js",
  "test/v2_0/Data2.2-FormattingRequirements.js",
]);

const timeMarginDependentFiles = new Set<string>([
  "test/v1_0_3/H.Communication2.1-StatementResource.js",
  "test/v1_0_3/H.Communication2.3-StateResource.js",
  "test/v1_0_3/H.Communication2.6-AgentProfileResource.js",
  "test/v1_0_3/H.Communication2.7-ActivityProfileResource.js",
  "test/v2_0/4.1.6.1-Statement-Resource.js",
  "test/v2_0/4.1.6.2-State-Resource.js",
  "test/v2_0/4.1.6.5-Agent-Profile-Resource.js",
  "test/v2_0/4.1.6.6-Activity-Profile-Resource.js",
]);

export function toPosixPath(pathValue: string): string {
  return pathValue.replaceAll("\\", "/");
}

export function normalizeSelectedFiles(selectedFiles: string[] | undefined): Set<string> | null {
  if (!selectedFiles || selectedFiles.length === 0) {
    return null;
  }

  return new Set(selectedFiles.map((filePath) => toPosixPath(filePath)));
}

function applyRunnerEnvironment(normalizedOptions: NormalizedRunnerOptions): Array<string | undefined> {
  const previousDirectory = process.env.DIRECTORY;
  const previousEndpoint = process.env.LRS_ENDPOINT;
  const previousBasicAuthEnabled = process.env.BASIC_AUTH_ENABLED;
  const previousBasicAuthUser = process.env.BASIC_AUTH_USER;
  const previousBasicAuthPassword = process.env.BASIC_AUTH_PASSWORD;
  const previousOAuthEnabled = process.env.OAUTH1_ENABLED;
  const previousXapiVersion = process.env.XAPI_VERSION;

  process.env.DIRECTORY = normalizedOptions.directory[0] ?? "";
  process.env.LRS_ENDPOINT = normalizedOptions.endpoint;
  process.env.BASIC_AUTH_ENABLED = String(normalizedOptions.basicAuth);
  process.env.BASIC_AUTH_USER = normalizedOptions.authUser ?? "";
  process.env.BASIC_AUTH_PASSWORD = normalizedOptions.authPass ?? "";
  process.env.OAUTH1_ENABLED = String(normalizedOptions.oAuth1);
  process.env.XAPI_VERSION = normalizedOptions.xapiVersion;

  if (normalizedOptions.oAuth1) {
    (globalThis as SuiteGlobalShape).OAUTH = {
      consumer_key: normalizedOptions.consumer_key ?? "",
      consumer_secret: normalizedOptions.consumer_secret ?? "",
      token: normalizedOptions.token ?? "",
      token_secret: normalizedOptions.token_secret ?? "",
      verifier: normalizedOptions.verifier ?? "",
    };
  } else {
    delete (globalThis as SuiteGlobalShape).OAUTH;
  }

  return [
    previousDirectory,
    previousEndpoint,
    previousBasicAuthEnabled,
    previousBasicAuthUser,
    previousBasicAuthPassword,
    previousOAuthEnabled,
    previousXapiVersion,
  ];
}

export function installRunnerEnvironment(normalizedOptions: NormalizedRunnerOptions): () => void {
  const previousValues = applyRunnerEnvironment(normalizedOptions);

  return () => {
    restoreRunnerEnvironment(previousValues);
  };
}

function restoreRunnerEnvironment(previousValues: Array<string | undefined>): void {
  const [
    previousDirectory,
    previousEndpoint,
    previousBasicAuthEnabled,
    previousBasicAuthUser,
    previousBasicAuthPassword,
    previousOAuthEnabled,
    previousXapiVersion,
  ] = previousValues;

  const restore = (name: string, value: string | undefined): void => {
    if (typeof value === "undefined") {
      delete process.env[name];
      return;
    }

    process.env[name] = value;
  };

  restore("DIRECTORY", previousDirectory);
  restore("LRS_ENDPOINT", previousEndpoint);
  restore("BASIC_AUTH_ENABLED", previousBasicAuthEnabled);
  restore("BASIC_AUTH_USER", previousBasicAuthUser);
  restore("BASIC_AUTH_PASSWORD", previousBasicAuthPassword);
  restore("OAUTH1_ENABLED", previousOAuthEnabled);
  restore("XAPI_VERSION", previousXapiVersion);
  delete (globalThis as SuiteGlobalShape).OAUTH;
}

function installSuiteGlobals(runtime: DescribeRuntime): () => void {
  const globalState = globalThis as SuiteGlobalShape;
  const previousDescribe = globalState.describe;
  const previousContext = globalState.context;
  const previousIt = globalState.it;
  const previousSpecify = globalState.specify;
  const previousBefore = globalState.before;

  const describe = Object.assign((title: string, build: () => void) => runtime.describe(title, build), {
    skip: (_title: string, _build: () => void) => {},
  });
  const it = Object.assign(
    (title: string, fn?: ((done?: (error?: unknown) => void) => unknown) | (() => unknown)) => runtime.it(title, fn),
    {
      skip: (title: string) => runtime.it(title),
    },
  );

  globalState.describe = describe;
  globalState.context = describe;
  globalState.it = it;
  globalState.specify = it;
  globalState.before = runtime.before.bind(runtime);

  return () => {
    globalState.describe = previousDescribe;
    globalState.context = previousContext;
    globalState.it = previousIt;
    globalState.specify = previousSpecify;
    globalState.before = previousBefore;
  };
}

export function getDirectoriesToLoad(normalizedOptions: NormalizedRunnerOptions): string[] {
  const directories = [...normalizedOptions.directory];
  if (normalizedOptions.optional && normalizedOptions.optional.length > 0) {
    for (const optionalDirectory of [...normalizedOptions.optional].reverse()) {
      directories.unshift(optionalDirectory);
    }
  }

  return directories;
}

function isMissingAssertionModule(error: unknown): boolean {
  const moduleError = error as { code?: unknown; message?: unknown };
  if (moduleError.code === "MODULE_NOT_FOUND") {
    return true;
  }

  const message = typeof moduleError.message === "string" ? moduleError.message : String(error);
  return /Cannot find (module|package) 'chai(?:-things)?'/.test(message);
}

export function installAssertionPlugins(requireFromRuntimeRoot: NodeJS.Require): void {
  try {
    const chai = requireFromRuntimeRoot("chai") as { use?: (plugin: unknown) => void };
    const chaiThings = requireFromRuntimeRoot("chai-things");

    if (typeof chai.use === "function") {
      chai.use(chaiThings);
    }
  } catch (error) {
    if (isMissingAssertionModule(error)) {
      return;
    }

    throw error;
  }
}

export function needsTimeMarginBootstrap(selectedFiles: Set<string> | null): boolean {
  if (!selectedFiles || selectedFiles.size === 0) {
    return false;
  }

  let hasDependentFile = false;
  let hasSetupFile = false;

  for (const filePath of selectedFiles) {
    if (timeMarginDependentFiles.has(filePath)) {
      hasDependentFile = true;
    }

    if (timeMarginSetupFiles.has(filePath)) {
      hasSetupFile = true;
    }
  }

  return hasDependentFile && !hasSetupFile;
}

function installSelectedFileBootstrapHooks(options: {
  requireFromRuntimeRoot: NodeJS.Require;
  runtime: DescribeRuntime;
  runtimeRoot: string;
  selectedFiles: Set<string> | null;
}): void {
  if (!needsTimeMarginBootstrap(options.selectedFiles)) {
    return;
  }

  const helperModulePath = resolve(options.runtimeRoot, "test", "helper.js");

  options.runtime.before("Accounting for time differential between test suite and lrs", (done) => {
    const helperModule = options.requireFromRuntimeRoot(helperModulePath) as {
      setTimeMargin?: (done?: (error?: unknown) => void) => unknown;
    };

    if (typeof helperModule.setTimeMargin !== "function") {
      done();
      return;
    }

    helperModule.setTimeMargin?.(done);
  });
}

export function registerSuiteFiles(options: SuiteLoaderOptions): string[] {
  const runtimeRoot = options.runtimeRoot;
  const normalizedOptions = options.normalizedOptions;
  const directoriesToLoad = getDirectoriesToLoad(normalizedOptions);
  const selectedFiles = normalizeSelectedFiles(normalizedOptions.file);
  const requireFromRuntimeRoot = createRequire(resolve(runtimeRoot, "bin", "console_runner.js"));
  installAssertionPlugins(requireFromRuntimeRoot);
  installSelectedFileBootstrapHooks({
    requireFromRuntimeRoot,
    runtime: options.runtime,
    runtimeRoot,
    selectedFiles,
  });
  const restoreGlobals = installSuiteGlobals(options.runtime);
  const loadedFiles: string[] = [];

  try {
    for (const directory of directoriesToLoad) {
      const testDirectory = resolve(runtimeRoot, "test", directory);
      const directoryEntries = readdirSync(testDirectory)
        .filter((entry) => entry.endsWith(".js"))
        .sort((left, right) => left.localeCompare(right));

      for (const entry of directoryEntries) {
        const relativeFilePath = toPosixPath(join("test", directory, entry));
        if (selectedFiles && !selectedFiles.has(relativeFilePath)) {
          continue;
        }

        const absoluteFilePath = resolve(testDirectory, entry);
        delete requireFromRuntimeRoot.cache?.[absoluteFilePath];
        requireFromRuntimeRoot(absoluteFilePath);
        loadedFiles.push(relativeFilePath);
      }
    }
  } finally {
    restoreGlobals();
  }

  return loadedFiles;
}
