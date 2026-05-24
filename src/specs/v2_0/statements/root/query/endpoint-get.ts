import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryEndpointGetCase = {
  "type": "case",
  "id": "v2.statements.query.endpoint.get",
  "title": "The Statements Resource exists at /statements and accepts GET requests",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00139",
      "section": "Communication 2.1",
      "title": "The Statements Resource exists at /statements"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "endpoint"
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
        "verb": "https://example.test/xapi/verbs/statement-endpoint-get"
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
    "textContains": [],
    "notes": [
      "proof-slice statement endpoint get exists",
      "legacy note: XAPI-00139 upstream comment - An LRS has a Statement API with endpoint \"base IRI\"+\"/statements\"",
      "legacy note: XAPI-00139 upstream describe - An LRS has a Statement Resource with endpoint \"base IRI\"+\"/statements\"",
    ]
  }
} as unknown as CaseDefinition;
