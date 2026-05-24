import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsResultSuccessTypeSubstatementTrueStringCase = {
  "type": "case",
  "id": "v2.statements.result.success-type.substatement-true-string",
  "title": "A Statement rejects a substatement result when success is the string true",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00074",
      "section": "Data 2.4.5.s2.table1.row1",
      "title": "Result success values are Booleans"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "validation",
    "success"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.4-Result-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/results.js"
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
                "scaled": 0.6767676,
                "raw": 0.6767676,
                "min": -1,
                "max": 1
              },
              "success": "true",
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
      "Statement Result"
    ]
  }
} as unknown as CaseDefinition;
