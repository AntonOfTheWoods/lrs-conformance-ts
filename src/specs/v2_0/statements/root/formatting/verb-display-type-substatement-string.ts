import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsVerbDisplayTypeSubstatementStringCase = {
  "type": "case",
  "id": "v2.statements.verb.display-type.substatement-string",
  "title": "A Statement rejects a substatement verb when display is a string",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00045",
      "section": "Data 2.4.3.s3.table1.row2",
      "title": "Verb display values are language maps"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "verb",
    "display",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.2-Verb-Requirements.js",
    "configFile": "test/v2_0/configs/verbs.js"
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
              "id": "https://example.test/xapi/verbs/verb-display-type",
              "display": "completed"
            },
            "object": {
              "objectType": "Activity",
              "id": "https://example.test/xapi/activities/substatement"
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
      "legacy note: XAPI-00045 upstream comment - in verbs.js",
    ]
  }
} as unknown as CaseDefinition;
