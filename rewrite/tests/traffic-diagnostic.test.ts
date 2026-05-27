import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  buildRewriteArgs,
  buildUpstreamArgs,
  readEffectiveRunnerExitCode,
  resolveRunnerScope,
} from "../scripts/traffic-diagnostic.ts";

test("resolveRunnerScope only treats supported optional suites as separate matrix dimensions", () => {
  expect(resolveRunnerScope("Multiplicity,v1_0_3", undefined, "1.0.3")).toEqual({
    rewriteDirectory: "Multiplicity,v1_0_3",
    upstreamDirectory: "v1_0_3",
    upstreamOptional: "Multiplicity",
    grep: undefined,
  });

  expect(resolveRunnerScope("Parameters", "Actor", "2.0.0")).toEqual({
    rewriteDirectory: "Parameters,v2_0",
    upstreamDirectory: "v2_0",
    upstreamOptional: undefined,
    grep: "(?=.*(?:Actor))(?=.*(?:\\b(?:Parameters)\\b))",
  });
});

test("buildRewriteArgs omits explicit version when directory scope already implies it", () => {
  const args = buildRewriteArgs(
    {
      compareMode: "bag",
      directory: "Parameters,v1_0_3",
      grep: undefined,
      keepClone: false,
      outDir: "/tmp/unused",
      password: "supersecret",
      targetBaseUrl: "http://localhost:8080/xapi",
      username: "janedoe",
      version: "1.0.3",
    },
    "http://127.0.0.1:12345/capture/xapi",
    "1.0.3",
  );

  expect(args).toContain("--directory");
  expect(args).toContain("Parameters,v1_0_3");
  expect(args).not.toContain("--optional");
  expect(args).not.toContain("--xapiVersion");
});

test("buildUpstreamArgs passes only supported optional suites separately from the version directory", () => {
  const args = buildUpstreamArgs(
    {
      compareMode: "bag",
      directory: "Parameters,v1_0_3",
      grep: undefined,
      keepClone: false,
      outDir: "/tmp/unused",
      password: "supersecret",
      targetBaseUrl: "http://localhost:8080/xapi",
      username: "janedoe",
      version: "1.0.3",
    },
    "http://127.0.0.1:12345/capture/xapi",
    "1.0.3",
    "/tmp/unused/1.0.3",
  );

  expect(args).toContain("--directory");
  expect(args).toContain("v1_0_3");
  expect(args).not.toContain("--optional");
});

test("readEffectiveRunnerExitCode prefers the recorded upstream suite exit code", async () => {
  const tempDir = await mkdtemp(join(process.cwd(), "tmp/agents/traffic-exit-"));

  try {
    await writeFile(join(tempDir, "upstream-run.json"), `${JSON.stringify({ upstreamExitCode: 2 })}\n`, "utf8");

    expect(await readEffectiveRunnerExitCode("upstream", tempDir, 0)).toBe(2);
    expect(await readEffectiveRunnerExitCode("rewrite", tempDir, 0)).toBe(0);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
