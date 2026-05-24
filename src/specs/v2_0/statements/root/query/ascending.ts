import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAscendingCase = {
  "type": "case",
  "id": "v2.statements.query.ascending",
  "title": "The Statements resource orders collection results by stored time when ascending is true",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00166",
      "section": "Communication 2.1.3.s1.table1.row14",
      "title": "GET with ascending returns results in ascending stored order"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "ascending"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.1.6.1-Statement-Resource.js"
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
            "id": "33333333-3333-4333-8333-000000000039",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/query-ascending",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:00:39.000Z"
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
            "id": "33333333-3333-4333-8333-000000000040",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/query-ascending",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:00:40.000Z"
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
          "verb": "https://example.test/xapi/verbs/query-ascending",
          "ascending": "true"
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
              "33333333-3333-4333-8333-000000000039"
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
              "33333333-3333-4333-8333-000000000040"
            ]
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      },
      {
        "status": 200,
        "expectedHeaders": [
          {
            "key": "X-Experience-API-Version",
            "equals": "2.0.0"
          }
        ],
        "expectedHeaderPatterns": [],
        "jsonPathEquals": [
          {
            "path": [
              "statements",
              "length"
            ],
            "equals": 2
          },
          {
            "path": [
              "statements",
              "0",
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000000039"
          },
          {
            "path": [
              "statements",
              "1",
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000000040"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice statement collection query",
      "legacy note: XAPI-00166 upstream comment - An LRS's Statement API can process a GET request with \"ascending\" as a parameter The Statement API MUST return 200 OK, StatementResult Object with results in ascending order of stored time if the ascending parameter is set to true.",
      "legacy note: XAPI-00166 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"ascending\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
