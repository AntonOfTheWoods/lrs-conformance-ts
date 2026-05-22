import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAccountPropertyAcceptanceObjectAgentCase = {
  "type": "case",
  "id": "v2.statements.account-property-acceptance.object-agent",
  "title": "A Statement accepts statement object \"agent\" when account is the sole IFI",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00041",
      "section": "Data 2.4.2.4",
      "title": "An Account Object is the \"account\" property of a Group or Agent"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "account",
    "acceptance"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "test/v2_0/configs/ifis.js"
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
            "objectType": "Agent",
            "account": {
              "homePage": "https://example.test/xapi/accounts/proof",
              "name": "proof-account"
            },
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
    "status": 200,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Formatting",
      "legacy note: XAPI-00041 upstream comment - An “account” property is an object. An LRS rejects with 400 Bad Request if a statement uses an invalid Account Object. A valid account is defined by the requirements listed in XAPI-I-63 and XAPI-I-66 Covers next suite",
    ]
  }
} as unknown as CaseDefinition;
