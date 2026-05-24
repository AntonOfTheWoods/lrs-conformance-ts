import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsObjectAgentGroupRequiresObjectTypeStatementGroupCase = {
  "type": "case",
  "id": "v2.statements.object-agent-group.requires-object-type.statement-group",
  "title": "A Statement rejects a statement Group object when objectType is omitted",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00065",
      "section": "Data 2.4.4.2.s1.b1",
      "title": "Agent and Group statement objects require objectType"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "object",
    "agent",
    "group",
    "object-type",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.3-Object-Requirements.js"
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
            "mbox": "mailto:proof-object-group-without-type@example.test",
            "name": "Proof Group",
            "member": [
              {
                "objectType": "Agent",
                "mbox": "mailto:proof-group-member@example.test",
                "name": "Proof Agent"
              }
            ]
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
      "Statement Activity And Object Typing",
      "legacy note: XAPI-00065 upstream comment - Statements that use an Agent or Group as an Object MUST specify an \"objectType\" property. The LRS rejects with 400 Bad Request if the “objectType” property is absent and the Object is an Agent Object or Group Object.",
      "legacy note: XAPI-00065 upstream describe - Statements that use an Agent or Group as an Object MUST specify an \"objectType\" property.",
    ]
  }
} as unknown as CaseDefinition;
