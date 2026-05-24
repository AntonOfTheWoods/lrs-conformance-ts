import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryStatementIdSingleStatementCase = {
  "type": "case",
  "id": "v2.statements.query.statement-id-single-statement",
  "title": "The Statements Resource returns a single Statement for a successful statementId lookup",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00156",
      "section": "Communication 2.1.3.s1",
      "title": "GET with statementId returns the corresponding Statement"
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
            "id": "33333333-3333-4333-8333-000000001206",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/statement-id-returned",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:20:06.000Z"
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
          "statementId": "33333333-3333-4333-8333-000000001206"
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
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000001206"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice statementId returns matching statement",
      "legacy note: XAPI-00156 upstream comment - An LRS's Statement API upon processing a successful GET request with a \"statementId\" parameter, returns code 200 OK and a single Statement with the corresponding \"id\".",
      "legacy note: XAPI-00156 upstream describe - An LRS\\'s Statement Resource upon processing a successful GET request with a \"statementId\" parameter, returns code 200 OK and a single Statement with the corresponding \"id\".",
    ]
  }
} as unknown as CaseDefinition;
