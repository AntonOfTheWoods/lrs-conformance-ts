import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidFormatStatementIdTooManyDigitsCase = {
  "type": "case",
  "id": "v2.statements.invalid-format.statement-id-too-many-digits",
  "title": "A Statement rejects a UUID with too many digits in the \"id\" field",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00007",
      "section": "Data 2.2.s4.b4",
      "title": "Statements reject invalid formatted values"
    },
    {
      "id": "XAPI-00027",
      "section": "Data 2.4.1",
      "title": "A Statement rejects an invalid UUID in the \"id\" property"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "invalid-format"
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
          "id": "111111111-1111-4111-8111-111111111111",
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
      "legacy note: XAPI-00007 upstream comment - in formatting.js",
      "legacy note: XAPI-00027 upstream comment - in uuids.js",
    ]
  }
} as unknown as CaseDefinition;
