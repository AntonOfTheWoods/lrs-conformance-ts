import type { EndpointKind, HttpMethod, HttpRequest, RegistryDefinition, SuiteDefinition } from "../../domain/contracts";
import {
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
  buildActivityStateDocumentFixture,
  buildActivityStateIdentityFixture,
  buildAgentProfileDocumentFixture,
  buildAgentProfileIdentityFixture,
} from "../../fixtures/v2_0/documents";
import { RegistryBuilder } from "../../registry/builder";
import {
  documentRoundTripCase,
  queryRetrievalFamily,
  requestSequenceCase,
  requiredFieldFamily,
  statementMutationFamily,
  statementQueryValidationFamily,
  statementRoundTripCase,
} from "../../registry/families";

const specVersion = "2.0.0" as const;
const formattingLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/Data2.2-FormattingRequirements.js";
const formattingLegacyConfigFile = "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/configs/formatting.js";
const statementResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.1-Statement-Resource.js";
const stateResourceLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.2-State-Resource.js";
const agentProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.5-Agent-Profile-Resource.js";
const activityProfileLegacySuiteFile =
  "/home/anton/dev/tmp/lrs-conformance-test-suite/test/v2_0/4.1.6.6-Activity-Profile-Resource.js";

function buildVersionedRequest(
  method: HttpMethod,
  endpoint: EndpointKind,
  query: Record<string, string>,
  body?: { value: unknown; fixtureName?: string },
): HttpRequest {
  return {
    method,
    endpoint,
    authMode: "basic",
    headers: {
      "X-Experience-API-Version": specVersion,
    },
    query,
    body: body
      ? {
          kind: "json",
          value: body.value,
          sourceFixture: body.fixtureName
            ? {
                version: specVersion,
                domain: "documents",
                name: body.fixtureName,
              }
            : undefined,
        }
      : undefined,
  };
}

function listEquals(expected: string[]) {
  return [
    {
      path: [],
      equals: expected,
    },
  ];
}

