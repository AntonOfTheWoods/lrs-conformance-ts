import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, posix, relative, resolve } from "node:path";

import { getMigrationLedgerUnitByUnitKey } from "../../src/describe-runtime/migration-ledger.ts";

const repoRoot = resolve(import.meta.dir, "../..");
const defaultBunImage = "docker.io/oven/bun:1";
const defaultNodeImage = "docker.io/library/node:22";
const defaultUpstreamRepoUrl = "https://github.com/adlnet/lrs-conformance-test-suite.git";
const defaultUpstreamRef = "5bc232d349c60faded8240da698f195106091638";
const defaultCloneDepth = 1;
const repoMountTarget = "/workspace";
const suiteMountTarget = "/adl-suite-src";
const allowedArtifactRoots = [resolve(repoRoot, "tmp/validation"), resolve(repoRoot, "tmp/agents")];

const timeMarginSetupFilePaths = [
  "test/v1_0_3/Data2.2-FormattingRequirements.js",
  "test/v2_0/Data2.2-FormattingRequirements.js",
];

const timeMarginDependentFilePaths = [
  "test/v1_0_3/H.Communication2.1-StatementResource.js",
  "test/v1_0_3/H.Communication2.3-StateResource.js",
  "test/v1_0_3/H.Communication2.6-AgentProfileResource.js",
  "test/v1_0_3/H.Communication2.7-ActivityProfileResource.js",
  "test/v2_0/4.1.6.1-Statement-Resource.js",
  "test/v2_0/4.1.6.2-State-Resource.js",
  "test/v2_0/4.1.6.5-Agent-Profile-Resource.js",
  "test/v2_0/4.1.6.6-Activity-Profile-Resource.js",
];

type SuiteLocation = {
  suiteDir: string;
};

type SupportedVersion = "2.0.0" | "1.0.3";

export type ProvidedSuiteRuntimeMode = "bun-ts";
export type ProvidedSuiteRunnerMode = "compat-forward" | "native";

const flagsWithValues = new Set([
  "--base-url",
  "--bun-image",
  "--provided-suite-runner-mode",
  "--username",
  "--password",
  "--version",
  "--out",
  "--log-dir",
  "--node-image",
  "--upstream-repo-url",
  "--upstream-ref",
  "--clone-depth",
  "--clone-base-dir",
  "--suite-dir",
  "--grep",
  "--directory",
  "--optional",
  "--unitKey",
]);

const booleanFlags = new Set(["--keep-clone", "--allow-unsafe-output-path"]);

interface ExportUpstreamConfig {
  baseUrl: string;
  bunImage: string;
  providedSuiteRunnerMode: ProvidedSuiteRunnerMode;
  username: string;
  password: string;
  version: SupportedVersion;
  outputPath: string;
  logDir: string;
  nodeImage: string;
  upstreamRepoUrl: string;
  upstreamRef: string;
  cloneDepth: number;
  cloneBaseDir: string;
  keepClone: boolean;
  allowUnsafeOutputPath: boolean;
  suiteDir?: string;
  grep?: string;
  directory?: string;
  optional?: string;
  unitKeys?: string[];
}

export interface UpstreamUnitSelection {
  directory: "v1_0_3" | "v2_0";
  filePaths: string[];
  optionalDirectories: string[];
}

export interface ExportRunMetadata {
  mode: "candidate" | "upstream-oracle";
  providedSuiteRunnerMode: ProvidedSuiteRunnerMode | null;
  providedSuiteRuntimeMode: ProvidedSuiteRuntimeMode | null;
  selectedFiles: string[] | null;
  selectedUnitKeys: string[] | null;
  sourceSuiteDir: string | null;
  sourceLogPath: string;
  suiteExitCode: number;
  upstreamExitCode: number;
}

function isProvidedSuiteRunnerMode(value: string): value is ProvidedSuiteRunnerMode {
  return value === "compat-forward" || value === "native";
}

