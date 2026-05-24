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
      "proof-slice retrieval direct more empty",
      "legacy note: XAPI-00109 upstream comment - The \"more\" property is absent or an empty string (no whitespace) if the entire results of the original GET request have been returned. To test make a GET request which will return a known number of statements and check to make sure the LRS either returns an empty string or the more property is absent.",
      "legacy note: XAPI-00109 upstream describe - The \"more\" property is absent or an empty string (no whitespace) if the entire results of the original GET request have been returned.",
    ]
  }
} as unknown as CaseDefinition;
