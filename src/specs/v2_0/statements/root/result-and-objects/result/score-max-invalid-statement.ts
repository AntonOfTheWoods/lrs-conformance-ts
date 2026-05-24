import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsScoreMaxInvalidStatementCase = {
  "type": "case",
  "id": "v2.statements.score.max-invalid.statement",
  "title": "A Statement rejects a statement result when max is less than min",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00080",
      "section": "Data 2.4.5.1.s2.table1.row4",
      "title": "Result score max values are greater than min when min is present"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "score",
    "max",
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
            "objectType": "Activity",
            "id": "https://example.test/xapi/activities/first-proof-slice"
          },
          "timestamp": "2026-05-23T12:00:00Z",
          "result": {
            "score": {
              "max": 100.6767676,
              "raw": 101.6767676,
              "min": 104.6767676
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
    "status": 400,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Score",
      "legacy note: XAPI-00080 upstream comment - If the \"score\" Object uses the \"max\" property, the value must be a decimal number more than the \"min\" property, if it is present. If \"min\" is not present \"max\" can be any number. The LRS rejects with 400 Bad Request a statement with a Result Object using the “max” property (if it is present) which is not a decimal number or is lesser than the value of the “min” property, if it is present. If this is the test, this will need to be moved, so that the result can be checked, oh no now that i read closer, no get and check it needed just a couple more tests sending in particular configurations of min and max and expecting 400's or 200's",
    ]
  }
} as unknown as CaseDefinition;
