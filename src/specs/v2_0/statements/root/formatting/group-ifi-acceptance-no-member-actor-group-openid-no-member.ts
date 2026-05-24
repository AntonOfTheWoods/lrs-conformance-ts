import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsGroupIfiAcceptanceNoMemberActorGroupOpenidNoMemberCase = {
  "type": "case",
  "id": "v2.statements.group-ifi-acceptance-no-member.actor-group-openid-no-member",
  "title": "A Statement accepts statement actor \"group\" when openid is the sole IFI and no member is present",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00037",
      "section": "Data 2.4.2.2.s2.table2.row4",
      "title": "Identified Groups accept a sole IFI without members"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "acceptance",
    "group",
    "no-member"
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
            "objectType": "Group",
            "openid": "https://openid.example.test/proof-group",
            "name": "Proof Group"
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
      "Statement Formatting",
      "legacy note: XAPI-00037 upstream comment - An \"actor\" property with \"objectType\" as \"Group\" uses exactly one of the following Inverse Functional Identifier properties: \"mbox\", \"mbox_sha1sum\", \"openid\", \"account\" or a member property with at least one Agent. An LRS rejects with 400 Bad Request any group object with: - no IFI and no member property - more than one IFI - an invalid IFI value The remaining 6 suites take care of XAPI-00037",
    ]
  }
} as unknown as CaseDefinition;
