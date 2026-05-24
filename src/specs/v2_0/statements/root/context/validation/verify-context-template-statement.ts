import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsVerifyContextTemplateStatementCase = {
  "type": "case",
  "id": "v2.statements.verify.context-template.statement",
  "title": "A Statement accepts a statement context default verify template",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00014",
      "section": "Data 2.2",
      "title": "All Objects are well-created JSON Objects"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "verify-template",
    "context",
    "acceptance"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/Data2.2-FormattingRequirements.js",
    "configFile": "test/v2_0/configs/verify.js"
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
            "registration": "33333333-3333-4333-8333-000000006400",
            "instructor": {
              "objectType": "Agent",
              "mbox": "mailto:verify-context-instructor-statement@example.test",
              "name": "Proof Agent"
            },
            "team": {
              "objectType": "Group",
              "mbox": "mailto:verify-context-team-statement@example.test",
              "name": "Proof Group",
              "member": [
                {
                  "objectType": "Agent",
                  "mbox": "mailto:proof-group-member@example.test",
                  "name": "Proof Agent"
                }
              ]
            },
            "contextActivities": {
              "category": {
                "objectType": "Activity",
                "id": "https://example.test/xapi/activities/verify-context-statement"
              }
            },
            "language": "en-US"
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
      "Statement Context",
      "legacy note: XAPI-00014 upstream comment - All Objects are well-created JSON Objects (Nature of Binding)",
      "legacy note: XAPI-00014 upstream describe - All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
    ]
  }
} as unknown as CaseDefinition;
