import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAgentIfiExclusivityObjectAgentOpenidWithAccountCase = {
  "type": "case",
  "id": "v2.statements.agent-ifi-exclusivity.object-agent-openid-with-account",
  "title": "A Statement rejects statement object \"agent\" when openid is used with account",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00034",
      "section": "Data 2.4.2.1.s2.b2",
      "title": "Agents must use only one IFI"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "exclusivity",
    "agent"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "test/v2_0/configs/agents.js"
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
            "openid": "https://openid.example.test/proof-agent",
            "name": "Proof Agent",
            "account": {
              "homePage": "https://example.test/xapi/accounts/proof",
              "name": "proof-account"
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
      "Statement Formatting",
      "legacy note: XAPI-00034 upstream comment - An \"actor\" property with \"objectType\" as \"Agent\" uses exactly one of the following Inverse Functional Identifier properties: \"mbox\", \"mbox_sha1sum\", \"openid\", \"account\". An LRS rejects with 400 Bad Request any agent object: - Where the IFI property is absent - Where the IFI value is invalid - With more than one IFI",
    ]
  }
} as unknown as CaseDefinition;
