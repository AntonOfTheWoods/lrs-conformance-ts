import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAgentIfiAcceptanceActorAgentMboxSha1sumCase = {
  "type": "case",
  "id": "v2.statements.agent-ifi-acceptance.actor-agent-mbox-sha1sum",
  "title": "A Statement accepts statement actor \"agent\" when mbox_sha1sum is the sole IFI",
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
            "mbox_sha1sum": "495395e777cd98da653df9615d09c0fd6bb2f8d4",
            "name": "Proof Agent"
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
    "status": 200,
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
