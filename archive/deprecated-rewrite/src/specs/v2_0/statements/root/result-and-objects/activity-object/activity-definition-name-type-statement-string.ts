import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityDefinitionNameTypeStatementStringCase = {
  "type": "case",
  "id": "v2.statements.activity.definition-name-type.statement-string",
  "title": "A Statement rejects a statement Activity object when definition.name is a string",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00056",
      "section": "Data 2.4.4.1.s2.table1.row1",
      "title": "Activity definition name values are Language Maps"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "activity",
    "definition",
    "name",
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
            "id": "https://example.test/xapi/activities/statement-name-string",
            "definition": {
              "name": "not-a-language-map"
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
      "legacy note: XAPI-00056 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
