import type { CaseDefinition } from "../../../../../../domain/contracts";
export const v2StatementsActivityObjectTypeGeneratedSubstatementCase = {
  type: "case",
  id: "v2.statements.activity.object-type-generated.substatement",
  title: "The Statements resource generates objectType Activity for a substatement Activity object when it is omitted",
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "DATA-2.4.4.s2.activity-objecttype-generation",
      section: "Data 2.4.4.s2",
      title: "LRSs generate an Activity objectType for statement objects when it is omitted",
    },
  ],
  tags: ["v2.0.0", "statements", "activity", "object", "retrieval"],
  capabilityFlags: ["query", "retrieval", "activity"],
  legacyTrace: {
    suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.2.3-Object-Requirements.js",
  },
  execution: {
    kind: "submit-and-query",
    submit: {
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
          id: "33333333-3333-4333-8333-000000001101",
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
            objectType: "SubStatement",
            actor: {
              objectType: "Agent",
              mbox: "mailto:proof-nested-agent@example.test",
              name: "Proof Agent",
            },
            verb: {
              id: "https://example.test/xapi/verbs/experienced",
              display: {
                "en-US": "experienced",
              },
            },
            object: {
              id: "https://example.test/xapi/activities/substatement-generated-object-type",
            },
          },
          timestamp: "2026-05-23T12:00:00Z",
        },
        sourceFixture: {
          version: "2.0.0",
          domain: "statements",
          name: "default",
        },
      },
    },
    query: {
      method: "GET",
      endpoint: "statements",
      authMode: "basic",
      headers: {
        "X-Experience-API-Version": "2.0.0",
      },
      query: {
        statementId: "33333333-3333-4333-8333-000000001101",
      },
    },
    polling: {
      strategy: "consistent-through",
      maxAttempts: 5,
      intervalMs: 250,
    },
  },
  assertion: {
    kind: "submit-and-query",
    submitStatus: 200,
    queryStatus: 200,
    expectedHeaders: [
      {
        key: "X-Experience-API-Version",
        equals: "2.0.0",
      },
    ],
    expectedHeaderPatterns: [],
    queryJsonPathEquals: [],
    queryJsonPathEqualsCaptured: [],
    queryTextContains: [],
    notes: ["proof-slice statement activity objectType generation"],
  },
} as unknown as CaseDefinition;