export function parseProvidedSuiteRunnerMode(value: string | undefined): ProvidedSuiteRunnerMode | undefined {
  if (!value) {
    return undefined;
  }

  if (!isProvidedSuiteRunnerMode(value)) {
    throw new Error(`Unsupported --provided-suite-runner-mode value: ${value}`);
  }

  return value;
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function parseCsvFlag(args: string[], flag: string): string[] | undefined {
  const value = getFlagValue(args, flag);
  if (!value) {
    return undefined;
  }

  const parsed = value
    .split(",")
    .map((segment) => segment.trim())
    .filter((segment, index, list) => segment.length > 0 && list.indexOf(segment) === index);

  return parsed.length > 0 ? parsed : undefined;
}

function validateArgs(args: string[]): void {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg || !arg.startsWith("--")) {
      continue;
    }

    if (booleanFlags.has(arg)) {
      continue;
    }

    if (flagsWithValues.has(arg)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}.`);
      }

      index += 1;
      continue;
    }

    throw new Error(`Unknown flag: ${arg}`);
  }
}

function getVersionDirectory(version: SupportedVersion): "v1_0_3" | "v2_0" {
  return version === "1.0.3" ? "v1_0_3" : "v2_0";
}

export function resolveUpstreamUnitSelection(unitKeys: string[], version: SupportedVersion): UpstreamUnitSelection {
  if (unitKeys.length === 0) {
    throw new Error("--unitKey requires at least one migration ledger unit key.");
  }

  const versionDirectory = getVersionDirectory(version);
  const filePathSet = new Set<string>();
  const optionalDirectorySet = new Set<string>();

  for (const unitKey of unitKeys) {
    const unit = getMigrationLedgerUnitByUnitKey(unitKey);
    if (!unit) {
      throw new Error(`Unknown --unitKey value: ${unitKey}`);
    }

    if (unit.version && unit.version !== version) {
      throw new Error(`Unit key ${unitKey} does not belong to xAPI version ${version}.`);
    }

    filePathSet.add(unit.upstreamFilePath);
    if (unit.directory !== versionDirectory) {
      optionalDirectorySet.add(unit.directory);
    }
  }

  return {
    directory: versionDirectory,
    filePaths: [...filePathSet],
    optionalDirectories: [...optionalDirectorySet].sort((left, right) => left.localeCompare(right)),
  };
}

function usage(): string {
  return [
    "Usage:",
    "  bun run rewrite:export:upstream:lrsql -- [--suite-dir <path>] [--provided-suite-runner-mode compat-forward|native] [--base-url <url>] [--username <user>] [--password <pass>] [--version 2.0.0|1.0.3] [--out <path>] [--grep <pattern>] [--directory <csv>] [--optional <csv>] [--unitKey <csv>] [--log-dir <path>] [--node-image <ref>] [--bun-image <ref>] [--upstream-repo-url <url>] [--upstream-ref <ref>] [--clone-depth <n>] [--clone-base-dir <path>] [--keep-clone]",
    "",
    "Defaults:",
    "  --base-url http://localhost:8080/xapi",
    "  --username janedoe",
    "  --password supersecret",
    "  --version 2.0.0",
    "  --out tmp/validation/oracles/upstream-baselines/upstream-run-<version>.json",
    "  --log-dir tmp/validation/oracles/upstream-baselines/lrs-conformance",
    `  --upstream-repo-url ${defaultUpstreamRepoUrl}`,
    `  --upstream-ref ${defaultUpstreamRef}`,
    `  --clone-depth ${defaultCloneDepth}`,
    "  --clone-base-dir tmp/agents/upstream-clones",
    `  --node-image ${defaultNodeImage}`,
    `  --bun-image ${defaultBunImage}`,
    "  --suite-dir rewrite4",
    "  --provided-suite-runner-mode defaults to native for provided suites",
    "",
    "Notes:",
    "  Without --suite-dir, the upstream suite source is fetched from GitHub by shallow clone.",
    "  With --suite-dir, the local suite source is used as the active migration candidate.",
    "  --unitKey is mutually exclusive with --grep, --directory, and --optional.",
  ].join("\n");
}

function parseConfig(args: string[]): ExportUpstreamConfig {
  validateArgs(args);

  const baseUrl = getFlagValue(args, "--base-url") ?? "http://localhost:8080/xapi";
  const bunImage = getFlagValue(args, "--bun-image") ?? process.env.BUN_IMAGE ?? defaultBunImage;
  const providedSuiteRunnerModeArg = getFlagValue(args, "--provided-suite-runner-mode");
  const username = getFlagValue(args, "--username") ?? "janedoe";
  const password = getFlagValue(args, "--password") ?? "supersecret";
  const versionFlag = getFlagValue(args, "--version") ?? "2.0.0";
  const outputPath =
    getFlagValue(args, "--out") ?? `tmp/validation/oracles/upstream-baselines/upstream-run-${versionFlag}.json`;
  const logDirArg =
    getFlagValue(args, "--log-dir") ?? `tmp/validation/oracles/upstream-baselines/lrs-conformance-${versionFlag}`;
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
  const suiteDirArg = getFlagValue(args, "--suite-dir");
  const grep = getFlagValue(args, "--grep");
  const directory = getFlagValue(args, "--directory");
  const optional = getFlagValue(args, "--optional");
  const unitKeys = parseCsvFlag(args, "--unitKey");
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

  if (unitKeys && (grep || directory || optional)) {
    throw new Error("--unitKey cannot be combined with --grep, --directory, or --optional.");
  }

  if (providedSuiteRunnerModeArg && !suiteDirArg) {
    throw new Error("--provided-suite-runner-mode can only be used with --suite-dir.");
  }

  const version: SupportedVersion = versionFlag;
  const suiteDir = suiteDirArg ? (isAbsolute(suiteDirArg) ? suiteDirArg : resolve(repoRoot, suiteDirArg)) : undefined;
  const providedSuiteRunnerMode = parseProvidedSuiteRunnerMode(providedSuiteRunnerModeArg) ?? "native";

  return {
    baseUrl,
    bunImage,
    providedSuiteRunnerMode,
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
    suiteDir,
    grep,
    directory,
    optional,
    unitKeys,
  };
}

function ensureOwnerCaptureSupport(suiteDir: string): void {
  const lrsTestPath = resolve(suiteDir, "bin/lrs-test.js");
  let lrsTestSource = readFileSync(lrsTestPath, "utf8");

  if (!lrsTestSource.includes("global.__lrsConformanceCaptureExecutionState")) {
    const processMessageReporterAnchor = "    function processMessageReporter(p) {\n";
    const processMessageReporterReplacement = [
      "    function getOrCreateCaptureExecutionState() {",
      "        if (!global.__lrsConformanceCaptureExecutionState) {",
      "            global.__lrsConformanceCaptureExecutionState = {",
      "                suitePath: [],",
      "                testTitle: null",
      "            };",
      "        }",
      "",
      "        return global.__lrsConformanceCaptureExecutionState;",
      "    }",
      "",
      "    function processMessageReporter(p) {",
    ].join("\n");
    const patched = lrsTestSource.replace(processMessageReporterAnchor, processMessageReporterReplacement);
    if (patched === lrsTestSource) {
      throw new Error(`Unable to patch capture execution state support into ${lrsTestPath}.`);
    }
    lrsTestSource = patched;
  }

  if (!lrsTestSource.includes("getOrCreateCaptureExecutionState().testTitle = test.title")) {
    const testStartAnchor = [
      "            runner.on('test', function(test) {",
      '                p.postMessage("test start", test.title);',
      "            })",
    ].join("\n");
    const testStartReplacement = [
      "            runner.on('test', function(test) {",
      "                getOrCreateCaptureExecutionState().testTitle = test.title;",
      '                p.postMessage("test start", test.title);',
      "            })",
    ].join("\n");
    const patched = lrsTestSource.replace(testStartAnchor, testStartReplacement);
    if (patched === lrsTestSource) {
      throw new Error(`Unable to patch test-start execution state support into ${lrsTestPath}.`);
    }
    lrsTestSource = patched;
  }

  if (!lrsTestSource.includes("executionState.testTitle = null;")) {
    const testEndAnchor = [
      "            runner.on('test end', function(test) {",
      '                p.postMessage("test end", test.title);',
      "            })",
    ].join("\n");
    const testEndReplacement = [
      "            runner.on('test end', function(test) {",
      "                var executionState = getOrCreateCaptureExecutionState();",
      "                if (executionState.testTitle === test.title) {",
      "                    executionState.testTitle = null;",
      "                }",
      '                p.postMessage("test end", test.title);',
      "            })",
    ].join("\n");
    const patched = lrsTestSource.replace(testEndAnchor, testEndReplacement);
    if (patched === lrsTestSource) {
      throw new Error(`Unable to patch test-end execution state support into ${lrsTestPath}.`);
    }
    lrsTestSource = patched;
  }

  if (!lrsTestSource.includes("executionState.suitePath.push(suite.title);")) {
    const suiteStartAnchor = [
      "            runner.on('suite', function(suite) {",
      '                p.postMessage("suite start", suite.title);',
      "            });",
    ].join("\n");
    const suiteStartReplacement = [
      "            runner.on('suite', function(suite) {",
      "                var executionState = getOrCreateCaptureExecutionState();",
      "                if (suite.title) {",
      "                    executionState.suitePath.push(suite.title);",
      "                }",
      '                p.postMessage("suite start", suite.title);',
      "            });",
    ].join("\n");
    const patched = lrsTestSource.replace(suiteStartAnchor, suiteStartReplacement);
    if (patched === lrsTestSource) {
      throw new Error(`Unable to patch suite-start execution state support into ${lrsTestPath}.`);
    }
    lrsTestSource = patched;
  }

  if (!lrsTestSource.includes("executionState.suitePath[executionState.suitePath.length - 1] === suite.title")) {
    const suiteEndAnchor = [
      "            runner.on('suite end', function(suite) {",
      "                p.postMessage('suite end', suite.title);",
      "            });",
    ].join("\n");
    const suiteEndReplacement = [
      "            runner.on('suite end', function(suite) {",
      "                var executionState = getOrCreateCaptureExecutionState();",
      "                if (suite.title && executionState.suitePath[executionState.suitePath.length - 1] === suite.title) {",
      "                    executionState.suitePath.pop();",
      "                }",
      "                p.postMessage('suite end', suite.title);",
      "            });",
    ].join("\n");
    const patched = lrsTestSource.replace(suiteEndAnchor, suiteEndReplacement);
    if (patched === lrsTestSource) {
      throw new Error(`Unable to patch suite-end execution state support into ${lrsTestPath}.`);
    }
    lrsTestSource = patched;
  }

  if (!lrsTestSource.includes("executionState.suitePath = [];")) {
    const endAnchor = [
      "            runner.on('end', function() {",
      "                p.postMessage(\"end\", 'All done');",
      "            });",
    ].join("\n");
    const endReplacement = [
      "            runner.on('end', function() {",
      "                var executionState = getOrCreateCaptureExecutionState();",
      "                executionState.suitePath = [];",
      "                executionState.testTitle = null;",
      "                p.postMessage(\"end\", 'All done');",
      "            });",
    ].join("\n");
    const patched = lrsTestSource.replace(endAnchor, endReplacement);
    if (patched === lrsTestSource) {
      throw new Error(`Unable to patch run-end execution state reset into ${lrsTestPath}.`);
    }
    lrsTestSource = patched;
  }

  writeFileSync(lrsTestPath, lrsTestSource, "utf8");

  const helperPath = resolve(suiteDir, "test/helper.js");
  let helperSource = readFileSync(helperPath, "utf8");

  if (
    !helperSource.includes("var CAPTURE_OWNER_HEADER = 'x-lrs-conformance-owner';") &&
    !helperSource.includes('var CAPTURE_OWNER_HEADER = "x-lrs-conformance-owner";')
  ) {
    const anchor = "    var URL_STATEMENTS = '/statements';\n";
    const replacement = `${anchor}\n    var CAPTURE_OWNER_HEADER = 'x-lrs-conformance-owner';\n`;
    const patched = helperSource.replace(anchor, replacement);
    if (patched === helperSource) {
      throw new Error(`Unable to patch capture owner header constant into ${helperPath}.`);
    }
    helperSource = patched;
  }

  if (!helperSource.includes("buildCaptureOwnerMetadata: function ()")) {
    const anchor = [
      "        addBasicAuthenicationHeader: function (header) {",
      "            var newHeader = extend(true, {}, header);",
      "            if (process.env.BASIC_AUTH_ENABLED === 'true') {",
      "                var userPass = new Buffer(process.env.BASIC_AUTH_USER + ':' + process.env.BASIC_AUTH_PASSWORD).toString('base64');",
      "                newHeader['Authorization'] = 'Basic ' + userPass;",
      "            }",
      "            return newHeader;",
      "        },",
    ].join("\n");
    const replacement = [
      "        addBasicAuthenicationHeader: function (header) {",
      "            var newHeader = extend(true, {}, header);",
      "            if (process.env.BASIC_AUTH_ENABLED === 'true') {",
      "                var userPass = new Buffer(process.env.BASIC_AUTH_USER + ':' + process.env.BASIC_AUTH_PASSWORD).toString('base64');",
      "                newHeader['Authorization'] = 'Basic ' + userPass;",
      "            }",
      "            return newHeader;",
      "        },",
      "        buildCaptureOwnerMetadata: function () {",
      "            var executionState = global.__lrsConformanceCaptureExecutionState;",
      "            if (!executionState || !Array.isArray(executionState.suitePath)) {",
      "                return null;",
      "            }",
      "",
      "            var suitePath = executionState.suitePath.filter(function (segment) {",
      "                return typeof segment === 'string' && segment.length > 0;",
      "            });",
      "            var testTitle = typeof executionState.testTitle === 'string' && executionState.testTitle.length > 0 ? executionState.testTitle : null;",
      "            if (suitePath.length === 0 && !testTitle) {",
      "                return null;",
      "            }",
      "",
      "            var casePath = testTitle ? suitePath.concat([testTitle]) : null;",
      "            var ownerPath = casePath || suitePath;",
      "            var fallbackSuiteTitle = suitePath.length > 0 ? suitePath[0] : 'unmapped';",
      "            var sourceFilePath = process.env.LRS_CAPTURE_SOURCE_FILE_PATH || null;",
      "            var sourceSymbol = process.env.LRS_CAPTURE_SOURCE_SYMBOL || null;",
      "",
      "            return encodeURIComponent(JSON.stringify({",
      "                casePath: casePath,",
      "                directory: process.env.LRS_CAPTURE_DIRECTORY || DIRECTORY || '',",
      "                hookTitle: null,",
      "                ownerLabel: ownerPath.join(' > '),",
      "                phase: testTitle ? 'case' : 'before',",
      "                sourceFilePath: sourceFilePath,",
      "                sourceSymbol: sourceSymbol,",
      "                suitePath: suitePath,",
      "                unitKey: process.env.LRS_CAPTURE_UNIT_KEY || ((process.env.LRS_CAPTURE_DIRECTORY || DIRECTORY || 'unmapped') + ':' + fallbackSuiteTitle),",
      "                version: process.env.LRS_CAPTURE_VERSION || process.env.XAPI_VERSION || ''",
      "            }));",
      "        },",
      "        addCaptureOwnerHeader: function (header) {",
      "            var newHeader = extend(true, {}, header);",
      "            var metadata = module.exports.buildCaptureOwnerMetadata();",
      "            if (metadata) {",
      "                newHeader[CAPTURE_OWNER_HEADER] = metadata;",
      "            }",
      "            return newHeader;",
      "        },",
    ].join("\n");
    const patched = helperSource.replace(anchor, replacement);
    if (patched === helperSource) {
      throw new Error(`Unable to patch capture owner metadata helpers into ${helperPath}.`);
    }
    helperSource = patched;
  }

  if (!helperSource.includes("module.exports.addCaptureOwnerHeader(newHeader)")) {
    const anchor = [
      "            else{",
      "                newHeader = module.exports.addBasicAuthenicationHeader(newHeader);",
      "            }",
      "            return newHeader;",
    ].join("\n");
    const replacement = [
      "            else{",
      "                newHeader = module.exports.addBasicAuthenicationHeader(newHeader);",
      "            }",
      "            newHeader = module.exports.addCaptureOwnerHeader(newHeader);",
      "            return newHeader;",
    ].join("\n");
    const patched = helperSource.replace(anchor, replacement);
    if (patched === helperSource) {
      throw new Error(`Unable to patch addAllHeaders capture owner support into ${helperPath}.`);
    }
    helperSource = patched;
  }

  if (!helperSource.includes("headers[CAPTURE_OWNER_HEADER]") && !helperSource.includes("pre.headers(headers);")) {
    const anchor = [
      "            if (process.env.BASIC_AUTH_ENABLED === 'true') {",
      "                pre.set('Authorization', headers['Authorization']);",
      "            }",
      "            //If we're doing oauth, set it up!",
    ].join("\n");
    const replacement = [
      "            if (process.env.BASIC_AUTH_ENABLED === 'true') {",
      "                pre.set('Authorization', headers['Authorization']);",
      "            }",
      "            if (headers[CAPTURE_OWNER_HEADER]) {",
      "                pre.set(CAPTURE_OWNER_HEADER, headers[CAPTURE_OWNER_HEADER]);",
      "            }",
      "            //If we're doing oauth, set it up!",
    ].join("\n");
    const patched = helperSource.replace(anchor, replacement);
    if (patched === helperSource) {
      throw new Error(`Unable to patch sendRequest capture owner support into ${helperPath}.`);
    }
    helperSource = patched;
  }

  writeFileSync(helperPath, helperSource, "utf8");

  const parametersPath = resolve(suiteDir, "test/Parameters/testing.js");
  if (!existsSync(parametersPath)) {
    return;
  }

  let parametersSource = readFileSync(parametersPath, "utf8");
  if (!parametersSource.includes("headers['x-lrs-conformance-owner']")) {
    const anchor = [
      "        if (process.env.BASIC_AUTH_ENABLED === 'true') {",
      "            pre.set('Authorization', headers['Authorization']);",
      "        }",
      "        //If we're doing oauth, set it up!",
    ].join("\n");
    const replacement = [
      "        if (process.env.BASIC_AUTH_ENABLED === 'true') {",
      "            pre.set('Authorization', headers['Authorization']);",
      "        }",
      "        if (headers['x-lrs-conformance-owner']) {",
      "            pre.set('x-lrs-conformance-owner', headers['x-lrs-conformance-owner']);",
      "        }",
      "        //If we're doing oauth, set it up!",
    ].join("\n");
    const patched = parametersSource.replace(anchor, replacement);
    if (patched === parametersSource) {
      throw new Error(`Unable to patch Parameters capture owner support into ${parametersPath}.`);
    }
    parametersSource = patched;
  }

  writeFileSync(parametersPath, parametersSource, "utf8");
}

function ensureRunnerSelectionFlagSupport(suiteDir: string): void {
  const consoleRunnerPath = resolve(suiteDir, "bin/console_runner.js");
  let source = readFileSync(consoleRunnerPath, "utf8");

  const directoryOptionLine =
    "    .option('-d, --directory [value]', 'Specific directories of tests (as a comma-separated list with no spaces).', clean_dir, [...[]])\n";
  const optionalOptionLine =
    "    .option('-m, --optional [value]', 'Optional directories of tests (as a comma-separated list with no spaces).', clean_dir, [...[]])\n";
  const fileOptionLine =
    "    .option('-f, --file [value]', 'Specific suite files (as a comma-separated list with no spaces).', clean_dir, [...[]])\n";
  const directoryConfigLine = "    directory: program.directory,\n";
  const optionalConfigLine =
    "    optional: Array.isArray(program.optional) && program.optional.length > 0 ? program.optional : undefined,\n";
  const fileConfigLine =
    "    file: Array.isArray(program.file) && program.file.length > 0 ? program.file : undefined,\n";

  if (!source.includes("--optional [value]")) {
    const patched = source.replace(directoryOptionLine, `${directoryOptionLine}${optionalOptionLine}`);
    if (patched === source) {
      throw new Error(`Unable to patch optional flag support into ${consoleRunnerPath}.`);
    }
    source = patched;
  }

  if (!source.includes("--file [value]")) {
    const optionAnchor = source.includes(optionalOptionLine) ? optionalOptionLine : directoryOptionLine;
    const patched = source.replace(optionAnchor, `${optionAnchor}${fileOptionLine}`);
    if (patched === source) {
      throw new Error(`Unable to patch file flag support into ${consoleRunnerPath}.`);
    }
    source = patched;
  }

  if (!source.includes("program.optional")) {
    const patched = source.replace(directoryConfigLine, `${directoryConfigLine}${optionalConfigLine}`);
    if (patched === source) {
      throw new Error(`Unable to patch optional config support into ${consoleRunnerPath}.`);
    }
    source = patched;
  }

  if (!source.includes("program.file")) {
    const configAnchor = source.includes(optionalConfigLine) ? optionalConfigLine : directoryConfigLine;
    const patched = source.replace(configAnchor, `${configAnchor}${fileConfigLine}`);
    if (patched === source) {
      throw new Error(`Unable to patch file config support into ${consoleRunnerPath}.`);
    }
    source = patched;
  }

  writeFileSync(consoleRunnerPath, source, "utf8");
}

export function patchUpstreamLrsTestSource(source: string): string {
  let patchedSource = source;

  const optionalValidatorLine = "            optional: Joi.array().items(Joi.string().required()),\n";
  const fileValidatorLine = "            file: Joi.array().items(Joi.string().required()),\n";
  const optionalOptionsLine = "            optional: _options.optional,\n";
  const fileOptionsLine = "            file: _options.file,\n";
  const directoryLoopAnchor = "        options.directory.forEach(function(dir) {\n";
  const chaiThingsBootstrapLine = "        require('chai').use(require('chai-things'));\n";
  const chaiThingsBootstrapVariants = [
    "require('chai').use(require('chai-things'))",
    'require("chai").use(require("chai-things"))',
  ];
  const selectedFilesVariants = [
    "var selectedFiles = Array.isArray(options.file)",
    "Array.isArray(options.file) && options.file.length > 0",
  ];
  const relativeFilePathVariants = [
    "relativeFilePath = path.join('test', dir, file)",
    'relativeFilePath = path.join("test", dir, file)',
  ];
  const timeMarginBootstrapBlock = [
    `        var timeMarginSetupFiles = ${JSON.stringify(timeMarginSetupFilePaths)};`,
    `        var timeMarginDependentFiles = ${JSON.stringify(timeMarginDependentFilePaths)};`,
    "        var needsTimeMarginBootstrap = !!selectedFiles && selectedFiles.some(function(filePath) {",
    "            return timeMarginDependentFiles.indexOf(filePath) !== -1;",
    "        }) && !selectedFiles.some(function(filePath) {",
    "            return timeMarginSetupFiles.indexOf(filePath) !== -1;",
    "        });",
    "        if (needsTimeMarginBootstrap) {",
    "            mocha.suite.beforeAll('Accounting for time differential between test suite and lrs', function(done) {",
    "                require(path.join(__dirname, '..', 'test', 'helper.js')).setTimeMargin(done);",
    "            });",
    "        }",
    "",
  ].join("\n");
  const selectedFilesBlock = [
    "        var selectedFiles = Array.isArray(options.file) && options.file.length > 0",
    "            ? options.file.map(function(filePath) {",
    "                return path.normalize(filePath).replace(/\\\\/g, '/');",
    "            })",
    "            : null;",
    "",
  ].join("\n");
  const fileFilterLine = "                return file.substr(-3) === '.js';";
  const fileFilterReplacement = [
    "                var relativeFilePath = path.join('test', dir, file).replace(/\\\\/g, '/');",
    "                return file.substr(-3) === '.js' && (!selectedFiles || selectedFiles.indexOf(relativeFilePath) !== -1);",
  ].join("\n");

  if (!patchedSource.includes("file: Joi.array().items(Joi.string().required())")) {
    const patched = patchedSource.replace(optionalValidatorLine, `${optionalValidatorLine}${fileValidatorLine}`);
    if (patched === patchedSource) {
      throw new Error("Unable to patch file validation support into upstream lrs-test source.");
    }
    patchedSource = patched;
  }

  if (!patchedSource.includes("file: _options.file")) {
    const patched = patchedSource.replace(optionalOptionsLine, `${optionalOptionsLine}${fileOptionsLine}`);
    if (patched === patchedSource) {
      throw new Error("Unable to patch file option support into upstream lrs-test source.");
    }
    patchedSource = patched;
  }

  if (!chaiThingsBootstrapVariants.some((variant) => patchedSource.includes(variant))) {
    const patched = patchedSource.replace(directoryLoopAnchor, `${chaiThingsBootstrapLine}${directoryLoopAnchor}`);
    if (patched === patchedSource) {
      throw new Error("Unable to patch chai-things bootstrap into upstream lrs-test source.");
    }
    patchedSource = patched;
  }

  if (!patchedSource.includes("var timeMarginDependentFiles = [")) {
    const patched = patchedSource.replace(directoryLoopAnchor, `${timeMarginBootstrapBlock}${directoryLoopAnchor}`);
    if (patched === patchedSource) {
      throw new Error("Unable to patch time margin bootstrap into upstream lrs-test source.");
    }
    patchedSource = patched;
  }

  if (!selectedFilesVariants.some((variant) => patchedSource.includes(variant))) {
    const patched = patchedSource.replace(directoryLoopAnchor, `${selectedFilesBlock}${directoryLoopAnchor}`);
    if (patched === patchedSource) {
      throw new Error("Unable to patch selected file filtering into upstream lrs-test source.");
    }
    patchedSource = patched;
  }

  if (!relativeFilePathVariants.some((variant) => patchedSource.includes(variant))) {
    const patched = patchedSource.replace(fileFilterLine, fileFilterReplacement);
    if (patched === patchedSource) {
      throw new Error("Unable to patch file filter support into upstream lrs-test source.");
    }
    patchedSource = patched;
  }

  return patchedSource;
}

function ensureUpstreamFileSelectionSupport(suiteDir: string): void {
  const lrsTestPath = resolve(suiteDir, "bin/lrs-test.js");
  const source = readFileSync(lrsTestPath, "utf8");
  const patchedSource = patchUpstreamLrsTestSource(source);

  writeFileSync(lrsTestPath, patchedSource, "utf8");
}

function resolveBunCandidateConsoleRunnerRelativePath(suiteDir: string): string {
  const packageJsonPath = resolve(suiteDir, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    bin?: Record<string, unknown> | string;
    main?: unknown;
  };

  if (typeof packageJson.bin === "string" && packageJson.bin.length > 0) {
    return packageJson.bin.replace(/^\.\//, "");
  }

  if (typeof packageJson.bin === "object" && packageJson.bin !== null) {
    const lrsTestBin = packageJson.bin["lrs-test"];
    if (typeof lrsTestBin === "string" && lrsTestBin.length > 0) {
      return lrsTestBin.replace(/^\.\//, "");
    }
  }

  if (typeof packageJson.main === "string" && packageJson.main.length > 0) {
    return packageJson.main.replace(/^\.\//, "");
  }

  return "bin/console_runner.ts";
}

function ensureUpstreamSuiteReady(suiteDir: string, missingMessage: string): string {
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

  const allowed = allowedArtifactRoots.some((rootPath) => isWithinPath(rootPath, absolutePath));
  if (!allowed) {
    throw new Error(
      `${kind} path ${absolutePath} is outside allowed artifact roots (${allowedArtifactRoots.join(", ")}). Set ALLOW_UNSAFE_OUTPUT_PATH=1 or pass --allow-unsafe-output-path to override.`,
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

  ensureUpstreamSuiteReady(cloneDir, `The cloned ADL conformance suite at ${cloneDir} is incomplete.`);
  ensureRunnerSelectionFlagSupport(cloneDir);
  ensureUpstreamFileSelectionSupport(cloneDir);
  ensureOwnerCaptureSupport(cloneDir);

  return {
    suiteDir: cloneDir,
  };
}

function prepareProvidedSuite(config: ExportUpstreamConfig): SuiteLocation {
  const suiteDir = config.suiteDir;
  if (!suiteDir) {
    throw new Error("Expected a local suite directory.");
  }

  const packageJsonPath = resolve(suiteDir, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error(`The local suite source at ${suiteDir} is incomplete. Expected ${packageJsonPath}.`);
  }

  const consoleRunnerPath = resolve(suiteDir, resolveBunCandidateConsoleRunnerRelativePath(suiteDir));
  if (!existsSync(consoleRunnerPath)) {
    throw new Error(`The local suite source at ${suiteDir} is incomplete. Expected ${consoleRunnerPath}.`);
  }

  return {
    suiteDir,
  };
}

function ensurePodmanAvailable(): void {
  ensureCommandAvailable(
    "podman",
    "podman is required to run the ADL conformance suite in its containerized execution paths.",
  );
}

function toPosixRelativePath(path: string): string {
  return path.replaceAll("\\", "/");
}

function shellEscape(value: string): string {
  return `'${value.replaceAll("'", `"'"'"`)}'`;
}

