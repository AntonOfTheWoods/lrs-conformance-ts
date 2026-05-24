import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsGroupIfiExclusivityObjectGroupMboxWithOpenidCase = {
  "type": "case",
  "id": "v2.statements.group-ifi-exclusivity.object-group-mbox-with-openid",
  "title": "A Statement rejects statement object \"group\" when mbox is used with openid",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00037",
      "section": "Data 2.4.2.2.s5.b1",
      "title": "Identified Groups must use only one IFI"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "exclusivity",
    "group"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/groups.js"
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
            "objectType": "Group",
            "mbox": "mailto:proof-group@example.test",
            "name": "Proof Group",
            "member": [
              {
                "objectType": "Agent",
                "mbox": "mailto:proof-group-member@example.test",
                "name": "Proof Agent"
              }
            ],
            "openid": "https://openid.example.test/proof-group"
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
