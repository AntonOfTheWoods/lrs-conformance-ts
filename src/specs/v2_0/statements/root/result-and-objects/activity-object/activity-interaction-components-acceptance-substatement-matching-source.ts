import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityInteractionComponentsAcceptanceSubstatementMatchingSourceCase = {
  "type": "case",
  "id": "v2.statements.activity.interaction-components.acceptance.substatement-matching-source",
  "title": "A Statement accepts a substatement Activity object when matching \"source\" uses interaction components",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00053",
      "section": "Data 2.4.4.1.s8.table1.row3",
      "title": "Activity definition source values are arrays of Interaction Components"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "interaction-components"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js"
  },
  "execution": {
    "kind": "single-request",
    "request": {
      "method": "POST",
      "endpoint": "statements",
      "authMode": "basic",
      "headers": {
        "X-Experience-API-Version": "2.0.0"
      },
      "query": {},
      "body": {
        "kind": "json",
        "value": {
          "id": "11111111-1111-4111-8111-111111111111",
          "actor": {
            "objectType": "Agent",
            "mbox": "mailto:learner@example.test",
            "name": "Learner Example"
          },
          "verb": {
            "id": "https://example.test/xapi/verbs/completed",
            "display": {
              "en-US": "completed"
            }
          },
          "object": {
            "objectType": "SubStatement",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:proof-nested-agent@example.test",
              "name": "Proof Agent"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/experienced",
              "display": {
                "en-US": "experienced"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/substatement-matching-source-acceptance",
              "definition": {
                "interactionType": "matching",
                "correctResponsesPattern": [
                  "source-a[.]target-a"
                ],
                "source": [
                  {
                    "id": "source-a",
                    "description": {
                      "en-US": "Source A"
                    }
                  },
                  {
                    "id": "source-b",
                    "description": {
                      "en-US": "Source B"
                    }
                  }
                ]
              }
            }
          },
          "timestamp": "2026-05-23T12:00:00Z"
        },
        "sourceFixture": {
          "version": "2.0.0",
          "domain": "statements",
          "name": "default"
        }
      }
    }
  },
  "assertion": {
    "kind": "single-request",
    "status": 200,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Activity Objects",
      "legacy note: XAPI-00053 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
