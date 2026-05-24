import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryStatementIdRoundtripCase = {
  "type": "case",
  "id": "v2.statements.query.statement-id-roundtrip",
  "title": "The Statements resource returns a submitted statement when queried by statementId",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-01001",
      "section": "Communication 4.1.6.1",
      "title": "Statements can be queried by statementId"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "retrieval"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js"
  },
  "execution": {
    "kind": "submit-and-query",
    "submit": {
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
          "id": "33333333-3333-4333-8333-000000000208",
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
          "timestamp": "2026-05-23T12:00:00Z"
        },
        "sourceFixture": {
          "version": "2.0.0",
          "domain": "statements",
          "name": "default"
        }
      }
    },
    "query": {
      "method": "GET",
      "endpoint": "statements",
      "authMode": "basic",
      "headers": {
        "X-Experience-API-Version": "2.0.0"
      },
      "query": {
        "statementId": "33333333-3333-4333-8333-000000000208"
      }
    },
    "polling": {
      "strategy": "consistent-through",
      "maxAttempts": 5,
      "intervalMs": 250
    }
  },
  "assertion": {
    "kind": "submit-and-query",
    "submitStatus": 200,
    "queryStatus": 200,
    "expectedHeaders": [
      {
        "key": "X-Experience-API-Version",
        "equals": "2.0.0"
      }
    ],
    "expectedHeaderPatterns": [],
    "queryJsonPathEquals": [
      {
        "path": [
          "id"
        ],
        "equals": "33333333-3333-4333-8333-000000000208"
      }
    ],
    "queryJsonPathEqualsCaptured": [],
    "queryTextContains": [],
    "notes": [
      "proof-slice query retrieval",
      "legacy note: XAPI-01001 upstream comment - Rewrite parity requirement: statementId GET roundtrip behavior remains covered in rewrite statement query cases.",
    ]
  }
} as unknown as CaseDefinition;
