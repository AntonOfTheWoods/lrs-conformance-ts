import {
  agentProfileLegacySuiteFile,
  buildAgentProfileDocumentFixture,
  buildAgentProfileIdentityFixture,
  buildDocumentResourceValidationCase,
  buildVersionedRequest,
  documentRoundTripCase,
  existingNonJsonDocumentBody,
  invalidAgentQuery,
  invalidJsonDocumentBody,
  invalidSerializedQueryBoolean,
  invalidSerializedQueryObject,
  invalidSinceTimestamp,
  listEquals,
  nonJsonDocumentBody,
  omitQueryParam,
  parametersLegacySuiteFile,
  requestSequenceCase,
  rfc1123HeaderPattern,
  singleRequestCase,
  specVersion,
  validSinceTimestamp,
} from "./shared";
import type {
  SuiteDefinition,
} from "./shared";

export function createV20AgentProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildAgentProfileDocumentFixture();
  const profileIdentity = buildAgentProfileIdentityFixture();
  const profileValidationIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-validation@example.test",
      name: "Agent Profile Validation",
    }),
    profileId: "proof-agent-profile-validation",
  });
  const profileListIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-list@example.test",
      name: "Agent Profile List",
    }),
    profileId: "proof-agent-profile-list",
  });
  const profileSinceIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-since@example.test",
      name: "Agent Profile Since",
    }),
    profileId: "proof-agent-profile-since",
  });
  const profileMergeIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge@example.test",
      name: "Agent Profile Merge",
    }),
    profileId: "proof-agent-profile-merge",
  });
  const profileNonJsonPostRejectIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge-reject-post@example.test",
      name: "Agent Profile Merge Reject Post",
    }),
    profileId: "proof-agent-profile-merge-reject-post",
  });
  const profileExistingNonJsonRejectIdentity = buildAgentProfileIdentityFixture({
    agent: JSON.stringify({
      objectType: "Agent",
      mbox: "mailto:agent-profile-merge-reject-existing@example.test",
      name: "Agent Profile Merge Reject Existing",
    }),
    profileId: "proof-agent-profile-merge-reject-existing",
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
  const profileSinceQuery = {
    agent: profileSinceIdentity.agent,
  };
  const profileDeleteListQuery = {
    agent: profileDeleteIdentity.agent,
  };
  const profileRequestBody = {
    value: profileDocument,
    fixtureName: "agent-profile-default",
  };
  function buildAgentProfileTraceIdentity(idSuffix: string) {
    return buildAgentProfileIdentityFixture({
      agent: JSON.stringify({
        objectType: "Agent",
        mbox: `mailto:agent-profile-${idSuffix}@example.test`,
        name: `Agent Profile ${idSuffix}`,
      }),
      profileId: `proof-agent-profile-${idSuffix}`,
    });
  }

  const profilePutAcceptedIdentity = buildAgentProfileTraceIdentity("put-accepted");
  const profilePostAcceptedIdentity = buildAgentProfileTraceIdentity("post-accepted");
  const profileGetAcceptedIdentity = buildAgentProfileTraceIdentity("get-accepted");
  const profileSinceAcceptedIdentity = buildAgentProfileTraceIdentity("since-accepted");
  const profilePostAsPutIdentity = buildAgentProfileTraceIdentity("post-as-put");
  const profileLegacyNonJsonRejectIdentity = buildAgentProfileTraceIdentity("merge-reject-legacy-non-json");
  const profileInvalidJsonMergeRejectIdentity = buildAgentProfileTraceIdentity("merge-reject-invalid-json");
  const profileLastModifiedIdentity = buildAgentProfileTraceIdentity("last-modified");
  const updatedAgentProfileDocument = {
    preference: "digest-only",
    notifications: {
      email: false,
      digest: "weekly",
    },
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

  const sinceCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list-since",
    title: "The Agent Profile Resource filters listed profile ids using the since parameter",
    specVersion,
    requirementRefs: [
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
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileSinceIdentity, {
          value: buildAgentProfileDocumentFixture(),
          fixtureName: "agent-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", {
          ...profileSinceQuery,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileSinceIdentity.profileId]),
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v2.agents-profile.invalid-since",
    title: "The Agent Profile Resource rejects an invalid since value when listing profile ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00260",
        section: "Communication 2.6.s4",
        title: "Agent Profile rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", "agents-profile", {
      agent: profileSinceIdentity.agent,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice agent profile invalid since"],
  });

  const invalidAgentQueryCase = singleRequestCase({
    caseId: "v2.agents-profile.document-invalid-agent-query",
    title: "The Agent Profile Resource rejects a POST request whose agent query value is not valid JSON",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00284",
        section: "Communication 2.6",
        title: "Agent Profile rejects invalid JSON agent query values",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "invalid", "agent-query"],
    capabilityFlags: ["document", "agent-profile", "invalid", "agent-query"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "agents-profile",
      {
        ...profileMergeIdentity,
        profileId: `${profileMergeIdentity.profileId}-invalid-agent`,
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
    notes: ["proof-slice agent profile invalid agent query"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge",
    title: "The Agent Profile Resource merges JSON documents on POST when a profile already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00279",
        section: "Communication 2.2.s7",
        title: "Agent Profile performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge"],
    capabilityFlags: ["document", "merge", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileMergeIdentity),
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

  const nonJsonPostRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-non-json-post",
    title: "The Agent Profile Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileNonJsonPostRejectIdentity),
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

  const existingNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-existing-non-json",
    title: "The Agent Profile Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "agents-profile", profileExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileExistingNonJsonRejectIdentity),
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

  const putAcceptedCase = singleRequestCase({
    caseId: "v2.agents-profile.accepts.put",
    title: "The Agent Profile Resource accepts PUT requests with 204 No Content",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00273",
        section: "Communication 2.6.s3",
        title: "Agent Profile Resource accepts PUT requests with 204 No Content",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "write"],
    capabilityFlags: ["document", "agent-profile", "write"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("PUT", "agents-profile", profilePutAcceptedIdentity, profileRequestBody, {
      "If-None-Match": "*",
    }),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice agent profile put accepted"],
  });

  const postAcceptedCase = singleRequestCase({
    caseId: "v2.agents-profile.accepts.post",
    title: "The Agent Profile Resource accepts POST requests with 204 No Content",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00272",
        section: "Communication 2.6.s3",
        title: "Agent Profile Resource accepts POST requests with 204 No Content",
      },
      {
        id: "XAPI-00283",
        section: "Communication 2.6.s3",
        title: "Agent Profile Resource accepts POST requests",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "write"],
    capabilityFlags: ["document", "agent-profile", "write"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    request: buildVersionedRequest("POST", "agents-profile", profilePostAcceptedIdentity, profileRequestBody),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice agent profile post accepted"],
  });

  const getAcceptedCase = documentRoundTripCase({
    caseId: "v2.agents-profile.accepts.get",
    title: "The Agent Profile Resource accepts GET requests and returns the stored document",
    specVersion,
    endpoint: "agents-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00274",
        section: "Communication 2.6.s2",
        title: "Agent Profile Resource accepts GET requests and returns the stored document",
      },
      {
        id: "XAPI-00259",
        section: "Communication 2.6",
        title: "Agent Profile GET with a valid agent object returns 200 OK and profile content",
      },
      {
        id: "XAPI-00282",
        section: "Communication 2.2.s3.table2.row3.a, Communication 2.2.table2.row3.c",
        title: 'The Agent Profile Resource exists at "base IRI"+"/agents/profile"',
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "retrieval"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    query: profileGetAcceptedIdentity,
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
    notes: ["proof-slice agent profile get accepted"],
  });

  const sinceAcceptedCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-list-since-accepted",
    title: "The Agent Profile Resource can process GET requests with the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00268",
        section: "Communication 2.6.s4.table1.row2",
        title: "Agent Profile Resource can process GET requests with since",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "agent-profile", "since"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile since accepted"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileSinceAcceptedIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", {
          agent: profileSinceAcceptedIdentity.agent,
          since: validSinceTimestamp,
        }),
        assertion: {
          status: 200,
          jsonPathEquals: listEquals([profileSinceAcceptedIdentity.profileId]),
        },
      },
    ],
  });

  const postAsPutCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-post-as-put",
    title: "The Agent Profile Resource treats POST as PUT when no document exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00280",
        section: "Communication 2.2.s7",
        title: "Agent Profile Resource treats POST as PUT when no document exists",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "write"],
    capabilityFlags: ["document", "agent-profile", "write"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile post as put"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profilePostAsPutIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profilePostAsPutIdentity),
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

  const legacyNonJsonRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-legacy-non-json-post",
    title: "The Agent Profile Resource rejects legacy non-JSON POST merges without mutation",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00281",
        section: "Communication 2.6",
        title: "Agent Profile Resource rejects legacy non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile legacy non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileLegacyNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileLegacyNonJsonRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "not/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileLegacyNonJsonRejectIdentity),
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

  const invalidJsonMergeRejectCase = requestSequenceCase({
    caseId: "v2.agents-profile.document-merge-rejects-invalid-json-body",
    title: "The Agent Profile Resource rejects POST merges when the incoming JSON document body is invalid",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00278",
        section: "Communication 2.3.s3.table1.row3",
        title: "Agent Profile Resource rejects invalid JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "merge", "invalid", "json"],
    capabilityFlags: ["document", "merge", "agent-profile", "invalid", "json"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile invalid JSON merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileInvalidJsonMergeRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileInvalidJsonMergeRejectIdentity, {
          kind: "text",
          value: invalidJsonDocumentBody,
          contentType: "application/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileInvalidJsonMergeRejectIdentity),
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

  const lastModifiedExistsCase = requestSequenceCase({
    caseId: "v2.agents-profile.headers.last-modified-present",
    title: "The Agent Profile Resource includes a Last-Modified header on successful GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-AGENT-PROFILE-LAST-MODIFIED-PRESENT",
        section: "Communication 2.6",
        title: "Agent Profile Resource GET responses include Last-Modified",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "headers"],
    capabilityFlags: ["document", "headers", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile last-modified present"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileLastModifiedIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileLastModifiedIdentity),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "last-modified",
              pattern: rfc1123HeaderPattern,
            },
          ],
        },
      },
    ],
  });

  const lastModifiedUpdatesCase = requestSequenceCase({
    caseId: "v2.agents-profile.headers.last-modified-updates",
    title: "The Agent Profile Resource updates Last-Modified when the stored document changes",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-AGENT-PROFILE-LAST-MODIFIED-UPDATES",
        section: "Communication 2.6",
        title: "Agent Profile Resource updates Last-Modified when the stored document changes",
      },
    ],
    tags: ["v2.0.0", "agents-profile", "document", "headers"],
    capabilityFlags: ["document", "headers", "agent-profile"],
    legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    notes: ["proof-slice agent profile last-modified updates"],
    steps: [
      {
        request: buildVersionedRequest("POST", "agents-profile", profileLastModifiedIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileLastModifiedIdentity),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "last-modified",
              pattern: rfc1123HeaderPattern,
            },
          ],
        },
      },
      {
        request: buildVersionedRequest("POST", "agents-profile", profileLastModifiedIdentity, {
          value: updatedAgentProfileDocument,
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "agents-profile", profileLastModifiedIdentity),
        assertion: {
          status: 200,
          expectedHeaderPatterns: [
            {
              key: "last-modified",
              pattern: rfc1123HeaderPattern,
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
              path: ["preference"],
              equals: updatedAgentProfileDocument.preference,
            },
          ],
        },
      },
    ],
  });

  const validationCases = [
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-agent.put",
      title: "The Agent Profile Resource rejects PUT without agent",
      specVersion,
      endpoint: "agents-profile",
      method: "PUT",
      query: omitQueryParam(profileValidationIdentity, "agent"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00264",
          section: "Communication 2.6.s3.table1.row1",
          title: "Agent Profile rejects PUT without agent",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.invalid-agent.put",
      title: "The Agent Profile Resource rejects PUT with an invalid agent query value",
      specVersion,
      endpoint: "agents-profile",
      method: "PUT",
      query: {
        ...profileValidationIdentity,
        agent: "true",
      },
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00257",
          section: "Communication 2.6.s3.table1.row1",
          title: "Agent Profile rejects PUT with a non-Agent query value",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-agent.post",
      title: "The Agent Profile Resource rejects POST without agent",
      specVersion,
      endpoint: "agents-profile",
      method: "POST",
      query: omitQueryParam(profileValidationIdentity, "agent"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00263",
          section: "Communication 2.6.s3.table1.row1",
          title: "Agent Profile rejects POST without agent",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.invalid-agent.post",
      title: "The Agent Profile Resource rejects POST with an invalid agent query value",
      specVersion,
      endpoint: "agents-profile",
      method: "POST",
      query: {
        ...profileValidationIdentity,
        agent: "true",
      },
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00256",
          section: "Communication 2.6.s3.table1.row1",
          title: "Agent Profile rejects POST with a non-Agent query value",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-agent.get",
      title: "The Agent Profile Resource rejects GET without agent",
      specVersion,
      endpoint: "agents-profile",
      method: "GET",
      query: omitQueryParam(profileValidationIdentity, "agent"),
      requirementRefs: [
        {
          id: "XAPI-00261",
          section: "Communication 2.6.s4.table1.row1",
          title: "Agent Profile rejects GET without agent",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.invalid-agent.get",
      title: "The Agent Profile Resource rejects GET with an invalid agent query value",
      specVersion,
      endpoint: "agents-profile",
      method: "GET",
      query: {
        ...profileValidationIdentity,
        agent: "true",
      },
      requirementRefs: [
        {
          id: "XAPI-00258",
          section: "Communication 2.6.s4.table1.row1",
          title: "Agent Profile rejects GET with a non-Agent query value",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-agent.delete",
      title: "The Agent Profile Resource rejects DELETE without agent",
      specVersion,
      endpoint: "agents-profile",
      method: "DELETE",
      query: omitQueryParam(profileValidationIdentity, "agent"),
      requirementRefs: [
        {
          id: "XAPI-00262",
          section: "Communication 2.6.s3.table1.row1",
          title: "Agent Profile rejects DELETE without agent",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.invalid-agent.delete",
      title: "The Agent Profile Resource rejects DELETE with an invalid agent query value",
      specVersion,
      endpoint: "agents-profile",
      method: "DELETE",
      query: {
        ...profileValidationIdentity,
        agent: "true",
      },
      requirementRefs: [
        {
          id: "XAPI-00255",
          section: "Communication 2.6.s3.table1.row1",
          title: "Agent Profile rejects DELETE with a non-Agent query value",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "agent"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-profileId.put",
      title: "The Agent Profile Resource rejects PUT without profileId",
      specVersion,
      endpoint: "agents-profile",
      method: "PUT",
      query: omitQueryParam(profileValidationIdentity, "profileId"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00267",
          section: "Communication 2.6.s3.table1.row2",
          title: "Agent Profile rejects PUT without profileId",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "profileId"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-profileId.post",
      title: "The Agent Profile Resource rejects POST without profileId",
      specVersion,
      endpoint: "agents-profile",
      method: "POST",
      query: omitQueryParam(profileValidationIdentity, "profileId"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00266",
          section: "Communication 2.6.s3.table1.row2",
          title: "Agent Profile rejects POST without profileId",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "profileId"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.missing-profileId.delete",
      title: "The Agent Profile Resource rejects DELETE without profileId",
      specVersion,
      endpoint: "agents-profile",
      method: "DELETE",
      query: omitQueryParam(profileValidationIdentity, "profileId"),
      requirementRefs: [
        {
          id: "XAPI-00265",
          section: "Communication 2.6.s3.table1.row2",
          title: "Agent Profile rejects DELETE without profileId",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "profileId"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: agentProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.invalid-profileId.put",
      title: "The Agent Profile Resource rejects PUT when profileId is not a string",
      specVersion,
      endpoint: "agents-profile",
      method: "PUT",
      query: {
        ...profileValidationIdentity,
        profileId: invalidSerializedQueryObject,
      },
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00277",
          section: "Communication 2.6 table3 row2.a",
          title: "Agent Profile rejects PUT when profileId is not a string",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "profileId"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.agents-profile.validation.invalid-profileId.post",
      title: "The Agent Profile Resource rejects POST when profileId is not a string",
      specVersion,
      endpoint: "agents-profile",
      method: "POST",
      query: {
        ...profileValidationIdentity,
        profileId: invalidSerializedQueryBoolean,
      },
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00276",
          section: "Communication 2.6 table3 row2.a",
          title: "Agent Profile rejects POST when profileId is not a string",
        },
      ],
      tags: ["v2.0.0", "agents-profile", "validation", "profileId"],
      capabilityFlags: ["document", "agent-profile", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
    }),
  ];

  return {
    type: "suite",
    id: "v2.proof-slice.agents-profile",
    title: "Agent Profile Resource",
    specVersion,
    tags: ["proof-slice", "agents-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.acceptance",
        title: "Agent Profile Acceptance",
        specVersion,
        tags: ["acceptance"],
        children: [putAcceptedCase, postAcceptedCase, getAcceptedCase],
      },
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
        id: "v2.proof-slice.agents-profile.since",
        title: "Agent Profile Since",
        specVersion,
        tags: ["list", "since"],
        children: [sinceCase, sinceAcceptedCase, invalidSinceCase, invalidAgentQueryCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.merge",
        title: "Agent Profile Merge",
        specVersion,
        tags: ["merge"],
        children: [
          mergeCase,
          postAsPutCase,
          nonJsonPostRejectCase,
          legacyNonJsonRejectCase,
          existingNonJsonRejectCase,
          invalidJsonMergeRejectCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.deletion",
        title: "Agent Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.headers",
        title: "Agent Profile Headers",
        specVersion,
        tags: ["headers"],
        children: [lastModifiedExistsCase, lastModifiedUpdatesCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.agents-profile.validation",
        title: "Agent Profile Validation",
        specVersion,
        tags: ["validation"],
        children: validationCases,
      },
    ],
  };
}
