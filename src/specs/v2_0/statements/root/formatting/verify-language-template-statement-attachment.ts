import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsVerifyLanguageTemplateStatementAttachmentCase = {
  "type": "case",
  "id": "v2.statements.verify.language-template.statement-attachment",
  "title": "A Statement accepts an attachment verify template with valid language maps",
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
    "languages",
    "acceptance"
  ],
  "capabilityFlags": [],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/Data2.2-FormattingRequirements.js",
    "configFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/verify.js"
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
    "status": 200,
    "expectedHeaders": [],
    "expectedHeaderPatterns": [],
    "jsonPathEquals": [],
    "jsonPathNotEquals": [],
    "textContains": [],
    "notes": [
      "Statement Formatting",
      "legacy note: XAPI-00014 upstream comment - All Objects are well-created JSON Objects (Nature of Binding)",
      "legacy note: XAPI-00014 upstream describe - All Objects are well-created JSON Objects (Nature of binding, Data 2.1, XAPI-00014) **Implicit**",
    ]
  }
} as unknown as CaseDefinition;
