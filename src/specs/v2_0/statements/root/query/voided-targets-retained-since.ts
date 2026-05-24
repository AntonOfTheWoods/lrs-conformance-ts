import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryVoidedTargetsRetainedSinceCase = {
  "type": "case",
  "id": "v2.statements.query.voided-targets-retained.since",
  "title": "The Statements Resource returns statements targeting a voided statement when using a qualifying \"since\" filter",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00162",
      "section": "Communication 2.1.4.s1.b2",
      "title": "Collection GETs return statements targeting a voided statement without returning the voided statement itself"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "voiding",
    "retrieval"
  ],
  "capabilityFlags": [
    "query",
    "retrieval",
    "voiding"
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
            "id": "33333333-3333-4333-8333-000000001240",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:voided-target-1240@example.test",
              "name": "Proof Agent"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/voided-target-1240",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/first-proof-slice"
            },
            "timestamp": "2026-05-23T12:20:40.000Z"
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
            "id": "33333333-3333-4333-8333-000000001241",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:voided-target-1240@example.test",
              "name": "Proof Agent"
            },
            "verb": {
              "id": "http://adlnet.gov/expapi/verbs/voided",
              "display": {
                "en-US": "voided"
              }
            },
            "object": {
              "objectType": "StatementRef",
              "id": "33333333-3333-4333-8333-000000001240"
            },
            "timestamp": "2026-05-23T12:20:41.000Z"
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
            "id": "33333333-3333-4333-8333-000000001242",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:voided-target-1240@example.test",
              "name": "Proof Agent"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/voided-target-ref-1240",
              "display": {
                "en-US": "completed"
              }
            },
            "object": {
              "objectType": "StatementRef",
              "id": "33333333-3333-4333-8333-000000001240"
            },
            "timestamp": "2026-05-23T12:20:42.000Z"
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
          "agent": "{\"objectType\":\"Agent\",\"mbox\":\"mailto:voided-target-1240@example.test\"}",
          "since": "2026-05-23T12:20:40.000Z"
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
              "33333333-3333-4333-8333-000000001240"
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
              "33333333-3333-4333-8333-000000001241"
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
              "33333333-3333-4333-8333-000000001242"
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
            "equals": "33333333-3333-4333-8333-000000001242"
          },
          {
            "path": [
              "statements",
              "1",
              "id"
            ],
            "equals": "33333333-3333-4333-8333-000000001241"
          }
        ],
        "jsonPathNotEquals": [],
        "textContains": [],
        "expectedHeaderDateAfterStep": []
      }
    ],
    "notes": [
      "proof-slice voided target retrieval since"
    ]
  }
} as unknown as CaseDefinition;
