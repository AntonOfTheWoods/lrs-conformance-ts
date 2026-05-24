import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsAuthoritySuite = {
  type: "suite",
  id: "v2.proof-slice.statements.authority",
  title: "Statement Authority",
  specVersion: "2.0.0",
  tags: ["authority"],
  children: [
    {
      type: "case",
      id: "v2.statements.authority-group-acceptance.anonymous-two-member",
      title: "A Statement accepts an authority anonymous group with exactly two members",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00098",
          section: "Data 2.4.9.s3.b1",
          title: "Authority groups are anonymous groups with exactly two members",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "acceptance"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    account: {
                      homePage: "http://example.com/xAPI/OAuth/Token",
                      name: "oauth_consumer_x75db",
                    },
                  },
                  {
                    mbox: "mailto:bob@example.com",
                  },
                ],
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-populates-when-missing",
      title: "The Statements resource populates authority from header information when authority is omitted",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00099",
          section: "Data 2.4.9.s3.b4",
          title: "Statements populate authority from header information",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "population"],
      capabilityFlags: ["authority", "query", "retrieval"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
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
                id: "22222222-2222-4222-8222-222222222222",
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
                timestamp: "2026-05-23T12:00:00Z",
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
              statementId: "22222222-2222-4222-8222-222222222222",
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
                equals: ["22222222-2222-4222-8222-222222222222"],
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
                path: ["authority", "objectType"],
                equals: "Agent",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: ["proof-slice statement authority population"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.non-oauth-members",
      title: "A Statement rejects an authority group composed only of non-OAuth Agents",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00100",
          section: "Data 2.4.9.s3.b3",
          title: "Authority groups reject non-O-Auth Agents",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection", "non-oauth"],
      capabilityFlags: ["authority"],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    mbox: "mailto:agent-a@example.com",
                  },
                  {
                    mbox: "mailto:agent-b@example.com",
                  },
                ],
              },
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
        notes: ["proof-slice statement authority non-oauth rejection"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.identified-mbox",
      title: "A Statement rejects an authority identified group that uses mbox",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00024",
          section: "Data 2.4.s1.table1.row9",
          title: "Authority groups do not use identified group IFIs",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    account: {
                      homePage: "http://example.com/xAPI/OAuth/Token",
                      name: "oauth_consumer_x75db",
                    },
                  },
                  {
                    mbox: "mailto:bob@example.com",
                  },
                ],
                mbox: "mailto:bob@example.com",
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.identified-mbox-sha1sum",
      title: "A Statement rejects an authority identified group that uses mbox_sha1sum",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00024",
          section: "Data 2.4.s1.table1.row9",
          title: "Authority groups do not use identified group IFIs",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    account: {
                      homePage: "http://example.com/xAPI/OAuth/Token",
                      name: "oauth_consumer_x75db",
                    },
                  },
                  {
                    mbox: "mailto:bob@example.com",
                  },
                ],
                mbox_sha1sum: "495395e777cd98da653df9615d09c0fd6bb2f8d4",
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.identified-openid",
      title: "A Statement rejects an authority identified group that uses openid",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00024",
          section: "Data 2.4.s1.table1.row9",
          title: "Authority groups do not use identified group IFIs",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    account: {
                      homePage: "http://example.com/xAPI/OAuth/Token",
                      name: "oauth_consumer_x75db",
                    },
                  },
                  {
                    mbox: "mailto:bob@example.com",
                  },
                ],
                openid: "http://openid.example.org/12345",
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.identified-account",
      title: "A Statement rejects an authority identified group that uses account",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00024",
          section: "Data 2.4.s1.table1.row9",
          title: "Authority groups do not use identified group IFIs",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    account: {
                      homePage: "http://example.com/xAPI/OAuth/Token",
                      name: "oauth_consumer_x75db",
                    },
                  },
                  {
                    mbox: "mailto:bob@example.com",
                  },
                ],
                account: {
                  homePage: "http://example.com/xAPI/OAuth/Token",
                  name: "oauth_consumer_x75db",
                },
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.anonymous-no-member",
      title: "A Statement rejects an authority anonymous group without two members",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00098",
          section: "Data 2.4.9.s3.b1",
          title: "Authority groups require exactly two members",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                name: "Proof Group",
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.anonymous-one-member",
      title: "A Statement rejects an authority anonymous group with one member",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00098",
          section: "Data 2.4.9.s3.b1",
          title: "Authority groups require exactly two members",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    mbox: "mailto:bob@example.com",
                  },
                ],
              },
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
        notes: ["Statement Authority"],
      },
    },
    {
      type: "case",
      id: "v2.statements.authority-group-rejection.anonymous-three-member",
      title: "A Statement rejects an authority anonymous group with three members",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "XAPI-00098",
          section: "Data 2.4.9.s3.b1",
          title: "Authority groups require exactly two members",
        },
      ],
      tags: ["v2.0.0", "statements", "authority", "group", "rejection"],
      capabilityFlags: [],
      legacyTrace: {
        suiteFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.4.2-Authority-Requirements.js",
        configFile: "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/configs/authorities.js",
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
              id: "11111111-1111-4111-8111-111111111111",
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
              timestamp: "2026-05-23T12:00:00Z",
              authority: {
                objectType: "Group",
                member: [
                  {
                    account: {
                      homePage: "http://example.com/xAPI/OAuth/Token",
                      name: "oauth_consumer_x75db",
                    },
                  },
                  {
                    mbox: "mailto:bob@example.com",
                  },
                  {
                    mbox: "mailto:james@example.com",
                  },
                ],
              },
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
        notes: ["Statement Authority"],
      },
    },
  ],
} as unknown as SuiteDefinition;
