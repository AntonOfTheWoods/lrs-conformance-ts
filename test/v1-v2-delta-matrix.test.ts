import { describe, expect, test } from "bun:test";

import { buildOriginalSuiteDeltaMatrix } from "../src/specs/migration/v1-v2-delta";

describe("v1.0.3 vs v2.0 original-suite delta matrix", () => {
  test("pins the known high-overlap inventory and requirement-id intersection", () => {
    const matrix = buildOriginalSuiteDeltaMatrix();

    expect({
      v103TopLevelSpecs: matrix.v103.topLevelSpecFiles.length,
      v20TopLevelSpecs: matrix.v20.topLevelSpecFiles.length,
      v103ConfigFiles: matrix.v103.configFiles.length,
      v20ConfigFiles: matrix.v20.configFiles.length,
      v103TemplateFiles: matrix.v103.templateFiles.length,
      v20TemplateFiles: matrix.v20.templateFiles.length,
      sharedConfigBasenames: matrix.overlap.sharedConfigBasenames.length,
      sharedTemplateRelativePaths: matrix.overlap.sharedTemplateRelativePaths.length,
      v103RequirementIds: matrix.requirementIds.v103UniqueCount,
      v20RequirementIds: matrix.requirementIds.v20UniqueCount,
      requirementIntersection: matrix.requirementIds.intersectionCount,
    }).toEqual({
      v103TopLevelSpecs: 33,
      v20TopLevelSpecs: 34,
      v103ConfigFiles: 26,
      v20ConfigFiles: 28,
      v103TemplateFiles: 124,
      v20TemplateFiles: 126,
      sharedConfigBasenames: 26,
      sharedTemplateRelativePaths: 124,
      v103RequirementIds: 336,
      v20RequirementIds: 335,
      requirementIntersection: 335,
    });
  });

  test("pins known version-only config/template deltas", () => {
    const matrix = buildOriginalSuiteDeltaMatrix();

    expect(matrix.overlap.v103OnlyConfigBasenames).toEqual([]);
    expect(matrix.overlap.v20OnlyConfigBasenames).toEqual(["contextagents", "contextgroups"]);

    expect(matrix.overlap.v103OnlyTemplateRelativePaths).toEqual([]);
    expect(matrix.overlap.v20OnlyTemplateRelativePaths).toEqual([
      "contexts/context_agents.json",
      "contexts/context_groups.json",
    ]);
  });

  test("pins file-level similarity across shared config/template pairs", () => {
    const matrix = buildOriginalSuiteDeltaMatrix();

    expect(matrix.similarity).toEqual({
      configPairs: {
        candidatePairs: 26,
        exactIdenticalPairs: 22,
        normalizedIdenticalPairs: 23,
      },
      templatePairs: {
        candidatePairs: 124,
        exactIdenticalPairs: 124,
        normalizedIdenticalPairs: 124,
      },
      totalPairs: {
        candidatePairs: 150,
        exactIdenticalPairs: 146,
        normalizedIdenticalPairs: 147,
      },
    });

    expect(matrix.requirementIds.v103Only).toEqual(["XAPI-00336"]);
    expect(matrix.requirementIds.v20Only).toEqual([]);
  });
});
