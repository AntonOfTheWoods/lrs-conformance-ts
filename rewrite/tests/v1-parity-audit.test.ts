import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { RegistryNode } from "../../src/domain/contracts";
import { buildOriginalSuiteDeltaMatrix } from "../../src/specs/migration/v1-v2-delta";
import { resolveUpstreamTestRoot } from "../../src/specs/migration/upstream-root";
import { createV103ProofSliceRegistry } from "../../src/specs/v1_0_3/proof-slice";

const upstreamV103Root = resolveUpstreamTestRoot("v1_0_3");

function collectFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(root, entry.name);
    return entry.isDirectory() ? collectFiles(filePath) : [filePath];
  });
}

function extractRequirementIds(text: string): string[] {
  return text.match(/XAPI-\d{5}/g) ?? [];
}

function collectUpstreamRequirementIds(): string[] {
  const ids = new Set<string>();

  for (const filePath of collectFiles(upstreamV103Root)) {
    if (!filePath.endsWith(".js")) {
      continue;
    }

    for (const id of extractRequirementIds(readFileSync(filePath, "utf8"))) {
      ids.add(id);
    }
  }

  return [...ids].sort();
}

function collectProofRequirementIds(): string[] {
  const ids = new Set<string>();
  const registry = createV103ProofSliceRegistry();

  const walk = (node: RegistryNode) => {
    if (node.type === "case") {
      for (const requirement of node.requirementRefs) {
        if (/^XAPI-\d{5}$/.test(requirement.id)) {
          ids.add(requirement.id);
        }
      }
      return;
    }

    for (const child of node.children) {
      walk(child);
    }
  };

  for (const suite of registry.versions["1.0.3"]) {
    walk(suite);
  }

  return [...ids].sort();
}

describe("xAPI 1.0.3 parity audit baseline", () => {
  test("pins upstream-original 1.0.3 requirement inventory and known v1-v2 delta ids", () => {
    const upstreamIds = collectUpstreamRequirementIds();
    const matrix = buildOriginalSuiteDeltaMatrix();

    expect(upstreamIds.length).toBe(336);
    expect(matrix.requirementIds.v103UniqueCount).toBe(336);
    expect(matrix.requirementIds.v20UniqueCount).toBe(335);
    expect(matrix.requirementIds.intersectionCount).toBe(335);
    expect(matrix.requirementIds.v103Only).toEqual(["XAPI-00336"]);
    expect(matrix.requirementIds.v20Only).toEqual([]);
  });

  test("pins the initial migrated 1.0.3 proof set and requires subset-safe growth", () => {
    const upstreamIds = new Set(collectUpstreamRequirementIds());
    const proofIds = collectProofRequirementIds();

    expect(proofIds.length).toBe(314);
    expect(proofIds).toContain("XAPI-00001");
    expect(proofIds).toContain("XAPI-00169");
    expect(proofIds).toContain("XAPI-00335");
    expect(proofIds).not.toContain("XAPI-00336");

    const extractedAuditOnlyIds = [
      "XAPI-00021",
      "XAPI-00063",
      "XAPI-00095",
      "XAPI-00112",
      "XAPI-00136",
      "XAPI-00137",
      "XAPI-00138",
      "XAPI-00140",
      "XAPI-00141",
      "XAPI-00148",
      "XAPI-00152",
      "XAPI-00185",
      "XAPI-00186",
      "XAPI-00205",
      "XAPI-00222",
      "XAPI-00223",
      "XAPI-00320",
      "XAPI-00323",
      "XAPI-00327",
      "XAPI-00328",
      "XAPI-00329",
      "XAPI-00336",
    ];

    for (const id of extractedAuditOnlyIds) {
      expect(proofIds).not.toContain(id);
    }
    expect(proofIds.every((id) => upstreamIds.has(id))).toBeTrue();
  });
});
