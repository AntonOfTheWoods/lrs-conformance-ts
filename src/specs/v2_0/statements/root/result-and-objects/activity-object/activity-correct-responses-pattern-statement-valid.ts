import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityCorrectResponsesPatternStatementValidCase = {
  "type": "case",
  "id": "v2.statements.activity.correct-responses-pattern.statement-valid",
  "title": "A Statement accepts a statement Activity object when definition.correctResponsesPattern is an array of strings",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00050",
      "section": "Data 2.4.4.1.s8.table1.row2",
      "title": "Activity definition correctResponsesPattern values are arrays of strings"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "correct-responses-pattern"
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
            "objectType": "Activity",
            "id": "https://example.test/xapi/activities/statement-correct-responses-pattern-valid",
            "definition": {
              "interactionType": "other",
              "correctResponsesPattern": [
                "proof-response"
              ]
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
      "legacy note: XAPI-00050 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
