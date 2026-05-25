import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidIriSchemesObjectIdNoSchemeCase = {
  "type": "case",
  "id": "v2.statements.invalid-iri-schemes.object-id-no-scheme",
  "title": "A Statement rejects an object id without an IRI scheme",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00011",
      "section": "Data 2.2.s4.b1.b8",
      "title": "Statements reject IRIs without schemes"
    },
    {
      "id": "XAPI-00061",
      "section": "Data 2.4.4.1.s2.table1.row4",
      "title": "An Activity Definition \"moreInfo\" property is an IRI"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "iri"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "test/v2_0/Data2.2-FormattingRequirements.js",
    "configFile": "test/v2_0/configs/formatting.js"
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
            "id": "example.test/xapi/activities/first-proof-slice"
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
      "legacy note: XAPI-00011 upstream comment - An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme.",
      "legacy note: XAPI-00011 upstream describe - An LRS rejects with error code 400 Bad Request a Statement containing IRL or IRI values without a scheme.",
      "legacy note: XAPI-00061 upstream comment - in activities.js",
    ]
  }
} as unknown as CaseDefinition;
