import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsResultExtensionsTypeStatementStringCase = {
  "type": "case",
  "id": "v2.statements.result.extensions-type.statement-string",
  "title": "A Statement rejects a statement result when extensions is a string",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00078",
      "section": "Data 2.4.5.s2.table1.row6",
      "title": "Result extensions values are Objects"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "result",
    "validation",
    "extensions"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.4-Result-Requirements.js",
    "configFile": "test/v2_0/configs/results.js"
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
            "duration": "PT1H0M0.1S",
            "extensions": "should fail"
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
      "legacy note: XAPI-00078 upstream comment - An \"extensions\" property is an Object. The LRS rejects with 400 Bad Request a Statement which has a Result Object with aa “extensions” property which does not have a valid Extensions Object, if present.",
    ]
  }
} as unknown as CaseDefinition;
