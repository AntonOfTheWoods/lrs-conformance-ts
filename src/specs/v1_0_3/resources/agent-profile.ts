import type { SuiteDefinition } from "../../../domain/contracts";
import { buildAgentProfileDocumentFixture, buildAgentProfileIdentityFixture } from "../../../fixtures/v2_0/documents";
import { requestSequenceCase, singleRequestCase } from "../../../registry/families";
import { specVersion, upstreamV103Root } from "../shared";

const agentProfileLegacySuiteFile = `${upstreamV103Root}/H.Communication2.6-AgentProfileResource.js`;

function buildVersionedRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  query: Record<string, string>,
  body?: unknown,
) {
  return {
    method,
    endpoint: "agents-profile" as const,
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
            name: "agent-profile-default",
          },
        }
      : undefined,
  };
}

export function createV103AgentProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-v1@example.test",
      name: "Agent Profile V1",
    }),
    profileId: "proof-agent-profile-v1",
  });
  const profileListIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-v1-list@example.test",
      name: "Agent Profile V1 List",
    }),
    profileId: "proof-agent-profile-v1-list",
  });
  const profileDocument = buildAgentProfileDocumentFixture();

  const endpointCase = singleRequestCase({
    caseId: "v1.agents-profile.endpoint-exists",
    title: "The Agent Profile Resource exists at /agents/profile",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00282",
        section: "Communication 2.6",
        title: "The Agent Profile Resource exists at /agents/profile",
      },
      {
        id: "XAPI-00283",
        section: "Communication 2.6.s3",
        title: "The Agent Profile Resource accepts POST requests",
      },
      {
        id: "XAPI-00272",
        section: "Communication 2.6.s3",
        title: "A successful Agent Profile POST returns 204",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "basics"],
    capabilityFlags: ["document", "agent-profile", "write"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("POST", profileIdentity, profileDocument),
    assertion: {
      status: 204,
    },
    notes: [
      "v1 proof-slice agent profile endpoint and post acceptance",
      "legacy note: XAPI-00282 upstream comment - An LRS has an Agent Profile API with endpoint \"base IRI\"+\"/agents/profile\"",
      "legacy note: XAPI-00282 upstream describe - An LRS has an Agent Profile Resource with endpoint \"base IRI\"+\"/agents/profile\"",
      "legacy note: XAPI-00283 upstream comment - An LRS will accept a POST request to the Agent Profile API",
      "legacy note: XAPI-00272 upstream comment - An LRS's Agent Profile API upon processing a successful POST request returns code 204 No Content",
    ],
  });

  const putAcceptedCase = singleRequestCase({
    caseId: "v1.agents-profile.put-accepted",
    title: "The Agent Profile Resource accepts PUT requests with 204 responses",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00273",
        section: "Communication 2.6.s3",
        title: "A successful Agent Profile PUT returns 204",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "basics"],
    capabilityFlags: ["document", "agent-profile", "write"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "PUT",
      {
        ...profileIdentity,
        profileId: "proof-agent-profile-v1-put",
      },
      profileDocument,
    ),
    assertion: {
      status: 204,
    },
    notes: [
      "v1 proof-slice agent profile put accepted",
      "legacy note: XAPI-00273 upstream comment - An LRS's Agent Profile API upon processing a successful PUT request returns code 204 No Content",
    ],
  });

  const getRoundTripCase = requestSequenceCase({
    caseId: "v1.agents-profile.get-roundtrip",
    title: "The Agent Profile Resource returns the stored document for a profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00274",
        section: "Communication 2.6.s2",
        title: "The Agent Profile Resource accepts GET requests",
      },
      {
        id: "XAPI-00259",
        section: "Communication 2.6",
        title: "Agent Profile GET returns profile content",
      },
      {
        id: "XAPI-00269",
        section: "Communication 2.6.s3",
        title: "Agent Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "roundtrip"],
    capabilityFlags: ["document", "agent-profile", "retrieval"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: [
      "v1 proof-slice agent profile get roundtrip",
      "legacy note: XAPI-00274 upstream comment - An LRS's Agent Profile API accepts valid GET requests with code 200 OK, Profile document",
      "legacy note: XAPI-00259 upstream comment - The Agent Profile API MUST return 200 OK - Profile Content when a GET request is received with a valid agent JSON Object.",
      "legacy note: XAPI-00269 upstream comment - An LRS's Agent Profile API upon processing a successful GET request with a valid Agent Object and valid \"profileId\" as a parameter returns the document satisfying the requirements of the GET and code 200 OK",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", profileIdentity, profileDocument),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", profileIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["preference"],
              equals: profileDocument.preference,
            },
          ],
        },
      },
    ],
  });

  const listAndSinceCase = requestSequenceCase({
    caseId: "v1.agents-profile.list-and-since",
    title: "The Agent Profile Resource lists ids and supports the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00270",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId returns matching ids",
      },
      {
        id: "XAPI-00268",
        section: "Communication 2.6.s4",
        title: "Agent Profile GET without profileId accepts since",
      },
      {
        id: "XAPI-00275",
        section: "Communication 2.6.s4",
        title: "Agent Profile list results can be filtered by since",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "list", "since"],
    capabilityFlags: ["document", "agent-profile", "list", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: [
      "v1 proof-slice agent profile list and since",
      "legacy note: XAPI-00270 upstream comment - An LRS's Agent Profile API upon processing a successful GET request with a valid Agent Object and without \"profileId\" as a parameter returns an array of ids of agent profile documents satisfying the requirements of the GET and code 200 OK",
      "legacy note: XAPI-00268 upstream comment - An LRS's Agent Profile API can process a GET request with \"since\" as a parameter. Returning 200 OK and all matching profiles after the date/time of the “since” parameter",
      "legacy note: XAPI-00275 upstream comment - The Agent Profile API's returned array of ids from a successful GET request all refer to documents stored after the TimeStamp in the \"since\" parameter of the GET request if such a parameter was present",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", profileListIdentity, profileDocument),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", {
          agent: profileListIdentity.agent,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: [profileListIdentity.profileId],
            },
          ],
        },
      },
      {
        request: buildVersionedRequest("GET", {
          agent: profileListIdentity.agent,
          since: "2015-11-18T12:17:00.000Z",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v1.agents-profile.invalid-since",
    title: "The Agent Profile Resource rejects invalid since values",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00260",
        section: "Communication 2.6.s4",
        title: "Agent Profile rejects invalid since values",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "since", "invalid"],
    capabilityFlags: ["document", "agent-profile", "list", "since", "validation"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", {
      agent: profileListIdentity.agent,
      since: "true",
    }),
    assertion: {
      status: 400,
    },
    notes: [
      "v1 proof-slice agent profile invalid since",
      "legacy note: XAPI-00260 upstream comment - An LRS's Agent Profile API rejects a GET request with \"since\" as a parameter if it is not a \"TimeStamp\", with error code 400 Bad Request",
      "legacy note: XAPI-00260 upstream describe - An LRS\\'s Agent Profile Resource rejects a GET request with \"since\" as a parameter if it is not a \"TimeStamp\", with error code 400 Bad Request",
    ],
  });

  const missingAndInvalidAgentCase = singleRequestCase({
    caseId: "v1.agents-profile.missing-and-invalid-agent-validation",
    title: "The Agent Profile Resource enforces valid agent query parameters",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00261",
        section: "Communication 2.6.s4.table1.row1",
        title: "Agent Profile rejects GET without agent",
      },
      {
        id: "XAPI-00284",
        section: "Communication 2.6",
        title: "Agent Profile rejects invalid JSON agent query values",
      },
      {
        id: "XAPI-00258",
        section: "Communication 2.6.s3.table1.row1",
        title: "Agent Profile rejects non-Agent query values",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "validation"],
    capabilityFlags: ["document", "agent-profile", "validation"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", {
      agent: "true",
    }),
    assertion: {
      status: 400,
    },
    notes: [
      "v1 proof-slice agent profile missing and invalid agent validation",
      "legacy note: XAPI-00261 upstream comment - An LRS's Agent Profile API rejects a GET request without \"agent\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00284 upstream comment - An LRS must reject with 400 Bad Request a POST request to the Activitiy Profile API which contains name/value pairs with invalid JSON and the Content-Type header is \"application/json\"",
      "legacy note: XAPI-00258 upstream comment - An LRS's Agent Profile API rejects a GET request with \"agent\" as a parameter if it is not an Agent Object with error code 400 Bad Request",
      "legacy note: XAPI-00258 upstream describe - An LRS\\'s Agent Profile Resource rejects a GET request with \"agent\" as a parameter if it is a valid, in structure, Agent with error code 400 Bad Request",
    ],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v1.agents-profile.document-merge",
    title: "The Agent Profile Resource merges JSON documents on POST",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00279",
        section: "Communication 2.2.s7",
        title: "Agent Profile performs JSON merge on POST",
      },
      {
        id: "XAPI-00278",
        section: "Communication 2.6.s3.table1.row3",
        title: "Agent Profile rejects non-JSON POST merges",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "merge"],
    capabilityFlags: ["document", "agent-profile", "merge"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: [
      "v1 proof-slice agent profile merge",
      "legacy note: XAPI-00279 upstream comment - An LRS's Agent Profile API performs a Document Merge if a profileId is found and both it and the document in the POST request have type \"application/json\" If the merge is successful, the LRS MUST respond with HTTP status code 204 No Content. not quite, but is this close enough??",
      "legacy note: XAPI-00278 upstream comment - An LRS's Agent Profile API, rejects a POST request if the document is found and either document's type is not \"application/json\" with error code 400 Bad Request",
      "legacy note: XAPI-00278 upstream describe - An LRSs Agent Profile Resource, rejects a POST request if the document is found and either documents type is not \"application/json\" with error code 400 Bad Request",
    ],
    steps: [
      {
        request: buildVersionedRequest("POST", profileIdentity, { car: "Honda" }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", profileIdentity, { type: "Civic" }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", profileIdentity),
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

  const deleteAcceptedCase = singleRequestCase({
    caseId: "v1.agents-profile.delete-accepted",
    title: "The Agent Profile Resource accepts DELETE requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00271",
        section: "Communication 2.6.s3",
        title: "A successful Agent Profile DELETE returns 204",
      },
      {
        id: "XAPI-00262",
        section: "Communication 2.6.s3.table1.row1",
        title: "Agent Profile rejects DELETE without agent",
      },
      {
        id: "XAPI-00265",
        section: "Communication 2.6.s3.table1.row2",
        title: "Agent Profile rejects DELETE without profileId",
      },
      {
        id: "XAPI-00255",
        section: "Communication 2.6.s3.table1.row1",
        title: "Agent Profile rejects DELETE with invalid agent value",
      },
    ],
    tags: ["v1.0.3", "agents-profile", "resource", "delete"],
    capabilityFlags: ["document", "agent-profile", "delete"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("DELETE", profileIdentity),
    assertion: {
      status: 204,
    },
    notes: [
      "v1 proof-slice agent profile delete accepted",
      "legacy note: XAPI-00271 upstream comment - An LRS's Agent Profile API upon processing a successful DELETE request deletes the associated profile and returns code 204 No Content",
      "legacy note: XAPI-00262 upstream comment - An LRS's Agent Profile API rejects a DELETE request without \"agent\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00265 upstream comment - An LRS's Agent Profile API rejects a DELETE request without \"profileId\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00255 upstream comment - An LRS's Agent Profile API rejects a DELETE request with \"agent\" as a parameter if it is not an Agent Object with error code 400 Bad Request",
      "legacy note: XAPI-00255 upstream describe - An LRS\\'s Agent Profile Resource rejects a DELETE request with \"agent\" as a parameter if it is not an Agent Object with error code 400 Bad Request",
    ],
  });

  return {
    type: "suite",
    id: "v1.proof-slice.agents-profile",
    title: "Agent Profile Resource",
    specVersion,
    tags: ["proof-slice", "agents-profile"],
    children: [
      {
        type: "suite",
        id: "v1.proof-slice.agents-profile.basics",
        title: "Agent Profile Basics",
        specVersion,
        tags: ["agents-profile", "basics"],
        children: [endpointCase, putAcceptedCase, deleteAcceptedCase, getRoundTripCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.agents-profile.list-and-validation",
        title: "Agent Profile List and Validation",
        specVersion,
        tags: ["agents-profile", "list", "validation"],
        children: [listAndSinceCase, invalidSinceCase, missingAndInvalidAgentCase, mergeCase],
      },
    ],
  };
}
