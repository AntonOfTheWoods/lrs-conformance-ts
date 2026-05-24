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
    notes: [
      "v1 proof-slice state resource endpoint and post acceptance",
      "legacy note: successful State POST returns 204 No Content",
      "legacy note: State API accepts POST requests",
      "legacy note: XAPI-00230 upstream comment - An LRS has a State API with endpoint \"base IRI\"+\"/activities/state\"",
      "legacy note: XAPI-00189 upstream comment - An LRS's State API upon processing a successful POST request returns code 204 No Content",
      "legacy note: XAPI-00231 upstream comment - An LRS will accept a POST request to the State API",
    ],
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
    notes: [
      "v1 proof-slice state resource put accepted",
      "legacy note: XAPI-00190 upstream comment - An LRS's State API upon processing a successful PUT request returns code 204 No Content",
    ],
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
    notes: [
      "v1 proof-slice state resource get roundtrip",
      "legacy note: no conformance requirement mandates additional since filtering behavior when GET includes a valid stateId",
      "legacy note: XAPI-00188 upstream comment - An LRS's State API upon processing a successful GET request returns 200 Ok, State Document",
      "legacy note: XAPI-00192 upstream comment - An LRS's State API upon processing a successful GET request with a valid \"stateId\" as a parameter returns the document satisfying the requirements of the GET and code 200 OK NOTE: There is no requirement here that the LRS reacts to the \"since\" parameter in the case of a GET request with valid \"stateId\" - this is intentional",
    ],
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
    notes: [
      "v1 proof-slice state resource delete accepted",
      "legacy note: XAPI-00187 upstream comment - An LRS's State API upon processing a successful DELETE request returns code 204 No Content",
      "legacy note: XAPI-00191 upstream comment - An LRS's State API upon processing a successful DELETE request with a valid \"stateId\" as a parameter deletes the document satisfying the requirements of the DELETE and returns code 204 No Content NOTE: There is no requirement here that the LRS reacts to the \"since\" parameter in the case of a DELETE request with valid \"stateId\" - this is intentional",
    ],
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
    notes: [
      "v1 proof-slice state resource list and since",
      "legacy note: XAPI-00193 upstream comment - An LRS's State API upon processing a successful GET request without \"stateId\" as a parameter returns an array of ids of state data documents satisfying the requirements of the GET and code 200 OK",
      "legacy note: XAPI-00221 upstream comment - An LRS's State API can process a GET request with \"since\" as a parameter. Returning 200 OK and all matching profiles after the date/time of the “since” parameter.",
      "legacy note: XAPI-00195 upstream comment - An LRS's returned array of ids from a successful GET request all refer to documents stored after the TimeStamp in the \"since\" parameter of the GET request",
    ],
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
    notes: [
      "v1 proof-slice state resource invalid since",
      "legacy note: XAPI-00204 upstream comment - An LRS's State API rejects a GET request with \"since\" as a parameter if it is not a \"TimeStamp\", with error code 400 Bad Request",
    ],
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
    notes: [
      "v1 proof-slice state resource missing activityId validation",
      "legacy note: XAPI-00207 upstream comment - An LRS's State API rejects a DELETE request without \"activityId\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00208 upstream comment - An LRS's State API rejects a GET request without \"activityId\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00209 upstream comment - An LRS's State API rejects a POST request without \"activityId\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00210 upstream comment - An LRS's State API rejects a PUT request without \"activityId\" as a parameter with error code 400 Bad Request",
    ],
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
    notes: [
      "v1 proof-slice state resource missing agent validation",
      "legacy note: XAPI-00214 upstream comment - An LRS's State API rejects a POST request without \"agent\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00215 upstream comment - An LRS's State API rejects a PUT request without \"agent\" as a parameter with error code 400 Bad Request",
    ],
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
    notes: [
      "v1 proof-slice state resource invalid agent query validation",
      "legacy note: XAPI-00199 upstream comment - An LRS's State API rejects a PUT request with \"agent\" as a parameter if it is not in JSON format with error code 400 Bad Request",
      "legacy note: XAPI-00235 upstream comment - An LRS must reject with 400 Bad Request a POST request to the State API which contains name/value pairs with invalid JSON and the Content-Type header is \"application/json\"",
    ],
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
    notes: [
      "v1 proof-slice state resource merge",
      "legacy note: XAPI-00234 upstream comment - An LRS's State API performs a Document Merge if a profileId is found and both it and the document in the POST request have type \"application/json\". If the merge is successful, the LRS MUST respond with HTTP status code 204 No Content.",
    ],
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
