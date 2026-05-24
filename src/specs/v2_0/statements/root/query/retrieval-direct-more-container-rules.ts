import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsRetrievalDirectMoreContainerRulesCase = {
  type: "case",
  id: "v2.statements.retrieval.direct.more-container-rules",
  title: 'A referenced "more" container follows the same StatementResult rules as the original GET',
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "XAPI-00111",
      section: "Data 2.5.s2.table1.row2",
      title: 'A referenced "more" container follows the same StatementResult rules as the original GET',
    },
  ],
  tags: ["v2.0.0", "statements", "retrieval", "pagination"],
  capabilityFlags: ["query", "retrieval"],
  legacyTrace: {
    suiteFile: "test/v2_0/E.Data2.5-RetrievalofStatements.js",
  },
  execution: {
    kind: "request-sequence",
    steps: [
      {
        method: "POST",
        endpoint: "statements",
        authMode: "basic",
        headers: {
          "X-Experience-API-Version": "2.0.0",
        },
        query: {},
        body: {
          kind: "json",
          value: {
            id: "33333333-3333-4333-8333-000000000981",
            actor: {
              objectType: "Agent",
              mbox: "mailto:learner@example.test",
              name: "Learner Example",
            },
            verb: {
              id: "https://example.test/xapi/verbs/retrieval-paged",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "Activity",
              id: "https://example.test/xapi/activities/first-proof-slice",
            },
            timestamp: "2026-05-23T12:16:21.000Z",
          },
          sourceFixture: {
            version: "2.0.0",
            domain: "statements",
            name: "default",
          },
        },
      },
      {
        method: "POST",
        endpoint: "statements",
        authMode: "basic",
        headers: {
          "X-Experience-API-Version": "2.0.0",
        },
        query: {},
        body: {
          kind: "json",
          value: {
            id: "33333333-3333-4333-8333-000000000982",
            actor: {
              objectType: "Agent",
              mbox: "mailto:learner@example.test",
              name: "Learner Example",
            },
            verb: {
              id: "https://example.test/xapi/verbs/retrieval-paged",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "Activity",
              id: "https://example.test/xapi/activities/first-proof-slice",
            },
            timestamp: "2026-05-23T12:16:22.000Z",
          },
          sourceFixture: {
            version: "2.0.0",
            domain: "statements",
            name: "default",
          },
        },
      },
      {
        method: "GET",
        endpoint: "statements",
        authMode: "basic",
        headers: {
          "X-Experience-API-Version": "2.0.0",
        },
        query: {
          verb: "https://example.test/xapi/verbs/retrieval-paged",
          limit: "1",
        },
      },
      {
        method: "GET",
        endpoint: "statements",
        authMode: "basic",
        headers: {
          "X-Experience-API-Version": "2.0.0",
        },
        query: {
          verb: "https://example.test/xapi/verbs/retrieval-paged",
          limit: "1",
          offset: "1",
        },
      },
    ],
  },
  assertion: {
    kind: "request-sequence",
    steps: [
      {
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [
          {
            path: [],
            equals: ["33333333-3333-4333-8333-000000000981"],
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
      {
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [
          {
            path: [],
            equals: ["33333333-3333-4333-8333-000000000982"],
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
      {
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [
          {
            path: ["more"],
            equals: "",
          },
        ],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
      {
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
    ],
    notes: [
      "proof-slice retrieval direct more container rules",
      "legacy note: a referenced more page follows the same StatementResult response rules as the originating request",
      "legacy note: XAPI-00111 upstream comment - A \"more\" property's referenced container object follows the same rules as the original GET request, originating with a single \"statements\" property and a single \"more\" property.",
    ],
  },
} as unknown as CaseDefinition;
