import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryVoidedStatementIdWithAttachmentsAllowedCase = {
  "type": "case",
  "id": "v2.statements.query.voided-statement-id-with-attachments-allowed",
  "title": "The Statements Resource allows voidedStatementId to be combined with attachments",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00150",
      "section": "Communication 2.1.3.s2.b2",
      "title": "voidedStatementId may be combined with attachments on GET requests"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "voidedStatementId",
    "attachments"
  ],
  "capabilityFlags": [
    "query",
    "retrieval",
    "attachments",
    "voiding"
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
            "id": "33333333-3333-4333-8333-000000001213",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/voided-statement-id-attachments-target",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:20:13.000Z"
          },
          "sourceFixture": {
            "version": "2.0.0",
            "domain": "statements",
            "name": "default"
          }
        }
      },
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
            "id": "33333333-3333-4333-8333-000000001214",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "http://adlnet.gov/expapi/verbs/voided",
              "display": {
                "en-US": "voided"
              }
            },
            "object": {
              "objectType": "StatementRef",
              "id": "33333333-3333-4333-8333-000000001213"
            },
            "timestamp": "2026-05-23T12:20:14.000Z"
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
          "voidedStatementId": "33333333-3333-4333-8333-000000001213",
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
      "proof-slice voidedStatementId attachments allowed"
    ]
  }
} as unknown as CaseDefinition;