export function createV20ProofSliceSuite(): SuiteDefinition {
  const formattingCases = requiredFieldFamily({
    familyId: "v2.statements.required-fields",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "missing-actor",
        title: 'A Statement contains an "actor" property',
        missingPath: ["actor"],
        requirementRefs: [
          {
            id: "XAPI-00003",
            section: "Data 2.2.s2.b3",
            title: "Statement actor is required",
          },
        ],
      },
      {
        idSuffix: "missing-verb",
        title: 'A Statement contains a "verb" property',
        missingPath: ["verb"],
        requirementRefs: [
          {
            id: "XAPI-00004",
            section: "Data 2.2.s2.b3",
            title: "Statement verb is required",
          },
        ],
      },
      {
        idSuffix: "missing-object",
        title: 'A Statement contains an "object" property',
        missingPath: ["object"],
        requirementRefs: [
          {
            id: "XAPI-00005",
            section: "Data 2.2.s2.b3",
            title: "Statement object is required",
          },
        ],
      },
    ],
  });

  const nullValueCases = statementMutationFamily({
    familyId: "v2.statements.invalid-values",
    suiteTitle: "Statement Formatting",
    specVersion: "2.0.0",
    endpoint: "statements",
    tags: ["v2.0.0", "statements", "formatting", "null-values"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    legacyTraceConfigFile: formattingLegacyConfigFile,
    variants: [
      {
        idSuffix: "actor-name-null",
        title: 'A Statement rejects "null" for actor.name',
        transforms: [
          {
            operation: "set",
            path: ["actor", "name"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
      {
        idSuffix: "verb-display-null",
        title: 'A Statement rejects "null" for verb.display.en-US',
        transforms: [
          {
            operation: "set",
            path: ["verb", "display", "en-US"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
      {
        idSuffix: "object-id-null",
        title: 'A Statement rejects "null" for object.id',
        transforms: [
          {
            operation: "set",
            path: ["object", "id"],
            value: null,
          },
        ],
        requirementRefs: [
          {
            id: "XAPI-00001",
            section: "Data 2.2.s4.b1.b1",
            title: "Statements reject null values outside extensions",
          },
        ],
      },
    ],
  });

  const min = 0.12123434;
  const raw = 12.125;
  const max = 45.45;
  const precisionCase = statementRoundTripCase({
    caseId: "v2.statements.numeric-precision.score-roundtrip",
    title: "The Statements resource preserves IEEE 754 score precision across submit and query",
    specVersion,
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-00002",
        section: "Data 2.2.s4.b3",
        title: "Statements preserve IEEE 754 score precision",
      },
    ],
    tags: ["v2.0.0", "statements", "formatting", "precision"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    transforms: [
      {
        operation: "set",
        path: ["result", "score", "min"],
        value: min,
      },
      {
        operation: "set",
        path: ["result", "score", "raw"],
        value: raw,
      },
      {
        operation: "set",
        path: ["result", "score", "max"],
        value: max,
      },
      {
        operation: "set",
        path: ["result", "score", "scaled"],
        value: min,
      },
    ],
    queryJsonPathEquals: [
      {
        path: ["result", "score", "min"],
        equals: min,
      },
      {
        path: ["result", "score", "raw"],
        equals: raw,
      },
      {
        path: ["result", "score", "max"],
        equals: max,
      },
      {
        path: ["result", "score", "scaled"],
        equals: min,
      },
    ],
    capabilityFlags: ["query", "retrieval", "precision"],
    notes: ["proof-slice numeric precision"],
  });

  const queryValidationCases = statementQueryValidationFamily({
    familyId: "v2.statements.query-validation",
    suiteTitle: "Statement Query Validation",
    specVersion,
    tags: ["v2.0.0", "statements", "query", "validation"],
    legacyTraceSuiteFile: formattingLegacySuiteFile,
    variants: [
      {
        idSuffix: "invalid-statement-id",
        title: "The Statements resource rejects an invalid statementId query value",
        query: {
          statementId: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-voided-statement-id",
        title: "The Statements resource rejects an invalid voidedStatementId query value",
        query: {
          voidedStatementId: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-agent",
        title: "The Statements resource rejects an invalid agent query value",
        query: {
          agent: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-verb",
        title: "The Statements resource rejects an invalid verb query value",
        query: {
          verb: "not.a.valid.iri.com/verb",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-activity",
        title: "The Statements resource rejects an invalid activity query value",
        query: {
          activity: "not.a.valid.iri.com/activity",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
      {
        idSuffix: "invalid-registration",
        title: "The Statements resource rejects an invalid registration query value",
        query: {
          registration: "wrong",
        },
        requirementRefs: [
          {
            id: "XAPI-00012",
            section: "Data 2.2.s4.b4",
            title: "Statement query parameters follow statement value validation rules",
          },
        ],
      },
    ],
  });

  const queryCase = queryRetrievalFamily({
    caseId: "v2.statements.query.statement-id-roundtrip",
    title: "The Statements resource returns a submitted statement when queried by statementId",
    specVersion,
    queryParam: "statementId",
    requirementRefs: [
      {
        id: "XAPI-01001",
        section: "Communication 4.1.6.1",
        title: "Statements can be queried by statementId",
      },
    ],
    tags: ["v2.0.0", "statements", "query", "retrieval"],
    legacyTraceSuiteFile: statementResourceLegacySuiteFile,
  });

  return {
    type: "suite",
    id: "v2.proof-slice.statements",
    title: "Statements",
    specVersion: "2.0.0",
    tags: ["proof-slice", "statements"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.statements.formatting",
        title: "Statement Formatting",
        specVersion: "2.0.0",
        tags: ["formatting"],
        children: [...formattingCases, ...nullValueCases, precisionCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query-validation",
        title: "Statement Query Validation",
        specVersion,
        tags: ["query", "validation"],
        children: queryValidationCases,
      },
      {
        type: "suite",
        id: "v2.proof-slice.statements.query",
        title: "Statement Query",
        specVersion,
        tags: ["query"],
        children: [queryCase],
      },
    ],
  };
}

export function createV20StateResourceProofSliceSuite(): SuiteDefinition {
  const stateDocument = buildActivityStateDocumentFixture();
  const stateIdentity = buildActivityStateIdentityFixture();
  const stateListIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/list",
    stateId: "proof-state-list",
  });
  const stateDeleteIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/delete",
    stateId: "proof-state-delete",
  });
  const stateListQuery = {
    activityId: stateListIdentity.activityId,
    agent: stateListIdentity.agent,
  };
  const stateDeleteQuery = {
    activityId: stateDeleteIdentity.activityId,
    agent: stateDeleteIdentity.agent,
  };

  const stateRoundTripCase = documentRoundTripCase({
    caseId: "v2.activities-state.document-roundtrip",
    title: "The State Resource returns a stored document when queried by stateId",
    specVersion,
    endpoint: "activities-state",
    submitMethod: "PUT",
    requirementRefs: [
      {
        id: "XAPI-00192",
        section: "Communication 2.3.s3",
        title: "State Resource GET with stateId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "roundtrip"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    query: stateIdentity,
    body: stateDocument,
    bodyFixtureName: "activity-state-default",
    queryJsonPathEquals: [
      {
        path: ["bookmark"],
        equals: stateDocument.bookmark,
      },
      {
        path: ["progress", "attempts"],
        equals: stateDocument.progress.attempts,
      },
      {
        path: ["progress", "complete"],
        equals: stateDocument.progress.complete,
      },
      {
        path: ["context", "location"],
        equals: stateDocument.context.location,
      },
    ],
    capabilityFlags: ["document", "retrieval", "state"],
    notes: ["proof-slice activity state roundtrip"],
  });

  const stateListCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list",
    title: "The State Resource lists stored state ids when queried without stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00193",
        section: "Communication 2.3.s4",
        title: "State Resource GET without stateId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list"],
    capabilityFlags: ["document", "list", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateListIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateListIdentity.stateId]),
        },
      },
    ],
  });

  const stateDeleteCase = requestSequenceCase({
    caseId: "v2.activities-state.delete-context-documents",
    title: "The State Resource deletes matching documents when DELETE omits stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00194",
        section: "Communication 2.3.s5",
        title: "State Resource DELETE without stateId deletes matching documents",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "delete"],
    capabilityFlags: ["document", "delete", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateDeleteIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-state", stateDeleteQuery),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateDeleteQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-state",
    title: "State Resource",
    specVersion,
    tags: ["proof-slice", "activities-state"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.roundtrip",
        title: "State Document Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [stateRoundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.listing",
        title: "State Document Listing",
        specVersion,
        tags: ["list"],
        children: [stateListCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.deletion",
        title: "State Document Deletion",
        specVersion,
        tags: ["delete"],
        children: [stateDeleteCase],
      },
    ],
  };
}

export function createV20ActivityProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildActivityProfileDocumentFixture();
  const profileIdentity = buildActivityProfileIdentityFixture();
  const profileListIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/list",
    profileId: "proof-activity-profile-list",
  });
  const profileDeleteIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/delete",
    profileId: "proof-activity-profile-delete",
  });
  const profileListQuery = {
    activityId: profileListIdentity.activityId,
  };
  const profileDeleteListQuery = {
    activityId: profileDeleteIdentity.activityId,
  };

  const roundTripCase = documentRoundTripCase({
    caseId: "v2.activities-profile.document-roundtrip",
    title: "The Activity Profile Resource returns a stored document when queried by profileId",
    specVersion,
    endpoint: "activities-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00288",
        section: "Communication 2.7.s3",
        title: "Activity Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "roundtrip"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    query: profileIdentity,
    body: profileDocument,
    bodyFixtureName: "activity-profile-default",
    queryJsonPathEquals: [
      {
        path: ["summary"],
        equals: profileDocument.summary,
      },
      {
        path: ["metadata", "audience"],
        equals: profileDocument.metadata.audience,
      },
      {
        path: ["metadata", "level"],
        equals: profileDocument.metadata.level,
      },
    ],
    capabilityFlags: ["document", "retrieval", "activity-profile"],
    notes: ["proof-slice activity profile roundtrip"],
  });

  const listCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list",
    title: "The Activity Profile Resource lists stored profile ids when queried without profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00289",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list"],
    capabilityFlags: ["document", "list", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileListIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileListIdentity.profileId]),
        },
      },
    ],
  });

  const deleteCase = requestSequenceCase({
    caseId: "v2.activities-profile.delete-document",
    title: "The Activity Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00285",
        section: "Communication 2.7.s3",
        title: "Activity Profile DELETE removes the associated profile",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "delete"],
    capabilityFlags: ["document", "delete", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileDeleteIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-profile", profileDeleteIdentity),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileDeleteListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities-profile",
    title: "Activity Profile Resource",
    specVersion,
    tags: ["proof-slice", "activities-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.roundtrip",
        title: "Activity Profile Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [roundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.listing",
        title: "Activity Profile Listing",
        specVersion,
        tags: ["list"],
        children: [listCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.deletion",
        title: "Activity Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
    ],
  };
}

export function createV20AgentProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildAgentProfileDocumentFixture();
  const profileIdentity = buildAgentProfileIdentityFixture();
  const profileListIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-list@example.test",
      name: "Agent Profile List",
    }),
    profileId: "proof-agent-profile-list",
  });
  const profileDeleteIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-delete@example.test",
      name: "Agent Profile Delete",
    }),
    profileId: "proof-agent-profile-delete",
  });
  const profileListQuery = {
    agent: profileListIdentity.agent,
  };
  const profileDeleteListQuery = {
    agent: profileDeleteIdentity.agent,
  };

  const roundTripCase = documentRoundTripCase({
    caseId: "v2.agents-profile.document-roundtrip",
    title: "The Agent Profile Resource returns a stored document when queried by profileId",
    specVersion,
    endpoint: "agents-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00269",
        section: "Communication 2.6.s3",
        title: "Agent Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "roundtrip"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    query: profileIdentity,
    body: profileDocument,
    bodyFixtureName: "agent-profile-default",
    queryJsonPathEquals: [
      {
        path: ["preference"],
        equals: profileDocument.preference,
      },
      {
        path: ["notifications", "email"],
        equals: profileDocument.notifications.email,
      },
      {
        path: ["notifications", "digest"],
        equals: profileDocument.notifications.digest,
      },
    ],
    capabilityFlags: ["document", "retrieval", "agent-profile"],
    notes: ["proof-slice agent profile roundtrip"],
  });

  const listCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list",
    title: "The Agent Profile Resource lists stored profile ids when queried without profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00270",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId returns matching ids",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list"],
    capabilityFlags: ["document", "list", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile list"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileListIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileListIdentity.profileId]),
        },
      },
    ],
  });

  const deleteCase = requestSequenceCase({
    caseId: "v2.agents-profile.delete-document",
    title: "The Agent Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00271",
        section: "Communication 2.6.s3",
        title: "Agent Profile DELETE removes the associated profile",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "delete"],
    capabilityFlags: ["document", "delete", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile delete"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileDeleteIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "agents-profile", profileDeleteIdentity),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileDeleteListQuery),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([]),
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.agents-profile",
    title: "Agent Profile Resource",
    specVersion,
    tags: ["proof-slice", "agents-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.roundtrip",
        title: "Agent Profile Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [roundTripCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.listing",
        title: "Agent Profile Listing",
        specVersion,
        tags: ["list"],
        children: [listCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.deletion",
        title: "Agent Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
    ],
  };
}

export function createProofSliceRegistry(): RegistryDefinition {
  const builder = new RegistryBuilder();
  builder.addSuite(specVersion, createV20ProofSliceSuite());
  builder.addSuite(specVersion, createV20StateResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20ActivityProfileResourceProofSliceSuite());
  builder.addSuite(specVersion, createV20AgentProfileResourceProofSliceSuite());
  return builder.build();
}