function buildUpstreamNodeSuiteBootstrapCommand(
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

function buildCandidateBunSuiteBootstrapCommand(
  upstreamArgs: string[],
  logDirInContainer: string,
  suiteSourceDirInContainer: string,
  consoleRunnerRelativePath: string,
): string {
  const shellQuotedUpstreamArgs = upstreamArgs.map(shellEscape).join(" ");
  const runtimePrefixDir = "/tmp/adl-suite-runtime";
  const runtimeSuiteDir = posix.resolve(runtimePrefixDir, "adl-lrs-conformance-tests");
  const runtimeSuiteNodeModulesDir = posix.resolve(runtimeSuiteDir, "node_modules");
  const runtimeSuiteLogsDir = posix.resolve(runtimeSuiteDir, "logs");
  const normalizedConsoleRunnerPath = consoleRunnerRelativePath.replaceAll("\\", "/").replace(/^\.\//, "");
  const runtimeConsoleRunnerPath = posix.resolve(runtimeSuiteDir, normalizedConsoleRunnerPath);
  const runtimeBunBinaryPath = "/usr/local/bin/bun";

  return [
    "set -eu",
    `suite_source_dir=${shellEscape(suiteSourceDirInContainer)}`,
    `artifact_dir=${shellEscape(logDirInContainer)}`,
    `runtime_prefix_dir=${shellEscape(runtimePrefixDir)}`,
    `runtime_suite_dir=${shellEscape(runtimeSuiteDir)}`,
    `runtime_suite_node_modules_dir=${shellEscape(runtimeSuiteNodeModulesDir)}`,
    `runtime_suite_logs_dir=${shellEscape(runtimeSuiteLogsDir)}`,
    `runtime_console_runner_path=${shellEscape(runtimeConsoleRunnerPath)}`,
    `runtime_bun_binary_path=${shellEscape(runtimeBunBinaryPath)}`,
    'if [ -z "$suite_source_dir" ] || [ "$suite_source_dir" = "/" ]; then',
    '  echo "[conformance] refusing unsafe suite source path: $suite_source_dir"',
    "  exit 1",
    "fi",
    `if [ ! -f "$suite_source_dir/${normalizedConsoleRunnerPath}" ] || [ ! -f "$suite_source_dir/package.json" ]; then`,
    '  echo "[conformance] candidate suite is missing expected files in $suite_source_dir"',
    "  exit 1",
    "fi",
    'rm -rf "$runtime_prefix_dir"',
    'mkdir -p "$runtime_suite_dir"',
    'mkdir -p "$artifact_dir"',
    'for entry in "$suite_source_dir"/* "$suite_source_dir"/.[!.]* "$suite_source_dir"/..?*; do',
    '  [ -e "$entry" ] || continue',
    '  entry_name=$(basename "$entry")',
    '  if [ "$entry_name" = "node_modules" ] || [ "$entry_name" = "logs" ]; then',
    "    continue",
    "  fi",
    '  cp -LR "$entry" "$runtime_suite_dir"/',
    "done",
    'rm -rf "$runtime_suite_logs_dir"',
    'ln -s "$artifact_dir" "$runtime_suite_logs_dir"',
    'cd "$runtime_suite_dir"',
    'rm -f "$runtime_suite_dir/package-lock.json" "$runtime_suite_dir/bun.lock" "$runtime_suite_dir/bun.lockb"',
    'if [ ! -x "$runtime_bun_binary_path" ]; then',
    '  echo "[conformance] missing Bun binary at $runtime_bun_binary_path"',
    "  exit 1",
    "fi",
    'if [ ! -f "$runtime_suite_node_modules_dir/pretty-error/package.json" ]; then',
    '  echo "[conformance] hydrating ADL suite runtime dependencies"',
    '  "$runtime_bun_binary_path" install --production --no-save',
    "fi",
    'export NODE_PATH="$runtime_suite_node_modules_dir${NODE_PATH:+:$NODE_PATH}"',
    "set +e",
    `"$runtime_bun_binary_path" "$runtime_console_runner_path"${shellQuotedUpstreamArgs.length > 0 ? ` ${shellQuotedUpstreamArgs}` : ""}`,
    "status=$?",
    'latest_log=$(ls -1t "$artifact_dir"/*.log 2>/dev/null | head -n 1 || true)',
    'if [ -n "$latest_log" ]; then',
    '  echo "[conformance] latest run log available at $latest_log"',
    "fi",
    'exit "$status"',
  ].join("\n");
}

function buildConsoleRunnerArgs(config: ExportUpstreamConfig): {
  captureUnit: ReturnType<typeof getMigrationLedgerUnitByUnitKey>;
  consoleRunnerArgs: string[];
  unitSelection: UpstreamUnitSelection | null;
} {
  const unitSelection = config.unitKeys ? resolveUpstreamUnitSelection(config.unitKeys, config.version) : null;
  const requestedCaptureUnitKey = config.unitKeys?.length === 1 ? (config.unitKeys[0] ?? undefined) : undefined;
  const captureUnit = requestedCaptureUnitKey ? getMigrationLedgerUnitByUnitKey(requestedCaptureUnitKey) : undefined;

  const consoleRunnerArgs = [
    "--endpoint",
    config.baseUrl,
    "--authUser",
    config.username,
    "--authPassword",
    config.password,
    "--basicAuth",
  ];

  if (!config.directory && !unitSelection) {
    consoleRunnerArgs.push("--xapiVersion", config.version);
  }

  if (unitSelection) {
    consoleRunnerArgs.push("--directory", unitSelection.directory);
    consoleRunnerArgs.push("--file", unitSelection.filePaths.join(","));
    if (unitSelection.optionalDirectories.length > 0) {
      consoleRunnerArgs.push("--optional", unitSelection.optionalDirectories.join(","));
    }
  }

  if (config.grep && !unitSelection) {
    consoleRunnerArgs.push("--grep", config.grep);
  }

  if (config.directory && !unitSelection) {
    consoleRunnerArgs.push("--directory", config.directory);
  }

  if (config.optional && !unitSelection) {
    consoleRunnerArgs.push("--optional", config.optional);
  }

  return {
    captureUnit,
    consoleRunnerArgs,
    unitSelection,
  };
}

function createBasePodmanArgs(
  config: ExportUpstreamConfig,
  suiteLocation: SuiteLocation,
  captureUnit: ReturnType<typeof getMigrationLedgerUnitByUnitKey>,
): string[] {
  const mountSuffix = process.platform === "linux" ? ":Z" : "";
  const podmanArgs = ["run", "--rm", "--network", "host"];

  if (process.platform === "linux") {
    podmanArgs.push("--userns", "keep-id");
  }

  podmanArgs.push("--volume", `${suiteLocation.suiteDir}:${suiteMountTarget}${mountSuffix}`);
  podmanArgs.push("--volume", `${repoRoot}:${repoMountTarget}${mountSuffix}`);
  podmanArgs.push("--workdir", suiteMountTarget, "--env", "HOME=/tmp");

  if (captureUnit) {
    const suiteSourcePrefix = config.suiteDir ? toPosixRelativePath(relative(repoRoot, suiteLocation.suiteDir)) : "";
    const captureSourcePath =
      suiteSourcePrefix.length > 0
        ? `${suiteSourcePrefix}/${captureUnit.upstreamFilePath}`
        : captureUnit.upstreamFilePath;

    podmanArgs.push(
      "--env",
      `LRS_CAPTURE_DIRECTORY=${captureUnit.directory}`,
      "--env",
      `LRS_CAPTURE_SOURCE_FILE_PATH=${captureSourcePath}`,
      "--env",
      `LRS_CAPTURE_UNIT_KEY=${captureUnit.unitKey}`,
      "--env",
      `LRS_CAPTURE_VERSION=${config.version}`,
    );
  }

  if (config.suiteDir) {
    podmanArgs.push("--env", `LRS_BUN_CONSOLE_RUNNER_MODE=${config.providedSuiteRunnerMode}`);
  }

  if (process.platform !== "linux" && typeof process.getuid === "function" && typeof process.getgid === "function") {
    podmanArgs.push("--user", `${process.getuid()}:${process.getgid()}`);
  }

  return podmanArgs;
}

function runUpstreamNodeConsoleRunnerInContainer(config: ExportUpstreamConfig, suiteLocation: SuiteLocation): number {
  ensurePodmanAvailable();

  const { captureUnit, consoleRunnerArgs } = buildConsoleRunnerArgs(config);

  mkdirSync(config.logDir, { recursive: true });

  const logDirInContainer = posix.resolve(repoMountTarget, toPosixRelativePath(relative(repoRoot, config.logDir)));
  const suiteBootstrapCommand = buildUpstreamNodeSuiteBootstrapCommand(
    consoleRunnerArgs,
    logDirInContainer,
    suiteMountTarget,
  );
  const podmanArgs = createBasePodmanArgs(config, suiteLocation, captureUnit);
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

function runCandidateBunConsoleRunnerInContainer(config: ExportUpstreamConfig, suiteLocation: SuiteLocation): number {
  ensurePodmanAvailable();

  const { captureUnit, consoleRunnerArgs } = buildConsoleRunnerArgs(config);
  const hostBunBinaryPath = process.execPath;
  const consoleRunnerRelativePath = resolveBunCandidateConsoleRunnerRelativePath(suiteLocation.suiteDir);

  if (!existsSync(hostBunBinaryPath)) {
    throw new Error(`Unable to find the host Bun binary for the candidate bun-ts lane: ${hostBunBinaryPath}`);
  }

  mkdirSync(config.logDir, { recursive: true });

  const logDirInContainer = posix.resolve(repoMountTarget, toPosixRelativePath(relative(repoRoot, config.logDir)));
  const suiteBootstrapCommand = buildCandidateBunSuiteBootstrapCommand(
    consoleRunnerArgs,
    logDirInContainer,
    suiteMountTarget,
    consoleRunnerRelativePath,
  );
  const podmanArgs = createBasePodmanArgs(config, suiteLocation, captureUnit);
  const mountSuffix = process.platform === "linux" ? ":Z" : "";
  podmanArgs.push("--volume", `${hostBunBinaryPath}:/usr/local/bin/bun${mountSuffix}`);
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

function runConsoleRunnerInContainer(config: ExportUpstreamConfig, suiteLocation: SuiteLocation): number {
  if (config.suiteDir) {
    return runCandidateBunConsoleRunnerInContainer(config, suiteLocation);
  }

  return runUpstreamNodeConsoleRunnerInContainer(config, suiteLocation);
}

export function buildExportRunMetadata(options: {
  config: Pick<ExportUpstreamConfig, "providedSuiteRunnerMode" | "suiteDir" | "unitKeys">;
  latestLogPath: string;
  exitCode: number;
  unitSelection: UpstreamUnitSelection | null;
}): ExportRunMetadata {
  return {
    mode: options.config.suiteDir ? "candidate" : "upstream-oracle",
    providedSuiteRunnerMode: options.config.suiteDir ? options.config.providedSuiteRunnerMode : null,
    providedSuiteRuntimeMode: options.config.suiteDir ? "bun-ts" : null,
    selectedFiles: options.unitSelection?.filePaths ?? null,
    selectedUnitKeys: options.config.unitKeys ?? null,
    sourceSuiteDir: options.config.suiteDir ?? null,
    sourceLogPath: options.latestLogPath,
    suiteExitCode: options.exitCode,
    upstreamExitCode: options.exitCode,
  };
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
  if (!config.suiteDir) {
    ensureCommandAvailable("git", "git is required to clone the upstream conformance suite.");
  }

  const safeLogDir = resolveSafeArtifactPath(config.logDir, "Log directory", config.allowUnsafeOutputPath);
  const safeOutputPath = resolveSafeArtifactPath(config.outputPath, "Output", config.allowUnsafeOutputPath);
  config.logDir = safeLogDir;
  config.outputPath = safeOutputPath;

  const suiteLocation = config.suiteDir ? prepareProvidedSuite(config) : cloneUpstreamSuite(config);
  const existingFiles = new Set(await listLogFiles(config.logDir));

  let exitCode = 1;
  try {
    exitCode = runConsoleRunnerInContainer(config, suiteLocation);
  } finally {
    if (config.suiteDir) {
      // keep the active candidate tree in place
    } else if (config.keepClone) {
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
  const unitSelection = config.unitKeys ? resolveUpstreamUnitSelection(config.unitKeys, config.version) : null;
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
  const exportMetadata = buildExportRunMetadata({
    config,
    latestLogPath,
    exitCode,
    unitSelection,
  });
  const outputPayload = {
    ...parsed,
    ...exportMetadata,
  };
  await mkdir(dirname(absoluteOutputPath), { recursive: true });
  await writeFile(absoluteOutputPath, `${JSON.stringify(outputPayload, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath: absoluteOutputPath,
        ...exportMetadata,
        summary: parsed.summary ?? null,
      },
      null,
      2,
    ),
  );

  return 0;
}

if (import.meta.main) {
  try {
    process.exitCode = await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}
