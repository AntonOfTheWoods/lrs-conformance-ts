import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQuerySinceCase = {
  type: "case",
  id: "v2.statements.query.since",
  title: "The Statements resource filters collection results to statements stored after the since value",
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "XAPI-00175",
      section: "Communication 2.1.3.s1.table1.row9",
      title: "GET with since returns statements stored after the provided timestamp",
    },
  ],
  tags: ["v2.0.0", "statements", "query", "since"],
  capabilityFlags: ["query", "retrieval"],
  legacyTrace: {
    suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
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
            id: "33333333-3333-4333-8333-000000000033",
            actor: {
              objectType: "Agent",
              mbox: "mailto:learner@example.test",
              name: "Learner Example",
            },
            verb: {
              id: "https://example.test/xapi/verbs/query-since",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "Activity",
              id: "https://example.test/xapi/activities/first-proof-slice",
            },
            timestamp: "2026-05-23T12:00:33.000Z",
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
            id: "33333333-3333-4333-8333-000000000034",
            actor: {
              objectType: "Agent",
              mbox: "mailto:learner@example.test",
              name: "Learner Example",
            },
            verb: {
              id: "https://example.test/xapi/verbs/query-since",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "Activity",
              id: "https://example.test/xapi/activities/first-proof-slice",
            },
            timestamp: "2026-05-23T12:00:34.000Z",
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
          verb: "https://example.test/xapi/verbs/query-since",
          since: "2026-05-23T12:00:33.000Z",
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
            equals: ["33333333-3333-4333-8333-000000000033"],
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
            equals: ["33333333-3333-4333-8333-000000000034"],
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
      {
        status: 200,
        expectedHeaders: [
          {
            key: "X-Experience-API-Version",
            equals: "2.0.0",
          },
        ],
        expectedHeaderPatterns: [],
        jsonPathEquals: [
          {
            path: ["statements", "length"],
            equals: 2,
          },
          {
            path: ["statements", "0", "id"],
            equals: "33333333-3333-4333-8333-000000000034",
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
    ],
    notes: [
      "proof-slice statement collection query",
      "legacy note: XAPI-00175 upstream comment - An LRS's Statement API can process a GET request with \"since\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object containing all statements which have a stored timestamp after the since parameter timestamp in the query.",
      "legacy note: XAPI-00175 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"since\" as a parameter",
    ],
  },
} as unknown as CaseDefinition;
