import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsExtensionsLegacyInvalidKeyStatementActivityCase = {
  "type": "case",
  "id": "v2.statements.extensions.legacy-invalid-key.statement-activity",
  "title": "A Statement rejects a non-IRI extension key in object.definition.extensions",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00118",
      "section": "Data 4.1.s3.b1",
      "title": "An Extension \"key\" is an IRI"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "extensions",
    "legacy",
    "iri"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/extensions.js"
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
            "id": "https://example.test/xapi/activities/first-proof-slice",
            "definition": {
              "extensions": {
                "id": "valid"
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
      "Statement Special Data Types"
    ]
  }
} as unknown as CaseDefinition;
