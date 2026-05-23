import { describe, expect, test } from "bun:test";

import type { SuiteDefinition } from "../src/domain/contracts";
import { buildStatementFixture } from "../src/fixtures/v2_0/statements";
import { RegistryBuilder } from "../src/registry/builder";
import {
  createV20ActivityProfileResourceProofSliceSuite,
  createV20AgentProfileResourceProofSliceSuite,
  createProofSliceRegistry,
  createV20ProofSliceSuite,
  createV20StateResourceProofSliceSuite,
} from "../src/specs/v2_0/proof-slice";

const expectedCaseIds = [
  "v2.statements.required-fields.missing-actor",
  "v2.statements.required-fields.missing-verb",
  "v2.statements.required-fields.missing-object",
  "v2.statements.invalid-values.actor-name-null",
  "v2.statements.invalid-values.verb-display-null",
  "v2.statements.invalid-values.object-id-null",
  "v2.statements.invalid-types.score-max-string",
  "v2.statements.invalid-types.score-max-numeric-string",
  "v2.statements.invalid-types.result-success-string",
  "v2.statements.invalid-types.result-completion-string",
  "v2.statements.invalid-format.statement-id-numeric",
  "v2.statements.invalid-format.statement-id-object",
  "v2.statements.invalid-format.statement-id-too-many-digits",
  "v2.statements.invalid-format.statement-id-invalid-letter",
  "v2.statements.invalid-iri-schemes.verb-id-no-scheme",
  "v2.statements.invalid-iri-schemes.object-id-no-scheme",
  "v2.statements.invalid-iri-schemes.definition-type-no-scheme",
  "v2.statements.invalid-iri-schemes.definition-more-info-no-scheme",
  "v2.statements.numeric-precision.score-roundtrip",
  "v2.statements.query-validation.invalid-statement-id",
  "v2.statements.query-validation.invalid-voided-statement-id",
  "v2.statements.query-validation.invalid-agent",
  "v2.statements.query-validation.invalid-verb",
  "v2.statements.query-validation.invalid-activity",
  "v2.statements.query-validation.invalid-registration",
  "v2.statements.query.statement-id-roundtrip",
  "v2.activities-state.document-roundtrip",
  "v2.activities-state.document-list",
  "v2.activities-state.document-list-since",
  "v2.activities-state.invalid-since",
  "v2.activities-state.document-merge",
  "v2.activities-state.delete-context-documents",
  "v2.activities-profile.document-roundtrip",
  "v2.activities-profile.document-list",
  "v2.activities-profile.document-list-since",
  "v2.activities-profile.invalid-since",
  "v2.activities-profile.document-merge",
  "v2.activities-profile.delete-document",
  "v2.agents-profile.document-roundtrip",
  "v2.agents-profile.document-list",
  "v2.agents-profile.document-list-since",
  "v2.agents-profile.invalid-since",
  "v2.agents-profile.document-merge",
  "v2.agents-profile.delete-document",
];

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
    builder.addSuite("2.0.0", createV20ActivityProfileResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20AgentProfileResourceProofSliceSuite());

    const manifest = builder.compileManifest();

    expect(manifest.versions["2.0.0"].suiteCount).toBe(4);
    expect(manifest.versions["2.0.0"].caseCount).toBe(expectedCaseIds.length);
    expect(manifest.versions["2.0.0"].caseIds).toEqual(expectedCaseIds);
    expect(manifest.versions["1.0.3"].caseCount).toBe(0);
  });

  test("compiles a batteries-like artifact without executing the suite", () => {
    const builder = new RegistryBuilder();
    builder.addSuite("2.0.0", createV20ProofSliceSuite());
    builder.addSuite("2.0.0", createV20StateResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20ActivityProfileResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20AgentProfileResourceProofSliceSuite());

    const batteries = builder.compileBatteries();

    expect(batteries["2.0.0"]?.conformanceTestCount).toBe(expectedCaseIds.length);
    expect(batteries["2.0.0"]?.tests.children.map((child) => child.text)).toEqual([
      "Statements",
      "State Resource",
      "Activity Profile Resource",
      "Agent Profile Resource",
    ]);
    expect(batteries["2.0.0"]?.tests.children[0]?.children).toHaveLength(3);
    expect(batteries["2.0.0"]?.tests.children[1]?.children).toHaveLength(5);
    expect(batteries["2.0.0"]?.tests.children[2]?.children).toHaveLength(5);
    expect(batteries["2.0.0"]?.tests.children[3]?.children).toHaveLength(5);
    expect(batteries["1.0.3"]).toBeUndefined();
  });
});

describe("Proof slice registry", () => {
  test("exposes a versioned registry tree for xAPI 2.0.0", () => {
    const registry = createProofSliceRegistry();

    expect(registry.versions["2.0.0"]).toHaveLength(4);
    expect(registry.versions["2.0.0"].map((suite) => suite.id)).toEqual([
      "v2.proof-slice.statements",
      "v2.proof-slice.activities-state",
      "v2.proof-slice.activities-profile",
      "v2.proof-slice.agents-profile",
    ]);
    expect(registry.versions["2.0.0"][0]?.children[0]?.type).toBe("suite");
  });
});
