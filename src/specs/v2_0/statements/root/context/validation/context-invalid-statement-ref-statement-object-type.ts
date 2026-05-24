import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsContextInvalidStatementRefStatementObjectTypeCase = {
  "type": "case",
  "id": "v2.statements.context.invalid-statement-ref.statement-object-type",
  "title": "A Statement rejects a statement context statement when objectType does not exactly match StatementRef",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00092",
      "section": "Data 2.4.6",
      "title": "Context statement values are StatementRefs"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "context",
    "statement-ref",
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
            "statement": {
              "objectType": "statementref",
              "id": "33333333-3333-4333-8333-000000000933"
            }
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
      "legacy note: XAPI-00092 upstream comment - in contexts.js",
    ]
  }
} as unknown as CaseDefinition;
