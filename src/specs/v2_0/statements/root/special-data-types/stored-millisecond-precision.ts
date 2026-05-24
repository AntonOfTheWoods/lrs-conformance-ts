import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsSpecialDataTypesStoredMillisecondPrecisionCase = {
  "type": "case",
  "id": "v2.statements.special-data-types.stored-millisecond-precision",
  "title": "The Statements resource recalls stored timestamps with at least millisecond precision",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00122",
      "section": "Data 4.5.s1.b3",
      "title": "Timestamps preserve precision to at least milliseconds when statements are recalled"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "special-data-types",
    "stored"
  ],
  "capabilityFlags": [
    "stored",
    "retrieval",
    "special-data-types"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js"
  },
  "execution": {
    "kind": "request-sequence",
    "steps": [
      {
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
            "id": "33333333-3333-4333-8333-000000005201",
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
            "timestamp": "2023-05-04T12:00:00.123456-05:00"
          },
          "sourceFixture": {
            "version": "2.0.0",
            "domain": "statements",
            "name": "default"
          }
        }
      },
      {
        "method": "GET",
        "endpoint": "statements",
        "authMode": "basic",
        "headers": {
          "X-Experience-API-Version": "2.0.0"
        },
        "query": {
          "statementId": "33333333-3333-4333-8333-000000005201"
        }
      }
    ]
  },
  "assertion": {
    "kind": "request-sequence",
    "steps": [
      {
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      },
      {
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [
          {
            "path": [
              "stored"
            ],
            "equals": "2023-05-04T17:00:00.123Z"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice special data types stored precision"
    ]
  }
} as unknown as CaseDefinition;
