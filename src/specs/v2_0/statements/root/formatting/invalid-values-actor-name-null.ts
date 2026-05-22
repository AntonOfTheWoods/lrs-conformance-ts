import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidValuesActorNameNullCase = {
  "type": "case",
  "id": "v2.statements.invalid-values.actor-name-null",
  "title": "A Statement rejects \"null\" for actor.name",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00001",
      "section": "Data 2.2.s4.b1.b1",
      "title": "Statements reject null values outside extensions"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "null-values"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/Data2.2-FormattingRequirements.js",
    "configFile": "test/v2_0/configs/formatting.js"
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
            "name": null
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
      "Statement Formatting",
      "legacy note: XAPI-00001 upstream comment - in formatting.js",
    ]
  }
} as unknown as CaseDefinition;
