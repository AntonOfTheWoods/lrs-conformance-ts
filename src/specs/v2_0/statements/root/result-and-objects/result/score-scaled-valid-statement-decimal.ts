import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsScoreScaledValidStatementDecimalCase = {
  "type": "case",
  "id": "v2.statements.score.scaled-valid.statement-decimal",
  "title": "A Statement accepts a statement result when scaled uses a decimal within range",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00083",
      "section": "Data 2.4.5.1.s2.table1.row1",
      "title": "Result score scaled values are between -1 and 1 inclusive"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "score",
    "scaled"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.4-Result-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/scores.js"
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
            "id": "https://example.test/xapi/activities/first-proof-slice"
          },
          "timestamp": "2026-05-23T12:00:00Z",
          "result": {
            "score": {
              "scaled": 0.6767676
            },
            "success": true,
            "completion": true,
            "response": "proof result response",
            "duration": "PT1H0M0.1S",
            "extensions": {
              "https://example.test/xapi/results/extensions/proof": true
            }
          }
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
      "Statement Score",
      "legacy note: XAPI-00083 upstream comment - If the \"score\" Object uses the \"scaled\" property, the value must be a decimal number between -1 and 1. The LRS rejects with 400 Bad Request a statement with a Result Object using the “scaled” property (if it is present) which is not a decimal number or is greater than 1 or less than -1.",
    ]
  }
} as unknown as CaseDefinition;
