import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryStatementResultDirectBaseCase = {
  "type": "case",
  "id": "v2.statements.query.statement-result.direct.base",
  "title": "The Statements Resource returns a StatementResult for GET requests without \"statementId\" or \"voidedStatementId\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00154",
      "section": "Communication 2.1.3.s1",
      "title": "GET without statementId or voidedStatementId returns a StatementResult"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "statement-result"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
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
      "query": {}
    }
  },
  "assertion": {
    "kind": "single-request",
    "status": 200,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [
      "\"statements\""
    ],
    "notes": [
      "proof-slice statement result direct trace"
    ]
  }
} as unknown as CaseDefinition;
