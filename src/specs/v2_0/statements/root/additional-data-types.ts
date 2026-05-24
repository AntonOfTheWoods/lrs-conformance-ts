import type { SuiteDefinition } from "../../../../domain/contracts";
export const v2ProofSliceStatementsAdditionalDataTypesSuite = {
  type: "suite",
  id: "v2.proof-slice.statements.additional-data-types",
  title: "Additional Data Types",
  specVersion: "2.0.0",
  tags: ["additional-data-types"],
  children: [
    {
      type: "case",
      id: "v2.statements.additional-data-types.iri-comparison",
      title: "The Activities Resource supports retrieval after statements store equivalent IRIs",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "LEGACY-DATATYPES-IRI-COMPARISON",
          section: "Additional Requirements for Data Types - IRIs",
          title: "IRIs are compared using simple string comparison or syntax-based normalization",
        },
      ],
      tags: ["v2.0.0", "statements", "additional-data-types", "iri"],
      capabilityFlags: ["activities", "retrieval", "iri"],
      legacyTrace: {
        suiteFile:
          "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.7-Additional-Requirements-for-Data-Types.js",
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
                id: "33333333-3333-4333-8333-000000005000",
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
                  id: "http://example.com/path/../33333333-3333-4333-8333-000000005000",
                },
                timestamp: "2026-05-23T13:23:20.000Z",
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
            endpoint: "activities",
            authMode: "basic",
            headers: {
              "X-Experience-API-Version": "2.0.0",
            },
            query: {
              activityId: "http://example.com/path/33333333-3333-4333-8333-000000005000",
            },
          },
          {
            method: "GET",
            endpoint: "activities",
            authMode: "basic",
            headers: {
              "X-Experience-API-Version": "2.0.0",
            },
            query: {
              activityId: "http://example.com/path/../33333333-3333-4333-8333-000000005000",
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
                path: ["id"],
                equals: "http://example.com/path/33333333-3333-4333-8333-000000005000",
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
                equals: "http://example.com/path/../33333333-3333-4333-8333-000000005000",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: ["proof-slice additional data types iri comparison"],
      },
    },
    {
      type: "case",
      id: "v2.statements.additional-data-types.duration-high-precision-accepted",
      title: "The Statements resource accepts Durations with precision beyond 0.01 seconds",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "LEGACY-DATATYPES-DURATION-PRECISION",
          section: "Additional Requirements for Data Types - Duration",
          title: "Durations with precision beyond 0.01 seconds are accepted and may be truncated without rounding",
        },
      ],
      tags: ["v2.0.0", "statements", "additional-data-types", "duration"],
      capabilityFlags: ["duration", "validation"],
      legacyTrace: {
        suiteFile:
          "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.7-Additional-Requirements-for-Data-Types.js",
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
              id: "33333333-3333-4333-8333-000000005001",
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
              timestamp: "2026-05-23T13:23:21.000Z",
              result: {
                score: {
                  scaled: 0.6767676,
                  raw: 0.6767676,
                  min: -1,
                  max: 1,
                },
                success: true,
                completion: true,
                response: "proof result response",
                duration: "P1DT12H36M0.12567S",
                extensions: {
                  "https://example.test/xapi/results/extensions/proof": true,
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
        status: 200,
        expectedHeaders: [],
        expectedHeaderPatterns: [],
        jsonPathEquals: [],
        jsonPathNotEquals: [],
        textContains: [],
        notes: ["proof-slice additional data types duration precision acceptance"],
      },
    },
    {
      type: "case",
      id: "v2.statements.additional-data-types.duration-high-precision-roundtrip",
      title: "The Statements resource returns stored high-precision Durations without rounding them upward",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "LEGACY-DATATYPES-DURATION-PRECISION",
          section: "Additional Requirements for Data Types - Duration",
          title: "Durations with precision beyond 0.01 seconds are accepted and may be truncated without rounding",
        },
      ],
      tags: ["v2.0.0", "statements", "additional-data-types", "duration", "retrieval"],
      capabilityFlags: ["duration", "retrieval"],
      legacyTrace: {
        suiteFile:
          "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.7-Additional-Requirements-for-Data-Types.js",
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
                id: "33333333-3333-4333-8333-000000005001",
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
                timestamp: "2026-05-23T13:23:21.000Z",
                result: {
                  score: {
                    scaled: 0.6767676,
                    raw: 0.6767676,
                    min: -1,
                    max: 1,
                  },
                  success: true,
                  completion: true,
                  response: "proof result response",
                  duration: "P1DT12H36M0.12567S",
                  extensions: {
                    "https://example.test/xapi/results/extensions/proof": true,
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
          {
            method: "GET",
            endpoint: "statements",
            authMode: "basic",
            headers: {
              "X-Experience-API-Version": "2.0.0",
            },
            query: {
              statementId: "33333333-3333-4333-8333-000000005001",
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
                path: ["result", "duration"],
                equals: "P1DT12H36M0.12567S",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: ["proof-slice additional data types duration precision roundtrip"],
      },
    },
    {
      type: "case",
      id: "v2.statements.additional-data-types.signed-duration-comparison-truncates-hundredths",
      title: "The Statements resource compares signed statement Durations only through the hundredths place",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "LEGACY-DATATYPES-DURATION-PRECISION",
          section: "Additional Requirements for Data Types - Duration",
          title: "Durations with precision beyond 0.01 seconds are accepted and may be truncated without rounding",
        },
      ],
      tags: ["v2.0.0", "statements", "additional-data-types", "duration", "signed"],
      capabilityFlags: ["duration", "signed"],
      legacyTrace: {
        suiteFile:
          "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.7-Additional-Requirements-for-Data-Types.js",
      },
      execution: {
        kind: "single-request",
        request: {
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
              '--mock-proof-statement-request\r\nContent-Type: application/json\r\n\r\n{"id":"33333333-3333-4333-8333-000000005002","actor":{"objectType":"Agent","mbox":"mailto:learner@example.test","name":"Learner Example"},"verb":{"id":"https://example.test/xapi/verbs/completed","display":{"en-US":"completed"}},"object":{"objectType":"Activity","id":"https://example.test/xapi/activities/first-proof-slice"},"timestamp":"2026-05-23T13:23:22.000Z","result":{"score":{"scaled":0.6767676,"raw":0.6767676,"min":-1,"max":1},"success":true,"completion":true,"response":"proof result response","duration":"P1DT12H36M0.1237S","extensions":{"https://example.test/xapi/results/extensions/proof":true}},"attachments":[{"usageType":"http://adlnet.gov/expapi/attachments/signature","display":{"en-US":"Signed by the Proof Slice"},"description":{"en-US":"Signed by the Proof Slice"},"contentType":"application/octet-stream","length":860,"sha2":"fc6c12297c5257d73f620c6fd64654355456333af4ad33fb12ea31cd6d9cc1f9"}]}\r\n--mock-proof-statement-request\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nX-Experience-API-Hash: fc6c12297c5257d73f620c6fd64654355456333af4ad33fb12ea31cd6d9cc1f9\r\n\r\neyJhbGciOiJSUzI1NiJ9.eyJpZCI6IjMzMzMzMzMzLTMzMzMtNDMzMy04MzMzLTAwMDAwMDAwNTAwMiIsImFjdG9yIjp7Im9iamVjdFR5cGUiOiJBZ2VudCIsIm1ib3giOiJtYWlsdG86bGVhcm5lckBleGFtcGxlLnRlc3QiLCJuYW1lIjoiTGVhcm5lciBFeGFtcGxlIn0sInZlcmIiOnsiaWQiOiJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3ZlcmJzL2NvbXBsZXRlZCIsImRpc3BsYXkiOnsiZW4tVVMiOiJjb21wbGV0ZWQifX0sIm9iamVjdCI6eyJvYmplY3RUeXBlIjoiQWN0aXZpdHkiLCJpZCI6Imh0dHBzOi8vZXhhbXBsZS50ZXN0L3hhcGkvYWN0aXZpdGllcy9maXJzdC1wcm9vZi1zbGljZSJ9LCJ0aW1lc3RhbXAiOiIyMDI2LTA1LTIzVDEzOjIzOjIyLjAwMFoiLCJyZXN1bHQiOnsic2NvcmUiOnsic2NhbGVkIjowLjY3Njc2NzYsInJhdyI6MC42NzY3Njc2LCJtaW4iOi0xLCJtYXgiOjF9LCJzdWNjZXNzIjp0cnVlLCJjb21wbGV0aW9uIjp0cnVlLCJyZXNwb25zZSI6InByb29mIHJlc3VsdCByZXNwb25zZSIsImR1cmF0aW9uIjoiUDFEVDEySDM2TTAuMTJTIiwiZXh0ZW5zaW9ucyI6eyJodHRwczovL2V4YW1wbGUudGVzdC94YXBpL3Jlc3VsdHMvZXh0ZW5zaW9ucy9wcm9vZiI6dHJ1ZX19fQ.cHJvb2Ytc2lnbmF0dXJlOlJTMjU2\r\n--mock-proof-statement-request--\r\n',
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
        notes: ["proof-slice additional data types signed duration comparison"],
      },
    },
    {
      type: "case",
      id: "v2.statements.additional-data-types.timestamp-utc-roundtrip",
      title: "The Statements resource returns timestamps in UTC-equivalent form when recalled",
      specVersion: "2.0.0",
      requirementRefs: [
        {
          id: "LEGACY-DATATYPES-TIMESTAMP-UTC",
          section: "Additional Requirements for Data Types - Timestamps",
          title: "Retrieved timestamps preserve UTC equivalence",
        },
      ],
      tags: ["v2.0.0", "statements", "additional-data-types", "timestamp"],
      capabilityFlags: ["timestamp", "retrieval"],
      legacyTrace: {
        suiteFile:
          "/home/anton/dev/tmp/lrs-conformance-test-suite-orig/test/v2_0/4.2.7-Additional-Requirements-for-Data-Types.js",
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
                id: "33333333-3333-4333-8333-000000005003",
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
                timestamp: "2023-05-04T12:00:00-05:00",
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
              statementId: "33333333-3333-4333-8333-000000005003",
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
                equals: "2023-05-04T17:00:00.000Z",
              },
            ],
            jsonPathNotEquals: [],
            textContains: [],
            expectedHeaderDateAfterStep: [],
          },
        ],
        notes: ["proof-slice additional data types timestamp utc equivalence"],
      },
    },
  ],
} as unknown as SuiteDefinition;
