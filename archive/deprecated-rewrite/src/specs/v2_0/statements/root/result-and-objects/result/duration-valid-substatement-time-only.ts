import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsResultDurationValidSubstatementTimeOnlyCase = {
  "type": "case",
  "id": "v2.statements.result.duration-valid.substatement-time-only",
  "title": "A Statement accepts a substatement result when duration is PT4H35M59.14S",
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
    "duration"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.4-Result-Requirements.js",
    "configFile": "test/v2_0/configs/durations.js"
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
              "success": true,
              "completion": true,
              "response": "proof result response",
              "duration": "PT4H35M59.14S",
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
    "status": 200,
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
