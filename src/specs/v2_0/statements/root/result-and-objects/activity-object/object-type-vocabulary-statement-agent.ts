import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsObjectTypeVocabularyStatementAgentCase = {
  "type": "case",
  "id": "v2.statements.object-type-vocabulary.statement-agent",
  "title": "A Statement rejects a statement Agent object when objectType does not exactly match Agent",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00046",
      "section": "Data 2.4.4.s2",
      "title": "Object objectType values are Activity, Agent, Group, SubStatement, or StatementRef"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "object",
    "object-type",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/objects.js"
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
            "objectType": "agent",
            "mbox": "mailto:proof-object-type-agent@example.test",
            "name": "Proof Agent"
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
      "Statement Activity And Object Typing"
    ]
  }
} as unknown as CaseDefinition;
