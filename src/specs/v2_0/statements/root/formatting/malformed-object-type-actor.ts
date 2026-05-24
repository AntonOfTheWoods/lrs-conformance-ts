import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsMalformedObjectTypeActorCase = {
  "type": "case",
  "id": "v2.statements.malformed-object-type.actor",
  "title": "A Statement rejects an actor objectType value that does not exactly match Agent",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00014",
      "section": "Data 2.1",
      "title": "All Objects are well-created JSON Objects"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "object-type"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
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
            "objectType": "\"objectType\": \"Agent\"",
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
      "legacy note: XAPI-00014 upstream comment - All Objects are well-created JSON Objects (Nature of Binding)",
      "legacy note: XAPI-00014 upstream describe - All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
    ]
  }
} as unknown as CaseDefinition;
