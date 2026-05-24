import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsResultDurationInvalidStatementInvalidDesignatorCase = {
  "type": "case",
  "id": "v2.statements.result.duration-invalid.statement-invalid-designator",
  "title": "A Statement rejects a statement result when duration is PA1H0M0S",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00077",
      "section": "Data 2.4.5.s2.table1.row4",
      "title": "Result duration values are ISO 8601 durations"
    },
    {
      "id": "XAPI-00124",
      "section": "Data 4.6.s1.b1",
      "title": "Duration values use the ISO 8601 duration format"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "validation",
    "duration"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.4-Result-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/durations.js"
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
              "scaled": 0.6767676,
              "raw": 0.6767676,
              "min": -1,
              "max": 1
            },
            "success": true,
            "completion": true,
            "response": "proof result response",
            "duration": "PA1H0M0S",
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
      "Statement Result",
      "legacy note: XAPI-00077 upstream comment - A \"duration\" property is a formatted to ISO 8601 durations (see Data 4.6). The LRS rejects with 400 Bad Request a Statement which has a Result Object with a “duration” property which does not have a valid ISO 8601 value, if present.",
      "legacy note: XAPI-00124 upstream comment - in durations.js",
    ]
  }
} as unknown as CaseDefinition;
