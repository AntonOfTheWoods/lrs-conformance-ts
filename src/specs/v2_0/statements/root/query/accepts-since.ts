import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsSinceCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.since",
  "title": "The Statements Resource can process GET requests with \"since\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00175",
      "section": "Communication 2.1.3.s1.table1.row9",
      "title": "The Statements Resource can process GET requests with since"
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
        "since": "2026-05-23T12:00:26.000Z"
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
      "legacy note: XAPI-00175 upstream comment - An LRS's Statement API can process a GET request with \"since\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object containing all statements which have a stored timestamp after the since parameter timestamp in the query.",
      "legacy note: XAPI-00175 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"since\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
