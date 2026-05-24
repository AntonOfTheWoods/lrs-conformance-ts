import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsTransportSuite = {
  type: "suite",
  id: "v2.proof-slice.statements.transport",
  title: "Statement Transport",
  specVersion: "2.0.0",
  tags: ["transport"],
  children: [
    {
      type: "case",
      id: "v2.statements.transport.endpoint.post",
      title: "The Statements Resource exists at /statements and accepts POST requests",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00139",
          section: "Communication 2.1",
          title: "The Statements Resource exists at /statements",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "endpoint"],
      capabilityFlags: ["transport"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
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
              id: "33333333-3333-4333-8333-000000001201",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "https://example.test/xapi/verbs/statement-endpoint-post",
                display: {
                  "en-US": "completed",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/first-proof-slice",
              },
              timestamp: "2026-05-23T12:20:01.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement endpoint post exists",
          "legacy note: XAPI-00139 upstream comment - An LRS has a Statement API with endpoint \"base IRI\"+\"/statements\"",
          "legacy note: XAPI-00139 upstream describe - An LRS has a Statement Resource with endpoint \"base IRI\"+\"/statements\"",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.endpoint.put",
      title: "The Statements Resource exists at /statements and accepts PUT requests",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00139",
          section: "Communication 2.1",
          title: "The Statements Resource exists at /statements",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "endpoint"],
      capabilityFlags: ["transport"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "PUT",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            statementId: "33333333-3333-4333-8333-000000001202",
          },
          body: {
            kind: "json",
            value: {
              id: "33333333-3333-4333-8333-000000001202",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "https://example.test/xapi/verbs/statement-endpoint-put",
                display: {
                  "en-US": "completed",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/first-proof-slice",
              },
              timestamp: "2026-05-23T12:20:02.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 204,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement endpoint put exists",
          "legacy note: XAPI-00139 upstream comment - An LRS has a Statement API with endpoint \"base IRI\"+\"/statements\"",
          "legacy note: XAPI-00139 upstream describe - An LRS has a Statement Resource with endpoint \"base IRI\"+\"/statements\"",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.put-with-statement-id-accepted",
      title: "The Statements Resource accepts PUT requests when statementId is provided",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00144",
          section: "Communication 2.1.1.s1.table1.row1",
          title: "The Statements Resource accepts PUT requests only if statementId is provided",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "put"],
      capabilityFlags: ["transport"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "PUT",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {
            statementId: "33333333-3333-4333-8333-000000001204",
          },
          body: {
            kind: "json",
            value: {
              id: "33333333-3333-4333-8333-000000001204",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "https://example.test/xapi/verbs/statement-put-accepted",
                display: {
                  "en-US": "completed",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/first-proof-slice",
              },
              timestamp: "2026-05-23T12:20:04.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 204,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement put accepted with statementId",
          "legacy note: XAPI-00144 upstream comment - An LRS's Statement API accepts PUT requests only if it contains a \"statementId\" parameter, returning 204 No Content",
          "legacy note: XAPI-00144 upstream describe - An LRS\\'s Statement Resource accepts PUT requests only if it contains a \"statementId\" parameter",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.put-roundtrip",
      title: "The Statements resource persists a statement written with PUT and retrieves it by statementId",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00143",
          section: "Communication 2.1.1.s1",
          title: "Successful Statement PUT returns 204 No Content",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "put"],
      capabilityFlags: ["transport", "query", "retrieval"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "request-sequence",
        steps: [
          {
            method: "PUT",
            endpoint: "statements",
            authMode: "basic",
            headers: {
              "X-Experience-API-Version": "2.0.0",
            },
            query: {
              statementId: "33333333-3333-4333-8333-000000000201",
            },
            body: {
              kind: "json",
              value: {
                id: "33333333-3333-4333-8333-000000000201",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/transport-put-roundtrip",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:21.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000201",
            },
          },
        ],
      },
      assertion: {
        kind: "request-sequence",
        steps: [
          {
            status: 204,
            expectedHeaders: [],
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
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
                path: ["id"],
                equals: "33333333-3333-4333-8333-000000000201",
              },
              {
                path: ["verb", "id"],
                equals: "https://example.test/xapi/verbs/transport-put-roundtrip",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement PUT roundtrip",
          "legacy note: PUT with statementId persists the statement and enables statementId retrieval",
          "legacy note: XAPI-00143 upstream comment - An LRS's Statement API upon processing a valid PUT request successfully returns code 204 No Content",
          "legacy note: XAPI-00143 upstream describe - An LRS\\'s Statement Resource upon processing a successful PUT request returns code 204 No Content",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.put-requires-statement-id",
      title: "The Statements resource rejects PUT without a statementId query parameter",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00145",
          section: "Communication 2.1.1.s1.table1.row1",
          title: "Statement PUT rejects requests without statementId",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "put"],
      capabilityFlags: ["transport", "validation"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "PUT",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {},
          body: {
            kind: "json",
            value: {
              id: "33333333-3333-4333-8333-000000000202",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "https://example.test/xapi/verbs/transport-put-missing-id",
                display: {
                  "en-US": "completed",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/first-proof-slice",
              },
              timestamp: "2026-05-23T12:03:22.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 400,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement PUT requires statementId",
          "legacy note: XAPI-00145 upstream comment - An LRS's Statement API rejects a PUT request which does not have a \"statementId\" parameter, returning 400 Bad Request",
          "legacy note: XAPI-00145 upstream describe - An LRS\\'s Statement Resource accepts PUT requests only if it contains a \"statementId\" parameter",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.put-is-immutable",
      title:
        "The Statements resource does not modify an existing statement when the same statementId is written again with PUT",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00142",
          section: "Communication 2.1.1.s2.b2",
          title: "Statement PUT cannot modify an existing Statement",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "put", "immutability"],
      capabilityFlags: ["transport", "query", "retrieval"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "request-sequence",
        steps: [
          {
            method: "PUT",
            endpoint: "statements",
            authMode: "basic",
            headers: {
              "X-Experience-API-Version": "2.0.0",
            },
            query: {
              statementId: "33333333-3333-4333-8333-000000000203",
            },
            body: {
              kind: "json",
              value: {
                id: "33333333-3333-4333-8333-000000000203",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/transport-put-original",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:23.000Z",
              },
              sourceFixture: {
                version: "2.0.0",
                domain: "statements",
                name: "default",
              },
            },
          },
          {
            method: "PUT",
            endpoint: "statements",
            authMode: "basic",
            headers: {
              "X-Experience-API-Version": "2.0.0",
            },
            query: {
              statementId: "33333333-3333-4333-8333-000000000203",
            },
            body: {
              kind: "json",
              value: {
                id: "33333333-3333-4333-8333-000000000203",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/transport-put-replacement",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:23.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000203",
            },
          },
        ],
      },
      assertion: {
        kind: "request-sequence",
        steps: [
          {
            status: 204,
            expectedHeaders: [],
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 409,
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
                path: ["verb", "id"],
                equals: "https://example.test/xapi/verbs/transport-put-original",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement PUT immutability",
          "legacy note: PUT cannot modify an existing statement with the same statementId",
          "legacy note: XAPI-00142 upstream comment - An LRS cannot modify a Statement in the event it receives a Statement with statementID equal to a Statement in the LRS already. To test: Send one statement with a particular statement ID. Send a second statement with the same statement ID but everything else different. Retrieve the statement before the second statement and after and both retrieved statements MUST match.",
          "legacy note: XAPI-00142 upstream describe - An LRS cannot modify a Statement, state, or Object in the event it receives a Statement with statementID equal to a Statement in the LRS already.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.post-accepted",
      title: "The Statements Resource accepts POST requests",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00147",
          section: "Communication 2.1.2.s1",
          title: "The Statements Resource accepts POST requests",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "post"],
      capabilityFlags: ["transport"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
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
              id: "33333333-3333-4333-8333-000000001203",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "https://example.test/xapi/verbs/statement-post-accepted",
                display: {
                  "en-US": "completed",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/first-proof-slice",
              },
              timestamp: "2026-05-23T12:20:03.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement post accepted",
          "legacy note: XAPI-00147 upstream comment - An LRS's Statement API accepts POST requests",
          "legacy note: XAPI-00147 upstream describe - An LRS\\'s Statement Resource accepts POST requests",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.post-single-returns-id-array",
      title:
        "The Statements resource returns an array containing the submitted statement id for a successful single POST",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00146",
          section: "Communication 2.1.2.s1",
          title: "Successful Statement POST returns all submitted statement ids",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "post"],
      capabilityFlags: ["transport"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
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
              id: "33333333-3333-4333-8333-000000000209",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "https://example.test/xapi/verbs/post-single-response-array",
                display: {
                  "en-US": "completed",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/first-proof-slice",
              },
              timestamp: "2026-05-23T12:03:29.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [
          {
            path: [],
            equals: ["33333333-3333-4333-8333-000000000209"],
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement single POST success",
          "legacy note: XAPI-00146 upstream comment - An LRS's Statement API upon processing a successful POST request returns code 200 OK and all Statement UUIDs within the POST",
          "legacy note: XAPI-00146 upstream describe - An LRS\\'s Statement Resource upon processing a successful POST request returns code 200 OK and all Statement UUIDs within the POST **Implicit**",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.post-batch-success",
      title: "The Statements resource accepts a valid POST batch and returns the submitted statement ids",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00146",
          section: "Communication 2.1.2.s1",
          title: "Successful Statement POST returns all submitted statement ids",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "batch"],
      capabilityFlags: ["transport", "batch"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "POST",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {},
          body: {
            kind: "json",
            value: [
              {
                id: "33333333-3333-4333-8333-000000000220",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/batch-success-one",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:40.000Z",
              },
              {
                id: "33333333-3333-4333-8333-000000000221",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/batch-success-two",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:41.000Z",
              },
            ],
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [
          {
            path: [],
            equals: ["33333333-3333-4333-8333-000000000220", "33333333-3333-4333-8333-000000000221"],
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement batch success",
          "legacy note: XAPI-00146 upstream comment - An LRS's Statement API upon processing a successful POST request returns code 200 OK and all Statement UUIDs within the POST",
          "legacy note: XAPI-00146 upstream describe - An LRS\\'s Statement Resource upon processing a successful POST request returns code 200 OK and all Statement UUIDs within the POST **Implicit**",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.post-batch-rejects-duplicate-ids",
      title: "The Statements resource rejects a POST batch that contains duplicate statement ids",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00326",
          section: "Communication 3.2.s3.b9",
          title: "Rejected Statement batches return 400 Bad Request",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "batch", "validation"],
      capabilityFlags: ["transport", "batch", "validation"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.1.6.1-Statement-Resource.js",
      },
      execution: {
        kind: "single-request",
        request: {
          method: "POST",
          endpoint: "statements",
          authMode: "basic",
          headers: {
            "X-Experience-API-Version": "2.0.0",
          },
          query: {},
          body: {
            kind: "json",
            value: [
              {
                id: "33333333-3333-4333-8333-000000000222",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/batch-duplicate-original",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:42.000Z",
              },
              {
                id: "33333333-3333-4333-8333-000000000222",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/batch-duplicate-conflict",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:43.000Z",
              },
            ],
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 400,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice statement batch duplicate-id rejection",
          "legacy note: XAPI-00326 upstream comment - An LRS rejects with a 400 Bad Request any batch of Statements in which one or more Statements is rejected and if necessary, restores the LRS to the state in which it was before the batch began processing. The response may identify the first statementId which failed.",
          "legacy note: XAPI-00326 upstream describe - An LRS does not process any batch of Statements in which one or more Statements is rejected and if necessary, restores the LRS to the state in which it was before the batch began processing",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.transport.post-batch-atomic-rollback",
      title: "The Statements resource does not persist any statements from a rejected POST batch",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00326",
          section: "Communication 3.2.s3.b9",
          title: "Rejected Statement batches do not partially persist",
        },
      ],
      tags: ["v2.0.0", "statements", "transport", "batch", "rollback"],
      capabilityFlags: ["transport", "batch", "validation"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/H.Communication3.2-ErrorCodes.js",
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
              value: [
                {
                  id: "33333333-3333-4333-8333-000000000224",
                  actor: {
                    objectType: "Agent",
                    mbox: "mailto:learner@example.test",
                    name: "Learner Example",
                  },
                  verb: {
                    id: "https://example.test/xapi/verbs/batch-rollback-valid",
                    display: {
                      "en-US": "completed",
                    },
                  },
                  object: {
                    objectType: "Activity",
                    id: "https://example.test/xapi/activities/first-proof-slice",
                  },
                  timestamp: "2026-05-23T12:03:44.000Z",
                },
                {
                  id: "33333333-3333-4333-8333-000000000225",
                  actor: {
                    objectType: "Agent",
                    mbox: "mailto:learner@example.test",
                    name: "Learner Example",
                  },
                  verb: {
                    id: "not-a-valid-iri",
                    display: {
                      "en-US": "completed",
                    },
                  },
                  object: {
                    objectType: "Activity",
                    id: "https://example.test/xapi/activities/first-proof-slice",
                  },
                  timestamp: "2026-05-23T12:03:45.000Z",
                },
              ],
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
              statementId: "33333333-3333-4333-8333-000000000224",
            },
          },
        ],
      },
      assertion: {
        kind: "request-sequence",
        steps: [
          {
            status: 400,
            expectedHeaders: [],
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 404,
            expectedHeaders: [],
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice statement batch rollback",
          "legacy note: XAPI-00326 upstream comment - An LRS rejects with a 400 Bad Request any batch of Statements in which one or more Statements is rejected and if necessary, restores the LRS to the state in which it was before the batch began processing. The response may identify the first statementId which failed.",
          "legacy note: XAPI-00326 upstream describe - An LRS does not process any batch of Statements in which one or more Statements is rejected and if necessary, restores the LRS to the state in which it was before the batch began processing",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.voiding.missing-target-accepted",
      title: "The Statements resource accepts a voiding statement whose StatementRef target is not present",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00019",
          section: "Data 2.3.2",
          title: "Voiding statements are identified by the voided verb and StatementRef object",
        },
        {
          id: "XAPI-00020",
          section: "Data 2.3.2.s2.b1",
          title: "Voiding statements use StatementRef as the objectType",
        },
      ],
      tags: ["v2.0.0", "statements", "voiding"],
      capabilityFlags: ["transport", "voiding"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/voiding.js",
      },
      execution: {
        kind: "single-request",
        request: {
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
              id: "33333333-3333-4333-8333-000000000970",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "http://adlnet.gov/expapi/verbs/voided",
                display: {
                  "en-US": "voided",
                },
              },
              object: {
                objectType: "StatementRef",
                id: "33333333-3333-4333-8333-000000000971",
              },
              timestamp: "2026-05-23T12:16:10.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [
          {
            path: [],
            equals: ["33333333-3333-4333-8333-000000000970"],
          },
        ],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice missing target voiding acceptance",
          "legacy note: XAPI-00019 upstream comment - in voiding.js",
          "legacy note: XAPI-00020 upstream comment - in voiding.js",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.voiding.requires-statement-ref-object",
      title: "The Statements resource rejects a voiding statement when its object is not a StatementRef",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00017",
          section: "Data 2.3.2.s2.b1",
          title: "Voiding statements are rejected when objectType is not StatementRef",
        },
      ],
      tags: ["v2.0.0", "statements", "voiding", "validation"],
      capabilityFlags: ["transport", "voiding", "validation"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/voiding.js",
      },
      execution: {
        kind: "single-request",
        request: {
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
              id: "33333333-3333-4333-8333-000000000972",
              actor: {
                objectType: "Agent",
                mbox: "mailto:learner@example.test",
                name: "Learner Example",
              },
              verb: {
                id: "http://adlnet.gov/expapi/verbs/voided",
                display: {
                  "en-US": "voided",
                },
              },
              object: {
                objectType: "Activity",
                id: "https://example.test/xapi/activities/not-a-statement-ref",
              },
              timestamp: "2026-05-23T12:16:12.000Z",
            },
            sourceFixture: {
              version: "2.0.0",
              domain: "statements",
              name: "default",
            },
          },
        },
      },
      assertion: {
        kind: "single-request",
        status: 400,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: [
          "proof-slice invalid voiding object rejection",
          "legacy note: XAPI-00017 upstream comment - in voiding.js",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.voiding.repeated-target-ignored",
      title: "The Statements resource ignores a second voiding statement that targets an already voided statement",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00016",
          section: "Data 2.3.2.s2.b7",
          title: "Voiding statements that target already voided statements are ignored if accepted",
        },
      ],
      tags: ["v2.0.0", "statements", "voiding"],
      capabilityFlags: ["transport", "query", "retrieval", "voiding"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js",
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
                id: "33333333-3333-4333-8333-000000000973",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/revoid-target",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:16:13.000Z",
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
                id: "33333333-3333-4333-8333-000000000974",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "http://adlnet.gov/expapi/verbs/voided",
                  display: {
                    "en-US": "voided",
                  },
                },
                object: {
                  objectType: "StatementRef",
                  id: "33333333-3333-4333-8333-000000000973",
                },
                timestamp: "2026-05-23T12:16:14.000Z",
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
                id: "33333333-3333-4333-8333-000000000975",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "http://adlnet.gov/expapi/verbs/voided",
                  display: {
                    "en-US": "voided",
                  },
                },
                object: {
                  objectType: "StatementRef",
                  id: "33333333-3333-4333-8333-000000000973",
                },
                timestamp: "2026-05-23T12:16:15.000Z",
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
              voidedStatementId: "33333333-3333-4333-8333-000000000973",
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
                equals: ["33333333-3333-4333-8333-000000000973"],
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
                equals: ["33333333-3333-4333-8333-000000000974"],
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
                equals: ["33333333-3333-4333-8333-000000000975"],
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
                path: ["id"],
                equals: "33333333-3333-4333-8333-000000000973",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice repeated voiding is ignored",
          "legacy note: 4.2.4.1 LRS Rejection Cases Update for 2.0 Never reject a stateemnt for using the voided verb.",
          "legacy note: XAPI-00016 upstream comment - A Voiding Statement cannot Target another Voiding Statement. LRS behavior this new VOIDING statement MAY be rejected. If the LRS accepts that statement, the violating VOIDING statement SHOULD be ignored. Adjust this test accordingly",
          "legacy note: XAPI-00016 upstream describe - A Voiding Statement cannot Target another Voiding Statement",
          "legacy note: XAPI-00016 upstream describe - An LRS SHALL NOT reject a voided statement because it cannot find the ID of the Object of that statement, nor does the LRS have to try to find it.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.voiding.cannot-target-voiding-statement",
      title: "The Statements resource does not void a voiding statement when another voiding statement targets it",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00016",
          section: "Data 2.3.2.s2.b7",
          title: "Voiding statements cannot target other voiding statements",
        },
      ],
      tags: ["v2.0.0", "statements", "voiding"],
      capabilityFlags: ["transport", "query", "retrieval", "voiding"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js",
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
                id: "33333333-3333-4333-8333-000000000976",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/protected-voiding-target",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:16:16.000Z",
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
                id: "33333333-3333-4333-8333-000000000977",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "http://adlnet.gov/expapi/verbs/voided",
                  display: {
                    "en-US": "voided",
                  },
                },
                object: {
                  objectType: "StatementRef",
                  id: "33333333-3333-4333-8333-000000000976",
                },
                timestamp: "2026-05-23T12:16:17.000Z",
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
                id: "33333333-3333-4333-8333-000000000978",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "http://adlnet.gov/expapi/verbs/voided",
                  display: {
                    "en-US": "voided",
                  },
                },
                object: {
                  objectType: "StatementRef",
                  id: "33333333-3333-4333-8333-000000000977",
                },
                timestamp: "2026-05-23T12:16:18.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000977",
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
                equals: ["33333333-3333-4333-8333-000000000976"],
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
                equals: ["33333333-3333-4333-8333-000000000977"],
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
                equals: ["33333333-3333-4333-8333-000000000978"],
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
                path: ["id"],
                equals: "33333333-3333-4333-8333-000000000977",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice voiding statements remain visible when targeted",
          "legacy note: 4.2.4.1 LRS Rejection Cases Update for 2.0 Never reject a stateemnt for using the voided verb.",
          "legacy note: XAPI-00016 upstream comment - A Voiding Statement cannot Target another Voiding Statement. LRS behavior this new VOIDING statement MAY be rejected. If the LRS accepts that statement, the violating VOIDING statement SHOULD be ignored. Adjust this test accordingly",
          "legacy note: XAPI-00016 upstream describe - A Voiding Statement cannot Target another Voiding Statement",
          "legacy note: XAPI-00016 upstream describe - An LRS SHALL NOT reject a voided statement because it cannot find the ID of the Object of that statement, nor does the LRS have to try to find it.",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.voiding.voided-statement-id-roundtrip",
      title: "The Statements resource returns a voided statement when queried by voidedStatementId",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00018",
          section: "Data 2.3.2.s2.b3",
          title: "Voided statements are returned only through voidedStatementId lookups",
        },
        {
          id: "XAPI-00155",
          section: "Communication 2.1.3.s1",
          title: "GET with voidedStatementId returns the corresponding Statement",
        },
      ],
      tags: ["v2.0.0", "statements", "voiding", "query"],
      capabilityFlags: ["transport", "query", "retrieval", "voiding"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js",
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
                id: "33333333-3333-4333-8333-000000000204",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/voiding-target",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:24.000Z",
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
                id: "33333333-3333-4333-8333-000000000205",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "http://adlnet.gov/expapi/verbs/voided",
                  display: {
                    "en-US": "voided",
                  },
                },
                object: {
                  objectType: "StatementRef",
                  id: "33333333-3333-4333-8333-000000000204",
                },
                timestamp: "2026-05-23T12:03:25.000Z",
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
              voidedStatementId: "33333333-3333-4333-8333-000000000204",
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
                path: ["id"],
                equals: "33333333-3333-4333-8333-000000000204",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice voided statement retrieval",
          "legacy note: A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS",
          "legacy note: XAPI-00018 upstream comment - An LRS MUST consider a Statement it contains voided if the Statement is not itself a voiding Statement and the LRS also contains a voiding Statement referring to the first Statement. Test: Void a statement and then send a GET for that statement which uses “statementId” instead of “voidedStatementId.” The statement should then not be returned in the GET request, which should return a 404.",
          "legacy note: XAPI-00018 upstream describe - A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS",
          "legacy note: XAPI-00155 upstream comment - An LRS's Statement API upon processing a successful GET request with a \"voidedStatementId\" parameter, returns code 200 OK and a single Statement with the corresponding \"id\".",
          "legacy note: XAPI-00155 upstream describe - An LRS\\'s Statement Resource upon processing a successful GET request with a \"voidedStatementId\" parameter, returns code 200 OK and a single Statement with the corresponding \"id\".",
        ],
      },
    },
    {
      type: "case",
      id: "v2.statements.voiding.statement-id-hides-voided",
      title: "The Statements resource does not return a voided statement when queried by statementId",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00018",
          section: "Data 2.3.2.s2.b3",
          title: "Voided statements are hidden from statementId lookups",
        },
        {
          id: "XAPI-00163",
          section: "Communication 2.1.4.s1.b1",
          title: "Voided Statements are only returned for voidedStatementId lookups",
        },
      ],
      tags: ["v2.0.0", "statements", "voiding", "query"],
      capabilityFlags: ["transport", "query", "retrieval", "voiding"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.5-Statement-Voiding.js",
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
                id: "33333333-3333-4333-8333-000000000206",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "https://example.test/xapi/verbs/voiding-hidden-target",
                  display: {
                    "en-US": "completed",
                  },
                },
                object: {
                  objectType: "Activity",
                  id: "https://example.test/xapi/activities/first-proof-slice",
                },
                timestamp: "2026-05-23T12:03:26.000Z",
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
                id: "33333333-3333-4333-8333-000000000207",
                actor: {
                  objectType: "Agent",
                  mbox: "mailto:learner@example.test",
                  name: "Learner Example",
                },
                verb: {
                  id: "http://adlnet.gov/expapi/verbs/voided",
                  display: {
                    "en-US": "voided",
                  },
                },
                object: {
                  objectType: "StatementRef",
                  id: "33333333-3333-4333-8333-000000000206",
                },
                timestamp: "2026-05-23T12:03:27.000Z",
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
              statementId: "33333333-3333-4333-8333-000000000206",
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
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
          {
            status: 404,
            expectedHeaders: [],
            expectedHeaderPatterns: [],
            jsonPathEquals: [],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: [
          "proof-slice hidden voided statement lookup",
          "legacy note: A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS",
          "legacy note: XAPI-00018 upstream comment - An LRS MUST consider a Statement it contains voided if the Statement is not itself a voiding Statement and the LRS also contains a voiding Statement referring to the first Statement. Test: Void a statement and then send a GET for that statement which uses “statementId” instead of “voidedStatementId.” The statement should then not be returned in the GET request, which should return a 404.",
          "legacy note: XAPI-00018 upstream describe - A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS",
          "legacy note: XAPI-00163 upstream comment - An LRS's Statement API, upon processing a successful GET request, can only return a Voided Statement if that Statement is specified in the voidedStatementId parameter of that request",
          "legacy note: XAPI-00163 upstream describe - An LRS\\'s Statement Resource, upon processing a successful GET request, can only return a Voided Statement if that Statement is specified in the voidedStatementId parameter of that request",
        ],
      },
    },
  ],
} as unknown as SuiteDefinition;
