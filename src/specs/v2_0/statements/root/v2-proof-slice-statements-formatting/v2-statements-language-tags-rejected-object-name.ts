import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsLanguageTagsRejectedObjectNameCase = {
  "type": "case",
  "id": "v2.statements.language-tags.rejected.object-name",
  "title": "A Statement rejects an invalid RFC 5646 language key in object.definition.name",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00013",
      "section": "Data 2.2.s4.b2",
      "title": "Language map keys follow RFC 5646"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "language-tags",
    "rejection"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/formatting.js"
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
            "id": "https://example.test/xapi/activities/first-proof-slice",
            "definition": {
              "name": {
                "something": "Bad activity name"
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
    "status": 400,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Formatting"
    ]
  }
} as unknown as CaseDefinition;
