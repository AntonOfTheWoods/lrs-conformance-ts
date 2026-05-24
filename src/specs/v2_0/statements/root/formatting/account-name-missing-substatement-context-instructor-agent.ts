import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAccountNameMissingSubstatementContextInstructorAgentCase = {
  "type": "case",
  "id": "v2.statements.account-name-missing.substatement-context-instructor-agent",
  "title": "A Statement rejects statement substatement context instructor \"agent\" when account.name is missing",
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
              "instructor": {
                "objectType": "Agent",
                "account": {
                  "homePage": "https://example.test/xapi/accounts/proof"
                },
                "name": "Proof Agent"
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
      "legacy note: XAPI-00043 upstream comment - An Account Object \"name\" property is a String. An LRS rejects with 400 Bad Request if a statement uses the “account” IFI and the “name” property is absent or has an invalid string.",
    ]
  }
} as unknown as CaseDefinition;
