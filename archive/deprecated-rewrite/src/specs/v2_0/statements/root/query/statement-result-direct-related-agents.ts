import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryStatementResultDirectRelatedAgentsCase = {
  "type": "case",
  "id": "v2.statements.query.statement-result.direct.related-agents",
  "title": "The Statements Resource returns a StatementResult for GET requests with \"related_agents\"",
  "specVersion": "2.0.0",
  "requirementRefs": [
    {
      "id": "XAPI-00154",
      "section": "Communication 2.1.3.s1",
      "title": "GET without statementId or voidedStatementId returns a StatementResult"
    }
  ],
  "tags": [
    "v2.0.0",
    "statements",
    "query",
    "statement-result"
  ],
  "capabilityFlags": [
    "query",
    "retrieval"
  ],
  "legacyTrace": {
    "suiteFile": "test/v2_0/4.1.6.1-Statement-Resource.js"
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
        "agent": "{\"objectType\":\"Agent\",\"mbox\":\"mailto:statement-result-related-agent@example.test\"}",
        "related_agents": "true"
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
      "proof-slice statement result direct trace",
      "legacy note: XAPI-00154 upstream comment - An LRS's Statement API upon processing a successful GET request with neither a \"statementId\" nor a \"voidedStatementId\" parameter, returns code 200 OK and a StatementResult Object.",
      "legacy note: XAPI-00154 upstream describe - An LRS\\'s Statement Resource upon processing a successful GET request with neither a \"statementId\" nor a \"voidedStatementId\" parameter, returns code 200 OK and a StatementResult Object.",
    ]
  }
} as unknown as CaseDefinition;
