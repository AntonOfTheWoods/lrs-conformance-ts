import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityInteractionTypeRequiredStatementStepsCase = {
  "type": "case",
  "id": "v2.statements.activity.interaction-type-required.statement-steps",
  "title": "A Statement rejects a statement Activity object when steps is used without interactionType",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00064",
      "section": "Data 2.4.4.1.s8",
      "title": "Activity definitions require interactionType when correctResponsesPattern or interaction component arrays are used"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "interaction-type",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js"
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
            "objectType": "Activity",
            "id": "https://example.test/xapi/activities/statement-steps-without-interaction-type",
            "definition": {
              "steps": [
                {
                  "id": "step-a",
                  "description": {
                    "en-US": "Proof step"
                  }
                }
              ]
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
    "status": 400,
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
