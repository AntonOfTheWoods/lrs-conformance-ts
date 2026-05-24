import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsRetrievalPaginationMoreContainerCase = {
  type: "case",
  id: "v2.statements.retrieval.pagination.more-container",
  title:
    "The Statements resource returns a usable more path for paginated StatementResult containers and preserves the container shape on follow-up pages",
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "XAPI-00108",
      section: "Data 2.5.s2.table1.row2",
      title: 'A non-empty "more" IRL refers to the next page of results',
    },
    {
      id: "XAPI-00111",
      section: "Data 2.5.s2.table1.row2",
      title: 'A "more" container follows the same StatementResult rules as the original GET',
    },
    {
      id: "XAPI-00113",
      section: "Data 2.5.s2.table1",
      title: 'Successful paginated GETs return both "statements" and "more"',
    },
    {
      id: "XAPI-00114",
      section: "Data 2.5.s2.table1.row1",
      title: "Paginated StatementResults create a container for each additional page",
    },
  ],
  tags: ["v2.0.0", "statements", "retrieval", "pagination"],
  capabilityFlags: ["transport", "query", "retrieval"],
  legacyTrace: {
    suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/E.Data2.5-RetrievalofStatements.js",
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
        jsonPathEquals: [
          {
            path: ["statements", "length"],
            equals: 1,
          },
          {
            path: ["statements", "0", "id"],
            equals: "33333333-3333-4333-8333-000000000982",
          },
        ],
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
        jsonPathEquals: [
          {
            path: ["statements", "length"],
            equals: 1,
          },
          {
            path: ["statements", "0", "id"],
            equals: "33333333-3333-4333-8333-000000000981",
          },
          {
            path: ["more"],
            equals: "",
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
    ],
    notes: [
      "proof-slice retrieval pagination containers",
      "legacy note: follow-up page retrieval should use the server-provided more reference",
      "legacy note: each additional page remains a StatementResult container with statements and more fields",
      "legacy note: XAPI-00108 upstream comment - If not empty, the \"more\" property's IRL refers to a specific container object corresponding to the next page of results from the original GET request. To test make a GET request which will return a known number of statements and confirm the LRS returns a “more” property which has an IRL with a container of the remaining statements and that the IRL is valid.",
      "legacy note: XAPI-00108 upstream describe - If not empty, the \"more\" property\\'s IRL refers to a specific container object corresponding to the next page of results from the orignal GET request",
      "legacy note: XAPI-00111 upstream comment - A \"more\" property's referenced container object follows the same rules as the original GET request, originating with a single \"statements\" property and a single \"more\" property.",
      "legacy note: XAPI-00113 upstream comment - An LRS's Statement API, upon processing a successful GET request, will return a single \"statements\" property and a single \"more\" property. A single \"more\" property must be present if there are additional results available.",
      "legacy note: XAPI-00113 upstream describe - An LRS\\'s Statement API, upon processing a successful GET request, will return a single \"statements\" property and a single \"more\" property.",
      "legacy note: XAPI-00114 upstream comment - A \"statements\" property result which is paginated will create a container for each additional page.",
    ],
  },
} as unknown as CaseDefinition;
