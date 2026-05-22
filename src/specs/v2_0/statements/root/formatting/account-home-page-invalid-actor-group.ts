import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAccountHomePageInvalidActorGroupCase = {
  "type": "case",
  "id": "v2.statements.account-home-page-invalid.actor-group",
  "title": "A Statement rejects statement actor \"group\" when account.homePage is not a valid URI",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00042",
      "section": "Data 2.4.2.4.s2.table1.row1",
      "title": "Account objects require valid homePage IRIs"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "account"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "test/v2_0/configs/accountobjects.js"
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
            "account": {
              "homePage": "ab=c://should.fail.com",
              "name": "proof-account"
            },
            "name": "Proof Group",
            "member": [
              {
                "objectType": "Agent",
                "mbox": "mailto:proof-group-member@example.test",
                "name": "Proof Agent"
              }
            ]
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
    "status": 400,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Formatting",
      "legacy note: XAPI-00042 upstream comment - An Account Object's homePage\" property is an IRL. An LRS rejects with 400 Bad Request if a statement uses the “account” IFI and the “homePage” property is absent or has an invalid IRL.",
    ]
  }
} as unknown as CaseDefinition;
