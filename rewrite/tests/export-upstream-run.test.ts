import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  parseCandidateBunRunnerMode,
  parseCandidateRuntimeMode,
  patchUpstreamLrsTestSource,
  readCandidateRuntimeModeFromSuiteDir,
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

test("parseCandidateRuntimeMode accepts supported runtime modes", () => {
  expect(parseCandidateRuntimeMode("legacy-node")).toBe("legacy-node");
  expect(parseCandidateRuntimeMode("bun-ts")).toBe("bun-ts");
  expect(parseCandidateRuntimeMode(undefined)).toBeUndefined();
});

test("parseCandidateRuntimeMode rejects unsupported runtime modes", () => {
  expect(() => parseCandidateRuntimeMode("unknown-mode")).toThrow(
    "Unsupported --candidate-runtime-mode value: unknown-mode",
  );
});

test("parseCandidateBunRunnerMode accepts supported bun runner modes", () => {
  expect(parseCandidateBunRunnerMode("legacy-forward")).toBe("legacy-forward");
  expect(parseCandidateBunRunnerMode("native")).toBe("native");
  expect(parseCandidateBunRunnerMode(undefined)).toBeUndefined();
});

test("parseCandidateBunRunnerMode rejects unsupported bun runner modes", () => {
  expect(() => parseCandidateBunRunnerMode("unknown-mode")).toThrow(
    "Unsupported --candidate-bun-runner-mode value: unknown-mode",
  );
});

test("readCandidateRuntimeModeFromSuiteDir defaults to legacy-node when package metadata is absent", async () => {
  const suiteDir = await mkdtemp(join(tmpdir(), "export-upstream-run-suite-"));

  try {
    await writeFile(
      join(suiteDir, "package.json"),
      `${JSON.stringify({ name: "candidate-suite" }, null, 2)}\n`,
      "utf8",
    );

    expect(readCandidateRuntimeModeFromSuiteDir(suiteDir)).toBe("legacy-node");
  } finally {
    await rm(suiteDir, { force: true, recursive: true });
  }
});

test("readCandidateRuntimeModeFromSuiteDir reads explicit runtime mode metadata", async () => {
  const suiteDir = await mkdtemp(join(tmpdir(), "export-upstream-run-suite-"));

  try {
    await writeFile(
      join(suiteDir, "package.json"),
      `${JSON.stringify({ lrsConformanceRuntimeMode: "bun-ts", name: "candidate-suite" }, null, 2)}\n`,
      "utf8",
    );

    expect(readCandidateRuntimeModeFromSuiteDir(suiteDir)).toBe("bun-ts");
  } finally {
    await rm(suiteDir, { force: true, recursive: true });
  }
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
