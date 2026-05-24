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
    notes: ["v1 proof-slice activity profile endpoint and post acceptance"],
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
    notes: ["v1 proof-slice activity profile put accepted"],
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
    notes: ["v1 proof-slice activity profile delete accepted"],
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
    notes: ["v1 proof-slice activity profile get roundtrip"],
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
    notes: ["v1 proof-slice activity profile list and since"],
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
    notes: ["v1 proof-slice activity profile invalid since"],
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
    notes: ["v1 proof-slice activity profile merge"],
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
