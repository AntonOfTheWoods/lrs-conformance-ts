import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryStatementIdWithAttachmentsAllowedCase = {
  "type": "case",
  "id": "v2.statements.query.statement-id-with-attachments-allowed",
  "title": "The Statements Resource allows statementId to be combined with attachments",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00151",
      "section": "Communication 2.1.3.s2.b2",
      "title": "statementId may be combined with attachments on GET requests"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "statementId",
    "attachments"
  ],
  "capabilityFlags": [
    "query",
    "retrieval",
    "attachments"
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
            "id": "33333333-3333-4333-8333-000000001210",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/statement-id-attachments-allowed",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:20:10.000Z"
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
          "statementId": "33333333-3333-4333-8333-000000001210",
          "attachments": "true"
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
      "proof-slice statementId attachments allowed",
      "legacy note: XAPI-00151 upstream comment - An LRS's Statement API rejects a GET request with both \"statementId\" and anything other than \"attachments\" or \"format\" as parameters with error code 400 Bad Request.",
      "legacy note: XAPI-00151 upstream describe - An LRS\\'s Statement Resource rejects with error code 400 a GET request with both \"statementId\" and anything other than \"attachments\" or \"format\" as parameters",
    ]
  }
} as unknown as CaseDefinition;
