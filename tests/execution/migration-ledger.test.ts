import { describe, expect, test } from "bun:test";

import {
  getMigrationLedgerUnitsForDirectory,
  migrationLedger,
  recordObservedMigrationUnitTitle,
  resolveMigrationUnitBinding,
} from "../../shared/execution/migration-ledger.ts";

describe("migration ledger", () => {
  test("keeps the v1 unit order stable for runtime-active registration", () => {
    const units = getMigrationLedgerUnitsForDirectory("v1_0_3");

    expect(migrationLedger.schemaVersion).toBe("migration-ledger.v1");
    expect(migrationLedger.defaultMode).toBe("legacy-oracle");
    expect(units).toHaveLength(32);
    expect(units.slice(0, 5).map((unit) => unit.unitKey)).toEqual([
      "test/v1_0_3/Data2.2-FormattingRequirements",
      "test/v1_0_3/Data2.3-StatementLifecycle",
      "test/v1_0_3/Data2.4.1-IDProperty",
      "test/v1_0_3/Data2.4.2-ActorProperty",
      "test/v1_0_3/Data2.4.3-VerbProperty",
    ]);
    expect(units.at(-1)?.unitKey).toBe("test/v1_0_3/H.Communication4.0-Authentication");
  });

  test("resolves observed top-level suite titles to stable capture bindings", () => {
    const formattingUnit = getMigrationLedgerUnitsForDirectory("v1_0_3")[0];
    if (!formattingUnit) {
      throw new Error("Expected the formatting unit to be present in the migration ledger.");
    }

    recordObservedMigrationUnitTitle("v1_0_3", "Formatting Requirements (Data 2.2)", formattingUnit);

    expect(resolveMigrationUnitBinding("v1_0_3", ["Formatting Requirements (Data 2.2)"])).toEqual({
      sourceFilePath: "runtime/test/v1_0_3/Data2.2-FormattingRequirements.ts",
      sourceSymbol: "registerFormattingRequirementsV103",
      unitKey: "test/v1_0_3/Data2.2-FormattingRequirements",
    });
  });

  test("falls back to a deterministic unmapped key before a suite title is observed", () => {
    expect(resolveMigrationUnitBinding("v2_0", ["Unknown Suite"])).toEqual({
      sourceFilePath: null,
      sourceSymbol: null,
      unitKey: "v2_0:Unknown Suite",
    });
  });
});
