import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  parseCandidateRuntimeMode,
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
