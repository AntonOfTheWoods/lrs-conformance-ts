import { describe, expect, test } from "bun:test";

import type { SuiteDefinition } from "../src/domain/contracts";
import { buildStatementFixture } from "../src/fixtures/v2_0/statements";
import { RegistryBuilder } from "../src/registry/builder";
import {
  createV20AboutResourceProofSliceSuite,
  createV20ActivitiesResourceProofSliceSuite,
  createV20ActivityProfileResourceProofSliceSuite,
  createV20AgentsResourceProofSliceSuite,
  createV20AgentProfileResourceProofSliceSuite,
  createV20CommunicationProofSliceSuite,
  createProofSliceRegistry,
  createV20ProofSliceSuite,
  createV20StateResourceProofSliceSuite,
} from "../src/specs/v2_0/proof-slice";

const expectedCaseCount = 532;
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
  "v2.statements.transport.put-roundtrip",
  "v2.statements.transport.put-requires-statement-id",
  "v2.statements.transport.put-is-immutable",
  "v2.statements.transport.post-batch-success",
  "v2.statements.transport.post-batch-rejects-duplicate-ids",
  "v2.statements.transport.post-batch-atomic-rollback",
  "v2.statements.voiding.voided-statement-id-roundtrip",
  "v2.statements.voiding.statement-id-hides-voided",
  "v2.statements.representation.format-exact",
  "v2.statements.representation.format-canonical-accept-language",
  "v2.statements.representation.format-ids",
  "v2.statements.representation.attachments-multipart",
  "v2.statements.representation.attachments-json-fallback",
  "v2.statements.headers.last-modified-matches-stored",
  "v2.statements.headers.consistent-through-success",
  "v2.statements.headers.consistent-through-error",
  "v2.statements.invalid-attachment-iri.file-url-no-scheme",
  "v2.statements.numeric-precision.score-roundtrip",
  "v2.statements.query-validation.invalid-registration",
  "v2.statements.query.statement-id-roundtrip",
  "v2.statements.query.empty-result",
  "v2.statements.query.agent",
  "v2.statements.query.related-agents",
  "v2.statements.query.since",
  "v2.statements.query.limit",
  "v2.statements.query.exclusive.statement-id.with-agent",
  "v2.statements.query.exclusive.voided-statement-id.with-limit",
  "v2.activities-state.document-invalid-agent-query",
  "v2.activities-state.document-merge-rejects-non-json-post",
  "v2.activities-state.document-merge-rejects-existing-non-json",
  "v2.activities-profile.document-invalid-json-post",
  "v2.activities-profile.document-merge-rejects-non-json-post",
  "v2.activities-profile.document-merge-rejects-existing-non-json",
  "v2.agents-profile.document-invalid-agent-query",
  "v2.agents-profile.document-merge-rejects-non-json-post",
  "v2.agents-profile.document-merge-rejects-existing-non-json",
  "v2.agents.resource.roundtrip",
  "v2.agents.resource.name-array",
  "v2.agents.resource.unknown-agent-fallback",
  "v2.activities.resource.complete-object",
  "v2.activities.resource.definition-merge",
  "v2.activities.resource.unknown-activity-fallback",
  "v2.about.resource.version-array",
  "v2.about.resource.non-about-requires-version-header",
  "v2.communication.head.activities",
  "v2.communication.head.statements",
  "v2.communication.versioning.response-header",
  "v2.communication.versioning.put-invalid-request-header",
  "v2.communication.authentication.bad-basic-rejected",
  "v2.communication.encoding.utf8-roundtrip",
  "v2.communication.content-types.extra-multipart-section-rejected",
  "v2.communication.concurrency.activities-state.etag-header",
  "v2.communication.concurrency.activities-profile.put-accepts-current-if-match",
  "v2.communication.concurrency.agents-profile.delete-accepts-current-if-match",
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
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
            textContains: [],
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
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
            textContains: [],
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
    builder.addSuite("2.0.0", createV20AgentsResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20ActivitiesResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20AboutResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20CommunicationProofSliceSuite());

    const manifest = builder.compileManifest();

    expect(manifest.versions["2.0.0"].suiteCount).toBe(8);
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
    builder.addSuite("2.0.0", createV20AgentsResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20ActivitiesResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20AboutResourceProofSliceSuite());
    builder.addSuite("2.0.0", createV20CommunicationProofSliceSuite());

    const batteries = builder.compileBatteries();

    expect(batteries["2.0.0"]?.conformanceTestCount).toBe(expectedCaseCount);
    expect(batteries["2.0.0"]?.tests.children.map((child) => child.text)).toEqual([
      "Statements",
      "State Resource",
      "Activity Profile Resource",
      "Agent Profile Resource",
      "Agents Resource",
      "Activities Resource",
      "About Resource",
      "Communication",
    ]);
    expect(batteries["2.0.0"]?.tests.children[0]?.children).toHaveLength(6);
    expect(batteries["2.0.0"]?.tests.children[1]?.children).toHaveLength(5);
    expect(batteries["2.0.0"]?.tests.children[2]?.children).toHaveLength(5);
    expect(batteries["2.0.0"]?.tests.children[3]?.children).toHaveLength(5);
    expect(batteries["2.0.0"]?.tests.children[4]?.children).toHaveLength(3);
    expect(batteries["2.0.0"]?.tests.children[5]?.children).toHaveLength(2);
    expect(batteries["2.0.0"]?.tests.children[6]?.children).toHaveLength(2);
    expect(batteries["2.0.0"]?.tests.children[7]?.children).toHaveLength(6);
    expect(batteries["1.0.3"]).toBeUndefined();
  });
});

describe("Proof slice registry", () => {
  test("exposes a versioned registry tree for xAPI 2.0.0", () => {
    const registry = createProofSliceRegistry();

    expect(registry.versions["2.0.0"]).toHaveLength(8);
    expect(registry.versions["2.0.0"].map((suite) => suite.id)).toEqual([
      "v2.proof-slice.statements",
      "v2.proof-slice.activities-state",
      "v2.proof-slice.activities-profile",
      "v2.proof-slice.agents-profile",
      "v2.proof-slice.agents",
      "v2.proof-slice.activities",
      "v2.proof-slice.about",
      "v2.proof-slice.communication",
    ]);
    expect(registry.versions["2.0.0"][0]?.children[0]?.type).toBe("suite");
  });
});
