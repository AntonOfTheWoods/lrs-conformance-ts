import type { SuiteDefinition } from "../../../domain/contracts";
import {
  buildActivityProfileDocumentFixture,
  buildActivityProfileIdentityFixture,
} from "../../../fixtures/v2_0/documents";
import { requestSequenceCase, singleRequestCase } from "../../../registry/families";
import { specVersion, upstreamV103Root } from "../shared";

const activityProfileLegacySuiteFile = `${upstreamV103Root}/H.Communication2.7-ActivityProfileResource.js`;

function buildVersionedRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  query: Record<string, string>,
  body?: unknown,
) {
  return {
    method,
    endpoint: "activities-profile" as const,
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
            name: "activity-profile-default",
          },
        }
      : undefined,
  };
}

export function createV103ActivityProfileResourceProofSliceSuite(): SuiteDefinition {
  const profileIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-v1",
    profileId: "proof-activity-profile-v1",
  });
  const profileListIdentity = buildActivityProfileIdentityFixture({
    activityId: "https://example.test/xapi/activities/profile-v1-list",
    profileId: "proof-activity-profile-v1-list",
  });
  const profileDocument = buildActivityProfileDocumentFixture();

  const endpointCase = singleRequestCase({
    caseId: "v1.activities-profile.endpoint-exists",
    title: "The Activity Profile Resource exists at /activities/profile",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00311",
        section: "Communication 2.7",
        title: "The Activity Profile Resource exists at /activities/profile",
      },
      {
        id: "XAPI-00312",
        section: "Communication 2.7.s3",
        title: "The Activity Profile Resource accepts POST requests",
      },
      {
        id: "XAPI-00286",
        section: "Communication 2.7.s3",
        title: "A successful Activity Profile POST returns 204",
      },
      {
        id: "XAPI-00292",
        section: "Communication 2.7",
        title: "The Activity Profile Resource accepts POST requests",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "basics"],
    capabilityFlags: ["document", "activity-profile", "write"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("POST", profileIdentity, profileDocument),
    assertion: {
      status: 204,
    },
    notes: [
      "v1 proof-slice activity profile endpoint and post acceptance",
      "legacy note: XAPI-00311 upstream comment - An LRS has an Activity Profile API with endpoint \"base IRI\"+\"/activities/profile\"",
      "legacy note: XAPI-00312 upstream comment - An LRS will accept a POST request to the Activity Profile API",
      "legacy note: XAPI-00286 upstream comment - An LRS's Activity Profile API upon processing a successful POST request returns code 204 No Content",
      "legacy note: XAPI-00292 upstream comment - An LRS's Activity Profile API accepts POST requests",
    ],
  });

  const putAcceptedCase = singleRequestCase({
    caseId: "v1.activities-profile.put-accepted",
    title: "The Activity Profile Resource accepts PUT requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00287",
        section: "Communication 2.7.s3",
        title: "A successful Activity Profile PUT returns 204",
      },
      {
        id: "XAPI-00293",
        section: "Communication 2.7",
        title: "The Activity Profile Resource accepts PUT requests",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "basics"],
    capabilityFlags: ["document", "activity-profile", "write"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest(
      "PUT",
      {
        ...profileIdentity,
        profileId: "proof-activity-profile-v1-put",
      },
      profileDocument,
    ),
    assertion: {
      status: 204,
    },
    notes: [
      "v1 proof-slice activity profile put accepted",
      "legacy note: XAPI-00287 upstream comment - An LRS's Activity Profile API upon processing a successful PUT request returns code 204 No Content",
      "legacy note: XAPI-00287 upstream describe - An LRS\\'s Activity Profile Resource accepts PUT requests",
      "legacy note: XAPI-00293 upstream comment - An LRS's Activity Profile API accepts PUT requests",
      "legacy note: XAPI-00293 upstream describe - An LRS\\'s Activity Profile Resource accepts PUT requests",
    ],
  });

  const deleteAcceptedCase = singleRequestCase({
    caseId: "v1.activities-profile.delete-accepted",
    title: "The Activity Profile Resource accepts DELETE requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00285",
        section: "Communication 2.7",
        title: "A successful Activity Profile DELETE returns 204",
      },
      {
        id: "XAPI-00291",
        section: "Communication 2.7",
        title: "The Activity Profile Resource accepts DELETE requests",
      },
      {
        id: "XAPI-00297",
        section: "Communication 2.7.s3.table1.row1",
        title: "Activity Profile rejects DELETE without activityId",
      },
      {
        id: "XAPI-00300",
        section: "Communication 2.7.s3.table1.row2",
        title: "Activity Profile rejects DELETE without profileId",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "delete"],
    capabilityFlags: ["document", "activity-profile", "delete"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("DELETE", profileIdentity),
    assertion: {
      status: 204,
    },
    notes: [
      "v1 proof-slice activity profile delete accepted",
      "legacy note: XAPI-00285 upstream comment - An LRS's Activity Profile API upon processing a successful DELETE request deletes the associated profile and returns code 204 No Content",
      "legacy note: XAPI-00291 upstream comment - An LRS's Activity Profile API accepts DELETE requests",
      "legacy note: XAPI-00297 upstream comment - An LRS's Activity Profile API rejects a DELETE request without \"activityId\" as a parameter with error code 400 Bad Request",
      "legacy note: XAPI-00300 upstream comment - An LRS's Activity Profile API rejects a DELETE request without \"profileId\" as a parameter with error code 400 Bad Request",
    ],
  });

  const getRoundTripCase = requestSequenceCase({
    caseId: "v1.activities-profile.get-roundtrip",
    title: "The Activity Profile Resource returns stored documents by profileId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00290",
        section: "Communication 2.7",
        title: "The Activity Profile Resource accepts GET requests",
      },
      {
        id: "XAPI-00288",
        section: "Communication 2.7.s3",
        title: "Activity Profile GET with profileId returns the stored document",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "roundtrip"],
    capabilityFlags: ["document", "activity-profile", "retrieval"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: [
      "v1 proof-slice activity profile get roundtrip",
      "legacy note: XAPI-00290 upstream comment - An LRS's Activity Profile API accepts GET requests",
      "legacy note: XAPI-00288 upstream comment - An LRS's Activity Profile API upon processing a successful GET request with a valid \"profileId\" as a parameter returns the document satisfying the requirements of the GET and code 200 OK",
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
              path: ["summary"],
              equals: profileDocument.summary,
            },
          ],
        },
      },
    ],
  });

  const listAndSinceCase = requestSequenceCase({
    caseId: "v1.activities-profile.list-and-since",
    title: "The Activity Profile Resource lists ids and supports since",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00289",
        section: "Communication 2.7.s4",
        title: "Activity Profile GET without profileId returns ids",
      },
      {
        id: "XAPI-00303",
        section: "Communication 2.7.s4",
        title: "Activity Profile accepts since for list requests",
      },
      {
        id: "XAPI-00294",
        section: "Communication 2.7.s4",
        title: "Activity Profile list results can be filtered by since",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "list", "since"],
    capabilityFlags: ["document", "activity-profile", "list", "since"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: [
      "v1 proof-slice activity profile list and since",
      "legacy note: XAPI-00289 upstream comment - An LRS's Activity Profile API upon processing a successful GET request without \"profileId\" as a parameter returns an array of ids of activity profile documents satisfying the requirements of the GET and code 200 OK",
      "legacy note: XAPI-00303 upstream comment - An LRS's Activity Profile API can process a GET request with \"since\" as a parameter. Returning 200 OK and all matching profiles after the date/time of the “since” parameter.",
      "legacy note: XAPI-00294 upstream comment - The Activity Profile API's returned array of ids from a successful GET request all refer to documents stored after the TimeStamp in the \"since\" parameter of the GET request if such a parameter was present",
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
          activityId: profileListIdentity.activityId,
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
          activityId: profileListIdentity.activityId,
          since: "2015-11-18T12:17:00.000Z",
        }),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const invalidSinceCase = singleRequestCase({
    caseId: "v1.activities-profile.invalid-since",
    title: "The Activity Profile Resource rejects invalid since values",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00295",
        section: "Communication 2.7.s4.table1.row2",
        title: "Activity Profile rejects invalid since values",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "since", "invalid"],
    capabilityFlags: ["document", "activity-profile", "list", "since", "validation"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    request: buildVersionedRequest("GET", {
      activityId: profileListIdentity.activityId,
      since: "true",
    }),
    assertion: {
      status: 400,
    },
    notes: [
      "v1 proof-slice activity profile invalid since",
      "legacy note: XAPI-00295 upstream comment - An LRS's Activity Profile API rejects a GET request with \"since\" as a parameter if it is not a \"TimeStamp\", with error code 400 Bad Request",
      "legacy note: XAPI-00295 upstream describe - An LRS\\'s Activity Profile Resource rejects a GET request with \"since\" as a parameter if it is not a \"TimeStamp\", with error code 400 Bad Request",
    ],
  });

  const mergeCase = requestSequenceCase({
    caseId: "v1.activities-profile.document-merge",
    title: "The Activity Profile Resource merges JSON documents on POST",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00308",
        section: "Communication 2.2.s7",
        title: "Activity Profile performs JSON merge on POST",
      },
      {
        id: "XAPI-00313",
        section: "Communication 2.7.s3.table1.row3",
        title: "Activity Profile rejects non-JSON POST merges",
      },
      {
        id: "XAPI-00314",
        section: "Communication 2.7.s4.table1.row2",
        title: "Activity Profile rejects invalid JSON documents",
      },
    ],
    tags: ["v1.0.3", "activities-profile", "resource", "merge"],
    capabilityFlags: ["document", "activity-profile", "merge"],
    legacyTraceSuiteFile: activityProfileLegacySuiteFile,
    notes: [
      "v1 proof-slice activity profile merge",
      "legacy note: XAPI-00308 upstream comment - An LRS's Activity Profile API performs a Document Merge if a activityId is found and both it and the document in the POST request have type \"application/json\" If the merge is successful, the LRS MUST respond with HTTP status code 204 No Content. activityId??",
      "legacy note: XAPI-00313 upstream comment - An LRS's Activity Profile API, rejects a POST request if the document is found and either doucment is not a valid JSON Object",
      "legacy note: XAPI-00313 upstream describe - An LRS\\'s Activity Profile Resource, rejects a POST request if the document is found and either document is not a valid JSON Object",
      "legacy note: XAPI-00314 upstream comment - An LRS's must reject, with 400 Bad Request, a POST request to the Activity Profile API which contains name/value pairs with invalid JSON and the Content-Type header is \"application/json\"",
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

  return {
    type: "suite",
    id: "v1.proof-slice.activities-profile",
    title: "Activity Profile Resource",
    specVersion,
    tags: ["proof-slice", "activities-profile"],
    children: [
      {
        type: "suite",
        id: "v1.proof-slice.activities-profile.basics",
        title: "Activity Profile Basics",
        specVersion,
        tags: ["activities-profile", "basics"],
        children: [endpointCase, putAcceptedCase, deleteAcceptedCase, getRoundTripCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.activities-profile.list-and-merge",
        title: "Activity Profile List and Merge",
        specVersion,
        tags: ["activities-profile", "list", "merge"],
        children: [listAndSinceCase, invalidSinceCase, mergeCase],
      },
    ],
  };
}
