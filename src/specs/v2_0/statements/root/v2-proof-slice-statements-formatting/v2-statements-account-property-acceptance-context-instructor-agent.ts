import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsAccountPropertyAcceptanceContextInstructorAgentCase = {
  "type": "case",
  "id": "v2.statements.account-property-acceptance.context-instructor-agent",
  "title": "A Statement accepts statement context instructor \"agent\" when account is the sole IFI",
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
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/ifis.js"
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
            "objectType": "Activity",
            "id": "https://example.test/xapi/activities/first-proof-slice"
          },
          "timestamp": "2026-05-23T12:00:00Z",
          "context": {
            "instructor": {
              "objectType": "Agent",
              "account": {
                "homePage": "https://example.test/xapi/accounts/proof",
                "name": "proof-account"
              },
              "name": "Proof Agent"
            }
          }
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
