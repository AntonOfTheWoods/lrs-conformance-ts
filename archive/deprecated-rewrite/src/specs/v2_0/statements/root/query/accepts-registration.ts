import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsRegistrationCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.registration",
  "title": "The Statements Resource can process GET requests with \"registration\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00178",
      "section": "Communication 2.1.3.s1.table1.row6",
      "title": "The Statements Resource can process GET requests with registration"
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
        "registration": "33333333-3333-4333-8333-000000001226"
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
      "legacy note: XAPI-00178 upstream comment - An LRS's Statement API can process a GET request with \"registration\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with exact match registration results if the registration parameter is set with a valid registration UUID",
      "legacy note: XAPI-00178 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"registration\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
