import { expect, test } from "bun:test";

import {
  buildExportRunMetadata,
  parseProvidedSuiteRunnerMode,
  patchUpstreamLrsTestSource,
  resolveUpstreamUnitSelection,
} from "../scripts/export-upstream-run.ts";

test("resolveUpstreamUnitSelection maps core units to a versioned upstream file selection", () => {
  expect(resolveUpstreamUnitSelection(["test/v1_0_3/Data2.2-FormattingRequirements"], "1.0.3")).toEqual({
    directory: "v1_0_3",
    filePaths: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
    optionalDirectories: [],
  });
});

test("resolveUpstreamUnitSelection retains optional directories for optional-suite units", () => {
  expect(resolveUpstreamUnitSelection(["test/Multiplicity/testing"], "2.0.0")).toEqual({
    directory: "v2_0",
    filePaths: ["test/Multiplicity/testing.js"],
    optionalDirectories: ["Multiplicity"],
  });
});

test("resolveUpstreamUnitSelection rejects mismatched versioned units", () => {
  expect(() => resolveUpstreamUnitSelection(["test/v1_0_3/Data2.2-FormattingRequirements"], "2.0.0")).toThrow(
    "Unit key test/v1_0_3/Data2.2-FormattingRequirements does not belong to xAPI version 2.0.0.",
  );
});

test("parseProvidedSuiteRunnerMode accepts supported bun runner modes", () => {
  expect(parseProvidedSuiteRunnerMode("native")).toBe("native");
  expect(parseProvidedSuiteRunnerMode(undefined)).toBeUndefined();
});

test("parseProvidedSuiteRunnerMode rejects unsupported bun runner modes", () => {
  expect(() => parseProvidedSuiteRunnerMode("unknown-mode")).toThrow(
    "Unsupported --provided-suite-runner-mode value: unknown-mode",
  );
});

test("patchUpstreamLrsTestSource injects chai-things bootstrap and file filtering support", () => {
  const source = [
    "        var optionsValidator = Joi.object({",
    "            optional: Joi.array().items(Joi.string().required()),",
    "        }).unknown(false);",
    "        var options = {",
    "            optional: _options.optional,",
    "        };",
    "        options.directory.forEach(function(dir) {",
    "            fs.readdirSync(testDirectory).filter(function(file) {",
    "                return file.substr(-3) === '.js';",
    "            }).forEach(function(file) {",
    "            });",
    "        });",
  ].join("\n");

  const patched = patchUpstreamLrsTestSource(source);

  expect(patched).toContain("file: Joi.array().items(Joi.string().required())");
  expect(patched).toContain("file: _options.file");
  expect(patched).toContain("require('chai').use(require('chai-things'));");
  expect(patched).toContain("var selectedFiles = Array.isArray(options.file) && options.file.length > 0");
  expect(patched).toContain("var timeMarginDependentFiles = [");
  expect(patched).toContain("mocha.suite.beforeAll('Accounting for time differential between test suite and lrs'");
  expect(patched).toContain("relativeFilePath = path.join('test', dir, file)");
  expect(patchUpstreamLrsTestSource(patched)).toBe(patched);
});

test("buildExportRunMetadata uses providedSuite keys for local Bun runtimes", () => {
  expect(
    buildExportRunMetadata({
      config: {
        providedSuiteRunnerMode: "native",
        suiteDir: "/tmp/runtime",
        unitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements"],
      },
      exitCode: 0,
      latestLogPath: "/tmp/runtime/logs/run.log",
      unitSelection: {
        directory: "v1_0_3",
        filePaths: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
        optionalDirectories: [],
      },
    }),
  ).toEqual({
    mode: "runtime",
    providedSuiteRunnerMode: "native",
    providedSuiteRuntimeMode: "bun-ts",
    selectedFiles: ["test/v1_0_3/Data2.2-FormattingRequirements.js"],
    selectedUnitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements"],
    sourceSuiteDir: "/tmp/runtime",
    sourceLogPath: "/tmp/runtime/logs/run.log",
    suiteExitCode: 0,
    upstreamExitCode: 0,
  });
});

test("buildExportRunMetadata nulls providedSuite keys for legacy-oracle runs", () => {
  expect(
    buildExportRunMetadata({
      config: {
        providedSuiteRunnerMode: "native",
        suiteDir: undefined,
        unitKeys: undefined,
      },
      exitCode: 1,
      latestLogPath: "/tmp/upstream/logs/run.log",
      unitSelection: null,
    }),
  ).toEqual({
    mode: "legacy-oracle",
    providedSuiteRunnerMode: null,
    providedSuiteRuntimeMode: null,
    selectedFiles: null,
    selectedUnitKeys: null,
    sourceSuiteDir: null,
    sourceLogPath: "/tmp/upstream/logs/run.log",
    suiteExitCode: 1,
    upstreamExitCode: 1,
  });
});
