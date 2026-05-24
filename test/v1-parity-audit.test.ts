import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { RegistryNode } from "../src/domain/contracts";
import { buildOriginalSuiteDeltaMatrix } from "../src/specs/migration/v1-v2-delta";
import { createV103ProofSliceRegistry } from "../src/specs/v1_0_3/proof-slice";

const upstreamV103Root = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v1_0_3";

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

    expect(proofIds).toEqual([
      "XAPI-00236",
      "XAPI-00237",
      "XAPI-00238",
      "XAPI-00239",
      "XAPI-00240",
      "XAPI-00241",
      "XAPI-00242",
      "XAPI-00243",
      "XAPI-00244",
      "XAPI-00245",
      "XAPI-00246",
      "XAPI-00247",
      "XAPI-00248",
      "XAPI-00249",
      "XAPI-00250",
      "XAPI-00251",
      "XAPI-00252",
      "XAPI-00253",
      "XAPI-00254",
      "XAPI-00255",
      "XAPI-00258",
      "XAPI-00259",
      "XAPI-00260",
      "XAPI-00261",
      "XAPI-00262",
      "XAPI-00265",
      "XAPI-00268",
      "XAPI-00269",
      "XAPI-00270",
      "XAPI-00271",
      "XAPI-00272",
      "XAPI-00273",
      "XAPI-00274",
      "XAPI-00275",
      "XAPI-00278",
      "XAPI-00279",
      "XAPI-00282",
      "XAPI-00283",
      "XAPI-00284",
      "XAPI-00285",
      "XAPI-00286",
      "XAPI-00287",
      "XAPI-00288",
      "XAPI-00289",
      "XAPI-00290",
      "XAPI-00291",
      "XAPI-00292",
      "XAPI-00293",
      "XAPI-00294",
      "XAPI-00295",
      "XAPI-00297",
      "XAPI-00300",
      "XAPI-00303",
      "XAPI-00308",
      "XAPI-00311",
      "XAPI-00312",
      "XAPI-00313",
      "XAPI-00314",
      "XAPI-00315",
      "XAPI-00316",
      "XAPI-00317",
      "XAPI-00318",
      "XAPI-00319",
      "XAPI-00321",
    ]);
    expect(proofIds.every((id) => upstreamIds.has(id))).toBeTrue();
  });
});
