import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityInteractionComponentsDescriptionTypeStatementPerformanceStepsCase = {
  "type": "case",
  "id": "v2.statements.activity.interaction-components.description-type.statement-performance-steps",
  "title": "A Statement rejects a statement Activity object when performance \"steps\" uses a non-object description",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00055",
      "section": "Data 2.4.4.1.s8.table1.row3",
      "title": "Activity definition steps values are arrays of Interaction Components"
    },
    {
      "id": "XAPI-00062",
      "section": "Data 2.4.4.1.s15.table1.row2",
      "title": "Interaction Component descriptions are Language Maps"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "interaction-components",
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
            "id": "https://example.test/xapi/activities/statement-performance-steps-description-type",
            "definition": {
              "interactionType": "performance",
              "correctResponsesPattern": [
                "step-a[.]complete"
              ],
              "steps": [
                {
                  "id": "performance-steps-description-type",
                  "description": "not-a-language-map"
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
      "Statement Activity Objects",
      "legacy note: XAPI-00055 upstream comment - in activities.js",
      "legacy note: XAPI-00062 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
