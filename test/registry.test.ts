import { describe, expect, test } from "bun:test";

import type { RegistryNode, SuiteDefinition } from "../src/domain/contracts";
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
import { createV103ProofSliceRegistry as createV103Registry } from "../src/specs/v1_0_3/proof-slice";

const expectedCaseCount = 1429;
const expectedCaseIdAnchors = [
  "v2.statements.required-fields.missing-actor",
  "v2.statements.invalid-types.result-completion-string",
  "v2.statements.invalid-format.statement-id-invalid-letter",
  "v2.statements.invalid-iri-schemes.definition-more-info-no-scheme",
  "v2.statements.invalid-mbox-iri.actor-agent",
  "v2.statements.invalid-mbox-iri.substatement-context-team-group",
  "v2.statements.invalid-mbox-mailto.actor-agent",
  "v2.statements.invalid-mbox-sha1sum.actor-agent",
  "v2.statements.verify.statement-template.default",
  "v2.statements.verify.agent-template.substatement-context-instructor-agent",
  "v2.statements.verify.group-template.substatement-context-team-group",
  "v2.statements.verify.activity-template.substatement-sequencing",
  "v2.statements.verify.activity-definition.statement-extensions",
  "v2.statements.verify.context-activity-single.substatement-other",
  "v2.statements.invalid-openid.actor-agent",
  "v2.statements.account-home-page-missing.actor-agent",
  "v2.statements.account-home-page-invalid.substatement-context-team-group",
  "v2.statements.account-name-missing.actor-agent",
  "v2.statements.account-property-acceptance.actor-agent",
  "v2.statements.agent-ifi-acceptance.authority-agent-account",
  "v2.statements.agent-ifi-required.actor-agent",
  "v2.statements.group-ifi-or-member-required.actor-group",
  "v2.statements.group-ifi-acceptance.actor-group-mbox",
  "v2.statements.group-ifi-acceptance-no-member.substatement-context-team-group-account-no-member",
  "v2.statements.agent-ifi-exclusivity.actor-agent-mbox-with-account",
  "v2.statements.agent-ifi-exclusivity.substatement-context-instructor-agent-openid-with-mbox-sha1sum",
  "v2.statements.group-ifi-exclusivity.actor-group-mbox-with-openid",
  "v2.statements.group-ifi-exclusivity.substatement-context-team-group-account-with-mbox-sha1sum",
  "v2.statements.language-maps.legacy-rejected.verb-display",
  "v2.statements.extensions.legacy-invalid-key.statement-activity",
  "v2.statements.authority-group-acceptance.anonymous-two-member",
  "v2.statements.authority-populates-when-missing",
  "v2.statements.authority-group-rejection.non-oauth-members",
  "v2.statements.authority-group-rejection.identified-openid",
  "v2.statements.authority-group-rejection.anonymous-three-member",
  "v2.statements.transport.put-roundtrip",
  "v2.statements.transport.endpoint.post",
  "v2.statements.transport.put-with-statement-id-accepted",
  "v2.statements.transport.put-requires-statement-id",
  "v2.statements.transport.put-is-immutable",
  "v2.statements.transport.post-single-returns-id-array",
  "v2.statements.transport.post-batch-success",
  "v2.statements.transport.post-batch-rejects-duplicate-ids",
  "v2.statements.transport.post-batch-atomic-rollback",
  "v2.statements.voiding.voided-statement-id-roundtrip",
  "v2.statements.voiding.statement-id-hides-voided",
  "v2.statements.representation.format-exact",
  "v2.statements.representation.format-absent-defaults-exact",
  "v2.statements.representation.format-canonical-accept-language",
  "v2.statements.representation.format-ids",
  "v2.statements.representation.collection-format-canonical",
  "v2.statements.representation.attachments-multipart",
  "v2.statements.representation.attachments-json-fallback",
  "v2.statements.representation.content-type-header",
  "v2.statements.headers.last-modified-matches-stored",
  "v2.statements.headers.consistent-through-success",
  "v2.statements.headers.consistent-through-error",
  "v2.statements.headers.consistent-through.presence.format",
  "v2.statements.headers.consistent-through.iso.attachments",
  "v2.statements.invalid-attachment-iri.file-url-no-scheme",
  "v2.statements.numeric-precision.score-roundtrip",
  "v2.statements.query-validation.invalid-registration",
  "v2.statements.query.collection-statement-result",
  "v2.statements.query.statement-result.direct.base",
  "v2.statements.query.statement-id-roundtrip",
  "v2.statements.query.empty-result",
  "v2.statements.query.accepts.attachments",
  "v2.statements.query.agent",
  "v2.statements.query.related-agents",
  "v2.statements.query.since",
  "v2.statements.query.limit",
  "v2.statements.query.filtering.related-agents",
  "v2.statements.query.voided-statement-id-with-format-allowed",
  "v2.statements.query.voided-targets-retained.base",
  "v2.statements.query.exclusive.statement-id.with-agent",
  "v2.statements.query.exclusive.voided-statement-id.with-limit",
  "v2.statements.retrieval.direct.more-container-rules",
  "v2.activities-state.document-invalid-agent-query",
  "v2.activities-state.document-merge-rejects-non-json-post",
  "v2.activities-state.document-merge-rejects-existing-non-json",
  "v2.activities-state.headers.last-modified-updates",
  "v2.activities-profile.document-invalid-json-post",
  "v2.activities-profile.document-merge-rejects-non-json-post",
  "v2.activities-profile.document-merge-rejects-existing-non-json",
  "v2.activities-profile.headers.last-modified-updates",
  "v2.agents-profile.document-invalid-agent-query",
  "v2.agents-profile.document-merge-rejects-non-json-post",
  "v2.agents-profile.document-merge-rejects-existing-non-json",
  "v2.agents-profile.headers.last-modified-updates",
  "v2.agents.resource.roundtrip",
  "v2.agents.resource.endpoint-exists",
  "v2.agents.resource.name-array",
  "v2.agents.resource.unknown-agent-fallback",
  "v2.activities.resource.complete-object",
  "v2.activities.resource.invalid-activity-id",
  "v2.activities.resource.definition-merge",
  "v2.activities.resource.unknown-activity-fallback",
  "v2.about.resource.version-array",
  "v2.about.resource.non-about-missing-version-header.agents-profile",
  "v2.about.resource.non-about-requires-version-header",
  "v2.communication.head.activities",
  "v2.communication.head.about.accepted",
  "v2.communication.head.no-content-length.head-statements",
  "v2.communication.head.statements",
  "v2.communication.versioning.response-header",
  "v2.communication.versioning.statement-shape-preserved",
  "v2.communication.versioning.put-invalid-request-header",
  "v2.communication.authentication.bad-basic-rejected",
  "v2.communication.encoding.utf8-roundtrip",
  "v2.communication.content-types.extra-multipart-section-rejected",
  "v2.communication.content-types.invalid-transfer-encoding-rejected",
  "v2.communication.error-codes.statements.unrecognized-query-parameter",
  "v2.communication.error-codes.statements.case-differing.statement-id.put",
  "v2.communication.error-codes.statements.case-differing.ascending",
  "v2.communication.concurrency.activities-state.etag-header",
  "v2.communication.concurrency.activities-state.etag-header-quoted",
  "v2.communication.concurrency.activities-profile.put-accepts-current-if-match",
  "v2.communication.concurrency.activities-profile.post-accepts-current-if-match",
  "v2.communication.concurrency.agents-profile.put-requires-if-match-error-message",
  "v2.communication.concurrency.agents-profile.delete-accepts-current-if-match",
  "v2.communication.document-resources.rejected-write-rollback",
  "v2.communication.document-resources.merge-overwrites-duplicates",
  "v2.communication.document-resources.merge-is-one-level-deep",
  "v2.statements.case-sensitive-keys.version",
  "v2.statements.interaction-type-case.other",
  "v2.statements.invalid-extension-iri.context",
  "v2.statements.language-tags.accepted.substatement-context-language",
  "v2.statements.language-tags.rejected.attachment-description",
  "v2.statements.malformed-object-type.substatement-actor",
  "v2.statements.result.duration-invalid.statement-mixed-week-day",
  "v2.statements.result.duration-valid.substatement-weeks",
  "v2.statements.result.duration-valid.statement-years-only",
  "v2.statements.score.scaled-invalid.statement-above-one",
  "v2.statements.object-type-vocabulary.statement-agent",
  "v2.statements.activity.object-type-generated.statement",
  "v2.statements.activity.missing-id.substatement",
  "v2.statements.activity.definition-type.statement",
  "v2.statements.activity.definition-name-type.substatement-string",
  "v2.statements.activity.interaction-type.acceptance.statement-matching",
  "v2.statements.activity.interaction-type.invalid.substatement-object",
  "v2.statements.activity.correct-responses-pattern.substatement-array-number",
  "v2.statements.activity.extensions-type.statement-invalid-key",
  "v2.statements.activity.interaction-components.acceptance.substatement-matching-target",
  "v2.statements.activity.interaction-components.not-array.statement-choice-choices",
  "v2.statements.activity.interaction-components.entry-not-object.substatement-performance-steps",
  "v2.statements.activity.interaction-components.id-missing.statement-likert-scale",
  "v2.statements.activity.interaction-components.id-invalid.substatement-matching-source",
  "v2.statements.activity.interaction-components.description-type.statement-sequencing-choices",
  "v2.statements.activity.interaction-components.description-language.substatement-matching-target",
  "v2.statements.activity.interaction-components.duplicate-ids.statement-choice-choices",
  "v2.statements.activity.interaction-type-required.substatement-steps",
  "v2.statements.object-agent-group.requires-object-type.statement-group",
  "v2.statements.statement-ref.acceptance.substatement",
  "v2.statements.substatement.nested.substatement",
  "v2.statements.context.invalid-registration.statement-string",
  "v2.statements.context.revision-activity-only.statement-substatement",
  "v2.statements.context.context-activities-keys.substatement-all",
  "v2.statements.context.context-activities-roundtrip.statement-category",
  "v2.statements.id.generated-roundtrip",
  "v2.statements.id.statement-ref.rfc4122.substatement-invalid-letter",
  "v2.statements.id.context-registration.string-form.substatement-numeric",
  "v2.statements.id.context-statement.rfc4122.statement-too-many-digits",
  "v2.statements.attachments.acceptance.array",
  "v2.statements.attachments.description-type.string",
  "v2.statements.timestamp.invalid-format.statement-string",
  "v2.statements.timestamp.iso8601-acceptance.substatement-rfc3339",
  "v2.statements.version.invalid.1-1-0",
  "v2.statements.version.retained-roundtrip",
  "v2.statements.stored.post-overwrites-client-value",
  "v2.statements.actor.object-type-vocabulary.actor-agent-agent",
  "v2.statements.actor.object-type-type.substatement-context-instructor-agent-object",
  "v2.statements.actor.name-type.authority-agent-numeric",
  "v2.statements.group.member-required.context-team-group",
  "v2.statements.group.member-type.substatement-context-team-group",
  "v2.statements.verb.id-required.statement",
  "v2.statements.verb.id-iri.substatement",
  "v2.statements.verb.display-type.substatement-string",
  "v2.statements.voiding.requires-statement-ref-object",
  "v2.statements.voiding.cannot-target-voiding-statement",
  "v2.statements.retrieval.statement-result-array",
  "v2.statements.retrieval.pagination.more-container",
  "v2.statements.additional-data-types.iri-comparison",
  "v2.statements.additional-data-types.signed-duration-comparison-truncates-hundredths",
  "v2.statements.signed-statements.missing-signature-part",
  "v2.statements.signed-statements.accepts-rs512",
  "v2.statements.special-data-types.extensions.statement-activity.empty-extensions",
  "v2.statements.special-data-types.extensions.substatement-context.null",
  "v2.statements.special-data-types.timestamp-millisecond-precision",
  "v2.activities-state.validation.missing-activityId.put",
  "v2.activities-state.registration.get",
  "v2.activities-profile.validation.missing-profileId.put",
  "v2.agents-profile.validation.invalid-agent.post",
  "v2.agents-profile.validation.missing-profileId.delete",
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
            jsonPathNotEquals: [],
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
            jsonPathNotEquals: [],
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
    expect(batteries["2.0.0"]?.tests.children[0]?.children.map((child) => child.text)).toEqual([
      "Statement Formatting",
      "Statement Authority",
      "Statement Attachments",
      "Statement Result And Object Requirements",
      "Statement Metadata",
      "Statement Context",
      "Statement Transport",
      "Statement Representation",
      "Statement Query Validation",
      "Statement Query",
      "Statement Id Requirements",
      "Additional Data Types",
      "Signed Statements",
      "Special Data Types And Rules",
    ]);
    expect(batteries["2.0.0"]?.tests.children[0]?.children).toHaveLength(14);
    expect(batteries["2.0.0"]?.tests.children[0]?.children[2]?.children).toHaveLength(13);
    expect(batteries["2.0.0"]?.tests.children[0]?.children[3]?.children).toHaveLength(4);
    expect(batteries["2.0.0"]?.tests.children[0]?.children[4]?.children).toHaveLength(22);
    expect(batteries["2.0.0"]?.tests.children[0]?.children[5]?.children).toHaveLength(3);
    expect(batteries["2.0.0"]?.tests.children[1]?.children).toHaveLength(9);
    expect(batteries["2.0.0"]?.tests.children[2]?.children).toHaveLength(8);
    expect(batteries["2.0.0"]?.tests.children[3]?.children).toHaveLength(8);
    expect(batteries["2.0.0"]?.tests.children[4]?.children).toHaveLength(3);
    expect(batteries["2.0.0"]?.tests.children[5]?.children).toHaveLength(2);
    expect(batteries["2.0.0"]?.tests.children[6]?.children).toHaveLength(2);
    expect(batteries["2.0.0"]?.tests.children[7]?.children).toHaveLength(8);
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

  test("exposes the initial versioned registry tree for xAPI 1.0.3", () => {
    const registry = createV103Registry();
    const v103Suites = registry.versions["1.0.3"];

    expect(v103Suites.length).toBe(11);
    expect(v103Suites.map((suite) => suite.id)).toEqual([
      "v1.proof-slice.statements.formatting",
      "v1.proof-slice.statements.result-and-objects",
      "v1.proof-slice.statements",
      "v1.proof-slice.statements.query",
      "v1.proof-slice.communication",
      "v1.proof-slice.about",
      "v1.proof-slice.activities",
      "v1.proof-slice.activities-state",
      "v1.proof-slice.activities-profile",
      "v1.proof-slice.agents",
      "v1.proof-slice.agents-profile",
    ]);
  });

  test("includes the first migrated xAPI 1.0.3 requirement IDs", () => {
    const registry = createV103Registry();
    const ids = new Set<string>();

    const walk = (node: RegistryNode) => {
      if (node.type === "case") {
        for (const ref of node.requirementRefs) {
          if (/^XAPI-\d{5}$/.test(ref.id)) {
            ids.add(ref.id);
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

    expect([...ids].sort()).toEqual([
      "XAPI-00001",
      "XAPI-00002",
      "XAPI-00003",
      "XAPI-00004",
      "XAPI-00005",
      "XAPI-00006",
      "XAPI-00007",
      "XAPI-00008",
      "XAPI-00009",
      "XAPI-00010",
      "XAPI-00011",
      "XAPI-00013",
      "XAPI-00014",
      "XAPI-00015",
      "XAPI-00016",
      "XAPI-00017",
      "XAPI-00018",
      "XAPI-00019",
      "XAPI-00020",
      "XAPI-00027",
      "XAPI-00028",
      "XAPI-00031",
      "XAPI-00032",
      "XAPI-00033",
      "XAPI-00034",
      "XAPI-00035",
      "XAPI-00036",
      "XAPI-00037",
      "XAPI-00038",
      "XAPI-00039",
      "XAPI-00040",
      "XAPI-00041",
      "XAPI-00042",
      "XAPI-00043",
      "XAPI-00044",
      "XAPI-00045",
      "XAPI-00046",
      "XAPI-00047",
      "XAPI-00048",
      "XAPI-00049",
      "XAPI-00050",
      "XAPI-00051",
      "XAPI-00052",
      "XAPI-00053",
      "XAPI-00054",
      "XAPI-00055",
      "XAPI-00056",
      "XAPI-00057",
      "XAPI-00058",
      "XAPI-00059",
      "XAPI-00060",
      "XAPI-00061",
      "XAPI-00062",
      "XAPI-00064",
      "XAPI-00065",
      "XAPI-00066",
      "XAPI-00067",
      "XAPI-00068",
      "XAPI-00069",
      "XAPI-00070",
      "XAPI-00071",
      "XAPI-00072",
      "XAPI-00073",
      "XAPI-00074",
      "XAPI-00075",
      "XAPI-00076",
      "XAPI-00077",
      "XAPI-00078",
      "XAPI-00079",
      "XAPI-00080",
      "XAPI-00081",
      "XAPI-00082",
      "XAPI-00083",
      "XAPI-00091",
      "XAPI-00108",
      "XAPI-00109",
      "XAPI-00110",
      "XAPI-00111",
      "XAPI-00113",
      "XAPI-00114",
      "XAPI-00124",
      "XAPI-00125",
      "XAPI-00126",
      "XAPI-00127",
      "XAPI-00128",
      "XAPI-00129",
      "XAPI-00130",
      "XAPI-00131",
      "XAPI-00132",
      "XAPI-00133",
      "XAPI-00134",
      "XAPI-00135",
      "XAPI-00139",
      "XAPI-00142",
      "XAPI-00143",
      "XAPI-00144",
      "XAPI-00145",
      "XAPI-00146",
      "XAPI-00147",
      "XAPI-00149",
      "XAPI-00150",
      "XAPI-00151",
      "XAPI-00154",
      "XAPI-00155",
      "XAPI-00156",
      "XAPI-00157",
      "XAPI-00158",
      "XAPI-00159",
      "XAPI-00162",
      "XAPI-00163",
      "XAPI-00164",
      "XAPI-00166",
      "XAPI-00167",
      "XAPI-00168",
      "XAPI-00173",
      "XAPI-00174",
      "XAPI-00175",
      "XAPI-00176",
      "XAPI-00177",
      "XAPI-00178",
      "XAPI-00179",
      "XAPI-00180",
      "XAPI-00181",
      "XAPI-00182",
      "XAPI-00183",
      "XAPI-00184",
      "XAPI-00187",
      "XAPI-00188",
      "XAPI-00189",
      "XAPI-00190",
      "XAPI-00191",
      "XAPI-00192",
      "XAPI-00193",
      "XAPI-00195",
      "XAPI-00199",
      "XAPI-00204",
      "XAPI-00207",
      "XAPI-00208",
      "XAPI-00209",
      "XAPI-00210",
      "XAPI-00214",
      "XAPI-00215",
      "XAPI-00221",
      "XAPI-00230",
      "XAPI-00231",
      "XAPI-00234",
      "XAPI-00235",
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
      "XAPI-00322",
      "XAPI-00324",
      "XAPI-00325",
      "XAPI-00326",
      "XAPI-00330",
      "XAPI-00331",
      "XAPI-00333",
      "XAPI-00334",
      "XAPI-00335",
    ]);
  });
});
