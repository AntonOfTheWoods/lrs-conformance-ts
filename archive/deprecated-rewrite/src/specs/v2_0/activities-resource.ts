import {
  activitiesResourceLegacySuiteFile,
  buildActivitiesGetRequest,
  buildProofStatement,
  buildStatementPostRequest,
  buildVersionedRequest,
  requestSequenceCase,
  singleRequestCase,
  specVersion,
} from "./shared";
import type { JsonObject, SuiteDefinition } from "./shared";

export function createV20ActivitiesResourceProofSliceSuite(): SuiteDefinition {
  const completeActivityId = "https://example.test/xapi/activities/resource-complete";
  const mergedActivityId = "https://example.test/xapi/activities/resource-merged";
  const unknownActivityId = "https://example.test/xapi/activities/resource-unknown";

  const completeActivityObject = {
    objectType: "Activity",
    id: completeActivityId,
    definition: {
      name: {
        "en-US": "Complete Activity",
      },
      description: {
        "en-US": "Complete activity description",
      },
      type: "https://example.test/xapi/activity-types/resource-complete",
    },
  } satisfies JsonObject;

  const completeActivityStatement = buildProofStatement(247, [
    {
      operation: "set",
      path: ["object"],
      value: completeActivityObject,
    },
  ]);
  const mergedActivityStatementOne = buildProofStatement(248, [
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: mergedActivityId,
        definition: {
          name: {
            "en-US": "Merged Activity",
          },
          description: {
            "en-US": "Merged activity description",
          },
        },
      },
    },
  ]);
  const mergedActivityStatementTwo = buildProofStatement(249, [
    {
      operation: "set",
      path: ["object"],
      value: {
        objectType: "Activity",
        id: mergedActivityId,
        definition: {
          name: {
            "fr-FR": "Activite Fusionnee",
          },
          description: {
            "fr-FR": "Description fusionnee",
          },
          type: "https://example.test/xapi/activity-types/resource-merged",
        },
      },
    },
  ]);

  const endpointCase = singleRequestCase({
    caseId: "v2.activities.resource.endpoint-exists",
    title: "The Activities Resource exists at /activities",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00252",
        section: "Communication 2.5",
        title: "The Activities Resource exists at /activities",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "basics"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildActivitiesGetRequest(unknownActivityId),
    assertion: {
      status: 200,
    },
    notes: [
      "proof-slice activities resource endpoint exists",
      "legacy note: XAPI-00252 treats the /activities endpoint requirement as implicit because the spec does not name it directly",
      "legacy note: XAPI-00252 upstream comment - An LRS has an Activities API with endpoint \"base IRI\" + /activities\" (7.5) Implicit (in that it is not named this by the spec).",
    ],
  });

  const acceptsGetCase = singleRequestCase({
    caseId: "v2.activities.resource.accepts-get",
    title: "The Activities Resource accepts GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00253",
        section: "Communication 2.5",
        title: "The Activities Resource accepts GET requests",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "basics"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildActivitiesGetRequest(unknownActivityId),
    assertion: {
      status: 200,
    },
    notes: [
      "proof-slice activities resource accepts get",
      "legacy note: equivalent to upstream XAPI-00253 coverage that the Activities Resource accepts GET",
      "legacy note: XAPI-00253 upstream comment - An LRS's Activities API accepts GET requests.",
    ],
  });

  const completeActivityCase = requestSequenceCase({
    caseId: "v2.activities.resource.complete-object",
    title: "The Activities Resource returns the complete Activity Object for a stored activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00252",
        section: "Communication 2.5",
        title: "The Activities Resource exists at /activities",
      },
      {
        id: "XAPI-00253",
        section: "Communication 2.5",
        title: "The Activities Resource accepts GET requests",
      },
      {
        id: "XAPI-00251",
        section: "Communication 2.5.s1",
        title: "The Activities Resource returns the complete Activity Object",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "roundtrip"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: [
      "proof-slice activities resource complete object",
      "legacy note: equivalent to upstream XAPI-00251 coverage that a successful GET returns the complete stored Activity Object",
      "legacy note: XAPI-00252 upstream comment - An LRS has an Activities API with endpoint \"base IRI\" + /activities\" (7.5) Implicit (in that it is not named this by the spec).",
      "legacy note: XAPI-00253 upstream comment - An LRS's Activities API accepts GET requests.",
      "legacy note: XAPI-00251 upstream comment - An LRS's Activities API upon processing a successful GET request returns 200 OK and the complete Activity Object.",
    ],
    steps: [
      {
        request: buildStatementPostRequest(completeActivityStatement),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(completeActivityId),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: [],
              equals: completeActivityObject,
            },
          ],
        },
      },
    ],
  });

  const missingActivityIdCase = singleRequestCase({
    caseId: "v2.activities.resource.missing-activity-id",
    title: "The Activities Resource rejects a GET request without activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00250",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource rejects requests without activityId",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "validation"],
    capabilityFlags: ["activities", "validation"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities", {}),
    assertion: {
      status: 400,
    },
    notes: [
      "proof-slice activities resource missing activityId",
      "legacy note: equivalent to upstream XAPI-00250 coverage that GET without activityId is rejected with 400",
      "legacy note: XAPI-00250 upstream comment - An LRS's Activities API rejects a GET request without \"activityId\" as a parameter with error code 400 Bad Request.",
    ],
  });

  const invalidActivityIdCase = singleRequestCase({
    caseId: "v2.activities.resource.invalid-activity-id",
    title: "The Activities Resource rejects a GET request whose activityId parameter is not a valid IRI",
    specVersion,
    requirementRefs: [
      {
        id: "LEGACY-ACTIVITY-RESOURCE-ACTIVITYID-FORMAT",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource rejects invalid activityId values",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "validation"],
    capabilityFlags: ["activities", "validation"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildActivitiesGetRequest("true"),
    assertion: {
      status: 400,
    },
    notes: [
      "proof-slice activities resource invalid activityId",
      "legacy note: equivalent to upstream format validation coverage that non-string or invalid activityId values are rejected",
    ],
  });

  const mergedDefinitionCase = requestSequenceCase({
    caseId: "v2.activities.resource.definition-merge",
    title: "The Activities Resource merges available definition data across statements with the same activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00254",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource returns all available information for an activityId",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "merge"],
    capabilityFlags: ["activities", "retrieval", "merge"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: [
      "proof-slice activities resource definition merge",
      "legacy note: equivalent to upstream XAPI-00254 example that language-map information from statements sharing activityId is merged and returned",
      "legacy note: XAPI-00254 upstream comment - The Activity Object must contain all available information about an activity from any statements who target the same “activityId”. For example, LRS accepts two statements each with a different language description of an activity using the exact same “activityId”. The LRS must return both language descriptions when a GET request is made to the Activities endpoint for that “activityId”.",
    ],
    steps: [
      {
        request: buildStatementPostRequest(mergedActivityStatementOne),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(mergedActivityStatementTwo),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(mergedActivityId),
        assertion: {
          status: 200,
          jsonPathEquals: [
            {
              path: ["definition", "name"],
              equals: {
                "en-US": "Merged Activity",
                "fr-FR": "Activite Fusionnee",
              },
            },
            {
              path: ["definition", "description"],
              equals: {
                "en-US": "Merged activity description",
                "fr-FR": "Description fusionnee",
              },
            },
          ],
        },
      },
    ],
  });

  const unknownActivityFallbackCase = singleRequestCase({
    caseId: "v2.activities.resource.unknown-activity-fallback",
    title: "The Activities Resource still returns an Activity Object when no canonical definition is known",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00251",
        section: "Communication 2.5.s1",
        title: "The Activities Resource returns an Activity Object for successful GET requests",
      },
    ],
    tags: ["v2.0.0", "activities", "resource", "fallback"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildActivitiesGetRequest(unknownActivityId),
    assertion: {
      status: 200,
      jsonPathEquals: [
        {
          path: ["objectType"],
          equals: "Activity",
        },
        {
          path: ["id"],
          equals: unknownActivityId,
        },
      ],
    },
    notes: [
      "proof-slice activities resource unknown activity fallback",
      "legacy note: equivalent to upstream behavior that an Activity object is still returned even without a canonical stored definition",
      "legacy note: XAPI-00251 upstream comment - An LRS's Activities API upon processing a successful GET request returns 200 OK and the complete Activity Object.",
    ],
  });

  return {
    type: "suite",
    id: "v2.proof-slice.activities",
    title: "Activities Resource",
    specVersion,
    tags: ["proof-slice", "activities"],
    children: [
      {
        type: "suite",
        id: "v2.proof-slice.activities.basics",
        title: "Activities Basics",
        specVersion,
        tags: ["activities", "basics"],
        children: [endpointCase, acceptsGetCase, completeActivityCase, missingActivityIdCase, invalidActivityIdCase],
      },
      {
        type: "suite",
        id: "v2.proof-slice.activities.definition",
        title: "Activities Definition",
        specVersion,
        tags: ["activities", "definition"],
        children: [mergedDefinitionCase, unknownActivityFallbackCase],
      },
    ],
  };
}
