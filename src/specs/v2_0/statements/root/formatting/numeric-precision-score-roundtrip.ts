import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsNumericPrecisionScoreRoundtripCase = {
  "type": "case",
  "id": "v2.statements.numeric-precision.score-roundtrip",
  "title": "The Statements resource preserves IEEE 754 score precision across submit and query",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00002",
      "section": "Data 2.2.s4.b3",
      "title": "Statements preserve IEEE 754 score precision"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "precision"
  ],
  "capabilityFlags": [
    "query",
    "retrieval",
    "precision"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
  },
  "execution": {
    "kind": "submit-and-query",
    "submit": {
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
          "id": "33333333-3333-4333-8333-000000000200",
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
          "timestamp": "2026-05-23T12:00:00Z",
          "result": {
            "score": {
              "min": 0.12123434,
              "raw": 12.125,
              "max": 45.45,
              "scaled": 0.12123434
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
    "query": {
      "method": "GET",
      "endpoint": "statements",
      "authMode": "basic",
      "headers": {
        "X-Experience-API-Version": "2.0.0"
      },
      "query": {
        "statementId": "33333333-3333-4333-8333-000000000200"
      }
    },
    "polling": {
      "strategy": "consistent-through",
      "maxAttempts": 5,
      "intervalMs": 250
    }
  },
  "assertion": {
    "kind": "submit-and-query",
    "submitStatus": 200,
    "queryStatus": 200,
    "expectedHeaders": [
      {
        "key": "X-Experience-API-Version",
        "equals": "2.0.0"
      }
    ],
    "expectedHeaderPatterns": [],
    "queryJsonPathEquals": [
      {
        "path": [
          "result",
          "score",
          "min"
        ],
        "equals": 0.12123434
      },
      {
        "path": [
          "result",
          "score",
          "raw"
        ],
        "equals": 12.125
      },
      {
        "path": [
          "result",
          "score",
          "max"
        ],
        "equals": 45.45
      },
      {
        "path": [
          "result",
          "score",
          "scaled"
        ],
        "equals": 0.12123434
      }
    ],
    "queryJsonPathEqualsCaptured": [],
    "queryTextContains": [],
    "notes": [
      "proof-slice numeric precision"
    ]
  }
} as unknown as CaseDefinition;
