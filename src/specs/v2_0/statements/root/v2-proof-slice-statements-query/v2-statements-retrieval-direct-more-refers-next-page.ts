import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsRetrievalDirectMoreRefersNextPageCase = {
  "type": "case",
  "id": "v2.statements.retrieval.direct.more-refers-next-page",
  "title": "A non-empty \"more\" value refers to the next page of StatementResult results",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00108",
      "section": "Data 2.5.s2.table1.row2",
      "title": "A non-empty \"more\" IRL refers to the next page of results"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "retrieval",
    "pagination"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data2.5-RetrievalofStatements.js"
  },
  "execution": {
    "kind": "request-sequence",
    "steps": [
      {
        "method": "POST",
        "endpoint": "statements",
        "authMode": "basic",
        "headers": {
          "X-Experience-API-Version": "2.0.0"
        },
        "query": {},
        "body": {
          "kind": "json",
          "value": {
            "id": "33333333-3333-4333-8333-000000000981",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/retrieval-paged",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:16:21.000Z"
          },
          "sourceFixture": {
            "version": "2.0.0",
            "domain": "statements",
            "name": "default"
          }
        }
      },
      {
        "method": "POST",
        "endpoint": "statements",
        "authMode": "basic",
        "headers": {
          "X-Experience-API-Version": "2.0.0"
        },
        "query": {},
        "body": {
          "kind": "json",
          "value": {
            "id": "33333333-3333-4333-8333-000000000982",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/retrieval-paged",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:16:22.000Z"
          },
          "sourceFixture": {
            "version": "2.0.0",
            "domain": "statements",
            "name": "default"
          }
        }
      },
      {
        "method": "GET",
        "endpoint": "statements",
        "authMode": "basic",
        "headers": {
          "X-Experience-API-Version": "2.0.0"
        },
        "query": {
          "verb": "https://example.test/xapi/verbs/retrieval-paged",
          "limit": "1"
        }
      },
      {
        "method": "GET",
        "endpoint": "statements",
        "authMode": "basic",
        "headers": {
          "X-Experience-API-Version": "2.0.0"
        },
        "query": {
          "verb": "https://example.test/xapi/verbs/retrieval-paged",
          "limit": "1",
          "offset": "1"
        }
      }
    ]
  },
  "assertion": {
    "kind": "request-sequence",
    "steps": [
      {
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [
          {
            "path": [],
            "equals": [
              "33333333-3333-4333-8333-000000000981"
            ]
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      },
      {
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [
          {
            "path": [],
            "equals": [
              "33333333-3333-4333-8333-000000000982"
            ]
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      },
      {
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [
          {
            "path": [
              "more"
            ],
            "equals": "/xapi/statements?verb=https%3A%2F%2Fexample.test%2Fxapi%2Fverbs%2Fretrieval-paged&limit=1&offset=1"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      },
      {
        "status": 200,
        "expectedHeaders": [],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [
          {
            "path": [
              "statements",
              "length"
            ],
            "equals": 1
          },
          {
            "path": [
              "statements",
              "0",
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000000981"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice retrieval direct more refers next page"
    ]
  }
} as unknown as CaseDefinition;
