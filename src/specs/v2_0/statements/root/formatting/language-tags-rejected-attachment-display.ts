import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsLanguageTagsRejectedAttachmentDisplayCase = {
  "type": "case",
  "id": "v2.statements.language-tags.rejected.attachment-display",
  "title": "A Statement rejects an invalid RFC 5646 language key in attachment.display",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00013",
      "section": "Data 2.2.s4.b2",
      "title": "Language map keys follow RFC 5646"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "formatting",
    "language-tags",
    "rejection"
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
            "id": "https://example.test/xapi/activities/first-proof-slice"
          },
          "timestamp": "2026-05-23T12:00:00Z",
          "attachments": [
            {
              "usageType": "https://example.test/xapi/attachments/proof",
              "display": {
                "en-US": "Proof Attachment",
                "something": "Adjunto de prueba"
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
      "legacy note: XAPI-00013 upstream comment - in formatting.js",
    ]
  }
} as unknown as CaseDefinition;
