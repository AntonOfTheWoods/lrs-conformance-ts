import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsRetrievalDirectMoreEmptyWhenExhaustedCase = {
  "type": "case",
  "id": "v2.statements.retrieval.direct.more-empty-when-exhausted",
  "title": "The \"more\" property is empty when the entire result set has been returned",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00109",
      "section": "Data 2.5.s2.table1.row2",
      "title": "The \"more\" property is empty or absent when all results have been returned"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "retrieval"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data2.5-RetrievalofStatements.js"
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
        "verb": "https://example.test/xapi/verbs/retrieval-empty-more"
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
          "more"
        ],
        "equals": ""
      }
    ],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "proof-slice retrieval direct more empty"
    ]
  }
} as unknown as CaseDefinition;
