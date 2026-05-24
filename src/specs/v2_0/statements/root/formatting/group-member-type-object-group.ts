import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsGroupMemberTypeObjectGroupCase = {
  "type": "case",
  "id": "v2.statements.group.member-type.object-group",
  "title": "A Statement rejects statement object \"group\" when member is not an array of Agents",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00036",
      "section": "Data 2.4.2.2.s2.table2.row3",
      "title": "Group member values are arrays of Agents"
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
            "objectType": "Group",
            "name": "Proof Group",
            "member": {
              "objectType": "Agent",
              "mbox": "mailto:group-member-type@example.test",
              "name": "Proof Agent"
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
      "legacy note: XAPI-00036 upstream comment - The \"member\" property is an array of Objects following Agent requirements. An LRS rejects with 400 Bad Request any group object which has a member property with anything other than a valid array of Agents as a value",
    ]
  }
} as unknown as CaseDefinition;
