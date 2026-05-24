import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyExtensionsCase = {
  "type": "case",
  "id": "v2.statements.special-data-types.extensions.substatement-activity.empty-extensions",
  "title": "The Statements resource accepts PUT when statement substatement activity extensions extensions can be empty object",
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
        "statementId": "33333333-3333-4333-8333-000000005112"
      },
      "body": {
        "kind": "json",
        "value": {
          "id": "33333333-3333-4333-8333-000000005112",
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
              "id": "https://example.test/xapi/activities/special-data-types/substatement/5112",
              "definition": {
                "extensions": {}
              }
            }
          },
          "timestamp": "2026-05-23T13:25:12.000Z"
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
      "proof-slice special data types substatement-activity empty-extensions"
    ]
  }
} as unknown as CaseDefinition;
