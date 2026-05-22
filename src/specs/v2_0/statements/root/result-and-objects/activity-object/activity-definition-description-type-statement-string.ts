import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityDefinitionDescriptionTypeStatementStringCase = {
  "type": "case",
  "id": "v2.statements.activity.definition-description-type.statement-string",
  "title": "A Statement rejects a statement Activity object when definition.description is a string",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00059",
      "section": "Data 2.4.4.1.s2.table1.row2",
      "title": "Activity definition description values are Language Maps"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "description",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js",
    "configFile": "test/v2_0/configs/activities.js"
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
            "id": "https://example.test/xapi/activities/statement-description-string",
            "definition": {
              "description": "not-a-language-map"
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
      "legacy note: XAPI-00059 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
