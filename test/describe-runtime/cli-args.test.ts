import { describe, expect, test } from "bun:test";

import { ConsoleRunnerArgsError, parseConsoleRunnerArgv } from "../../src/describe-runtime/cli-args.ts";

describe("console runner argv parsing", () => {
  test("parses the short-form upstream flags including directory CSV", () => {
    expect(
      parseConsoleRunnerArgv([
        "-e",
        "http://localhost:8000/xapi",
        "-x",
        "1.0.3",
        "-u",
        "admin",
        "-p",
        "password",
        "-a",
        "-g",
        "Actor",
        "-d",
        "v1_0_3,Parameters",
        "-b",
        "-z",
      ]),
    ).toEqual({
      endpoint: "http://localhost:8000/xapi",
      xapiVersion: "1.0.3",
      authUser: "admin",
      authPass: "password",
      basicAuth: true,
      grep: "Actor",
      directory: ["v1_0_3", "Parameters"],
      bail: true,
      errors: true,
    });
  });

  test("parses the long-form OAuth flags including inline assignment", () => {
    expect(
      parseConsoleRunnerArgv([
        "--endpoint=http://localhost:8000/xapi",
        "--oAuth1",
        "--consumer_key",
        "consumer-key",
        "--consumer_secret",
        "consumer-secret",
        "--request_token_path=/OAuth/initiate",
        "--auth_token_path",
        "/OAuth/token",
        "--authorization_path",
        "/accounts/login",
      ]),
    ).toEqual({
      endpoint: "http://localhost:8000/xapi",
      oAuth1: true,
      consumer_key: "consumer-key",
      consumer_secret: "consumer-secret",
      request_token_path: "/OAuth/initiate",
      auth_token_path: "/OAuth/token",
      authorization_path: "/accounts/login",
    });
  });

  test("parses stable migration unit keys as a CSV value", () => {
    expect(
      parseConsoleRunnerArgv([
        "--endpoint",
        "http://localhost:8000/xapi",
        "--unitKey",
        "test/v1_0_3/Data2.2-FormattingRequirements,test/v1_0_3/Data2.3-StatementLifecycle",
      ]),
    ).toEqual({
      endpoint: "http://localhost:8000/xapi",
      unitKeys: ["test/v1_0_3/Data2.2-FormattingRequirements", "test/v1_0_3/Data2.3-StatementLifecycle"],
    });
  });

  test("rejects unknown flags", () => {
    expect(() => parseConsoleRunnerArgv(["--wat"])).toThrow(
      new ConsoleRunnerArgsError("Unknown console runner flag: --wat"),
    );
  });

  test("rejects value flags when the value is missing", () => {
    expect(() => parseConsoleRunnerArgv(["--endpoint"])).toThrow(
      new ConsoleRunnerArgsError("Flag --endpoint requires a value."),
    );
  });
});
