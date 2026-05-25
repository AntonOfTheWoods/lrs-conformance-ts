import { describe, test } from "bun:test";

import type { LegacyConfigCase, LegacyConfigGroup } from "./legacy-config";

const it = test;

export interface LegacyRegisteredCaseContext {
  group: LegacyConfigGroup;
  testCase: LegacyConfigCase;
}

export function defineLegacyConfigSuites(
  groups: LegacyConfigGroup[],
  runCase: (context: LegacyRegisteredCaseContext) => void | Promise<void>,
): void {
  for (const group of groups) {
    describe(group.name, () => {
      for (const testCase of group.config) {
        it(testCase.name, async () => {
          await runCase({ group, testCase });
        });
      }
    });
  }
}
