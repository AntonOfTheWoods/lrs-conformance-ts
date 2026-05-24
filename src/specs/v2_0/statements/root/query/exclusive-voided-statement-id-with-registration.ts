import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryExclusiveVoidedStatementIdWithRegistrationCase = {
  "type": "case",
  "id": "v2.statements.query.exclusive.voided-statement-id.with-registration",
  "title": "The Statements resource rejects a GET request that combines voidedStatementId with registration",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00150",
      "section": "Communication 2.1.3.s2.b2",
      "title": "GET rejects voidedStatementId combined with collection query parameters"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "validation",
    "exclusive"
  ],
  "capabilityFlags": [
    "query",
    "validation"
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
        "voidedStatementId": "33333333-3333-4333-8333-000000000951",
        "registration": "33333333-3333-4333-8333-000000000900"
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
      "proof-slice statement query exclusivity",
      "legacy note: XAPI-00150 upstream comment - An LRS's Statement API rejects a GET request with both \"voidedStatementId\" and anything other than \"attachments\" or \"format\" as parameters with error code 400 Bad Request.",
      "legacy note: XAPI-00150 upstream describe - An LRS\\'s Statement Resource rejects with error code 400 a GET request with both \"voidedStatementId\" and anything other than \"attachments\" or \"format\" as parameters",
    ]
  }
} as unknown as CaseDefinition;
