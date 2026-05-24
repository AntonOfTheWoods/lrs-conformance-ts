import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsRetrievalStatementResultArrayCase = {
  "type": "case",
  "id": "v2.statements.retrieval.statement-result-array",
  "title": "The Statements resource returns StatementResult collections with a statements array and empty more when all matches are returned",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00110",
      "section": "Data 2.5.s2.table1.row1",
      "title": "StatementResult collections expose a \"statements\" array"
    },
    {
      "id": "XAPI-00109",
      "section": "Data 2.5.s2.table1.row2",
      "title": "StatementResult collections return an empty or absent \"more\" when fully exhausted"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "retrieval",
    "query"
  ],
  "capabilityFlags": [
    "transport",
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
            "equals": "33333333-3333-4333-8333-000000000980"
          },
          {
            "path": [
              "statements",
              "1",
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000000979"
          },
          {
            "path": [
              "more"
            ],
            "equals": ""
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice retrieval statements array and empty more"
    ]
  }
} as unknown as CaseDefinition;
