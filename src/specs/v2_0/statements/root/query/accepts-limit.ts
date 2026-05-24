import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsLimitCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.limit",
  "title": "The Statements Resource can process GET requests with \"limit\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00173",
      "section": "Communication 2.1.3.s1.table1.row11",
      "title": "The Statements Resource can process GET requests with limit"
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
    "suiteFile": "test/v2_0/4.1.6.1-Statement-Resource.js"
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
        "limit": "1"
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
      "legacy note: XAPI-00173 upstream comment - An LRS's Statement API can process a GET request with \"limit\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with only the number of results set by the integer in the limit parameter. If the limit parameter is not present, the limit is defaulted to 0 which returns all results up to the server limit.",
      "legacy note: XAPI-00173 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"limit\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
