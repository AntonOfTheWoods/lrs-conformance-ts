import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryFilteringLimitCase = {
  "type": "case",
  "id": "v2.statements.query.filtering.limit",
  "title": "The Statements Resource returns only the number of statements requested by the \"limit\" filtering criterion",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00164",
      "section": "Communication 2.1.3.s1",
      "title": "The statements within the \"statements\" property correspond to the filtering criterion sent in the GET request"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "filtering",
    "limit"
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
            "id": "33333333-3333-4333-8333-000000000037",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/query-limit",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:00:37.000Z"
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
            "id": "33333333-3333-4333-8333-000000000038",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/query-limit",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:00:38.000Z"
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
          "verb": "https://example.test/xapi/verbs/query-limit",
          "limit": "1"
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
              "33333333-3333-4333-8333-000000000037"
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
              "33333333-3333-4333-8333-000000000038"
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
            "equals": 1
          },
          {
            "path": [
              "statements",
              "0",
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000000038"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice statement filtering criterion limit",
      "legacy note: XAPI-00164 upstream comment - The Statements within the \"statements\" property will correspond to the filtering criterion sent in with the GET request",
      "legacy note: XAPI-00164 upstream describe - The Statements within the \"statements\" property will correspond to the filtering criterion sent in with the GET request",
    ]
  }
} as unknown as CaseDefinition;
