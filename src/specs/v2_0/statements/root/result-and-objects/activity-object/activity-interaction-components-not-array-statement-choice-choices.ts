import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityInteractionComponentsNotArrayStatementChoiceChoicesCase = {
  "type": "case",
  "id": "v2.statements.activity.interaction-components.not-array.statement-choice-choices",
  "title": "A Statement rejects a statement Activity object when choice \"choices\" is not an array",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00051",
      "section": "Data 2.4.4.1.s8.table1.row3",
      "title": "Activity definition choices values are arrays of Interaction Components"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "interaction-components",
    "validation"
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
            "objectType": "Activity",
            "id": "https://example.test/xapi/activities/statement-choice-choices-not-array",
            "definition": {
              "interactionType": "choice",
              "correctResponsesPattern": [
                "choice-a[,]choice-b"
              ],
              "choices": {
                "invalid": true
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
    "status": 400,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Activity Objects",
      "legacy note: XAPI-00051 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
