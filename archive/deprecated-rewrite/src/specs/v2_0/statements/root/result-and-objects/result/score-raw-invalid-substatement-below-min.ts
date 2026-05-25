import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsScoreRawInvalidSubstatementBelowMinCase = {
  "type": "case",
  "id": "v2.statements.score.raw-invalid.substatement-below-min",
  "title": "A Statement rejects a substatement result when score uses raw less than min",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00082",
      "section": "Data 2.4.5.1.s2.table1.row2",
      "title": "Result score raw values stay within min and max when present"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "score",
    "raw",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.4-Result-Requirements.js",
    "configFile": "test/v2_0/configs/scores.js"
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
              "score": {
                "raw": 0.6767676,
                "min": 1.4067676
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
      "legacy note: XAPI-00082 upstream comment - If the \"score\" Object uses the \"raw\" property, the value must be a decimal number between the \"min\" and \"max\", if they are present. If they are not present \"raw\" can be any number. The LRS rejects with 400 Bad Request a statement with a Result Object using the “raw” property (if it is present) which is not a decimal number or is greater than the value of the “max” property, if it is present, or lesser than the value of the “min” property, if it is present.",
    ]
  }
} as unknown as CaseDefinition;
