import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityInteractionTypeAcceptanceSubstatementSequencingCase = {
  "type": "case",
  "id": "v2.statements.activity.interaction-type.acceptance.substatement-sequencing",
  "title": "A Statement accepts a substatement Activity object when definition.interactionType uses \"sequencing\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00049",
      "section": "Data 2.4.4.1.s8.table1.row1",
      "title": "Activity definition interactionType values are one of true-false, choice, fill-in, long-fill-in, matching, performance, sequencing, likert, numeric, or other"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "interaction-type"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/activities.js"
  },
  "execution": {
    "kind": "single-request",
    "request": {
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
          "id": "11111111-1111-4111-8111-111111111111",
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
              "id": "https://example.test/xapi/activities/substatement-interaction-type-sequencing",
              "definition": {
                "interactionType": "sequencing",
                "correctResponsesPattern": [
                  "sequence-a[,]sequence-b"
                ],
                "choices": [
                  {
                    "id": "sequence-a",
                    "description": {
                      "en-US": "Sequence A"
                    }
                  },
                  {
                    "id": "sequence-b",
                    "description": {
                      "en-US": "Sequence B"
                    }
                  }
                ]
              }
            }
          },
          "timestamp": "2026-05-23T12:00:00Z"
        },
        "sourceFixture": {
          "version": "2.0.0",
          "domain": "statements",
          "name": "default"
        }
      }
    }
  },
  "assertion": {
    "kind": "single-request",
    "status": 200,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Activity Objects",
      "legacy note: XAPI-00049 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
