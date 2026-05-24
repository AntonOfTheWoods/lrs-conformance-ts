import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsActorObjectTypeVocabularyAuthorityAgentGroupCase = {
  "type": "case",
  "id": "v2.statements.actor.object-type-vocabulary.authority-agent-group",
  "title": "A Statement rejects statement authority \"agent\" when objectType is not \"Group\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00031",
      "section": "Data 2.4.2.1, Data 2.4.2.2",
      "title": "Actor objectType values are \"Agent\" or \"Group\""
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
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.1-Actor-Requirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/actors.js"
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
            "objectType": "group",
            "mbox": "mailto:actor-object-type-group@example.test",
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
      "legacy note: XAPI-00031 upstream comment - An \"actor\" property's \"objectType\" property is either \"Agent\" or \"Group\" An LRS rejects with 400 Bad Request an actor with an “objectType” which is not “Agent” or “Group”",
    ]
  }
} as unknown as CaseDefinition;
