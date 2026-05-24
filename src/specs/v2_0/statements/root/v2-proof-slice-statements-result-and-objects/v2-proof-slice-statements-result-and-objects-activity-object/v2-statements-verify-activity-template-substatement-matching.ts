import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsVerifyActivityTemplateSubstatementMatchingCase = {
  "type": "case",
  "id": "v2.statements.verify.activity-template.substatement-matching",
  "title": "A Statement accepts a substatement Activity object verify template using interactionType \"matching\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00014",
      "section": "Data 2.2",
      "title": "All Objects are well-created JSON Objects"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "verify-template",
    "activity",
    "acceptance"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
              "id": "https://example.test/xapi/activities/verify-substatement-matching",
              "definition": {
                "interactionType": "matching",
                "correctResponsesPattern": [
                  "source-a[.]target-a"
                ],
                "source": [
                  {
                    "id": "source-a",
                    "description": {
                      "en-US": "Source A"
                    }
                  },
                  {
                    "id": "source-b",
                    "description": {
                      "en-US": "Source B"
                    }
                  }
                ],
                "target": [
                  {
                    "id": "target-a",
                    "description": {
                      "en-US": "Target A"
                    }
                  },
                  {
                    "id": "target-b",
                    "description": {
                      "en-US": "Target B"
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
      "Statement Activity Objects"
    ]
  }
} as unknown as CaseDefinition;
