import { describe, expect, test } from "bun:test";

import { buildLegacyStatementHeaders, postLegacyStatement } from "../src/describe-runtime/http";
import { registerLegacyStatementConfigSuite } from "../src/describe-runtime/statement-suite";

function requestTargetToString(input: string | URL | Request): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

const capturedRequests: Array<{
  url: string;
  authorization: string | null;
  version: string | null;
  body: unknown;
}> = [];

registerLegacyStatementConfigSuite({
  baseUrl: "http://example.test/xapi",
  version: "v2_0",
  basicAuth: {
    username: "janedoe",
    password: "supersecret",
  },
  fileName: "formatting.js",
  groupFilter: (group) => group.name.includes('"actor" property'),
  caseFilter: (testCase) => testCase.name === 'statement "actor" missing',
  fetchImpl: async (input, init) => {
    const url = requestTargetToString(input);
    const headers = new Headers(init?.headers);
    const bodyText = typeof init?.body === "string" ? init.body : "";

    capturedRequests.push({
      url,
      authorization: headers.get("authorization"),
      version: headers.get("x-experience-api-version"),
      body: bodyText.length > 0 ? JSON.parse(bodyText) : null,
    });

    return new Response("{}", {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  },
});

describe("describe-runtime statement executor", () => {
  test("builds legacy statement headers with xAPI version and basic auth", () => {
    const headers = buildLegacyStatementHeaders({
      baseUrl: "http://example.test/xapi",
      version: "v1_0_3",
      basicAuth: {
        username: "janedoe",
        password: "supersecret",
      },
    });

    expect(headers.get("x-experience-api-version")).toBe("1.0.3");
    expect(headers.get("authorization")).toBe("Basic amFuZWRvZTpzdXBlcnNlY3JldA==");
    expect(headers.get("content-type")).toBe("application/json");
  });

  test("posts statement JSON to the statements endpoint", async () => {
    const result = await postLegacyStatement(
      {
        baseUrl: "http://example.test/xapi",
        version: "v2_0",
        fetchImpl: async (input, init) => {
          expect(typeof init?.body).toBe("string");
          expect(requestTargetToString(input)).toBe("http://example.test/xapi/statements");

          return new Response('{"ok":true}', {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          });
        },
      },
      { actor: { mbox: "mailto:xapi@adlnet.gov" } },
    );

    expect(result.response.status).toBe(200);
    expect(result.bodyText).toBe('{"ok":true}');
  });

  test("records one executed upstream formatting case", () => {
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0]?.url).toBe("http://example.test/xapi/statements");
    expect(capturedRequests[0]?.version).toBe("2.0.0");
    expect(capturedRequests[0]?.authorization).toBe("Basic amFuZWRvZTpzdXBlcnNlY3JldA==");
    expect(capturedRequests[0]?.body).toEqual({
      verb: {
        id: "http://adlnet.gov/expapi/verbs/attended",
        display: {
          "en-GB": "attended",
          "en-US": "attended",
        },
      },
      object: {
        objectType: "Activity",
        id: "http://www.example.com/meetings/occurances/34534",
      },
    });
  });
});
