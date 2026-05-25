import {
  buildActivityStateDocumentFixture,
  buildActivityStateIdentityFixture,
  buildDocumentResourceValidationCase,
  buildProofUuid,
  buildVersionedRequest,
  documentRoundTripCase,
  existingNonJsonDocumentBody,
  invalidAgentQuery,
  invalidJsonDocumentBody,
  invalidLegacyString,
  invalidSerializedQueryBoolean,
  invalidSerializedQueryNumeric,
  invalidSerializedQueryObject,
  invalidSinceTimestamp,
  listEquals,
  nonJsonDocumentBody,
  omitQueryParam,
  parametersLegacySuiteFile,
  requestSequenceCase,
  singleRequestCase,
  specVersion,
  stateResourceLegacySuiteFile,
  validSinceTimestamp,
} from "./shared";
import type { SuiteDefinition } from "./shared";

export function createV20StateResourceProofSliceSuite(): SuiteDefinition {
  const stateDocument = buildActivityStateDocumentFixture();
  const stateIdentity = buildActivityStateIdentityFixture();
  const stateValidationIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/validation",
    stateId: "proof-state-validation",
  });
  const stateListIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/list",
    stateId: "proof-state-list",
  });
  const stateSinceIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/since",
    stateId: "proof-state-since",
  });
  const stateMergeIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge",
    stateId: "proof-state-merge",
  });
  const stateNonJsonPostRejectIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge-reject-post",
    stateId: "proof-state-merge-reject-post",
  });
  const stateExistingNonJsonRejectIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/merge-reject-existing",
    stateId: "proof-state-merge-reject-existing",
  });
  const stateDeleteIdentity = buildActivityStateIdentityFixture({
    activityId: "https://example.test/xapi/activities/state-proof-slice/delete",
    stateId: "proof-state-delete",
  });
  const stateRegistrationPutIdentity = {
    ...buildActivityStateIdentityFixture({
      activityId: "https://example.test/xapi/activities/state-proof-slice/registration-put",
      stateId: "proof-state-registration-put",
    }),
    registration: buildProofUuid(9800),
  };
  const stateRegistrationPostIdentity = {
    ...buildActivityStateIdentityFixture({
      activityId: "https://example.test/xapi/activities/state-proof-slice/registration-post",
      stateId: "proof-state-registration-post",
    }),
    registration: buildProofUuid(9801),
  };
  const stateRegistrationGetIdentity = {
    ...buildActivityStateIdentityFixture({
      activityId: "https://example.test/xapi/activities/state-proof-slice/registration-get",
      stateId: "proof-state-registration-get",
    }),
    registration: buildProofUuid(9802),
  };
  const stateRegistrationDeleteIdentity = {
    ...buildActivityStateIdentityFixture({
      activityId: "https://example.test/xapi/activities/state-proof-slice/registration-delete",
      stateId: "proof-state-registration-delete",
    }),
    registration: buildProofUuid(9803),
  };
  const stateRequestBody = {
    value: stateDocument,
    fixtureName: "activity-state-default",
  };
  const stateListQuery = {
    activityId: stateListIdentity.activityId,
    agent: stateListIdentity.agent,
  };
  const stateSinceQuery = {
    activityId: stateSinceIdentity.activityId,
    agent: stateSinceIdentity.agent,
  };
  const stateDeleteQuery = {
    activityId: stateDeleteIdentity.activityId,
    agent: stateDeleteIdentity.agent,
  };
  function buildStateTraceIdentity(idSuffix: string) {
    return buildActivityStateIdentityFixture({
      activityId: `https://example.test/xapi/activities/state-proof-slice/${idSuffix}`,
      stateId: `proof-state-${idSuffix}`,
    });
  }

  const stateEndpointIdentity = buildStateTraceIdentity("endpoint");
  const statePutAcceptedIdentity = buildStateTraceIdentity("put-accepted");
  const statePostAcceptedIdentity = buildStateTraceIdentity("post-accepted");
  const stateGetAcceptedIdentity = buildStateTraceIdentity("get-accepted");
  const stateGetByStateIdIdentity = buildStateTraceIdentity("get-by-state-id");
  const stateSinceAcceptedIdentity = buildStateTraceIdentity("since-accepted");
  const statePostAsPutIdentity = buildStateTraceIdentity("post-as-put");
  const stateNonJsonTypeRejectIdentity = buildStateTraceIdentity("merge-reject-type");
  const stateInvalidJsonMergeRejectIdentity = buildStateTraceIdentity("merge-reject-invalid-json");
  const stateDeleteAcceptedIdentity = buildStateTraceIdentity("delete-accepted");
  const stateDeleteByStateIdIdentity = buildStateTraceIdentity("delete-by-state-id");
  const stateDeleteStateIdAcceptedIdentity = buildStateTraceIdentity("delete-state-id-accepted");
  const stateLastModifiedIdentity = buildStateTraceIdentity("last-modified");
  const updatedStateDocument = {
    bookmark: "chapter-9",
    progress: {
      attempts: 9,
      complete: false,
    },
    context: {
      location: "lab-9",
    },
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
    notes: [
      "proof-slice activity state roundtrip",
      'legacy note: XAPI-00192 upstream comment - An LRS\'s State API upon processing a successful GET request with a valid "stateId" as a parameter returns the document satisfying the requirements of the GET and code 200 OK NOTE: There is no requirement here that the LRS reacts to the "since" parameter in the case of a GET request with valid "stateId" - this is intentional',
    ],
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
    notes: [
      "proof-slice activity state list",
      'legacy note: XAPI-00193 upstream comment - An LRS\'s State API upon processing a successful GET request without "stateId" as a parameter returns an array of ids of state data documents satisfying the requirements of the GET and code 200 OK',
    ],
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

  const stateSinceCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list-since",
    title: "The State Resource filters listed state ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00221",
        section: "Communication 2.3.s4",
        title: "State Resource GET without stateId accepts since",
      },
      {
        id: "XAPI-00195",
        section: "Communication 2.3.s4",
        title: "State Resource list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state since filtering",
      'legacy note: XAPI-00221 upstream comment - An LRS\'s State API can process a GET request with "since" as a parameter. Returning 200 OK and all matching profiles after the date/time of the “since” parameter.',
      'legacy note: XAPI-00195 upstream comment - An LRS\'s returned array of ids from a successful GET request all refer to documents stored after the TimeStamp in the "since" parameter of the GET request',
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateSinceIdentity, {
          value: buildActivityStateDocumentFixture(),
          fixtureName: "activity-state-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", {
          ...stateSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateSinceIdentity.stateId]),
        },
      },
    ],
  });

  const stateInvalidSinceCase = singleRequestCase({
    caseId: "v2.activities-state.invalid-since",
    title: "The State Resource rejects an invalid since value when listing state ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00204",
        section: "Communication 2.3.s4",
        title: "State Resource rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities-state", {
      activityId: stateSinceIdentity.activityId,
      agent: stateSinceIdentity.agent,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: [
      "proof-slice activity state invalid since",
      'legacy note: XAPI-00204 upstream comment - An LRS\'s State API rejects a GET request with "since" as a parameter if it is not a "TimeStamp", with error code 400 Bad Request',
    ],
  });

  const stateInvalidAgentQueryCase = singleRequestCase({
    caseId: "v2.activities-state.document-invalid-agent-query",
    title: "The State Resource rejects a POST request whose agent query value is not valid JSON",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00235",
        section: "Communication 2.3",
        title: "State Resource rejects invalid JSON agent query values",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "invalid", "agent-query"],
    capabilityFlags: ["document", "state", "invalid", "agent-query"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "activities-state",
      {
        ...stateMergeIdentity,
        stateId: `${stateMergeIdentity.stateId}-invalid-agent`,
        agent: invalidAgentQuery,
      },
      {
        value: {
          car: "Honda",
        },
      },
    ),
    assertion: {
      status: 400,
    },
    notes: [
      "proof-slice activity state invalid agent query",
      'legacy note: XAPI-00235 upstream comment - An LRS must reject with 400 Bad Request a POST request to the State API which contains name/value pairs with invalid JSON and the Content-Type header is "application/json"',
    ],
  });

  const stateMergeCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge",
    title: "The State Resource merges JSON documents on POST when a state document already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00234",
        section: "Communication 2.2.s7",
        title: "State Resource performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge"],
    capabilityFlags: ["document", "merge", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state merge",
      'legacy note: XAPI-00234 upstream comment - An LRS\'s State API performs a Document Merge if a profileId is found and both it and the document in the POST request have type "application/json". If the merge is successful, the LRS MUST respond with HTTP status code 204 No Content.',
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateMergeIdentity),
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

  const stateNonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-non-json-post",
    title: "The State Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state non-json incoming merge rejection",
      "legacy note: merge rejection scenario case 1 (incoming POST body is non-JSON)",
      "legacy note: XAPI-00229 upstream comment - An LRS's State API, rejects a POST request if the document is found and either document is not a valid JSON Object",
      "legacy note: XAPI-00229 upstream describe - An LRSs State Resource, rejects a POST request if the document is found and either document is not a valid JSON Object",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "not/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateNonJsonPostRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const stateExistingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-existing-non-json",
    title: "The State Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state existing non-json merge rejection",
      "legacy note: merge rejection scenario case 2 (existing stored document is non-JSON)",
      "legacy note: XAPI-00229 upstream comment - An LRS's State API, rejects a POST request if the document is found and either document is not a valid JSON Object",
      "legacy note: XAPI-00229 upstream describe - An LRSs State Resource, rejects a POST request if the document is found and either document is not a valid JSON Object",
    ],
    steps: [
      {
        request: buildVersionedRequest("PUT", "activities-state", stateExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateExistingNonJsonRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: existingNonJsonDocumentBody,
            },
          ],
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
    notes: [
      "proof-slice activity state delete",
      'legacy note: XAPI-00194 upstream comment - An LRS\'s State API upon processing a successful DELETE request without "stateId" as a parameter deletes documents satisfying the requirements of the DELETE and code 204 No Content',
    ],
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

  const stateEndpointCase = singleRequestCase({
    caseId: "v2.activities-state.endpoint",
    title: 'The State Resource is available at "base IRI"+"/activities/state"',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00230",
        section: "Communication 2.2.s3.table1.row1",
        title: 'State Resource is available at "base IRI"+"/activities/state"',
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "endpoint"],
    capabilityFlags: ["document", "state", "endpoint"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("POST", "activities-state", stateEndpointIdentity, stateRequestBody),
    assertion: {
      status: 204,
    },
    notes: [
      "proof-slice activity state endpoint",
      'legacy note: XAPI-00230 upstream comment - An LRS has a State API with endpoint "base IRI"+"/activities/state"',
    ],
  });

  const statePutAcceptedCase = singleRequestCase({
    caseId: "v2.activities-state.accepts.put",
    title: "The State Resource accepts PUT requests with 204 No Content",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00190",
        section: "Communication 2.3",
        title: "State Resource accepts PUT requests with 204 No Content",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "write"],
    capabilityFlags: ["document", "state", "write"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("PUT", "activities-state", statePutAcceptedIdentity, stateRequestBody),
    assertion: {
      status: 204,
    },
    notes: [
      "proof-slice activity state put accepted",
      "legacy note: XAPI-00190 upstream comment - An LRS's State API upon processing a successful PUT request returns code 204 No Content",
    ],
  });

  const statePostAcceptedCase = singleRequestCase({
    caseId: "v2.activities-state.accepts.post",
    title: "The State Resource accepts POST requests with 204 No Content",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00189",
        section: "Communication 2.3",
        title: "State Resource accepts POST requests with 204 No Content",
      },
      {
        id: "XAPI-00231",
        section: "Communication 2.3",
        title: "State Resource accepts POST requests",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "write"],
    capabilityFlags: ["document", "state", "write"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    request: buildVersionedRequest("POST", "activities-state", statePostAcceptedIdentity, stateRequestBody),
    assertion: {
      status: 204,
    },
    notes: [
      "proof-slice activity state post accepted",
      "legacy note: successful State POST returns 204 No Content",
      "legacy note: State API accepts POST requests",
      "legacy note: XAPI-00189 upstream comment - An LRS's State API upon processing a successful POST request returns code 204 No Content",
      "legacy note: XAPI-00231 upstream comment - An LRS will accept a POST request to the State API",
    ],
  });

  const stateGetAcceptedCase = documentRoundTripCase({
    caseId: "v2.activities-state.accepts.get",
    title: "The State Resource accepts GET requests and returns the stored document",
    specVersion,
    endpoint: "activities-state",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00188",
        section: "Communication 2.3",
        title: "State Resource accepts GET requests and returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "retrieval"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    query: stateGetAcceptedIdentity,
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
    notes: [
      "proof-slice activity state get accepted",
      "legacy note: XAPI-00188 upstream comment - An LRS's State API upon processing a successful GET request returns 200 Ok, State Document",
    ],
  });

  const stateGetByStateIdCase = documentRoundTripCase({
    caseId: "v2.activities-state.accepts.get-with-state-id",
    title: "The State Resource can process GET requests with stateId",
    specVersion,
    endpoint: "activities-state",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00217",
        section: "Communication 2.3.s3.table1.row4",
        title: "State Resource can process GET requests with stateId",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "retrieval", "stateId"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    query: stateGetByStateIdIdentity,
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
    capabilityFlags: ["document", "retrieval", "state", "stateId"],
    notes: [
      "proof-slice activity state get with stateId accepted",
      "legacy note: no conformance requirement mandates additional since filtering behavior when GET includes a valid stateId",
      'legacy note: XAPI-00217 upstream comment - An LRS\'s State API can process a GET request with "stateId" as a parameter',
    ],
  });

  const stateSinceAcceptedCase = requestSequenceCase({
    caseId: "v2.activities-state.document-list-since-accepted",
    title: "The State Resource can process GET requests with the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00221",
        section: "Communication 2.3.s4.table1.row4",
        title: "State Resource can process GET requests with since",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "list", "since"],
    capabilityFlags: ["document", "list", "state", "since"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state since accepted",
      'legacy note: XAPI-00221 upstream comment - An LRS\'s State API can process a GET request with "since" as a parameter. Returning 200 OK and all matching profiles after the date/time of the “since” parameter.',
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateSinceAcceptedIdentity, stateRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", {
          activityId: stateSinceAcceptedIdentity.activityId,
          agent: stateSinceAcceptedIdentity.agent,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([stateSinceAcceptedIdentity.stateId]),
        },
      },
    ],
  });

  const statePostAsPutCase = requestSequenceCase({
    caseId: "v2.activities-state.document-post-as-put",
    title: "The State Resource treats POST as PUT when no document exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00233",
        section: "Communication 2.2.s7",
        title: "State Resource treats POST as PUT when no document exists",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "write"],
    capabilityFlags: ["document", "state", "write"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state post as put",
      "legacy note: XAPI-00233 upstream comment - An LRS's State API, upon receiving a POST request for a document not currently in the LRS, treats it as a PUT request and store a new document. Returning 204 No Content",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", statePostAsPutIdentity, stateRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", statePostAsPutIdentity),
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

  const stateNonJsonTypeRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-non-json-type",
    title: "The State Resource rejects POST merges when either document type is not application or json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00232",
        section: "Communication 2.2.s8.b1",
        title: "State Resource rejects POST merges when either document type is not application or json",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "state", "invalid"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state non-json type merge rejection",
      "legacy note: XAPI-00232 upstream comment - An LRS's State API, rejects a POST request if the document is found and either document's type is not \"application/json\" with error code 400 Bad Request",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonTypeRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateNonJsonTypeRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "not/json",
        }),
        assertion: {
          status: 400,
        },
      },
    ],
  });

  const stateInvalidJsonMergeRejectCase = requestSequenceCase({
    caseId: "v2.activities-state.document-merge-rejects-invalid-json-body",
    title: "The State Resource rejects POST merges when the incoming JSON document body is invalid",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00229",
        section: "Communication 2.3.s3.table1.row3",
        title: "State Resource rejects invalid JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "merge", "invalid", "json"],
    capabilityFlags: ["document", "merge", "state", "invalid", "json"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state invalid JSON merge rejection",
      "legacy note: merge rejection scenario case 3 (incoming JSON body is syntactically invalid)",
      "legacy note: XAPI-00229 upstream comment - An LRS's State API, rejects a POST request if the document is found and either document is not a valid JSON Object",
      "legacy note: XAPI-00229 upstream describe - An LRSs State Resource, rejects a POST request if the document is found and either document is not a valid JSON Object",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateInvalidJsonMergeRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateInvalidJsonMergeRejectIdentity, {
          kind: "text",
          value: invalidJsonDocumentBody,
          contentType: "application/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateInvalidJsonMergeRejectIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["car"],
              equals: "Honda",
            },
          ],
        },
      },
    ],
  });

  const stateDeleteAcceptedCase = requestSequenceCase({
    caseId: "v2.activities-state.accepts.delete",
    title: "The State Resource accepts DELETE requests with stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00187",
        section: "Communication 2.3",
        title: "State Resource accepts DELETE requests with 204 No Content",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "delete"],
    capabilityFlags: ["document", "delete", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state delete accepted",
      "legacy note: XAPI-00187 upstream comment - An LRS's State API upon processing a successful DELETE request returns code 204 No Content",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateDeleteAcceptedIdentity, stateRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-state", stateDeleteAcceptedIdentity),
        assertion: {
          status: 204,
        },
      },
    ],
  });

  const stateDeleteByStateIdCase = requestSequenceCase({
    caseId: "v2.activities-state.delete-by-state-id",
    title: "The State Resource deletes a stored document when DELETE includes stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00191",
        section: "Communication 2.3.s3",
        title: "State Resource deletes a stored document when DELETE includes stateId",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "delete", "stateId"],
    capabilityFlags: ["document", "delete", "state", "stateId"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state delete by stateId",
      'legacy note: XAPI-00191 upstream comment - An LRS\'s State API upon processing a successful DELETE request with a valid "stateId" as a parameter deletes the document satisfying the requirements of the DELETE and returns code 204 No Content NOTE: There is no requirement here that the LRS reacts to the "since" parameter in the case of a DELETE request with valid "stateId" - this is intentional',
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateDeleteByStateIdIdentity, stateRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-state", stateDeleteByStateIdIdentity),
        assertion: {
          status: 204,
        },
      },
    ],
  });

  const stateDeleteStateIdAcceptedCase = requestSequenceCase({
    caseId: "v2.activities-state.accepts.delete-with-state-id",
    title: "The State Resource can process DELETE requests with stateId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00216",
        section: "Communication 2.3.s3.table1.row4",
        title: "State Resource can process DELETE requests with stateId",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "delete", "stateId"],
    capabilityFlags: ["document", "delete", "state", "stateId"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: [
      "proof-slice activity state delete with stateId accepted",
      'legacy note: XAPI-00216 upstream comment - An LRS\'s State API can process a DELETE request with "stateId" as a parameter',
    ],
    steps: [
      {
        request: buildVersionedRequest(
          "POST",
          "activities-state",
          stateDeleteStateIdAcceptedIdentity,
          stateRequestBody,
        ),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("DELETE", "activities-state", stateDeleteStateIdAcceptedIdentity),
        assertion: {
          status: 204,
        },
      },
    ],
  });

  const stateLastModifiedExistsCase = requestSequenceCase({
    caseId: "v2.activities-state.headers.last-modified-present",
    title: "The State Resource includes a Last-Modified header on successful GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-STATE-LAST-MODIFIED-PRESENT",
        section: "Communication 2.3",
        title: "State Resource GET responses include Last-Modified",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "headers"],
    capabilityFlags: ["document", "headers", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state last-modified present"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateLastModifiedIdentity, stateRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateLastModifiedIdentity),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "last-modified",
              pattern:
                "(^[A-Z][a-z]{2}, \\d{2} [A-Z][a-z]{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT$)|(^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?Z$)",
            },
          ],
        },
      },
    ],
  });

  const stateLastModifiedUpdatesCase = requestSequenceCase({
    caseId: "v2.activities-state.headers.last-modified-updates",
    title: "The State Resource updates Last-Modified when the stored document changes",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-STATE-LAST-MODIFIED-UPDATES",
        section: "Communication 2.3",
        title: "State Resource updates Last-Modified when the stored document changes",
      },
    ],
    tags: ["v2.0.0", "activities-state", "document", "headers"],
    capabilityFlags: ["document", "headers", "state"],
    legacyTraceSuiteFile: stateResourceLegacySuiteFile,
    notes: ["proof-slice activity state last-modified updates"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-state", stateLastModifiedIdentity, stateRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateLastModifiedIdentity),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "last-modified",
              pattern:
                "(^[A-Z][a-z]{2}, \\d{2} [A-Z][a-z]{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT$)|(^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?Z$)",
            },
          ],
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-state", stateLastModifiedIdentity, {
          value: updatedStateDocument,
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-state", stateLastModifiedIdentity),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "last-modified",
              pattern:
                "(^[A-Z][a-z]{2}, \\d{2} [A-Z][a-z]{2} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT$)|(^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?Z$)",
            },
          ],
          expectedHeaderDateAfterStep: [
            {
              key: "last-modified",
              fromStep: 2,
            },
          ],
          jsonPathEquals: [
            {
              path: ["bookmark"],
              equals: updatedStateDocument.bookmark,
            },
          ],
        },
      },
    ],
  });

  const stateValidationCases = [
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-activityId.put",
      title: "The State Resource rejects PUT without activityId",
      specVersion,
      endpoint: "activities-state",
      method: "PUT",
      query: omitQueryParam(stateValidationIdentity, "activityId"),
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00210",
          section: "Communication 2.3.s3.table1.row1",
          title: "State Resource rejects PUT without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "activityId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00210 upstream comment - An LRS\'s State API rejects a PUT request without "activityId" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-activityId.post",
      title: "The State Resource rejects POST without activityId",
      specVersion,
      endpoint: "activities-state",
      method: "POST",
      query: omitQueryParam(stateValidationIdentity, "activityId"),
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00209",
          section: "Communication 2.3.s3.table1.row1",
          title: "State Resource rejects POST without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "activityId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00209 upstream comment - An LRS\'s State API rejects a POST request without "activityId" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-activityId.get",
      title: "The State Resource rejects GET without activityId",
      specVersion,
      endpoint: "activities-state",
      method: "GET",
      query: omitQueryParam(stateValidationIdentity, "activityId"),
      requirementRefs: [
        {
          id: "XAPI-00208",
          section: "Communication 2.3.s3.table1.row1",
          title: "State Resource rejects GET without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "activityId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00208 upstream comment - An LRS\'s State API rejects a GET request without "activityId" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-activityId.delete",
      title: "The State Resource rejects DELETE without activityId",
      specVersion,
      endpoint: "activities-state",
      method: "DELETE",
      query: omitQueryParam(stateValidationIdentity, "activityId"),
      requirementRefs: [
        {
          id: "XAPI-00207",
          section: "Communication 2.3.s3.table1.row1",
          title: "State Resource rejects DELETE without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "activityId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00207 upstream comment - An LRS\'s State API rejects a DELETE request without "activityId" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-agent.put",
      title: "The State Resource rejects PUT without agent",
      specVersion,
      endpoint: "activities-state",
      method: "PUT",
      query: omitQueryParam(stateValidationIdentity, "agent"),
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00215",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects PUT without agent",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00215 upstream comment - An LRS\'s State API rejects a PUT request without "agent" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-agent.put",
      title: "The State Resource rejects PUT with an invalid agent query value",
      specVersion,
      endpoint: "activities-state",
      method: "PUT",
      query: {
        ...stateValidationIdentity,
        agent: "true",
      },
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00199",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects PUT with a non-JSON agent parameter",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00199 upstream comment - An LRS\'s State API rejects a PUT request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-agent.post",
      title: "The State Resource rejects POST without agent",
      specVersion,
      endpoint: "activities-state",
      method: "POST",
      query: omitQueryParam(stateValidationIdentity, "agent"),
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00214",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects POST without agent",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00214 upstream comment - An LRS\'s State API rejects a POST request without "agent" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-agent.post",
      title: "The State Resource rejects POST with an invalid agent query value",
      specVersion,
      endpoint: "activities-state",
      method: "POST",
      query: {
        ...stateValidationIdentity,
        agent: "true",
      },
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00198",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects POST with a non-JSON agent parameter",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00198 upstream comment - An LRS\'s State API rejects a POST request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
        'legacy note: XAPI-00198 upstream describe - An LRS\\\'s State Resource rejects a POST request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-agent.get",
      title: "The State Resource rejects GET without agent",
      specVersion,
      endpoint: "activities-state",
      method: "GET",
      query: omitQueryParam(stateValidationIdentity, "agent"),
      requirementRefs: [
        {
          id: "XAPI-00213",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects GET without agent",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00213 upstream comment - An LRS\'s State API rejects a GET request without "agent" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-agent.get",
      title: "The State Resource rejects GET with an invalid agent query value",
      specVersion,
      endpoint: "activities-state",
      method: "GET",
      query: {
        ...stateValidationIdentity,
        agent: "true",
      },
      requirementRefs: [
        {
          id: "XAPI-00197",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects GET with a non-JSON agent parameter",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00197 upstream comment - An LRS\'s State API rejects a GET request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
        'legacy note: XAPI-00197 upstream describe - An LRS\\\'s State Resource rejects a GET request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-agent.delete",
      title: "The State Resource rejects DELETE without agent",
      specVersion,
      endpoint: "activities-state",
      method: "DELETE",
      query: omitQueryParam(stateValidationIdentity, "agent"),
      requirementRefs: [
        {
          id: "XAPI-00212",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects DELETE without agent",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00212 upstream comment - An LRS\'s State API rejects a DELETE request without "agent" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-agent.delete",
      title: "The State Resource rejects DELETE with an invalid agent query value",
      specVersion,
      endpoint: "activities-state",
      method: "DELETE",
      query: {
        ...stateValidationIdentity,
        agent: "true",
      },
      requirementRefs: [
        {
          id: "XAPI-00196",
          section: "Communication 2.3.s3.table1.row2",
          title: "State Resource rejects DELETE with a non-JSON agent parameter",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "agent"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00196 upstream comment - An LRS\'s State API rejects a DELETE request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
        'legacy note: XAPI-00196 upstream describe - An LRS\\\'s State Resource rejects a DELETE request with "agent" as a parameter if it is not in JSON format with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-registration.put",
      title: "The State Resource rejects PUT with a non-UUID registration",
      specVersion,
      endpoint: "activities-state",
      method: "PUT",
      query: {
        ...stateValidationIdentity,
        registration: invalidLegacyString,
      },
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00203",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource rejects PUT with a non-UUID registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "registration"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00203 upstream comment - An LRS\'s State API rejects a PUT request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
        'legacy note: XAPI-00203 upstream describe - An LRS\\\'s State Resource rejects a PUT request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-registration.post",
      title: "The State Resource rejects POST with a non-UUID registration",
      specVersion,
      endpoint: "activities-state",
      method: "POST",
      query: {
        ...stateValidationIdentity,
        registration: invalidLegacyString,
      },
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00202",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource rejects POST with a non-UUID registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "registration"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00202 upstream comment - An LRS\'s State API rejects a POST request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
        'legacy note: XAPI-00202 upstream describe - An LRS\\\'s State Resource rejects a POST request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-registration.get",
      title: "The State Resource rejects GET with a non-UUID registration",
      specVersion,
      endpoint: "activities-state",
      method: "GET",
      query: {
        ...stateValidationIdentity,
        registration: invalidLegacyString,
      },
      requirementRefs: [
        {
          id: "XAPI-00201",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource rejects GET with a non-UUID registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "registration"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00201 upstream comment - An LRS\'s State API rejects a GET request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
        'legacy note: XAPI-00201 upstream describe - An LRS\\\'s State Resource rejects a GET request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-registration.delete",
      title: "The State Resource rejects DELETE with a non-UUID registration",
      specVersion,
      endpoint: "activities-state",
      method: "DELETE",
      query: {
        ...stateValidationIdentity,
        registration: invalidLegacyString,
      },
      requirementRefs: [
        {
          id: "XAPI-00200",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource rejects DELETE with a non-UUID registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "registration"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00200 upstream comment - An LRS\'s State API rejects a DELETE request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
        'legacy note: XAPI-00200 upstream describe - An LRS\\\'s State Resource rejects a DELETE request with "registration" as a parameter if it is not a UUID with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-stateId.put",
      title: "The State Resource rejects PUT without stateId",
      specVersion,
      endpoint: "activities-state",
      method: "PUT",
      query: omitQueryParam(stateValidationIdentity, "stateId"),
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00206",
          section: "Communication 2.3.s3.table1.row4",
          title: "State Resource rejects PUT without stateId",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "stateId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00206 upstream comment - An LRS\'s State API rejects a PUT request without "stateId" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.missing-stateId.post",
      title: "The State Resource rejects POST without stateId",
      specVersion,
      endpoint: "activities-state",
      method: "POST",
      query: omitQueryParam(stateValidationIdentity, "stateId"),
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00211",
          section: "Communication 2.3.s3.table1.row4",
          title: "State Resource rejects POST without stateId",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "stateId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,

      notes: [
        'legacy note: XAPI-00211 upstream comment - An LRS\'s State API rejects a POST request without "stateId" as a parameter with error code 400 Bad Request',
      ],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-stateId.put",
      title: "The State Resource rejects PUT when stateId is not a string",
      specVersion,
      endpoint: "activities-state",
      method: "PUT",
      query: {
        ...stateValidationIdentity,
        stateId: invalidSerializedQueryNumeric,
      },
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00228",
          section: "Communication 2.3 table1 row1.a",
          title: "State Resource rejects PUT when stateId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "stateId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
      expectedStatus: 400,

      notes: ["legacy note: XAPI-00228 upstream comment - in Parameters folder"],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-stateId.post",
      title: "The State Resource rejects POST when stateId is not a string",
      specVersion,
      endpoint: "activities-state",
      method: "POST",
      query: {
        ...stateValidationIdentity,
        stateId: invalidSerializedQueryBoolean,
      },
      body: stateRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00226",
          section: "Communication 2.3 table1 row1.a",
          title: "State Resource rejects POST when stateId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "stateId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
      expectedStatus: 400,

      notes: ["legacy note: XAPI-00226 upstream comment - in Parameters folder"],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-stateId.get",
      title: "The State Resource rejects GET when stateId is not a string",
      specVersion,
      endpoint: "activities-state",
      method: "GET",
      query: {
        ...stateValidationIdentity,
        stateId: invalidSerializedQueryObject,
      },
      requirementRefs: [
        {
          id: "XAPI-00225",
          section: "Communication 2.3 table1 row1.a",
          title: "State Resource rejects GET when stateId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "stateId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
      expectedStatus: 400,

      notes: ["legacy note: XAPI-00225 upstream comment - in Parameters folder"],
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-state.validation.invalid-stateId.delete",
      title: "The State Resource rejects DELETE when stateId is not a string",
      specVersion,
      endpoint: "activities-state",
      method: "DELETE",
      query: {
        ...stateValidationIdentity,
        stateId: invalidSerializedQueryNumeric,
      },
      requirementRefs: [
        {
          id: "XAPI-00224",
          section: "Communication 2.3 table1 row1.a",
          title: "State Resource rejects DELETE when stateId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-state", "validation", "stateId"],
      capabilityFlags: ["document", "state", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
      expectedStatus: 400,

      notes: ["legacy note: XAPI-00224 upstream comment - in Parameters folder"],
    }),
  ];

  const stateRegistrationCases = [
    singleRequestCase({
      caseId: "v2.activities-state.registration.put",
      title: "The State Resource accepts PUT with a registration parameter",
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00218",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource accepts PUT with registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "registration"],
      capabilityFlags: ["document", "state", "registration"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,
      request: buildVersionedRequest("PUT", "activities-state", stateRegistrationPutIdentity, stateRequestBody),
      assertion: {
        status: 204,
      },
      notes: [
        "proof-slice activity state registration PUT",
        'legacy note: XAPI-00218 upstream comment - An LRS\'s State API can process a PUT request with "registration" as a parameter',
      ],
    }),
    singleRequestCase({
      caseId: "v2.activities-state.registration.post",
      title: "The State Resource accepts POST with a registration parameter",
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00227",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource accepts POST with registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "registration"],
      capabilityFlags: ["document", "state", "registration"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,
      request: buildVersionedRequest("POST", "activities-state", stateRegistrationPostIdentity, stateRequestBody),
      assertion: {
        status: 204,
      },
      notes: [
        "proof-slice activity state registration POST",
        'legacy note: XAPI-00227 upstream comment - An LRS\'s State API can process a POST request with "registration" as a parameter',
      ],
    }),
    requestSequenceCase({
      caseId: "v2.activities-state.registration.get",
      title: "The State Resource can retrieve a document scoped by registration",
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00220",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource accepts GET with registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "registration"],
      capabilityFlags: ["document", "state", "registration", "retrieval"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,
      notes: [
        "proof-slice activity state registration GET",
        'legacy note: XAPI-00220 upstream comment - An LRS\'s State API can process a GET request with "registration" as a parameter',
      ],
      steps: [
        {
          request: buildVersionedRequest("POST", "activities-state", stateRegistrationGetIdentity, stateRequestBody),
          assertion: {
            status: 204,
          },
        },
        {
          request: buildVersionedRequest("GET", "activities-state", stateRegistrationGetIdentity),
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
    }),
    requestSequenceCase({
      caseId: "v2.activities-state.registration.delete",
      title: "The State Resource accepts DELETE with a registration parameter",
      specVersion,
      requirementRefs: [
        {
          id: "XAPI-00219",
          section: "Communication 2.3.s3.table1.row3",
          title: "State Resource accepts DELETE with registration",
        },
      ],
      tags: ["v2.0.0", "activities-state", "registration"],
      capabilityFlags: ["document", "state", "registration", "delete"],
      legacyTraceSuiteFile: stateResourceLegacySuiteFile,
      notes: [
        "proof-slice activity state registration DELETE",
        'legacy note: XAPI-00219 upstream comment - An LRS\'s State API can process a DELETE request with "registration" as a parameter',
      ],
      steps: [
        {
          request: buildVersionedRequest("POST", "activities-state", stateRegistrationDeleteIdentity, stateRequestBody),
          assertion: {
            status: 204,
          },
        },
        {
          request: buildVersionedRequest("DELETE", "activities-state", stateRegistrationDeleteIdentity),
          assertion: {
            status: 204,
          },
        },
      ],
    }),
  ];

  return {
    type: "suite",
    id: "v2.proof-slice.activities-state",
    title: "State Resource",
    specVersion,
    tags: ["proof-slice", "activities-state"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.acceptance",
        title: "State Document Acceptance",
        specVersion,
        tags: ["acceptance"],
        children: [stateEndpointCase, statePutAcceptedCase, statePostAcceptedCase, stateGetAcceptedCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.roundtrip",
        title: "State Document Roundtrip",
        specVersion,
        tags: ["roundtrip"],
        children: [stateRoundTripCase, stateGetByStateIdCase],
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
        id: "v2.proof-slice.activities-state.since",
        title: "State Document Since",
        specVersion,
        tags: ["list", "since"],
        children: [stateSinceCase, stateSinceAcceptedCase, stateInvalidSinceCase, stateInvalidAgentQueryCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.merge",
        title: "State Document Merge",
        specVersion,
        tags: ["merge"],
        children: [
          stateMergeCase,
          statePostAsPutCase,
          stateNonJsonPostRejectCase,
          stateNonJsonTypeRejectCase,
          stateExistingNonJsonRejectCase,
          stateInvalidJsonMergeRejectCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.deletion",
        title: "State Document Deletion",
        specVersion,
        tags: ["delete"],
        children: [stateDeleteAcceptedCase, stateDeleteByStateIdCase, stateDeleteStateIdAcceptedCase, stateDeleteCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.headers",
        title: "State Document Headers",
        specVersion,
        tags: ["headers"],
        children: [stateLastModifiedExistsCase, stateLastModifiedUpdatesCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.validation",
        title: "State Document Validation",
        specVersion,
        tags: ["validation"],
        children: stateValidationCases,
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-state.registration",
        title: "State Document Registration",
        specVersion,
        tags: ["registration"],
        children: stateRegistrationCases,
      },
    ],
  };
}
