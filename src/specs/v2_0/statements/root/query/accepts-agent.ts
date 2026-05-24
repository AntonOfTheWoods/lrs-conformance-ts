import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryAcceptsAgentCase = {
  "type": "case",
  "id": "v2.statements.query.accepts.agent",
  "title": "The Statements Resource can process GET requests with \"agent\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00181",
      "section": "Communication 2.1.3.s1.table1.row3",
      "title": "The Statements Resource can process GET requests with agent"
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
        "agent": "{\"objectType\":\"Agent\",\"mbox\":\"mailto:query-accepts-agent@example.test\"}"
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
