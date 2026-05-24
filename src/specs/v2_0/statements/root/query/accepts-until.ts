import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsUntilCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.until",
  "title": "The Statements Resource can process GET requests with \"until\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00174",
      "section": "Communication 2.1.3.s1.table1.row10",
      "title": "The Statements Resource can process GET requests with until"
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
        "until": "2026-05-23T12:00:27.000Z"
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
      "legacy note: XAPI-00174 upstream comment - An LRS's Statement API can process a GET request with \"until\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object containing all statements which have a stored timestamp at or before the specified until parameter timestamp.",
      "legacy note: XAPI-00174 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"until\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
