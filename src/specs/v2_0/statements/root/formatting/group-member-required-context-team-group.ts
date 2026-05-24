import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsGroupMemberRequiredContextTeamGroupCase = {
  "type": "case",
  "id": "v2.statements.group.member-required.context-team-group",
  "title": "A Statement rejects statement context team \"group\" when an anonymous group omits member",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00035",
      "section": "Data 2.4.2.2.s2.table1.row3",
      "title": "Anonymous Groups require a member property"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "group",
    "member",
    "validation"
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
            "objectType": "Activity",
            "id": "https://example.test/xapi/activities/first-proof-slice"
          },
          "timestamp": "2026-05-23T12:00:00Z",
          "context": {
            "team": {
              "objectType": "Group",
              "name": "Proof Group"
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
      "legacy note: XAPI-00035 upstream comment - A Group uses the \"member\" property. An LRS rejects with 400 Bad Request if the \"member\" property is present anywhere but in a group object (Actor or team).",
    ]
  }
} as unknown as CaseDefinition;
