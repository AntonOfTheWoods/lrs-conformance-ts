import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsRelatedActivitiesCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.related-activities",
  "title": "The Statements Resource can process GET requests with \"related_activities\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00177",
      "section": "Communication 2.1.3.s1.table1.row7",
      "title": "The Statements Resource can process GET requests with related_activities"
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
        "activity": "https://example.test/xapi/activities/query-accepts-related-activity",
        "related_activities": "true"
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
      "proof-slice statement query acceptance direct trace"
    ]
  }
} as unknown as CaseDefinition;
