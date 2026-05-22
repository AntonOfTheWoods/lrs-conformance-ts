import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsRetrievalDirectStatementsArrayTypeCase = {
  "type": "case",
  "id": "v2.statements.retrieval.direct.statements-array-type",
  "title": "A StatementResult exposes a \"statements\" property that is an array",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00110",
      "section": "Data 2.5.s2.table1.row1",
      "title": "The \"statements\" property is an array of Statements"
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
    "suiteFile": "test/v2_0/E.Data2.5-RetrievalofStatements.js"
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
            "id": "33333333-3333-4333-8333-000000000979",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:retrieval-array-statement@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/retrieval-array",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:16:19.000Z"
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
            "id": "33333333-3333-4333-8333-000000000980",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:retrieval-array-substatement@example.test",
              "name": "Learner Example"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/retrieval-array",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "SubStatement",
              "actor": {
                "objectType": "Agent",
                "mbox": "mailto:proof-nested-agent@example.test",
                "name": "Proof Agent"
              },
              "verb": {
                "id": "https://example.test/xapi/verbs/experienced",
                "display": {
                  "en-US": "experienced"
                }
              },
              "object": {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/substatement"
              }
            },
            "timestamp": "2026-05-23T12:16:20.000Z"
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
          "verb": "https://example.test/xapi/verbs/retrieval-array"
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
              "33333333-3333-4333-8333-000000000979"
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
              "33333333-3333-4333-8333-000000000980"
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
        "jsonPathEquals": [],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice retrieval direct statements array",
      "legacy note: XAPI-00110 upstream comment - A \"statements\" property is an Array of Statements. Make a GET request which will return at least one statement and confirm the “statements” property is a valid Array of Statements.",
      "legacy note: XAPI-00110 upstream describe - A \"statements\" property is an Array of Statements",
    ]
  }
} as unknown as CaseDefinition;
