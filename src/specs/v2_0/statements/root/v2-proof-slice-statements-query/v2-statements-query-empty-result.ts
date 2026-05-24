import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryEmptyResultCase = {
  "type": "case",
  "id": "v2.statements.query.empty-result",
  "title": "The Statements resource returns 200 with an empty StatementResult when a collection query matches nothing",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00149",
      "section": "Communication 2.1.3.s2.b4",
      "title": "GET returns an empty StatementResult instead of rejecting the request"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "retrieval"
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
        "verb": "https://example.test/xapi/verbs/non-existent-proof-query"
      }
    }
  },
  "assertion": {
    "kind": "single-request",
    "status": 200,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [
      {
        "path": [
          "statements"
        ],
        "equals": []
      }
    ],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "proof-slice empty statement query result"
    ]
  }
} as unknown as CaseDefinition;
