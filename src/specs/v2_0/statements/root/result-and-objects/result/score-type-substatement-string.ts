import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsScoreTypeSubstatementStringCase = {
  "type": "case",
  "id": "v2.statements.score.type.substatement-string",
  "title": "A Statement rejects a substatement result when score is a string",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00079",
      "section": "Data 2.4.5.1",
      "title": "Result score values are Objects"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "score",
    "validation"
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
              "id": "https://example.test/xapi/activities/substatement"
            },
            "result": {
              "score": "should fail",
              "success": true,
              "completion": true,
              "response": "proof result response",
              "duration": "PT1H0M0.1S",
              "extensions": {
                "https://example.test/xapi/results/extensions/proof": true
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
      "Statement Score",
      "legacy note: XAPI-00079 upstream comment - A \"score\" property is an Object. The LRS rejects with 400 Bad Request a “score” property which is not a valid object.",
    ]
  }
} as unknown as CaseDefinition;
