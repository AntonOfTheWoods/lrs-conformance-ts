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

const expectedCaseCount = 424;
const expectedCaseIdAnchors = [
  "v2.statements.required-fields.missing-actor",
  "v2.statements.invalid-types.result-completion-string",
  "v2.statements.invalid-format.statement-id-invalid-letter",
  "v2.statements.invalid-iri-schemes.definition-more-info-no-scheme",
  "v2.statements.invalid-mbox-iri.actor-agent",
  "v2.statements.invalid-mbox-iri.substatement-context-team-group",
  "v2.statements.invalid-mbox-mailto.actor-agent",
  "v2.statements.invalid-mbox-sha1sum.actor-agent",
  "v2.statements.invalid-openid.actor-agent",
  "v2.statements.account-home-page-missing.actor-agent",
  "v2.statements.account-home-page-invalid.substatement-context-team-group",
  "v2.statements.account-name-missing.actor-agent",
  "v2.statements.agent-ifi-acceptance.authority-agent-account",
  "v2.statements.agent-ifi-required.actor-agent",
  "v2.statements.group-ifi-or-member-required.actor-group",
  "v2.statements.group-ifi-acceptance.actor-group-mbox",
  "v2.statements.group-ifi-acceptance-no-member.substatement-context-team-group-account-no-member",
  "v2.statements.agent-ifi-exclusivity.actor-agent-mbox-with-account",
  "v2.statements.agent-ifi-exclusivity.substatement-context-instructor-agent-openid-with-mbox-sha1sum",
  "v2.statements.group-ifi-exclusivity.actor-group-mbox-with-openid",
  "v2.statements.group-ifi-exclusivity.substatement-context-team-group-account-with-mbox-sha1sum",
  "v2.statements.authority-group-acceptance.anonymous-two-member",
  "v2.statements.authority-populates-when-missing",
  "v2.statements.authority-group-rejection.non-oauth-members",
  "v2.statements.authority-group-rejection.identified-openid",
  "v2.statements.authority-group-rejection.anonymous-three-member",
  "v2.statements.invalid-attachment-iri.file-url-no-scheme",
  "v2.statements.numeric-precision.score-roundtrip",
  "v2.statements.query-validation.invalid-registration",
  "v2.statements.query.statement-id-roundtrip",
  "v2.activities-state.document-invalid-agent-query",
  "v2.activities-state.document-merge-rejects-non-json-post",
  "v2.activities-state.document-merge-rejects-existing-non-json",
  "v2.activities-profile.document-invalid-json-post",
  "v2.activities-profile.document-merge-rejects-non-json-post",
  "v2.activities-profile.document-merge-rejects-existing-non-json",
  "v2.agents-profile.document-invalid-agent-query",
  "v2.agents-profile.document-merge-rejects-non-json-post",
  "v2.agents-profile.document-merge-rejects-existing-non-json",
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
    expect(manifest.versions["2.0.0"].caseCount).toBe(expectedCaseCount);
    expect(new Set(manifest.versions["2.0.0"].caseIds).size).toBe(expectedCaseCount);
    for (const caseId of expectedCaseIdAnchors) {
      expect(manifest.versions["2.0.0"].caseIds).toContain(caseId);
    }
    expect(manifest.versions["1.0.3"].caseCount).toBe(0);
  });

  test("compiles a batteries-like artifact without executing the suite", () => {
    const builder = new RegistryBuilder();
    builder.addSuite("2.0.0", createV20ProofSliceSuite());
    builder.addSuite("2.0.0", createV20StateResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20ActivityProfileResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20AgentProfileResourceProofSliceSuite());

    const batteries = builder.compileBatteries();

    expect(batteries["2.0.0"]?.conformanceTestCount).toBe(expectedCaseCount);
    expect(batteries["2.0.0"]?.tests.children.map((child) => child.text)).toEqual([
      "Statements",
      "State Resource",
      "Activity Profile Resource",
      "Agent Profile Resource",
    ]);
    expect(batteries["2.0.0"]?.tests.children[0]?.children).toHaveLength(4);
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
