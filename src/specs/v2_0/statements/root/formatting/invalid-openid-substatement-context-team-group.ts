import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidOpenidSubstatementContextTeamGroupCase = {
  "type": "case",
  "id": "v2.statements.invalid-openid.substatement-context-team-group",
  "title": "A Statement rejects statement substatement context team \"group\" when openid is not a valid URI",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00040",
      "section": "Data 2.4.2.3.s3.table1.row3",
      "title": "openid values must be URIs"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "ifi",
    "openid"
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
              "team": {
                "objectType": "Group",
                "openid": "ab=c://should.fail.com",
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
      "legacy note: XAPI-00040 upstream comment - An \"openid\" property is a URI. An LRS rejects with 400 Bad Request if a statement uses the “openID” IFI and the URI is invalid.",
    ]
  }
} as unknown as CaseDefinition;
