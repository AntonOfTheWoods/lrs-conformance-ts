import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityInteractionComponentsAcceptanceSubstatementLikertScaleCase = {
  "type": "case",
  "id": "v2.statements.activity.interaction-components.acceptance.substatement-likert-scale",
  "title": "A Statement accepts a substatement Activity object when likert \"scale\" uses interaction components",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00052",
      "section": "Data 2.4.4.1.s8.table1.row3",
      "title": "Activity definition scale values are arrays of Interaction Components"
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
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js"
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
              "id": "https://example.test/xapi/activities/substatement-likert-scale-acceptance",
              "definition": {
                "interactionType": "likert",
                "correctResponsesPattern": [
                  "likert-1"
                ],
                "scale": [
                  {
                    "id": "likert-0",
                    "description": {
                      "en-US": "Likert zero"
                    }
                  },
                  {
                    "id": "likert-1",
                    "description": {
                      "en-US": "Likert one"
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
      "legacy note: XAPI-00052 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
