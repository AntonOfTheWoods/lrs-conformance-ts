import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsVerbCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.verb",
  "title": "The Statements Resource can process GET requests with \"verb\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00180",
      "section": "Communication 2.1.3.s1.table1.row4",
      "title": "The Statements Resource can process GET requests with verb"
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
        "verb": "https://example.test/xapi/verbs/query-accepts-verb"
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
      "legacy note: XAPI-00180 upstream comment - An LRS's Statement API can process a GET request with \"verb\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with exact match verb results if the verb parameter is set with a valid Verb IRI",
      "legacy note: XAPI-00180 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"verb\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
