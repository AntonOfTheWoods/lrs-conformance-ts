import type { JsonObject, SuiteDefinition } from "../../../domain/contracts";
import { requestSequenceCase, singleRequestCase } from "../../../registry/families";
import { buildStatementFixture } from "../../../fixtures/v2_0/statements";
import { specVersion, upstreamV103Root } from "../shared";

const activitiesResourceLegacySuiteFile = `${upstreamV103Root}/H.Communication2.5-ActivitiesResource.js`;

function buildVersionedRequest(
  method: "GET" | "POST",
  endpoint: "activities" | "statements",
  query: Record<string, string>,
  body?: unknown,
) {
  return {
    method,
    endpoint,
    authMode: "basic" as const,
    headers: {
      "X-Experience-API-Version": specVersion,
    },
    query,
    body: body
      ? {
          kind: "json" as const,
          value: body,
          sourceFixture: {
            version: specVersion,
            domain: "statements",
            name: "default",
          },
        }
      : undefined,
  };
}

function buildActivitiesGetRequest(activityId: string) {
  return buildVersionedRequest("GET", "activities", { activityId });
}

function buildStatementPostRequest(statement: JsonObject) {
  return buildVersionedRequest("POST", "statements", {}, statement);
}

function buildProofStatement(id: string, object: JsonObject): JsonObject {
  return buildStatementFixture([
    {
      operation: "set",
      path: ["id"],
      value: id,
    },
    {
      operation: "set",
      path: ["object"],
      value: object,
    },
  ]) as JsonObject;
}

