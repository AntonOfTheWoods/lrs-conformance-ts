import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsFormatCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.format",
  "title": "The Statements Resource can process GET requests with \"format\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00168",
      "section": "Communication 2.1.3.s1.table1.row12",
      "title": "The Statements Resource can process GET requests with format"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "acceptance"
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
      "query": {
        "format": "ids"
      }
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
      "proof-slice statement query acceptance direct trace",
      "legacy note: XAPI-00168 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format or in “exact” if the “format” parameter is absent.",
    ]
  }
} as unknown as CaseDefinition;
