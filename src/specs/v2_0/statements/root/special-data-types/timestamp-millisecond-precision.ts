import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsSpecialDataTypesTimestampMillisecondPrecisionCase = {
  type: "case",
  id: "v2.statements.special-data-types.timestamp-millisecond-precision",
  title: "The Statements resource recalls timestamps with at least millisecond precision",
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "XAPI-00122",
      section: "Data 4.5.s1.b3",
      title: "Timestamps preserve precision to at least milliseconds when statements are recalled",
    },
  ],
  tags: ["v2.0.0", "statements", "special-data-types", "timestamp"],
  capabilityFlags: ["timestamp", "retrieval", "special-data-types"],
  legacyTrace: {
    suiteFile: "test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js",
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
            id: "33333333-3333-4333-8333-000000005200",
            actor: {
              objectType: "Agent",
              mbox: "mailto:learner@example.test",
              name: "Learner Example",
            },
            verb: {
              id: "https://example.test/xapi/verbs/completed",
              display: {
                "en-US": "completed",
              },
            },
            object: {
              objectType: "Activity",
              id: "https://example.test/xapi/activities/first-proof-slice",
            },
            timestamp: "2023-05-04T12:00:00.123456-05:00",
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
          statementId: "33333333-3333-4333-8333-000000005200",
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
        jsonPathEquals: [],
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
            path: ["timestamp"],
            equals: "2023-05-04T17:00:00.123Z",
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        expectedHeaderDateAfterStep: [],
      },
    ],
    notes: [
      "proof-slice special data types timestamp precision",
      "legacy note: timestamp recall remains ISO 8601 formatted",
      "legacy note: precision must be at least milliseconds",
      "legacy note: XAPI-00122 upstream comment - A Timestamp MUST preserve precision to at least milliseconds (3 decimal points beyond seconds). The LRS accepts a statement with a valid timestamp which has more than 3 decimal points beyond seconds and when recalled it returns at least 3 decimals points beyond seconds.",
      "legacy note: XAPI-00122 upstream describe - A Timestamp MUST preserve precision to at least milliseconds, 3 decimal points beyond seconds.",
    ],
  },
} as unknown as CaseDefinition;
