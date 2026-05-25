import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsAscendingCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.ascending",
  "title": "The Statements Resource can process GET requests with \"ascending\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00166",
      "section": "Communication 2.1.3.s1.table1.row14",
      "title": "The Statements Resource can process GET requests with ascending"
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
        "ascending": "true"
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
      "legacy note: XAPI-00166 upstream comment - An LRS's Statement API can process a GET request with \"ascending\" as a parameter The Statement API MUST return 200 OK, StatementResult Object with results in ascending order of stored time if the ascending parameter is set to true.",
      "legacy note: XAPI-00166 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"ascending\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
