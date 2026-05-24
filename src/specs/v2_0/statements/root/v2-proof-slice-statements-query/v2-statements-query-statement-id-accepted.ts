import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryStatementIdAcceptedCase = {
  "type": "case",
  "id": "v2.statements.query.statement-id-accepted",
  "title": "The Statements Resource can process a GET request with statementId",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00158",
      "section": "Communication 2.1.3.s1.table1.row1",
      "title": "The Statements Resource can process GET requests with statementId"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "statementId"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js"
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
            "id": "33333333-3333-4333-8333-000000001205",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/statement-id-accepted",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:20:05.000Z"
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
          "statementId": "33333333-3333-4333-8333-000000001205"
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
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice statementId accepted"
    ]
  }
} as unknown as CaseDefinition;
