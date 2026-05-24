import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithAccountCase = {
  "type": "case",
  "id": "v2.statements.group-ifi-exclusivity.substatement-context-team-group-mbox-with-account",
  "title": "A Statement rejects statement substatement context team \"group\" when mbox is used with account",
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
    "suiteFile": "test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "test/v2_0/configs/groups.js"
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
            "objectType": "SubStatement",
            "actor": {
              "objectType": "Agent",
              "mbox": "mailto:proof-nested-agent@example.test",
              "name": "Proof Agent"
            },
            "verb": {
              "id": "https://example.test/xapi/verbs/experienced",
              "display": {
                "en-US": "experienced"
              }
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/substatement"
            },
            "context": {
              "team": {
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
                "account": {
                  "homePage": "https://example.test/xapi/accounts/proof",
                  "name": "proof-account"
                }
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
      "Statement Formatting",
      "legacy note: XAPI-00037 upstream comment - An \"actor\" property with \"objectType\" as \"Group\" uses exactly one of the following Inverse Functional Identifier properties: \"mbox\", \"mbox_sha1sum\", \"openid\", \"account\" or a member property with at least one Agent. An LRS rejects with 400 Bad Request any group object with: - no IFI and no member property - more than one IFI - an invalid IFI value The remaining 6 suites take care of XAPI-00037",
    ]
  }
} as unknown as CaseDefinition;
