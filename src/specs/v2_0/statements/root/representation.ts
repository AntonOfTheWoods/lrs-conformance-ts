import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsRepresentationSuite = {
  type: "suite",
  id: "v2.proof-slice.statements.representation",
  title: "Statement Representation",
  specVersion: "2.0.0",
  tags: ["representation"],
  children: [
    {
      type: "case",
      id: "v2.statements.representation.format-absent-defaults-exact",
      title: "The Statements Resource returns exact statement data when format is absent",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00168",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "The Statements Resource defaults GET responses to exact when format is absent",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001215",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:format-absent-default@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/format-absent-default",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/format-absent-default",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:15.000Z",
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
              statementId: "33333333-3333-4333-8333-000000001215",
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
                path: ["actor"],
                equals: {
                  objectType: "Agent",
                  mbox: "mailto:format-absent-default@example.test",
                  name: "Format Proof Agent",
                },
              },
              {
                path: ["verb", "display"],
                equals: {
                  "en-US": "format-proof-us",
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["object", "definition", "name"],
                equals: {
                  "en-US": "Format Proof US",
                  "en-GB": "Format Proof GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement format absent defaults exact",
          "legacy note: XAPI-00168 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format or in “exact” if the “format” parameter is absent.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.accept-language-ignored-without-canonical",
      title: "The Statements Resource does not apply Accept-Language when format is absent",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00172",
          section: "Communication 2.1.3.s1.table1.row11",
          title: "Accept-Language only affects statement retrieval when format is canonical",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format", "accept-language"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001216",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:format-no-canonical@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/format-no-canonical-default",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/format-no-canonical-default",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:16.000Z",
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
              "Accept-Language": "en-GB",
            },
            query: {
              statementId: "33333333-3333-4333-8333-000000001216",
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
                path: ["verb", "display"],
                equals: {
                  "en-US": "format-proof-us",
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["object", "definition", "name"],
                equals: {
                  "en-US": "Format Proof US",
                  "en-GB": "Format Proof GB",
                },
              },
              {
                path: ["object", "definition", "description"],
                equals: {
                  "en-US": "Format description US",
                  "en-GB": "Format description GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement accept-language ignored without canonical",
          "legacy note: XAPI-00172 upstream comment - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
          "legacy note: XAPI-00172 upstream describe - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.format-exact",
      title: "The Statements resource returns exact statement representations when format is exact",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00170",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "GET with format exact returns statement content exactly as submitted",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000000226",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:format-exact@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/format-proof",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/format-proof",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:03:46.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000226",
              format: "exact",
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
                path: ["actor"],
                equals: {
                  objectType: "Agent",
                  mbox: "mailto:format-exact@example.test",
                  name: "Format Proof Agent",
                },
              },
              {
                path: ["verb", "display"],
                equals: {
                  "en-US": "format-proof-us",
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["object", "definition", "name"],
                equals: {
                  "en-US": "Format Proof US",
                  "en-GB": "Format Proof GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement exact format",
          "legacy note: XAPI-00170 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format. If “exact”, return Agent, Activity, Verb and Group Objects populated exactly as they were when the Statement was received.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.format-canonical-accept-language",
      title: "The Statements resource applies Accept-Language when format is canonical",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00169",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "GET with format canonical returns canonicalized statement values",
        },
        {
          id: "XAPI-00172",
          section: "Communication 2.1.3.s1.table1.row11",
          title: "GET with format canonical applies Accept-Language",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format", "canonical"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000000227",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:format-canonical@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/format-proof",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/format-proof",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:03:47.000Z",
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
              "Accept-Language": "en-GB",
            },
            query: {
              statementId: "33333333-3333-4333-8333-000000000227",
              format: "canonical",
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
                path: ["verb", "display"],
                equals: {
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["object", "definition", "name"],
                equals: {
                  "en-GB": "Format Proof GB",
                },
              },
              {
                path: ["object", "definition", "description"],
                equals: {
                  "en-GB": "Format description GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement canonical format",
          "legacy note: XAPI-00169 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format. If “canonical”, return Activity Objects and Verbs populated with the canonical definition of the Activity Objects and Display of the Verbs as determined by the LRS, returning only one language.",
          "legacy note: XAPI-00172 upstream comment - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
          "legacy note: XAPI-00172 upstream describe - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.format-ids",
      title: "The Statements resource returns identifier-only statement representations when format is ids",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00171",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "GET with format ids returns only identifying statement data",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format", "ids"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000000228",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:format-ids@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/format-proof",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/format-proof",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:03:48.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000228",
              format: "ids",
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
                path: ["actor"],
                equals: {
                  objectType: "Agent",
                  mbox: "mailto:format-ids@example.test",
                },
              },
              {
                path: ["verb"],
                equals: {
                  id: "https://example.test/xapi/verbs/format-proof",
                },
              },
              {
                path: ["object"],
                equals: {
                  id: "https://example.test/xapi/activities/format-proof",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement ids format",
          "legacy note: XAPI-00171 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format. If “ids”, only include identifiers for Agent, Activity, Verb, Group Objects, and members of Anonymous groups.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.collection-format-absent",
      title: "The Statements Resource returns exact collection data when format is absent",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00168",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "Collection GET defaults to exact when format is absent",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001252",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:collection-format-absent@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/collection-format-absent",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/collection-format-absent",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:52.000Z",
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
              verb: "https://example.test/xapi/verbs/collection-format-absent",
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
                path: ["statements", "length"],
                equals: 1,
              },
              {
                path: ["statements", "0", "id"],
                equals: "33333333-3333-4333-8333-000000001252",
              },
              {
                path: ["statements", "0", "verb", "display"],
                equals: {
                  "en-US": "format-proof-us",
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["statements", "0", "object", "definition", "name"],
                equals: {
                  "en-US": "Format Proof US",
                  "en-GB": "Format Proof GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice collection format absent direct trace",
          "legacy note: XAPI-00168 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format or in “exact” if the “format” parameter is absent.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.collection-format-canonical",
      title: "The Statements Resource returns canonical collection data when format is canonical",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00169",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "Collection GET canonical format returns a single language per localized field",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001253",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:collection-format-canonical@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/collection-format-canonical",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/collection-format-canonical",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:53.000Z",
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
              "Accept-Language": "en-GB",
            },
            query: {
              verb: "https://example.test/xapi/verbs/collection-format-canonical",
              format: "canonical",
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
                path: ["statements", "length"],
                equals: 1,
              },
              {
                path: ["statements", "0", "id"],
                equals: "33333333-3333-4333-8333-000000001253",
              },
              {
                path: ["statements", "0", "verb", "display"],
                equals: {
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["statements", "0", "object", "definition", "name"],
                equals: {
                  "en-GB": "Format Proof GB",
                },
              },
              {
                path: ["statements", "0", "object", "definition", "description"],
                equals: {
                  "en-GB": "Format description GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice collection format canonical direct trace",
          "legacy note: XAPI-00169 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format. If “canonical”, return Activity Objects and Verbs populated with the canonical definition of the Activity Objects and Display of the Verbs as determined by the LRS, returning only one language.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.collection-format-exact",
      title: "The Statements Resource returns exact collection data when format is exact",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00170",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "Collection GET exact format preserves full localized values",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001254",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:collection-format-exact@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/collection-format-exact",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/collection-format-exact",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:54.000Z",
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
              verb: "https://example.test/xapi/verbs/collection-format-exact",
              format: "exact",
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
                path: ["statements", "length"],
                equals: 1,
              },
              {
                path: ["statements", "0", "id"],
                equals: "33333333-3333-4333-8333-000000001254",
              },
              {
                path: ["statements", "0", "verb", "display"],
                equals: {
                  "en-US": "format-proof-us",
                  "en-GB": "format-proof-gb",
                },
              },
              {
                path: ["statements", "0", "object", "definition", "description"],
                equals: {
                  "en-US": "Format description US",
                  "en-GB": "Format description GB",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice collection format exact direct trace",
          "legacy note: XAPI-00170 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format. If “exact”, return Agent, Activity, Verb and Group Objects populated exactly as they were when the Statement was received.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.collection-format-ids",
      title: "The Statements Resource returns identifier-only collection data when format is ids",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00171",
          section: "Communication 2.1.3.s1.table1.row12",
          title: "Collection GET ids format returns identifier-only representations",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001255",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:collection-format-ids@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/collection-format-ids",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/collection-format-ids",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:55.000Z",
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
              verb: "https://example.test/xapi/verbs/collection-format-ids",
              format: "ids",
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
                path: ["statements", "length"],
                equals: 1,
              },
              {
                path: ["statements", "0", "id"],
                equals: "33333333-3333-4333-8333-000000001255",
              },
              {
                path: ["statements", "0", "verb"],
                equals: {
                  id: "https://example.test/xapi/verbs/collection-format-ids",
                },
              },
              {
                path: ["statements", "0", "object", "id"],
                equals: "https://example.test/xapi/activities/collection-format-ids",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice collection format ids direct trace",
          "legacy note: XAPI-00171 upstream comment - An LRS's Statement API can process a GET request with \"format\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object with results in the requested format. If “ids”, only include identifiers for Agent, Activity, Verb, Group Objects, and members of Anonymous groups.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.collection-canonical-accept-language",
      title: "The Statements Resource applies Accept-Language on collection GET requests when format is canonical",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00172",
          section: "Communication 2.1.3.s1.table1.row11",
          title: "Accept-Language affects collection retrieval when format is canonical",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format", "accept-language"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001253",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:collection-format-canonical@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/collection-format-canonical",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/collection-format-canonical",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:53.000Z",
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
              "Accept-Language": "en-GB",
            },
            query: {
              verb: "https://example.test/xapi/verbs/collection-format-canonical",
              format: "canonical",
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
                path: ["statements", "length"],
                equals: 1,
              },
              {
                path: ["statements", "0", "id"],
                equals: "33333333-3333-4333-8333-000000001253",
              },
              {
                path: ["statements", "0", "verb", "display"],
                equals: {
                  "en-GB": "format-proof-gb",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice collection canonical accept-language direct trace",
          "legacy note: XAPI-00172 upstream comment - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
          "legacy note: XAPI-00172 upstream describe - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.collection-accept-language-without-format",
      title: "The Statements Resource does not apply Accept-Language on collection GET requests when format is absent",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00172",
          section: "Communication 2.1.3.s1.table1.row11",
          title: "Accept-Language does not affect collection retrieval when format is absent",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "format", "accept-language"],
      capabilityFlags: ["query", "retrieval", "format"],
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
                id: "33333333-3333-4333-8333-000000001252",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:collection-format-absent@example.test",
                  name: "Format Proof Agent",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/collection-format-absent",
                  display: {
                    "en-US": "format-proof-us",
                    "en-GB": "format-proof-gb",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/collection-format-absent",
                  definition: {
                    name: {
                      "en-US": "Format Proof US",
                      "en-GB": "Format Proof GB",
                    },
                    description: {
                      "en-US": "Format description US",
                      "en-GB": "Format description GB",
                    },
                    type: "https://example.test/xapi/activity-types/format-proof",
                  },
                },
                timestamp: "2026-05-23T12:20:52.000Z",
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
              "Accept-Language": "en-GB",
            },
            query: {
              verb: "https://example.test/xapi/verbs/collection-format-absent",
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
                path: ["statements", "length"],
                equals: 1,
              },
              {
                path: ["statements", "0", "id"],
                equals: "33333333-3333-4333-8333-000000001252",
              },
              {
                path: ["statements", "0", "verb", "display"],
                equals: {
                  "en-US": "format-proof-us",
                  "en-GB": "format-proof-gb",
                },
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice collection accept-language without format direct trace",
          "legacy note: XAPI-00172 upstream comment - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
          "legacy note: XAPI-00172 upstream describe - If the \"Accept-Language\" header is present as part of the GET request to the Statement API and the \"format\" parameter is set to \"canonical\", the LRS MUST apply this data to choose the matching language in the response.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.attachments-multipart",
      title: "The Statements resource returns multipart attachment data when attachments is true",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00167",
          section: "Communication 2.1.3.s1.table1.row13",
          title: "GET with attachments true returns multipart attachment data",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "attachments"],
      capabilityFlags: ["query", "retrieval", "attachments"],
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
              "content-type": "multipart/mixed; boundary=mock-proof-statement-request",
            },
            query: {},
            body: {
              kind: "text",
              value:
                '--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{"id":"33333333-3333-4333-8333-000000000229","actor":{"objectType":"Agent","mbox":"mailto:learner@example.test","name":"Learner Example"},"verb":{"id":"https://example.test/xapi/verbs/completed","display":{"en-US":"completed"}},"object":{"objectType":"Activity","id":"https://example.test/xapi/activities/first-proof-slice"},"timestamp":"2026-05-23T12:03:49.000Z","attachments":[{"usageType":"https://example.test/xapi/attachments/proof","display":{"en-US":"Proof Attachment"},"description":{"en-US":"Proof Attachment Description"},"contentType":"text/plain","length":26,"sha2":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","fileUrl":"https://example.test/files/proof-attachment.txt"}]}\r\n--mock-proof-statement-request\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\r\n\r\nhere is a proof attachment\r\n--mock-proof-statement-request--\r\n',
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
              statementId: "33333333-3333-4333-8333-000000000229",
              attachments: "true",
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
                equals: ["33333333-3333-4333-8333-000000000229"],
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 200,
            expectedHeaders: [],
            expectedHeaderPatterns: [
              {
                key: "content-type",
                pattern: "^multipart/mixed;\\s*boundary=.*$",
              },
            ],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [
              "33333333-3333-4333-8333-000000000229",
              "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              "here is a proof attachment",
            ],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement multipart attachments",
          "legacy note: XAPI-00167 upstream comment - An LRS's Statement API can process a GET request with \"attachments\" as a parameter. The Statement API MUST return 200 OK, StatementResult Object and use the multipart response format and include all attachments if the attachment parameter is set to true",
          "legacy note: XAPI-00167 upstream describe - An LRS\\'s Statement Resource can process a GET request with \"attachments\" as a parameter",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.attachments-json-fallback",
      title: "The Statements resource falls back to application/json when attachments is absent or false",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00161",
          section: "Communication 2.1.3.s1.b1",
          title: "GET without attachments data returns application/json",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "attachments"],
      capabilityFlags: ["query", "retrieval", "attachments"],
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
              "content-type": "multipart/mixed; boundary=mock-proof-statement-request",
            },
            query: {},
            body: {
              kind: "text",
              value:
                '--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{"id":"33333333-3333-4333-8333-000000000230","actor":{"objectType":"Agent","mbox":"mailto:learner@example.test","name":"Learner Example"},"verb":{"id":"https://example.test/xapi/verbs/completed","display":{"en-US":"completed"}},"object":{"objectType":"Activity","id":"https://example.test/xapi/activities/first-proof-slice"},"timestamp":"2026-05-23T12:03:50.000Z","attachments":[{"usageType":"https://example.test/xapi/attachments/proof","display":{"en-US":"Proof Attachment"},"description":{"en-US":"Proof Attachment Description"},"contentType":"text/plain","length":26,"sha2":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","fileUrl":"https://example.test/files/proof-attachment.txt"}]}\r\n--mock-proof-statement-request\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\r\n\r\nhere is a proof attachment\r\n--mock-proof-statement-request--\r\n',
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
              statementId: "33333333-3333-4333-8333-000000000230",
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
              statementId: "33333333-3333-4333-8333-000000000230",
              attachments: "false",
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
                equals: ["33333333-3333-4333-8333-000000000230"],
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 200,
            expectedHeaders: [],
            expectedHeaderPatterns: [
              {
                key: "content-type",
                pattern: "^application/json(?:;.*)?$",
              },
            ],
            jsonPathEquals: [
              {
                path: ["id"],
                equals: "33333333-3333-4333-8333-000000000230",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 200,
            expectedHeaders: [],
            expectedHeaderPatterns: [
              {
                key: "content-type",
                pattern: "^application/json(?:;.*)?$",
              },
            ],
            jsonPathEquals: [
              {
                path: ["id"],
                equals: "33333333-3333-4333-8333-000000000230",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement attachment json fallback",
          "legacy note: XAPI-00161 upstream comment - An LRS's Statement API not return attachment data and only return application/json if the \"attachment\" parameter set to \"false\"",
          "legacy note: XAPI-00161 upstream describe - An LRSs Statement Resource does not return attachment data and only returns application/json if the \"attachment\" parameter set to \"false\"",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.attachments-missing-json",
      title: "The Statements Resource returns application/json when attachments is omitted",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00161",
          section: "Communication 2.1.3.s1.b1",
          title: "The Statements Resource does not return attachment data when attachments is omitted",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "attachments"],
      capabilityFlags: ["query", "retrieval", "attachments"],
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
              "content-type": "multipart/mixed; boundary=mock-proof-statement-request",
            },
            query: {},
            body: {
              kind: "text",
              value:
                '--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{"id":"33333333-3333-4333-8333-000000001217","actor":{"objectType":"Agent","mbox":"mailto:learner@example.test","name":"Learner Example"},"verb":{"id":"https://example.test/xapi/verbs/completed","display":{"en-US":"completed"}},"object":{"objectType":"Activity","id":"https://example.test/xapi/activities/first-proof-slice"},"timestamp":"2026-05-23T12:20:17.000Z","attachments":[{"usageType":"https://example.test/xapi/attachments/proof","display":{"en-US":"Proof Attachment"},"description":{"en-US":"Proof Attachment Description"},"contentType":"text/plain","length":26,"sha2":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","fileUrl":"https://example.test/files/proof-attachment.txt"}]}\r\n--mock-proof-statement-request\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\r\n\r\nhere is a proof attachment\r\n--mock-proof-statement-request--\r\n',
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
              statementId: "33333333-3333-4333-8333-000000001217",
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
                equals: ["33333333-3333-4333-8333-000000001217"],
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 200,
            expectedHeaders: [],
            expectedHeaderPatterns: [
              {
                key: "content-type",
                pattern: "^application/json(?:;.*)?$",
              },
            ],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement attachments omitted json fallback",
          "legacy note: XAPI-00161 upstream comment - An LRS's Statement API not return attachment data and only return application/json if the \"attachment\" parameter set to \"false\"",
          "legacy note: XAPI-00161 upstream describe - An LRSs Statement Resource does not return attachment data and only returns application/json if the \"attachment\" parameter set to \"false\"",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.attachments-false-json",
      title: "The Statements Resource returns application/json when attachments is false",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00161",
          section: "Communication 2.1.3.s1.b1",
          title: "The Statements Resource does not return attachment data when attachments is false",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "attachments"],
      capabilityFlags: ["query", "retrieval", "attachments"],
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
              "content-type": "multipart/mixed; boundary=mock-proof-statement-request",
            },
            query: {},
            body: {
              kind: "text",
              value:
                '--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{"id":"33333333-3333-4333-8333-000000001218","actor":{"objectType":"Agent","mbox":"mailto:learner@example.test","name":"Learner Example"},"verb":{"id":"https://example.test/xapi/verbs/completed","display":{"en-US":"completed"}},"object":{"objectType":"Activity","id":"https://example.test/xapi/activities/first-proof-slice"},"timestamp":"2026-05-23T12:20:18.000Z","attachments":[{"usageType":"https://example.test/xapi/attachments/proof","display":{"en-US":"Proof Attachment"},"description":{"en-US":"Proof Attachment Description"},"contentType":"text/plain","length":26,"sha2":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","fileUrl":"https://example.test/files/proof-attachment.txt"}]}\r\n--mock-proof-statement-request\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\r\n\r\nhere is a proof attachment\r\n--mock-proof-statement-request--\r\n',
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
              statementId: "33333333-3333-4333-8333-000000001218",
              attachments: "false",
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
                equals: ["33333333-3333-4333-8333-000000001218"],
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 200,
            expectedHeaders: [],
            expectedHeaderPatterns: [
              {
                key: "content-type",
                pattern: "^application/json(?:;.*)?$",
              },
            ],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement attachments false json fallback",
          "legacy note: XAPI-00161 upstream comment - An LRS's Statement API not return attachment data and only return application/json if the \"attachment\" parameter set to \"false\"",
          "legacy note: XAPI-00161 upstream describe - An LRSs Statement Resource does not return attachment data and only returns application/json if the \"attachment\" parameter set to \"false\"",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.representation.content-type-header",
      title: "The Statements Resource includes a Content-Type header on successful GET responses",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00165",
          section: "Communication 2.1.3.s1.table1.row14",
          title: "The Statements Resource includes a Content-Type header on GET responses",
        },
      ],
      tags: ["v2.0.0", "statements", "representation", "headers"],
      capabilityFlags: ["query", "headers"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            ascending: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "content-type",
            pattern: "^application/json(?:;.*)?$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement content-type header on get",
          "legacy note: XAPI-00165 upstream comment - An LRS's Statement API, upon receiving a GET request, MUST have a \"Content-Type\" header",
          "legacy note: XAPI-00165 upstream describe - An LRSs Statement Resource, upon receiving a GET request, MUST have a \"Content-Type\" header",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.last-modified-matches-stored",
      title: "The Statements resource returns Last-Modified that matches the stored timestamp",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-01002",
          section: "Communication 2.1.1",
          title: "Statement GET Last-Modified matches the stored timestamp",
        },
      ],
      tags: ["v2.0.0", "statements", "headers"],
      capabilityFlags: ["query", "retrieval", "headers"],
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
                id: "33333333-3333-4333-8333-000000000231",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/header-last-modified",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:51.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000231",
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
            expectedHeaderPatterns: [
              {
                key: "last-modified",
                pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
              },
            ],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement last-modified header",
          "legacy note: XAPI-01002 upstream comment - Rewrite parity requirement: statement metadata/header consistency remains covered in rewrite statement header/substatement cases.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through-success",
      title: "The Statements resource returns X-Experience-API-Consistent-Through on successful GET responses",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "GET returns X-Experience-API-Consistent-Through regardless of successful code",
        },
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "X-Experience-API-Consistent-Through is an ISO 8601 timestamp",
        },
      ],
      tags: ["v2.0.0", "statements", "headers"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            verb: "https://example.test/xapi/verbs/non-existent-consistent-through",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through success header",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through-error",
      title: "The Statements resource returns X-Experience-API-Consistent-Through on invalid GET responses",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "GET returns X-Experience-API-Consistent-Through regardless of returned code",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "validation"],
      capabilityFlags: ["headers", "query", "validation"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            LIMIT: "1",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 400,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through error header",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.agent",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "agent"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            agent: '{"objectType":"Agent","mbox":"mailto:consistent-through-agent@example.test"}',
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence agent",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.verb",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "verb"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            verb: "https://example.test/xapi/verbs/consistent-through-verb",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence verb",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.activity",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "activity"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            activity: "https://example.test/xapi/activities/consistent-through-activity",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence activity",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.registration",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "registration"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            registration: "33333333-3333-4333-8333-000000001220",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence registration",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.related-activities",
      title:
        'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "related_activities"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            activity: "https://example.test/xapi/activities/consistent-through-related-activity",
            related_activities: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence related-activities",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.related-agents",
      title:
        'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "related_agents"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            agent: '{"objectType":"Agent","mbox":"mailto:consistent-through-related-agent@example.test"}',
            related_agents: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence related-agents",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.since",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "since"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            since: "2026-05-23T12:00:22.000Z",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence since",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.until",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "until"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            until: "2026-05-23T12:00:23.000Z",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence until",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.limit",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "limit"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            limit: "1",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence limit",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.ascending",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "ascending"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            ascending: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence ascending",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.format",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "format"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            format: "ids",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence format",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.presence.attachments",
      title: 'The Statements Resource returns X-Experience-API-Consistent-Through for GET requests with "attachments"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00153",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns X-Experience-API-Consistent-Through regardless of the GET query",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            attachments: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^.+$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through presence attachments",
          "legacy note: XAPI-00153 upstream comment - An LRS's Statement API upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
          "legacy note: XAPI-00153 upstream describe - An LRS\\'s Statement Resource upon processing a GET request, returns a header with name \"X-Experience-API-Consistent-Through\" regardless of the code returned.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.agent",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "agent"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            agent: '{"objectType":"Agent","mbox":"mailto:consistent-through-agent@example.test"}',
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso agent",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.verb",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "verb"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            verb: "https://example.test/xapi/verbs/consistent-through-verb",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso verb",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.activity",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "activity"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            activity: "https://example.test/xapi/activities/consistent-through-activity",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso activity",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.registration",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "registration"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            registration: "33333333-3333-4333-8333-000000001220",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso registration",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.related-activities",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "related_activities"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            activity: "https://example.test/xapi/activities/consistent-through-related-activity",
            related_activities: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso related-activities",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.related-agents",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "related_agents"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            agent: '{"objectType":"Agent","mbox":"mailto:consistent-through-related-agent@example.test"}',
            related_agents: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso related-agents",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.since",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "since"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            since: "2026-05-23T12:00:22.000Z",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso since",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.until",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "until"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            until: "2026-05-23T12:00:23.000Z",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso until",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.limit",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "limit"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            limit: "1",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso limit",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.ascending",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "ascending"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            ascending: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso ascending",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.format",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "format"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            format: "ids",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso format",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.headers.consistent-through.iso.attachments",
      title:
        'The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header for GET requests with "attachments"',
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00160",
          section: "Communication 2.1.3.s2.b5",
          title: "The Statements Resource returns an ISO 8601 X-Experience-API-Consistent-Through header",
        },
      ],
      tags: ["v2.0.0", "statements", "headers", "consistent-through"],
      capabilityFlags: ["headers", "query"],
      legacyTrace: {
        suiteFile: "test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "GET",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            attachments: "true",
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [
          {
            key: "x-experience-api-consistent-through",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,9}Z$",
          },
        ],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement consistent-through iso attachments",
          "legacy note: XAPI-00160 upstream comment - An LRS's \"X-Experience-API-Consistent-Through\" header is an ISO 8601 combined date and time",
        ],
      },
    },
  ],
} as unknown as SuiteDefinition;
