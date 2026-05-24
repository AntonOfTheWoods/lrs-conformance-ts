import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsSpecialDataTypesExtensionsStatementContextNullCase = {
  "type": "case",
  "id": "v2.statements.special-data-types.extensions.statement-context.null",
  "title": "The Statements resource accepts PUT when statement context extensions extension values can be null",
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
        "statementId": "33333333-3333-4333-8333-000000005110"
      },
      "body": {
        "kind": "json",
        "value": {
          "id": "33333333-3333-4333-8333-000000005110",
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
          "timestamp": "2026-05-23T13:25:10.000Z",
          "context": {
            "extensions": {
              "http://example.com/ex": null
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
    "status": 204,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "proof-slice special data types statement-context null"
    ]
  }
} as unknown as CaseDefinition;
