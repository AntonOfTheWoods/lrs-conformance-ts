import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAccountNameMissingActorGroupCase = {
  "type": "case",
  "id": "v2.statements.account-name-missing.actor-group",
  "title": "A Statement rejects statement actor \"group\" when account.name is missing",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00043",
      "section": "Data 2.4.2.4.s2.table1.row2",
      "title": "Account objects require name"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "account"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/accountobjects.js"
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
              "homePage": "https://example.test/xapi/accounts/proof"
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
      "Statement Formatting"
    ]
  }
} as unknown as CaseDefinition;