export function createV103ActivitiesResourceProofSliceSuite(): SuiteDefinition {
  const completeActivityId = "http://www.example.com/verify/complete/34534";
  const mergedActivityId = "http://www.example.com/verify/complete/34534100123";
  const unknownActivityId = "https://example.test/xapi/activities/resource-unknown-v1";

  const completeActivityObject = {
    objectType: "Activity",
    id: completeActivityId,
    definition: {
      name: {
        "en-US": "example meeting",
      },
      description: {
        "en-US": "An example meeting activity",
      },
      type: "http://adlnet.gov/expapi/activities/meeting",
    },
  } satisfies JsonObject;

  const mergedActivityObjectOne = {
    objectType: "Activity",
    id: mergedActivityId,
    definition: {
      name: {
        "en-US": "example meeting",
      },
      description: {
        "en-US": "An example meeting activity",
      },
      type: "http://adlnet.gov/expapi/activities/meeting",
    },
  } satisfies JsonObject;

  const mergedActivityObjectTwo = {
    objectType: "Activity",
    id: mergedActivityId,
    definition: {
      name: {
        "fr-FR": "réunion",
      },
      description: {
        "fr-FR": "description fusionnée",
      },
      type: "http://adlnet.gov/expapi/activities/meeting",
    },
  } satisfies JsonObject;

  const endpointCase = requestSequenceCase({
    caseId: "v1.activities.resource.endpoint-exists",
    title: "The Activities Resource exists at /activities",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00252",
        section: "Communication 2.5",
        title: "The Activities Resource exists at /activities",
      },
    ],
    tags: ["v1.0.3", "activities", "resource", "basics"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: [
      "v1 proof-slice activities resource endpoint exists",
      "legacy note: XAPI-00252 upstream comment - An LRS has an Activities API with endpoint \"base IRI\" + /activities\" (7.5) Implicit (in that it is not named this by the spec).",
    ],
    steps: [
      {
        request: buildStatementPostRequest(
          buildProofStatement("11111111-1111-4111-8111-000000000301", {
            objectType: "Activity",
            id: unknownActivityId,
            definition: {
              name: {
                "en-US": "unknown activity seed",
              },
            },
          }),
        ),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(unknownActivityId),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const acceptsGetCase = requestSequenceCase({
    caseId: "v1.activities.resource.accepts-get",
    title: "The Activities Resource accepts GET requests",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00253",
        section: "Communication 2.5",
        title: "The Activities Resource accepts GET requests",
      },
    ],
    tags: ["v1.0.3", "activities", "resource", "basics"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: [
      "v1 proof-slice activities resource accepts get",
      "legacy note: XAPI-00253 upstream comment - An LRS's Activities API accepts GET requests.",
    ],
    steps: [
      {
        request: buildStatementPostRequest(
          buildProofStatement("11111111-1111-4111-8111-000000000302", {
            objectType: "Activity",
            id: unknownActivityId,
            definition: {
              name: {
                "en-US": "accepts get seed",
              },
            },
          }),
        ),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildActivitiesGetRequest(unknownActivityId),
        assertion: {
          status: 200,
        },
      },
    ],
  });

  const completeActivityCase = requestSequenceCase({
    caseId: "v1.activities.resource.complete-object",
    title: "The Activities Resource returns the complete Activity Object for a stored activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00251",
        section: "Communication 2.5.s1",
        title: "The Activities Resource returns the complete Activity Object",
      },
    ],
    tags: ["v1.0.3", "activities", "resource", "roundtrip"],
    capabilityFlags: ["activities", "retrieval"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: [
      "v1 proof-slice activities resource complete object",
      "legacy note: XAPI-00251 upstream comment - An LRS's Activities API upon processing a successful GET request returns 200 OK and the complete Activity Object.",
    ],
    steps: [
      {
        request: buildStatementPostRequest(
          buildProofStatement("11111111-1111-4111-8111-000000000303", completeActivityObject),
        ),
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
    caseId: "v1.activities.resource.missing-activity-id",
    title: "The Activities Resource rejects a GET request without activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00250",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource rejects requests without activityId",
      },
    ],
    tags: ["v1.0.3", "activities", "resource", "validation"],
    capabilityFlags: ["activities", "validation"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    request: buildVersionedRequest("GET", "activities", {}),
    assertion: {
      status: 400,
    },
    notes: [
      "v1 proof-slice activities resource missing activityId",
      "legacy note: XAPI-00250 upstream comment - An LRS's Activities API rejects a GET request without \"activityId\" as a parameter with error code 400 Bad Request.",
    ],
  });

  const mergedDefinitionCase = requestSequenceCase({
    caseId: "v1.activities.resource.definition-merge",
    title: "The Activities Resource merges definition language maps across statements sharing activityId",
    specVersion,
    requirementRefs: [
      {
        id: "XAPI-00254",
        section: "Communication 2.5.s1.table1.row1",
        title: "The Activities Resource returns all available information for an activityId",
      },
    ],
    tags: ["v1.0.3", "activities", "resource", "merge"],
    capabilityFlags: ["activities", "retrieval", "merge"],
    legacyTraceSuiteFile: activitiesResourceLegacySuiteFile,
    notes: [
      "v1 proof-slice activities resource definition merge",
      "legacy note: XAPI-00254 upstream comment - The Activity Object must contain all available information about an activity from any statements who target the same “activityId”. For example, LRS accepts two statements each with a different language description of an activity using the exact same “activityId”. The LRS must return both language descriptions when a GET request is made to the Activities endpoint for that “activityId”.",
    ],
    steps: [
      {
        request: buildStatementPostRequest(
          buildProofStatement("11111111-1111-4111-8111-000000000304", mergedActivityObjectOne),
        ),
        assertion: {
          status: 200,
        },
      },
      {
        request: buildStatementPostRequest(
          buildProofStatement("11111111-1111-4111-8111-000000000305", mergedActivityObjectTwo),
        ),
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
                "en-US": "example meeting",
                "fr-FR": "réunion",
              },
            },
          ],
        },
      },
    ],
  });

  return {
    type: "suite",
    id: "v1.proof-slice.activities",
    title: "Activities Resource",
    specVersion,
    tags: ["proof-slice", "activities"],
    children: [
      {
        type: "suite",
        id: "v1.proof-slice.activities.basics",
        title: "Activities Basics",
        specVersion,
        tags: ["activities", "basics"],
        children: [endpointCase, acceptsGetCase, completeActivityCase, missingActivityIdCase],
      },
      {
        type: "suite",
        id: "v1.proof-slice.activities.definition",
        title: "Activities Definition",
        specVersion,
        tags: ["activities", "definition"],
        children: [mergedDefinitionCase],
      },
    ],
  };
}
