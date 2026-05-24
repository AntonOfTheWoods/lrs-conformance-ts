import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsInvalidAttachmentIriUsageTypeNoSchemeCase = {
  "type": "case",
  "id": "v2.statements.invalid-attachment-iri.usage-type-no-scheme",
  "title": "A Statement rejects an attachment usageType without an IRI scheme",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00011",
      "section": "Data 2.2.s4.b1.b8",
      "title": "Attachment usageType values must be IRIs"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "attachment",
    "iri"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js"
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
          "attachments": [
            {
              "usageType": "example.test/xapi/attachments/proof",
              "display": {
                "en-US": "Proof Attachment"
              },
              "description": {
                "en-US": "Proof Attachment Description"
              },
              "contentType": "text/plain; charset=ascii",
              "length": 27,
              "sha2": "495395e777cd98da653df9615d09c0fd6bb2f8d4788394cd53c56a3bfdcd848a",
              "fileUrl": "https://example.test/files/proof.txt"
            }
          ]
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
    ]
  }
} as unknown as CaseDefinition;
