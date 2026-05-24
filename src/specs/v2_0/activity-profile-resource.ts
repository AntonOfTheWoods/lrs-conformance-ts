import {
  activityProfileLegacySuiteFile,
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
  buildDocumentResourceValidationCase,
  buildVersionedRequest,
  documentRoundTripCase,
  existingNonJsonDocumentBody,
  invalidJsonDocumentBody,
  invalidSerializedQueryBoolean,
  invalidSerializedQueryNumeric,
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

export function createV20ActivityProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileDocument = buildActivityProfileDocumentFixture();
  const profileIdentity = buildActivityProfileIdentityFixture();
  const profileValidationIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/validation",
    profileId: "proof-activity-profile-validation",
  });
  const profileListIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/list",
    profileId: "proof-activity-profile-list",
  });
  const profileSinceIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/since",
    profileId: "proof-activity-profile-since",
  });
  const profileMergeIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge",
    profileId: "proof-activity-profile-merge",
  });
  const profileNonJsonPostRejectIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge-reject-post",
    profileId: "proof-activity-profile-merge-reject-post",
  });
  const profileExistingNonJsonRejectIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/merge-reject-existing",
    profileId: "proof-activity-profile-merge-reject-existing",
  });
  const profileDeleteIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-proof-slice/delete",
    profileId: "proof-activity-profile-delete",
  });
  const profileListQuery = {
    activityId: profileListIdentity.activityId,
  };
  const profileSinceQuery = {
    activityId: profileSinceIdentity.activityId,
  };
  const profileDeleteListQuery = {
    activityId: profileDeleteIdentity.activityId,
  };
  const profileRequestBody = {
    value: profileDocument,
    fixtureName: "activity-profile-default",
  };
  function buildActivityProfileTraceIdentity(idSuffix: string) {
    return buildActivityProfileIdentityFixture({
      activityId: `https://example.test/xapi/activities/profile-proof-slice/${idSuffix}`,
      profileId: `proof-activity-profile-${idSuffix}`,
    });
  }

  const profileEndpointIdentity = buildActivityProfileTraceIdentity("endpoint");
  const profilePutAcceptedIdentity = buildActivityProfileTraceIdentity("put-accepted");
  const profilePostAcceptedIdentity = buildActivityProfileTraceIdentity("post-accepted");
  const profileGetAcceptedIdentity = buildActivityProfileTraceIdentity("get-accepted");
  const profileSinceAcceptedIdentity = buildActivityProfileTraceIdentity("since-accepted");
  const profilePostAsPutIdentity = buildActivityProfileTraceIdentity("post-as-put");
  const profileNonJsonTypeRejectIdentity = buildActivityProfileTraceIdentity("merge-reject-type");
  const profileInvalidJsonMergeRejectIdentity = buildActivityProfileTraceIdentity("merge-reject-invalid-json");
  const profileLastModifiedIdentity = buildActivityProfileTraceIdentity("last-modified");
  const updatedProfileDocument = {
    summary: "Updated activity profile summary",
    metadata: {
      audience: "team-leads",
      level: "advanced",
    },
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

  const sinceCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list-since",
    title: "The Activity Profile Resource filters listed profile ids using the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00303",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId accepts since",
      },
      {
        id: "XAPI-00294",
        section: "Communication 2.7.s4",
        title: "Activity Profile list results can be filtered by since",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile since filtering"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileSinceIdentity, {
          value: buildActivityProfileDocumentFixture(),
          fixtureName: "activity-profile-default",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", {
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
    caseId: "v2.activities-profile.invalid-since",
    title: "The Activity Profile Resource rejects an invalid since value when listing profile ids",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00295",
        section: "Communication 2.7.s4",
        title: "Activity Profile rejects invalid since values",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities-profile", {
      activityId: profileSinceIdentity.activityId,
      since: invalidSinceTimestamp,
    }),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity profile invalid since"],
  });

  const invalidJsonPostCase = singleRequestCase({
    caseId: "v2.activities-profile.document-invalid-json-post",
    title: "The Activity Profile Resource rejects a POST request with an invalid JSON document body",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00314",
        section: "Communication 2.7.s4.table1.row2",
        title: "Activity Profile rejects invalid JSON document bodies",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "invalid", "json"],
    capabilityFlags: ["document", "activity-profile", "invalid", "json"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "POST",
      "activities-profile",
      {
        ...profileMergeIdentity,
        profileId: `${profileMergeIdentity.profileId}-invalid-json`,
      },
      {
        kind: "text",
        value: invalidJsonDocumentBody,
        contentType: "application/json",
      },
    ),
    assertion: {
      status: 400,
    },
    notes: ["proof-slice activity profile invalid JSON document body"],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge",
    title: "The Activity Profile Resource merges JSON documents on POST when a profile already exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00308",
        section: "Communication 2.2.s7",
        title: "Activity Profile performs JSON document merge",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge"],
    capabilityFlags: ["document", "merge", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile merge"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileMergeIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileMergeIdentity, {
          value: {
            type: "Civic",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileMergeIdentity),
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
    caseId: "v2.activities-profile.document-merge-rejects-non-json-post",
    title: "The Activity Profile Resource rejects a POST merge when the incoming document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects non-JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile non-json incoming merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonPostRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonPostRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileNonJsonPostRejectIdentity),
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
    caseId: "v2.activities-profile.document-merge-rejects-existing-non-json",
    title: "The Activity Profile Resource rejects a POST merge when the existing document is not application/json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects merges against non-JSON stored documents",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile existing non-json merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("PUT", "activities-profile", profileExistingNonJsonRejectIdentity, {
          kind: "text",
          value: existingNonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileExistingNonJsonRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileExistingNonJsonRejectIdentity),
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
    caseId: "v2.activities-profile.delete-document",
    title: "The Activity Profile Resource deletes a stored document and removes it from profile listings",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00285",
        section: "Communication 2.7.s3",
        title: "Activity Profile DELETE removes the associated profile",
      },
      {
        id: "XAPI-00291",
        section: "Communication 2.7",
        title: "Activity Profile accepts DELETE requests",
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

  const endpointCase = singleRequestCase({
    caseId: "v2.activities-profile.endpoint",
    title: 'The Activity Profile Resource is available at "base IRI"+"/activities/profile"',
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00311",
        section: "Communication 2.2.s3.table1.row2",
        title: 'Activity Profile Resource is available at "base IRI"+"/activities/profile"',
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "endpoint"],
    capabilityFlags: ["document", "activity-profile", "endpoint"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("POST", "activities-profile", profileEndpointIdentity, profileRequestBody),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice activity profile endpoint"],
  });

  const putAcceptedCase = singleRequestCase({
    caseId: "v2.activities-profile.accepts.put",
    title: "The Activity Profile Resource accepts PUT requests with 204 No Content",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00287",
        section: "Communication 2.7",
        title: "Activity Profile Resource accepts PUT requests with 204 No Content",
      },
      {
        id: "XAPI-00293",
        section: "Communication 2.7",
        title: "Activity Profile Resource accepts PUT requests",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "write"],
    capabilityFlags: ["document", "activity-profile", "write"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("PUT", "activities-profile", profilePutAcceptedIdentity, profileRequestBody),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice activity profile put accepted"],
  });

  const postAcceptedCase = singleRequestCase({
    caseId: "v2.activities-profile.accepts.post",
    title: "The Activity Profile Resource accepts POST requests with 204 No Content",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00286",
        section: "Communication 2.7",
        title: "Activity Profile Resource accepts POST requests with 204 No Content",
      },
      {
        id: "XAPI-00292",
        section: "Communication 2.7",
        title: "Activity Profile Resource accepts POST requests",
      },
      {
        id: "XAPI-00312",
        section: "Communication 2.7",
        title: "Activity Profile Resource accepts POST requests",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "write"],
    capabilityFlags: ["document", "activity-profile", "write"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("POST", "activities-profile", profilePostAcceptedIdentity, profileRequestBody),
    assertion: {
      status: 204,
    },
    notes: ["proof-slice activity profile post accepted"],
  });

  const getAcceptedCase = documentRoundTripCase({
    caseId: "v2.activities-profile.accepts.get",
    title: "The Activity Profile Resource accepts GET requests and returns the stored document",
    specVersion,
    endpoint: "activities-profile",
    submitMethod: "POST",
    requirementRefs: [
      {
        id: "XAPI-00290",
        section: "Communication 2.7",
        title: "Activity Profile Resource accepts GET requests and returns the stored document",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "retrieval"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    query: profileGetAcceptedIdentity,
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
    notes: ["proof-slice activity profile get accepted"],
  });

  const sinceAcceptedCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-list-since-accepted",
    title: "The Activity Profile Resource can process GET requests with the since parameter",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00303",
        section: "Communication 2.7.s4.table1.row2",
        title: "Activity Profile Resource can process GET requests with since",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "list", "since"],
    capabilityFlags: ["document", "list", "activity-profile", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile since accepted"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileSinceAcceptedIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", {
          activityId: profileSinceAcceptedIdentity.activityId,
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
    caseId: "v2.activities-profile.document-post-as-put",
    title: "The Activity Profile Resource treats POST as PUT when no document exists",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00310",
        section: "Communication 2.2.s7",
        title: "Activity Profile Resource treats POST as PUT when no document exists",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "write"],
    capabilityFlags: ["document", "activity-profile", "write"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile post as put"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profilePostAsPutIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profilePostAsPutIdentity),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["summary"],
              equals: profileDocument.summary,
            },
          ],
        },
      },
    ],
  });

  const nonJsonTypeRejectCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge-rejects-non-json-type",
    title: "The Activity Profile Resource rejects POST merges when either document type is not application or json",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00309",
        section: "Communication 2.2.s8.b1",
        title: "Activity Profile Resource rejects POST merges when either document type is not application or json",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile non-json type merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonTypeRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileNonJsonTypeRejectIdentity, {
          kind: "text",
          value: nonJsonDocumentBody,
          contentType: "application/octet-stream",
        }),
        assertion: {
          status: 400,
        },
      },
    ],
  });

  const invalidJsonMergeRejectCase = requestSequenceCase({
    caseId: "v2.activities-profile.document-merge-rejects-invalid-json-body",
    title: "The Activity Profile Resource rejects POST merges when the incoming JSON document body is invalid",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile Resource rejects invalid JSON POST merges without mutation",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "merge", "invalid", "json"],
    capabilityFlags: ["document", "merge", "activity-profile", "invalid", "json"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile invalid JSON merge rejection"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileInvalidJsonMergeRejectIdentity, {
          value: {
            car: "Honda",
          },
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("POST", "activities-profile", profileInvalidJsonMergeRejectIdentity, {
          kind: "text",
          value: invalidJsonDocumentBody,
          contentType: "application/json",
        }),
        assertion: {
          status: 400,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileInvalidJsonMergeRejectIdentity),
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
    caseId: "v2.activities-profile.headers.last-modified-present",
    title: "The Activity Profile Resource includes a Last-Modified header on successful GET responses",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-ACTIVITY-PROFILE-LAST-MODIFIED-PRESENT",
        section: "Communication 2.7",
        title: "Activity Profile Resource GET responses include Last-Modified",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "headers"],
    capabilityFlags: ["document", "headers", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile last-modified present"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileLastModifiedIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileLastModifiedIdentity),
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
    caseId: "v2.activities-profile.headers.last-modified-updates",
    title: "The Activity Profile Resource updates Last-Modified when the stored document changes",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-ACTIVITY-PROFILE-LAST-MODIFIED-UPDATES",
        section: "Communication 2.7",
        title: "Activity Profile Resource updates Last-Modified when the stored document changes",
      },
    ],
    tags: ["v2.0.0", "activities-profile", "document", "headers"],
    capabilityFlags: ["document", "headers", "activity-profile"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: ["proof-slice activity profile last-modified updates"],
    steps: [
      {
        request: buildVersionedRequest("POST", "activities-profile", profileLastModifiedIdentity, profileRequestBody),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileLastModifiedIdentity),
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
        request: buildVersionedRequest("POST", "activities-profile", profileLastModifiedIdentity, {
          value: updatedProfileDocument,
        }),
        assertion: {
          status: 204,
        },
      },
      {
        request: buildVersionedRequest("GET", "activities-profile", profileLastModifiedIdentity),
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
              path: ["summary"],
              equals: updatedProfileDocument.summary,
            },
          ],
        },
      },
    ],
  });

  const validationCases = [
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-activityId.put",
      title: "The Activity Profile Resource rejects PUT without activityId",
      specVersion,
      endpoint: "activities-profile",
      method: "PUT",
      query: omitQueryParam(profileValidationIdentity, "activityId"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00299",
          section: "Communication 2.7.s3.table1.row1",
          title: "Activity Profile rejects PUT without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "activityId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-activityId.post",
      title: "The Activity Profile Resource rejects POST without activityId",
      specVersion,
      endpoint: "activities-profile",
      method: "POST",
      query: omitQueryParam(profileValidationIdentity, "activityId"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00298",
          section: "Communication 2.7.s3.table1.row1",
          title: "Activity Profile rejects POST without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "activityId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-activityId.get",
      title: "The Activity Profile Resource rejects GET without activityId",
      specVersion,
      endpoint: "activities-profile",
      method: "GET",
      query: omitQueryParam(profileValidationIdentity, "activityId"),
      requirementRefs: [
        {
          id: "XAPI-00296",
          section: "Communication 2.7.s3.table1.row1",
          title: "Activity Profile rejects GET without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "activityId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-activityId.delete",
      title: "The Activity Profile Resource rejects DELETE without activityId",
      specVersion,
      endpoint: "activities-profile",
      method: "DELETE",
      query: omitQueryParam(profileValidationIdentity, "activityId"),
      requirementRefs: [
        {
          id: "XAPI-00297",
          section: "Communication 2.7.s3.table1.row1",
          title: "Activity Profile rejects DELETE without activityId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "activityId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-profileId.put",
      title: "The Activity Profile Resource rejects PUT without profileId",
      specVersion,
      endpoint: "activities-profile",
      method: "PUT",
      query: omitQueryParam(profileValidationIdentity, "profileId"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00302",
          section: "Communication 2.7.s3.table1.row2",
          title: "Activity Profile rejects PUT without profileId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "profileId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-profileId.post",
      title: "The Activity Profile Resource rejects POST without profileId",
      specVersion,
      endpoint: "activities-profile",
      method: "POST",
      query: omitQueryParam(profileValidationIdentity, "profileId"),
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00301",
          section: "Communication 2.7.s3.table1.row2",
          title: "Activity Profile rejects POST without profileId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "profileId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.missing-profileId.delete",
      title: "The Activity Profile Resource rejects DELETE without profileId",
      specVersion,
      endpoint: "activities-profile",
      method: "DELETE",
      query: omitQueryParam(profileValidationIdentity, "profileId"),
      requirementRefs: [
        {
          id: "XAPI-00300",
          section: "Communication 2.7.s3.table1.row2",
          title: "Activity Profile rejects DELETE without profileId",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "profileId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.invalid-profileId.put",
      title: "The Activity Profile Resource rejects PUT when profileId is not a string",
      specVersion,
      endpoint: "activities-profile",
      method: "PUT",
      query: {
        ...profileValidationIdentity,
        profileId: invalidSerializedQueryBoolean,
      },
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00307",
          section: "Communication 2.7.s3.table1.row2",
          title: "Activity Profile rejects PUT when profileId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "profileId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.invalid-profileId.post",
      title: "The Activity Profile Resource rejects POST when profileId is not a string",
      specVersion,
      endpoint: "activities-profile",
      method: "POST",
      query: {
        ...profileValidationIdentity,
        profileId: invalidSerializedQueryNumeric,
      },
      body: profileRequestBody,
      requirementRefs: [
        {
          id: "XAPI-00306",
          section: "Communication 2.7.s3.table1.row2",
          title: "Activity Profile rejects POST when profileId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "profileId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
    }),
    buildDocumentResourceValidationCase({
      caseId: "v2.activities-profile.validation.invalid-profileId.delete",
      title: "The Activity Profile Resource rejects DELETE when profileId is not a string",
      specVersion,
      endpoint: "activities-profile",
      method: "DELETE",
      query: {
        ...profileValidationIdentity,
        profileId: invalidSerializedQueryObject,
      },
      requirementRefs: [
        {
          id: "XAPI-00305",
          section: "Communication 2.7.s4.table1.row2",
          title: "Activity Profile rejects DELETE when profileId is not a string",
        },
      ],
      tags: ["v2.0.0", "activities-profile", "validation", "profileId"],
      capabilityFlags: ["document", "activity-profile", "validation", "parameters"],
      legacyTraceSuiteFile: parametersLegacySuiteFile,
    }),
  ];

  return {
    type: "suite",
    id: "v2.proof-slice.activities-profile",
    title: "Activity Profile Resource",
    specVersion,
    tags: ["proof-slice", "activities-profile"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.acceptance",
        title: "Activity Profile Acceptance",
        specVersion,
        tags: ["acceptance"],
        children: [endpointCase, putAcceptedCase, postAcceptedCase, getAcceptedCase],
      },
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
        id: "v2.proof-slice.activities-profile.since",
        title: "Activity Profile Since",
        specVersion,
        tags: ["list", "since"],
        children: [sinceCase, sinceAcceptedCase, invalidSinceCase, invalidJsonPostCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.merge",
        title: "Activity Profile Merge",
        specVersion,
        tags: ["merge"],
        children: [
          mergeCase,
          postAsPutCase,
          nonJsonTypeRejectCase,
          nonJsonPostRejectCase,
          existingNonJsonRejectCase,
          invalidJsonMergeRejectCase,
        ],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.deletion",
        title: "Activity Profile Deletion",
        specVersion,
        tags: ["delete"],
        children: [deleteCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.headers",
        title: "Activity Profile Headers",
        specVersion,
        tags: ["headers"],
        children: [lastModifiedExistsCase, lastModifiedUpdatesCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities-profile.validation",
        title: "Activity Profile Validation",
        specVersion,
        tags: ["validation"],
        children: validationCases,
      },
    ],
  };
}
