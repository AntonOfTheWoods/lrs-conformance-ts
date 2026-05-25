import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidMboxSha1sumContextInstructorGroupCase = {
  "type": "case",
  "id": "v2.statements.invalid-mbox-sha1sum.context-instructor-group",
  "title": "A Statement rejects statement context instructor \"group\" when mbox_sha1sum is not a string",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00039",
      "section": "Data 2.4.2.3.s3.table1.row2",
      "title": "mbox_sha1sum values must be strings"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "mbox-sha1sum"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "test/v2_0/configs/ifis.js"
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
              "objectType": "Group",
              "mbox_sha1sum": {
                "key": "value"
              },
              "name": "Proof Group",
              "member": [
                {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-group-member@example.test",
                  "name": "Proof Agent"
                }
              ]
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
      "legacy note: XAPI-00039 upstream comment - An \"mbox_sha1sum\" property is a String An LRS rejects with 400 Bad Request if a statement uses the “mbox_sha1sum” IFI and it is not a valid string.",
    ]
  }
} as unknown as CaseDefinition;
