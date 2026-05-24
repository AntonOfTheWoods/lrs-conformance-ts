import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsLanguageMapsLegacyRejectedAttachmentDescriptionCase = {
  "type": "case",
  "id": "v2.statements.language-maps.legacy-rejected.attachment-description",
  "title": "A Statement rejects an invalid language map in attachment.description",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00121",
      "section": "Data 4.2.s1",
      "title": "A Language Map follows RFC 5646"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "language-maps",
    "legacy",
    "rejection"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/languages.js"
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
              "usageType": "https://example.test/xapi/attachments/proof",
              "display": {
                "en-US": "Proof Attachment"
              },
              "description": {
                "en-US": "Proof Attachment Description",
                "something": "Descripcion del adjunto de prueba"
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
      "Statement Special Data Types",
      "legacy note: XAPI-00121 upstream comment - in languages.js",
    ]
  }
} as unknown as CaseDefinition;
