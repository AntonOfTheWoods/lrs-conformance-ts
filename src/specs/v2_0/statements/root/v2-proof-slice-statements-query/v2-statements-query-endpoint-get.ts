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
      "proof-slice statement endpoint get exists"
    ]
  }
} as unknown as CaseDefinition;
