import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryVoidedStatementIdWithFormatAllowedCase = {
  "type": "case",
  "id": "v2.statements.query.voided-statement-id-with-format-allowed",
  "title": "The Statements Resource allows voidedStatementId to be combined with format",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00150",
      "section": "Communication 2.1.3.s2.b2",
      "title": "voidedStatementId may be combined with format on GET requests"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "voidedStatementId",
    "format"
  ],
  "capabilityFlags": [
    "query",
    "retrieval",
    "format",
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
            "id": "33333333-3333-4333-8333-000000001211",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/voided-statement-id-format-target",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:20:11.000Z"
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
            "id": "33333333-3333-4333-8333-000000001212",
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
              "id": "33333333-3333-4333-8333-000000001211"
            },
            "timestamp": "2026-05-23T12:20:12.000Z"
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
          "voidedStatementId": "33333333-3333-4333-8333-000000001211",
          "format": "ids"
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
      "proof-slice voidedStatementId format allowed"
    ]
  }
} as unknown as CaseDefinition;
