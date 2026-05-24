import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryExclusiveStatementIdWithSinceCase = {
  "type": "case",
  "id": "v2.statements.query.exclusive.statement-id.with-since",
  "title": "The Statements resource rejects a GET request that combines statementId with since",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00151",
      "section": "Communication 2.1.3.s2.b2",
      "title": "GET rejects statementId combined with collection query parameters"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "validation",
    "exclusive"
  ],
  "capabilityFlags": [
    "query",
    "validation"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js"
  },
  "execution": {
    "kind": "single-request",
    "request": {
      "method": "GET",
      "endpoint": "statements",
      "authMode": "basic",
      "headers": {
        "X-Experience-API-Version": "2.0.0"
      },
      "query": {
        "statementId": "33333333-3333-4333-8333-000000000950",
        "since": "2026-05-23T12:00:50.000Z"
      }
    }
  },
  "assertion": {
    "kind": "single-request",
    "status": 400,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "proof-slice statement query exclusivity"
    ]
  }
} as unknown as CaseDefinition;
