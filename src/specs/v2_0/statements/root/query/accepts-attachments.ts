import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsAttachmentsCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.attachments",
  "title": "The Statements Resource can process GET requests with \"attachments\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00167",
      "section": "Communication 2.1.3.s1.table1.row13",
      "title": "The Statements Resource can process GET requests with attachments"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "acceptance"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js"
  },
  "execution": {
    "kind": "single-request",
    "request": {
      "method": "GET",
      "endpoint": "statements",
      "authMode": "basic",
      "headers": {
        "X-Experience-API-Version": "2.0.0"
      },
      "query": {
        "attachments": "true"
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
    "textContains": [
      "\"statements\""
    ],
    "notes": [
      "proof-slice statement query acceptance direct trace",
      "legacy note: XAPI-00167 upstream comment - An LRS's Statement API can process a GET request with \"attachments\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object and use the multipart response format and include all attachments if the attachment parameter is set to true",
      "legacy note: XAPI-00167 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"attachments\" as a parameter",
    ]
  }
} as unknown as CaseDefinition;
