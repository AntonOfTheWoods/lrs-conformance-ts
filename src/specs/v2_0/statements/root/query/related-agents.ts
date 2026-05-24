import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryRelatedAgentsCase = {
  "type": "case",
  "id": "v2.statements.query.related-agents",
  "title": "The Statements resource returns related agent matches from nested actor-like values",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00176",
      "section": "Communication 2.1.3.s1.table1.row8",
      "title": "GET with related_agents returns nested agent matches"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "related-agents"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js"
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
            "id": "33333333-3333-4333-8333-000000000031",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/completed",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:00:31.000Z",
            "context": {
              "instructor": {
                "objectType": "Agent",
                "mbox": "mailto:query-related-agent@example.test",
                "name": "Proof Agent"
              }
            }
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
            "id": "33333333-3333-4333-8333-000000000032",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:learner@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/completed",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:00:32.000Z",
            "context": {
              "instructor": {
                "objectType": "Agent",
                "mbox": "mailto:query-related-agent-noise@example.test",
                "name": "Proof Agent"
              }
            }
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
          "agent": "{\"objectType\":\"Agent\",\"mbox\":\"mailto:query-related-agent@example.test\"}",
          "related_agents": "true"
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
              "33333333-3333-4333-8333-000000000031"
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
              "33333333-3333-4333-8333-000000000032"
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
            "equals": "33333333-3333-4333-8333-000000000031"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice statement collection query",
      "legacy note: XAPI-00176 upstream comment - An LRS's Statement API can process a GET request with \"related_agents\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with exact match agent results if the agent parameter is set with a valid Agent or Identified Group JSON Object unless the related_agents parameter is set to true. If set to true it MUST return 200 OK, StatementResult Object with agent matches in the Actor, Object, authority, instructor, team, or any of these properties in a contained SubStatement",
      "legacy note: XAPI-00176 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"related_agents\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
