import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsQueryVoidedTargetsRetainedUntilCase = {
  type: "case",
  id: "v2.statements.query.voided-targets-retained.until",
  title:
    'The Statements Resource returns statements targeting a voided statement when using a qualifying "until" filter',
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "XAPI-00162",
      section: "Communication 2.1.4.s1.b2",
      title:
        "Collection GETs return statements targeting a voided statement without returning the voided statement itself",
    },
  ],
  tags: ["v2.0.0", "statements", "query", "voiding", "retrieval"],
  capabilityFlags: ["query", "retrieval", "voiding"],
  legacyTrace: {
    suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
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
            id: "33333333-3333-4333-8333-000000001243",
            actor: {
              objectType: "Agent",
              mbox: "mailto:voided-target-1243@example.test",
              name: "Proof Agent",
            },
            verb: {
              id: "https://example.test/xapi/verbs/voided-target-1243",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "Activity",
              id: "https://example.test/xapi/activities/first-proof-slice",
            },
            timestamp: "2026-05-23T12:20:43.000Z",
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
            id: "33333333-3333-4333-8333-000000001244",
            actor: {
              objectType: "Agent",
              mbox: "mailto:voided-target-1243@example.test",
              name: "Proof Agent",
            },
            verb: {
              id: "http://adlnet.gov/expapi/verbs/voided",
              display: {
                "en-US": "voided",
              },
            },
            object: {
              objectType: "StatementRef",
              id: "33333333-3333-4333-8333-000000001243",
            },
            timestamp: "2026-05-23T12:20:44.000Z",
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
            id: "33333333-3333-4333-8333-000000001245",
            actor: {
              objectType: "Agent",
              mbox: "mailto:voided-target-1243@example.test",
              name: "Proof Agent",
            },
            verb: {
              id: "https://example.test/xapi/verbs/voided-target-ref-1243",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "StatementRef",
              id: "33333333-3333-4333-8333-000000001243",
            },
            timestamp: "2026-05-23T12:20:45.000Z",
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
          agent: '{"objectType":"Agent","mbox":"mailto:voided-target-1243@example.test"}',
          until: "2031-05-23T12:00:00.000Z",
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
            equals: ["33333333-3333-4333-8333-000000001243"],
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
            equals: ["33333333-3333-4333-8333-000000001244"],
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
            equals: ["33333333-3333-4333-8333-000000001245"],
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
            equals: 2,
          },
          {
            path: ["statements", "0", "id"],
            equals: "33333333-3333-4333-8333-000000001245",
          },
          {
            path: ["statements", "1", "id"],
            equals: "33333333-3333-4333-8333-000000001244",
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
    ],
    notes: [
      "proof-slice voided target retrieval until",
      "legacy note: query should return statements referencing the voided statement while excluding the voiding statement target itself",
      "legacy note: XAPI-00162 upstream comment - An LRS's Statement API processes a successful GET request using a parameter (such as stored time) which includes a voided statement and unvoided statements targeting the voided statement. The API must return 200 Ok and the statement result object, containing statements which target a voided statement, but not the voided statement itself.",
      "legacy note: XAPI-00162 upstream describe - An LRS\\'s Statement Resource, upon processing a successful GET request wishing to return a Voided Statement still returns Statements which target it",
    ],
  },
} as unknown as CaseDefinition;
