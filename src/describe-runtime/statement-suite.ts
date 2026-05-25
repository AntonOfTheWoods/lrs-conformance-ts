import { expect } from "bun:test";

import {
  loadLegacyConfigFile,
  resolveLegacyCaseRequestBody,
  type LegacyConfigCase,
  type LegacyConfigGroup,
} from "./legacy-config";
import { postLegacyStatement, type LegacyStatementPostRuntimeOptions } from "./http";
import { defineLegacyConfigSuites } from "./register";
import type { LegacyVersionFolder } from "./upstream";

export interface LegacyStatementConfigSuiteOptions extends LegacyStatementPostRuntimeOptions {
  fileName: string;
  groupFilter?: (group: LegacyConfigGroup) => boolean;
  caseFilter?: (testCase: LegacyConfigCase, group: LegacyConfigGroup) => boolean;
}

function filterGroups(groups: LegacyConfigGroup[], options: LegacyStatementConfigSuiteOptions): LegacyConfigGroup[] {
  return groups
    .filter((group) => (options.groupFilter ? options.groupFilter(group) : true))
    .map((group) => ({
      ...group,
      config: group.config.filter((testCase) => (options.caseFilter ? options.caseFilter(testCase, group) : true)),
    }))
    .filter((group) => group.config.length > 0);
}

export function registerLegacyStatementConfigSuite(options: LegacyStatementConfigSuiteOptions): void {
  const groups = filterGroups(loadLegacyConfigFile(options.version, options.fileName), options);

  defineLegacyConfigSuites(groups, async ({ testCase }) => {
    const requestBody = resolveLegacyCaseRequestBody(options.version, testCase);
    const expectedStatus = testCase.expect?.[0];

    if (typeof expectedStatus !== "number") {
      throw new Error(`Legacy case is missing numeric expect[0] status: ${testCase.name}`);
    }

    const result = await postLegacyStatement(options, requestBody);
    expect(result.response.status).toBe(expectedStatus);
  });
}

export function loadLegacyStatementConfigGroups(version: LegacyVersionFolder, fileName: string): LegacyConfigGroup[] {
  return loadLegacyConfigFile(version, fileName);
}
