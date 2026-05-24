import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAgentIfiAcceptanceObjectAgentMboxCase = {
  "type": "case",
  "id": "v2.statements.agent-ifi-acceptance.object-agent-mbox",
  "title": "A Statement accepts statement object \"agent\" when mbox is the sole IFI",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00034",
      "section": "Data 2.4.2.1.s2.b1",
      "title": "Agents accept exactly one IFI"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "acceptance",
    "agent"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/agents.js"
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
            "mbox": "mailto:proof-agent@example.test",
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
      "legacy note: XAPI-00034 upstream comment - An \"actor\" property with \"objectType\" as \"Agent\" uses exactly one of the following Inverse Functional Identifier properties: \"mbox\", \"mbox_sha1sum\", \"openid\", \"account\". An LRS rejects with 400 Bad Request any agent object: - Where the IFI property is absent - Where the IFI value is invalid - With more than one IFI",
    ]
  }
} as unknown as CaseDefinition;
