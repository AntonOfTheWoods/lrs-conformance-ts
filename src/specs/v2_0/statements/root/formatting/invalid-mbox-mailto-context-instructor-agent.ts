import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidMboxMailtoContextInstructorAgentCase = {
  "type": "case",
  "id": "v2.statements.invalid-mbox-mailto.context-instructor-agent",
  "title": "A Statement rejects statement context instructor \"agent\" when mbox is not a valid mailto email address",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00038",
      "section": "Data 2.4.2.3.s3.table1.row1",
      "title": "mbox values must be mailto IRIs"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "mbox"
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
              "mbox": "mailto:should.fail.com",
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
    "status": 400,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Formatting",
      "legacy note: XAPI-00038 upstream comment - An \"mbox\" property has the form \"mailto:email address\" and is an IRI. An LRS rejects with 400 Bad Request if a statement that uses the “mbox” IFI is an invalid form.",
    ]
  }
} as unknown as CaseDefinition;
