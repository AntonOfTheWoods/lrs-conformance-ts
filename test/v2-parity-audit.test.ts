import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { RegistryNode } from "../src/domain/contracts";
import { createProofSliceRegistry } from "../src/specs/v2_0/proof-slice";

const upstreamV20Root = "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0";

const auditedMissingV20RequirementIds = {
  "XAPI-00021": "Multiplicity-folder-only note in the upstream ID Requirements suite; not executed from test/v2_0.",
  "XAPI-00041":
    "Config-backed Account Object acceptance in ifis.js; current proof covers account behavior but does not yet attach this legacy id directly.",
  "XAPI-00063":
    "Stale suite comment pointing to activities.js; no concrete XAPI-00063 config definition exists in upstream test/v2_0.",
  "XAPI-00095": "Removed per the 2017 spec-call note in Context Requirements.",
  "XAPI-00112": "Explicit duplicate of XAPI-00149 in Retrieval of Statements.",
  "XAPI-00118":
    "Config-backed extension-key IRI requirement in extensions.js; behavior is exercised, but this legacy id is not yet attached directly.",
  "XAPI-00121":
    "Config-backed language-map RFC 5646 requirement in languages.js; language-tag behavior is exercised, but this legacy id is not yet attached directly.",
  "XAPI-00136": "Marked as nonexistent in the upstream Content Types suite.",
  "XAPI-00137": "Marked as removed in the upstream Content Types suite.",
  "XAPI-00138": "Marked as removed in the upstream Content Types suite.",
  "XAPI-00140": "Marked in the upstream Statement Resource suite as a generic requirement covered by other files.",
  "XAPI-00141": "Marked in the upstream Statement Resource suite as covered by XAPI-00195, XAPI-00275, and XAPI-00294.",
  "XAPI-00148": "Owned by Alternate Request Syntax, which is an audited no-op for xAPI 2.0 in this rewrite.",
  "XAPI-00152": "Marked as removed per the 2017 spec-call note in Statement Resource.",
  "XAPI-00185": "Marked as untestable in the upstream Document Resources suite.",
  "XAPI-00186": "Marked as untestable in the upstream Document Resources suite.",
  "XAPI-00205":
    "Comment-only State Resource note: DELETE does not define a since parameter; no executable legacy leaf exists.",
  "XAPI-00222": "Explicit duplicate of XAPI-00195 in the upstream State Resource suite.",
  "XAPI-00223":
    "Comment-only State Resource note: DELETE does not define a since parameter; no executable legacy leaf exists.",
  "XAPI-00304":
    "Comment-only Activity Profile note about the invalid agent parameter; no executable legacy leaf exists in test/v2_0.",
  "XAPI-00320": "Marked as a bad upstream test because the extension property is optional in the spec.",
  "XAPI-00323": "Audited as a non-executable Error Codes reference rather than a direct proof target.",
  "XAPI-00327": "Audited as a non-executable Error Codes reference rather than a direct proof target.",
  "XAPI-00328": "Held-out size-limit Error Codes requirement; audited but not modeled by the current proof slice.",
  "XAPI-00329": "Audited as a non-executable Error Codes reference rather than a direct proof target.",
} as const;

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

  for (const filePath of collectFiles(upstreamV20Root)) {
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
  const registry = createProofSliceRegistry();

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

  for (const suite of registry.versions["2.0.0"]) {
    walk(suite);
  }

  return [...ids].sort();
}

describe("xAPI 2.0 parity audit", () => {
  test("pins the remaining upstream-original v2.0 requirement ids not yet directly referenced by the proof slice", () => {
    const upstreamIds = new Set(collectUpstreamRequirementIds());
    const proofIds = new Set(collectProofRequirementIds());
    const missingIds = [...upstreamIds].filter((id) => !proofIds.has(id)).sort();

    expect(missingIds).toEqual(Object.keys(auditedMissingV20RequirementIds).sort());
  });
});
