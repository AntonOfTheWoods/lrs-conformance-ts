import type { SuiteDefinition } from "../../../domain/contracts";
import { buildActivityStateDocumentFixture, buildActivityStateIdentityFixture } from "../../../fixtures/v2_0/documents";
import { requestSequenceCase, singleRequestCase } from "../../../registry/families";
import { specVersion, upstreamV103Root } from "../shared";

const stateResourceLegacySuiteFile = `${upstreamV103Root}/H.Communication2.3-StateResource.js`;

function buildVersionedRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  query: Record<string, string>,
  body?: unknown,
) {
  return {
    method,
    endpoint: "activities-state" as const,
    authMode: "basic" as const,
    headers: {
      "X-Experience-API-Version": specVersion,
      ...(method === "PUT" ? { "If-None-Match": "*" } : {}),
    },
    query,
    body: body
      ? {
          kind: "json" as const,
          value: body,
          sourceFixture: {
            version: specVersion,
            domain: "documents",
            name: "activity-state-default",
          },
        }
      : undefined,
  };
}

export function createV103StateResourceProofSliceSuite(): SuiteDefinition {
  const stateIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-v1",
    stateId: "proof-state-v1",
  });
  const stateListIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-v1-list",
    stateId: "proof-state-v1-list",
  });
  const stateMergeIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-v1-merge",
    stateId: "proof-state-v1-merge",
  });
  const stateDocument = buildActivityStateDocumentFixture();

  const endpointCase = singleRequestCase({
    caseId: "v1.activities-state.endpoint-exists",
    title: "The State Resource exists at /activities/state and accepts POST requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00230",
        section: "Communication 2.3",
        title: "The State Resource exists at /activities/state",
      },
      {
        id: "XAPI-00189",
        section: "Communication 2.3",
        title: "A successful State POST returns 204",
      },
      {
        id: "XAPI-00231",
        section: "Communication 2.3",
        title: "The State Resource accepts POST requests",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "basics"],
    capabilityFlags: ["document", "state", "write"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("POST", stateIdentity, stateDocument),
    assertion: {
      status: 204,
    },
    notes: ["v1 proof-slice state resource endpoint and post acceptance"],
  });

  const putAcceptedCase = singleRequestCase({
    caseId: "v1.activities-state.put-accepted",
    title: "The State Resource accepts PUT requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00190",
        section: "Communication 2.3",
        title: "A successful State PUT returns 204",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "basics"],
    capabilityFlags: ["document", "state", "write"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest(
      "PUT",
      {
        ...stateIdentity,
        stateId: "proof-state-v1-put",
      },
      stateDocument,
    ),
    assertion: {
      status: 204,
    },
    notes: ["v1 proof-slice state resource put accepted"],
  });

  const getRoundTripCase = requestSequenceCase({
    caseId: "v1.activities-state.get-roundtrip",
    title: "The State Resource returns stored documents by stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00188",
        section: "Communication 2.3",
        title: "The State Resource accepts GET requests",
      },
      {
        id: "XAPI-00192",
        section: "Communication 2.3.s3",
        title: "State GET with stateId returns the stored document",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "roundtrip"],
    capabilityFlags: ["document", "state", "retrieval"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["v1 proof-slice state resource get roundtrip"],
    steps: [
      {
        request: buildVersionedRequest("POST", stateIdentity, stateDocument),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", stateIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["bookmark"],
              equals: stateDocument.bookmark,
            },
          ],
        },
      },
    ],
  });

  const deleteAcceptedCase = requestSequenceCase({
    caseId: "v1.activities-state.delete-accepted",
    title: "The State Resource accepts DELETE requests for stored state documents",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00187",
        section: "Communication 2.3",
        title: "A successful State DELETE returns 204",
      },
      {
        id: "XAPI-00191",
        section: "Communication 2.3.s3",
        title: "State DELETE with stateId removes the stored document",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "delete"],
    capabilityFlags: ["document", "state", "delete"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["v1 proof-slice state resource delete accepted"],
    steps: [
      {
        request: buildVersionedRequest(
          "POST",
          {
            ...stateIdentity,
            stateId: "proof-state-v1-delete",
          },
          stateDocument,
        ),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", {
          ...stateIdentity,
          stateId: "proof-state-v1-delete",
        }),
        assertion: {
          status: 204,
        },
      },
    ],
  });

  const listAndSinceCase = requestSequenceCase({
    caseId: "v1.activities-state.list-and-since",
    title: "The State Resource lists ids and supports since",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00193",
        section: "Communication 2.3.s4",
        title: "State GET without stateId returns matching ids",
      },
      {
        id: "XAPI-00221",
        section: "Communication 2.3.s4",
        title: "State GET without stateId accepts since",
      },
      {
        id: "XAPI-00195",
        section: "Communication 2.3.s4",
        title: "State list results can be filtered by since",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "list", "since"],
    capabilityFlags: ["document", "state", "list", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["v1 proof-slice state resource list and since"],
    steps: [
      {
        request: buildVersionedRequest("POST", stateListIdentity, stateDocument),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", {
          activityId: stateListIdentity.activityId,
          agent: stateListIdentity.agent,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: [stateListIdentity.stateId],
            },
          ],
        },
      },
      {
        request: buildVersionedRequest("GET", {
          activityId: stateListIdentity.activityId,
          agent: stateListIdentity.agent,
          since: "2015-11-18T12:17:00.000Z",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v1.activities-state.invalid-since",
    title: "The State Resource rejects invalid since values",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00204",
        section: "Communication 2.3.s4",
        title: "State rejects invalid since values",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "since", "invalid"],
    capabilityFlags: ["document", "state", "list", "since", "validation"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", {
      activityId: stateListIdentity.activityId,
      agent: stateListIdentity.agent,
      since: "true",
    }),
    assertion: {
      status: 400,
    },
    notes: ["v1 proof-slice state resource invalid since"],
  });

  const missingActivityIdValidationCase = singleRequestCase({
    caseId: "v1.activities-state.missing-activity-id-validation",
    title: "The State Resource rejects requests that omit activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00207",
        section: "Communication 2.3.s3.table1.row1",
        title: "State rejects DELETE without activityId",
      },
      {
        id: "XAPI-00208",
        section: "Communication 2.3.s3.table1.row1",
        title: "State rejects GET without activityId",
      },
      {
        id: "XAPI-00209",
        section: "Communication 2.3.s3.table1.row1",
        title: "State rejects POST without activityId",
      },
      {
        id: "XAPI-00210",
        section: "Communication 2.3.s3.table1.row1",
        title: "State rejects PUT without activityId",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "validation"],
    capabilityFlags: ["document", "state", "validation"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", {
      agent: stateIdentity.agent,
      stateId: stateIdentity.stateId,
    }),
    assertion: {
      status: 400,
    },
    notes: ["v1 proof-slice state resource missing activityId validation"],
  });

  const missingAgentValidationCase = singleRequestCase({
    caseId: "v1.activities-state.missing-agent-validation",
    title: "The State Resource rejects requests that omit agent",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00214",
        section: "Communication 2.3.s3.table1.row2",
        title: "State rejects POST without agent",
      },
      {
        id: "XAPI-00215",
        section: "Communication 2.3.s3.table1.row2",
        title: "State rejects PUT without agent",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "validation"],
    capabilityFlags: ["document", "state", "validation"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      {
        activityId: stateIdentity.activityId,
        stateId: stateIdentity.stateId,
      },
      stateDocument,
    ),
    assertion: {
      status: 400,
    },
    notes: ["v1 proof-slice state resource missing agent validation"],
  });

  const invalidAgentQueryCase = singleRequestCase({
    caseId: "v1.activities-state.invalid-agent-query",
    title: "The State Resource rejects non-JSON and invalid JSON agent query values",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00199",
        section: "Communication 2.3.s3.table1.row2",
        title: "State rejects non-JSON agent values",
      },
      {
        id: "XAPI-00235",
        section: "Communication 2.3",
        title: "State rejects invalid JSON agent query values",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "validation"],
    capabilityFlags: ["document", "state", "validation"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest(
      "PUT",
      {
        activityId: stateIdentity.activityId,
        stateId: stateIdentity.stateId,
        agent: "not JSON",
      },
      stateDocument,
    ),
    assertion: {
      status: 400,
    },
    notes: ["v1 proof-slice state resource invalid agent query validation"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v1.activities-state.document-merge",
    title: "The State Resource merges JSON documents on POST",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00234",
        section: "Communication 2.2.s7",
        title: "State performs JSON merge on POST",
      },
    ],
    tags: ["v1.0.3", "activities-state", "resource", "merge"],
    capabilityFlags: ["document", "state", "merge"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["v1 proof-slice state resource merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", stateMergeIdentity, { car: "Honda" }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", stateMergeIdentity, { type: "Civic" }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", stateMergeIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
            {
              path: ["type"],
              equals: "Civic",
            },
          ],
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v1.proof-slice.activities-state",
    title: "State Resource",
    specVersion,
    tags: ["proof-slice", "activities-state"],
    children: [
      {
        type: "suite",
        id: "v1.proof-slice.activities-state.basics",
        title: "State Basics",
        specVersion,
        tags: ["activities-state", "basics"],
        children: [endpointCase, putAcceptedCase, getRoundTripCase, deleteAcceptedCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.activities-state.list-and-validation",
        title: "State List and Validation",
        specVersion,
        tags: ["activities-state", "list", "validation"],
        children: [
          listAndSinceCase,
          invalidSinceCase,
          missingActivityIdValidationCase,
          missingAgentValidationCase,
          invalidAgentQueryCase,
        ],
      },
      {
        type: "suite",
        id: "v1.proof-slice.activities-state.merge",
        title: "State Merge",
        specVersion,
        tags: ["activities-state", "merge"],
        children: [mergeCase],
      },
    ],
  };
}
