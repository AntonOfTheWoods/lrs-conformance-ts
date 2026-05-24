import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsActorObjectTypeTypeAuthorityAgentNumericCase = {
  "type": "case",
  "id": "v2.statements.actor.object-type-type.authority-agent-numeric",
  "title": "A Statement rejects statement authority \"agent\" when objectType is numeric",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00032",
      "section": "Data 2.4.2.1.s2.table1.row1",
      "title": "Agent objectType values are strings when present"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "actor",
    "object-type",
    "validation"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "test/v2_0/configs/agents.js"
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
          "authority": {
            "objectType": 123,
            "mbox": "mailto:actor-object-type-numeric@example.test",
            "name": "Proof Agent"
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
      "legacy note: XAPI-00032 upstream comment - An \"objectType\" property is a String. If present, the LRS must validate and reject with 400 Bad Request if invalid",
    ]
  }
} as unknown as CaseDefinition;
