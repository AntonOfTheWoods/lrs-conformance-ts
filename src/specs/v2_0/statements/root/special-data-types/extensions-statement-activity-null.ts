import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsSpecialDataTypesExtensionsStatementActivityNullCase = {
  "type": "case",
  "id": "v2.statements.special-data-types.extensions.statement-activity.null",
  "title": "The Statements resource accepts PUT when statement activity extensions extension values can be null",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00119",
      "section": "Data 4.1, XAPI-00119",
      "title": "Extensions may contain null, empty strings, and empty objects"
    },
    {
      "id": "XAPI-00120",
      "section": "Data 4.1.s2",
      "title": "An Extension is defined as an Object of any \"extensions\" property"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "special-data-types",
    "extensions",
    "put"
  ],
  "capabilityFlags": [
    "extensions",
    "put",
    "special-data-types"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js"
  },
  "execution": {
    "kind": "single-request",
    "request": {
      "method": "PUT",
      "endpoint": "statements",
      "authMode": "basic",
      "headers": {
        "X-Experience-API-Version": "2.0.0"
      },
      "query": {
        "statementId": "33333333-3333-4333-8333-000000005102"
      },
      "body": {
        "kind": "json",
        "value": {
          "id": "33333333-3333-4333-8333-000000005102",
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
            "id": "https://example.test/xapi/activities/special-data-types/5102",
            "definition": {
              "extensions": {
                "http://example.com/ex": null
              }
            }
          },
          "timestamp": "2026-05-23T13:25:02.000Z"
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
    "status": 204,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "proof-slice special data types statement-activity null",
      "legacy note: XAPI-00119 upstream comment - An Extension can be null, an empty string, objects with nothing in them. The LRS accepts with 200 if a PUT or 204 if a POST an otherwise valid statement which has any extension value including null, an empty string, or an empty object. Tests for other emptys and PUT",
      "legacy note: XAPI-00119 upstream describe - An Extension can be null, an empty string, objects with nothing in them when using PUT.",
      "legacy note: XAPI-00120 upstream comment - in extensions.js",
    ]
  }
} as unknown as CaseDefinition;
