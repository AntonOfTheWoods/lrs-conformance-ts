import { describe, expect, test } from "bun:test";

import { RunnerOptionsError, normalizeRunnerOptions } from "../../src/describe-runtime/options.ts";

describe("runner option normalization", () => {
  test("defaults to xAPI 2.0.0 and the v2_0 directory", () => {
    expect(
      normalizeRunnerOptions({
        endpoint: "http://localhost:8000/xapi",
      }),
    ).toEqual({
      xapiVersion: "2.0.0",
      directory: ["v2_0"],
      endpoint: "http://localhost:8000/xapi",
      grep: undefined,
      optional: undefined,
      basicAuth: false,
      authUser: undefined,
      authPass: undefined,
      oAuth1: false,
      consumer_key: undefined,
      consumer_secret: undefined,
      token: undefined,
      token_secret: undefined,
      verifier: undefined,
      bail: false,
      errors: false,
    });
  });

  test("maps version aliases onto the expected versioned directory", () => {
    expect(
      normalizeRunnerOptions({
        endpoint: "http://localhost:8000/xapi",
        xapiVersion: "2.0",
      }),
    ).toMatchObject({
      xapiVersion: "2.0.0",
      directory: ["v2_0"],
    });
  });

  test("rejects specifying both xAPI version and directory", () => {
    expect(() =>
      normalizeRunnerOptions({
        endpoint: "http://localhost:8000/xapi",
        xapiVersion: "1.0.3",
        directory: ["v1_0_3"],
      }),
    ).toThrow(new RunnerOptionsError("Cannot specify both an xAPI Version and a Directory."));
  });

  test("rejects directories that span multiple xAPI versions", () => {
    expect(() =>
      normalizeRunnerOptions({
        endpoint: "http://localhost:8000/xapi",
        directory: ["v1_0_3", "v2_0"],
      }),
    ).toThrow(
      new RunnerOptionsError(
        "Multiple directories specified which refer to different versions of the xAPI spec: 2.0.0 vs. 1.0.3",
      ),
    );
  });

  test("prepends optional suites ahead of the resolved version directory", () => {
    expect(
      normalizeRunnerOptions({
        endpoint: "http://localhost:8000/xapi",
        xapiVersion: "1.0.3",
        optional: ["Multiplicity", "Parameters", "Untested"],
      }),
    ).toMatchObject({
      xapiVersion: "1.0.3",
      directory: ["Multiplicity", "Parameters", "Untested", "v1_0_3"],
      optional: ["Multiplicity", "Parameters", "Untested"],
    });
  });

  test("requires an endpoint URI", () => {
    expect(() =>
      normalizeRunnerOptions({
        endpoint: "/xapi",
      }),
    ).toThrow(new RunnerOptionsError("Endpoint must be a URI: /xapi"));
  });
});
