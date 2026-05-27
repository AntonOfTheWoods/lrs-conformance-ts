import { expect, test } from "bun:test";

import { resolveUpstreamUnitSelection } from "../scripts/export-upstream-run.ts";

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
