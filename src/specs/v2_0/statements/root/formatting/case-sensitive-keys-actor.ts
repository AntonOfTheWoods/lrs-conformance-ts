import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsCaseSensitiveKeysActorCase = {
  "type": "case",
  "id": "v2.statements.case-sensitive-keys.actor",
  "title": "A Statement rejects a case-mismatched top-level key for \"actor\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00008",
      "section": "Data 2.2.s4.b1.b5",
      "title": "Statement keys are case-sensitive"
    },
    {
      "id": "XAPI-00010",
      "section": "Data 2.2.s4.b1.b5",
      "title": "Statements reject unsupported keys"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "keys"
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
          "Actor": {
            "objectType": "Agent",
            "mbox": "mailto:case-sensitive-actor@example.test",
            "name": "Proof Agent"
          }
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
      "legacy note: XAPI-00008 upstream comment - in formatting.js",
      "legacy note: XAPI-00010 upstream comment - in formatting.js",
    ]
  }
} as unknown as CaseDefinition;
