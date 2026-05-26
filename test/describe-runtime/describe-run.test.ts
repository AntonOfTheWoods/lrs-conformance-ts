import { describe, expect, test } from "bun:test";

import { ensureCompatibleLocalLrsqlMode, isLocalLrsqlEndpoint } from "../../src/describe-runtime/describe-run.ts";
import type { NormalizedRunnerOptions } from "../../src/describe-runtime/options.ts";

function createNormalizedOptions(
  xapiVersion: "1.0.3" | "2.0.0",
  endpoint = "http://localhost:8080/xapi",
): NormalizedRunnerOptions {
  return {
    authPass: "supersecret",
    authUser: "janedoe",
    authorization_path: undefined,
    bail: false,
    basicAuth: true,
    consumer_key: undefined,
    consumer_secret: undefined,
    directory: [xapiVersion === "1.0.3" ? "v1_0_3" : "v2_0"],
    endpoint,
    errors: false,
    grep: undefined,
    oAuth1: false,
    optional: undefined,
    request_token_path: undefined,
    token: undefined,
    token_secret: undefined,
    verifier: undefined,
    xapiVersion,
    auth_token_path: undefined,
  };
}

describe("describe run wrapper", () => {
  test("detects the local LRSQL endpoint shape", () => {
    expect(isLocalLrsqlEndpoint("http://localhost:8080/xapi")).toBe(true);
    expect(isLocalLrsqlEndpoint("http://127.0.0.1:8080/xapi/")).toBe(true);
    expect(isLocalLrsqlEndpoint("http://example.com/xapi")).toBe(false);
    expect(isLocalLrsqlEndpoint("http://localhost:8080/other")).toBe(false);
  });

  test("resets local LRSQL into v2-compatible mode when the version probe is invalid", async () => {
    const commands: Array<{ command: string[]; env: Record<string, string> }> = [];
    let probeCount = 0;

    await ensureCompatibleLocalLrsqlMode(createNormalizedOptions("2.0.0"), {
      commandRunner: async (command, env) => {
        commands.push({ command, env });
      },
      fetchImpl: async () => {
        probeCount += 1;
        if (probeCount === 1) {
          return new Response('{"error":{"message":"X-Experience-API-Version header invalid!"}}', { status: 400 });
        }

        return new Response('{"version":["2.0.0","1.0.3"]}', { status: 200 });
      },
      logger: {
        error() {},
        log() {},
      },
    });

    expect(commands.map(({ command }) => command.join(" "))).toEqual([
      "bash ./scripts/lrsql-reset-best-effort.sh",
      "bash ./scripts/lrsql-wait.sh",
      "bash ./scripts/lrsql-auth-check.sh",
    ]);
    expect(commands.every(({ env }) => env.LRSQL_SUPPORTED_VERSIONS === "1.0.3,2.0.0")).toBe(true);
    expect(commands.every(({ env }) => env.LRSQL_ENABLE_STRICT_VERSION === "false")).toBe(true);
    expect(commands.every(({ env }) => env.XAPI_VERSION === "2.0.0")).toBe(true);
  });

  test("resets local LRSQL into strict v1 mode when requested", async () => {
    const commands: Array<{ command: string[]; env: Record<string, string> }> = [];
    let probeCount = 0;

    await ensureCompatibleLocalLrsqlMode(createNormalizedOptions("1.0.3"), {
      commandRunner: async (command, env) => {
        commands.push({ command, env });
      },
      fetchImpl: async () => {
        probeCount += 1;
        if (probeCount === 1) {
          return new Response('{"error":{"message":"X-Experience-API-Version header invalid!"}}', { status: 400 });
        }

        return new Response('{"version":["1.0.3"]}', { status: 200 });
      },
      logger: {
        error() {},
        log() {},
      },
    });

    expect(commands.every(({ env }) => env.LRSQL_SUPPORTED_VERSIONS === "1.0.3")).toBe(true);
    expect(commands.every(({ env }) => env.LRSQL_ENABLE_STRICT_VERSION === "true")).toBe(true);
    expect(commands.every(({ env }) => env.XAPI_VERSION === "1.0.3")).toBe(true);
  });

  test("does not manage non-local endpoints", async () => {
    let ranCommand = false;

    await ensureCompatibleLocalLrsqlMode(createNormalizedOptions("2.0.0", "http://example.com/xapi"), {
      commandRunner: async () => {
        ranCommand = true;
      },
      fetchImpl: async () => new Response("ignored", { status: 400 }),
      logger: {
        error() {},
        log() {},
      },
    });

    expect(ranCommand).toBe(false);
  });
});
