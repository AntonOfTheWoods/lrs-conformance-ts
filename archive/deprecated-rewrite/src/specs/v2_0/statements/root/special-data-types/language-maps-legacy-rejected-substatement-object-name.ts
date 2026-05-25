import type { CaseDefinition } from "../../../../../domain/contracts";
export const v2StatementsLanguageMapsLegacyRejectedSubstatementObjectNameCase = {
  type: "case",
  id: "v2.statements.language-maps.legacy-rejected.substatement-object-name",
  title: "A Statement rejects an invalid language map in a substatement activity name",
  specVersion: "2.0.0",
  requirementRefs: [
    {
      id: "XAPI-00121",
      section: "Data 4.2.s1",
      title: "A Language Map follows RFC 5646",
    },
  ],
  tags: ["v2.0.0", "statements", "language-maps", "legacy", "rejection"],
  capabilityFlags: [],
  legacyTrace: {
    suiteFile: "test/v2_0/E.Data4.0-SpecialDataTypesAndRules.js",
    configFile: "test/v2_0/configs/languages.js",
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
              objectType: "Activity",
              id: "https://example.test/xapi/activities/substatement",
              definition: {
                name: {
                  "zh-z-aaa-z-bbb-c-ccc": "Invalid language tag",
                },
              },
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
  },
  assertion: {
    kind: "single-request",
    status: 400,
    expectedHeaders: [],
    expectedHeaderPatterns: [],
    jsonPathEquals: [],
    jsonPathNotEquals: [],
    textContains: [],
    notes: ["Statement Special Data Types", "legacy note: XAPI-00121 upstream comment - in languages.js"],
  },
} as unknown as CaseDefinition;
