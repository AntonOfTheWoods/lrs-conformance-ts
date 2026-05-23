import { describe, expect, test } from "bun:test";

import type { SuiteDefinition } from "../src/domain/contracts";
import { buildStatementFixture } from "../src/fixtures/v2_0/statements";
import { RegistryBuilder } from "../src/registry/builder";
import {
  createProofSliceRegistry,
  createV20ProofSliceSuite,
  createV20StateResourceProofSliceSuite,
} from "../src/specs/v2_0/proof-slice";

describe("RegistryBuilder", () => {
  test("rejects duplicate ids across the registry tree", () => {
    const duplicateSuite: SuiteDefinition = {
      type: "suite",
      id: "duplicate-root",
      title: "Duplicate Root",
      specVersion: "2.0.0",
      tags: [],
      children: [
        {
          type: "case",
          id: "duplicate-case",
          title: "First duplicate",
          specVersion: "2.0.0",
          requirementRefs: [
            {
              id: "REQ-1",
              section: "Test 1",
            },
          ],
          tags: [],
          capabilityFlags: [],
          execution: {
            kind: "single-request",
            request: {
              method: "POST",
              endpoint: "statements",
              authMode: "basic",
              headers: {},
              query: {},
              body: {
                kind: "json",
                value: buildStatementFixture(),
              },
            },
          },
          assertion: {
            kind: "single-request",
            status: 400,
            expectedHeaders: [],
            jsonPathEquals: [],
            notes: [],
          },
        },
        {
          type: "case",
          id: "duplicate-case",
          title: "Second duplicate",
          specVersion: "2.0.0",
          requirementRefs: [
            {
              id: "REQ-2",
              section: "Test 2",
            },
          ],
          tags: [],
          capabilityFlags: [],
          execution: {
            kind: "single-request",
            request: {
              method: "POST",
              endpoint: "statements",
              authMode: "basic",
              headers: {},
              query: {},
              body: {
                kind: "json",
                value: buildStatementFixture(),
              },
            },
          },
          assertion: {
            kind: "single-request",
            status: 400,
            expectedHeaders: [],
            jsonPathEquals: [],
            notes: [],
          },
        },
      ],
    };

    const builder = new RegistryBuilder();

    expect(() => builder.addSuite("2.0.0", duplicateSuite)).toThrow(/Duplicate registry id/);
  });

  test("builds a stable manifest for the first 2.0 proof slice", () => {
    const builder = new RegistryBuilder();
    builder.addSuite("2.0.0", createV20ProofSliceSuite());
    builder.addSuite("2.0.0", createV20StateResourceProofSliceSuite());

    const manifest = builder.compileManifest();

    expect(manifest.versions["2.0.0"].suiteCount).toBe(2);
    expect(manifest.versions["2.0.0"].caseCount).toBe(9);
    expect(manifest.versions["2.0.0"].caseIds).toEqual([
      "v2.statements.required-fields.missing-actor",
      "v2.statements.required-fields.missing-verb",
      "v2.statements.required-fields.missing-object",
      "v2.statements.invalid-values.actor-name-null",
      "v2.statements.invalid-values.verb-display-null",
      "v2.statements.invalid-values.object-id-null",
      "v2.statements.numeric-precision.score-roundtrip",
      "v2.statements.query.statement-id-roundtrip",
      "v2.activities-state.document-roundtrip",
    ]);
    expect(manifest.versions["1.0.3"].caseCount).toBe(0);
  });

  test("compiles a batteries-like artifact without executing the suite", () => {
    const builder = new RegistryBuilder();
    builder.addSuite("2.0.0", createV20ProofSliceSuite());
    builder.addSuite("2.0.0", createV20StateResourceProofSliceSuite());

    const batteries = builder.compileBatteries();

    expect(batteries["2.0.0"]?.conformanceTestCount).toBe(9);
    expect(batteries["2.0.0"]?.tests.children[0]?.text).toBe("Statements");
    expect(batteries["2.0.0"]?.tests.children[0]?.children).toHaveLength(2);
    expect(batteries["2.0.0"]?.tests.children[1]?.text).toBe("State Resource");
    expect(batteries["1.0.3"]).toBeUndefined();
  });
});

describe("Proof slice registry", () => {
  test("exposes a versioned registry tree for xAPI 2.0.0", () => {
    const registry = createProofSliceRegistry();

    expect(registry.versions["2.0.0"]).toHaveLength(2);
    expect(registry.versions["2.0.0"][0]?.id).toBe("v2.proof-slice.statements");
    expect(registry.versions["2.0.0"][0]?.children[0]?.type).toBe("suite");
    expect(registry.versions["2.0.0"][1]?.id).toBe("v2.proof-slice.activities-state");
  });
});
