import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsScoreRawValidStatementUnrestrictedCase = {
  "type": "case",
  "id": "v2.statements.score.raw-valid.statement-unrestricted",
  "title": "A Statement accepts a statement result when score uses raw without min or max",
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
    "raw"
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
              "raw": 0.6767676
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
      "Statement Score"
    ]
  }
} as unknown as CaseDefinition;
