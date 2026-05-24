import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsContextInvalidRevisionTypeStatementNumberCase = {
  "type": "case",
  "id": "v2.statements.context.invalid-revision-type.statement-number",
  "title": "A Statement rejects a statement context revision when it is a number",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00084",
      "section": "Data 2.4.6",
      "title": "Context revision values are strings and only apply to Activity objects"
    },
    {
      "id": "XAPI-00089",
      "section": "Data 2.4.6.s3.table1.row5",
      "title": "A \"revision\" property is a String"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "context",
    "revision",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.5-Context-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/contexts.js"
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
          "context": {
            "revision": 12
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
      "Statement Context",
      "legacy note: XAPI-00084 upstream comment - in contexts.js",
      "legacy note: XAPI-00089 upstream comment - in contexts.js",
    ]
  }
} as unknown as CaseDefinition;
