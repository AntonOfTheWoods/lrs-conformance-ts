import { describe, expect, test } from "bun:test";

import type { RegistryNode } from "../src/domain/contracts";
import { LEGACY_XAPI_COMMENT_MAP } from "../src/registry/legacyCommentMap";
import { createProofSliceRegistry as createV20Registry } from "../src/specs/v2_0/proof-slice";
import { createV103ProofSliceRegistry as createV103Registry } from "../src/specs/v1_0_3/proof-slice";

function collectCases(node: RegistryNode): Array<Extract<RegistryNode, { type: "case" }>> {
  if (node.type === "case") {
    return [node];
  }

  return node.children.flatMap((child) => collectCases(child));
}

function collectAllCases(registry: ReturnType<typeof createV20Registry | typeof createV103Registry>) {
  return [...registry.versions["2.0.0"], ...registry.versions["1.0.3"]].flatMap((suite) => collectCases(suite));
}

describe("Comment Parity", () => {
  test("all cases include generated spec reference notes", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    for (const testCase of cases) {
      const specNotes = testCase.assertion.notes.filter((note) => note.startsWith("spec-ref "));
      expect(specNotes.length).toBeGreaterThanOrEqual(1);
      expect(specNotes.length).toBeGreaterThanOrEqual(testCase.requirementRefs.length);
    }
  });

  test("state acceptance and stateId rationale notes are preserved", () => {
    const v20 = createV20Registry();
    const v20Cases = collectAllCases(v20);

    const postAccepted = v20Cases.find((testCase) => testCase.id === "v2.activities-state.accepts.post");
    expect(postAccepted).toBeDefined();
    expect(postAccepted?.assertion.notes).toContain("legacy note: successful State POST returns 204 No Content");
    expect(postAccepted?.assertion.notes).toContain("legacy note: State API accepts POST requests");

    const getWithStateId = v20Cases.find((testCase) => testCase.id === "v2.activities-state.accepts.get-with-state-id");
    expect(getWithStateId).toBeDefined();
    expect(getWithStateId?.assertion.notes).toContain(
      "legacy note: no conformance requirement mandates additional since filtering behavior when GET includes a valid stateId",
    );
  });

  test("cases preserve upstream explanatory comments for mapped XAPI requirements", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    for (const testCase of cases) {
      const mappedRefs = testCase.requirementRefs.filter(
        (ref) => /^XAPI-\d{5}$/.test(ref.id) && Boolean(LEGACY_XAPI_COMMENT_MAP[ref.id]),
      );

      for (const ref of mappedRefs) {
        const expected = `legacy note: ${ref.id} upstream comment - ${LEGACY_XAPI_COMMENT_MAP[ref.id]}`;
        expect(testCase.assertion.notes).toContain(expected);
      }
    }
  });

  test("all referenced XAPI IDs are mapped to upstream explanatory comments", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    const missing = new Map<string, string[]>();

    for (const testCase of cases) {
      for (const ref of testCase.requirementRefs) {
        if (!/^XAPI-\d{5}$/.test(ref.id)) {
          continue;
        }

        if (LEGACY_XAPI_COMMENT_MAP[ref.id]) {
          continue;
        }

        const ids = missing.get(ref.id) ?? [];
        ids.push(testCase.id);
        missing.set(ref.id, ids);
      }
    }

    if (missing.size > 0) {
      const message = [...missing.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([xapiId, caseIds]) => `${xapiId}: ${[...new Set(caseIds)].sort().join(", ")}`)
        .join("\n");

      throw new Error(`Missing upstream explanatory comment mapping for XAPI IDs:\n${message}`);
    }

    expect(missing.size).toBe(0);
  });
});
