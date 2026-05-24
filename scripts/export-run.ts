import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { runRegistryVersion } from "../src/execution/runner";
import { createV103ProofSliceRegistry } from "../src/specs/v1_0_3/proof-slice";
import { createProofSliceRegistry } from "../src/specs/v2_0/proof-slice";

type SupportedSpecVersion = "2.0.0" | "1.0.3";

interface ExportRunConfig {
  baseUrl: string;
  version: SupportedSpecVersion;
  outputPath: string;
  username?: string;
  password?: string;
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function usage(): string {
  return [
    "Usage:",
    "  bun run export:run -- --base-url <url> [--version 2.0.0|1.0.3] [--out <path>] [--username <user> --password <pass>]",
    "",
    "Examples:",
    "  bun run export:run -- --base-url http://localhost:8080/xapi --username janedoe --password supersecret --out tmp/agents/lrsql-run.json",
    "  bun run export:run -- --base-url http://localhost:8080/xapi --version 1.0.3 --out tmp/agents/lrsql-v103-run.json",
  ].join("\n");
}

function parseConfig(args: string[]): ExportRunConfig | undefined {
  const baseUrl = getFlagValue(args, "--base-url");
  const versionFlag = getFlagValue(args, "--version") ?? "2.0.0";
  const outputPath = getFlagValue(args, "--out") ?? "tmp/agents/live-run.json";
  const username = getFlagValue(args, "--username");
  const password = getFlagValue(args, "--password");

  if (!baseUrl) {
    return undefined;
  }

  if (versionFlag !== "2.0.0" && versionFlag !== "1.0.3") {
    throw new Error(`Unsupported --version value: ${versionFlag}`);
  }

  if ((username && !password) || (!username && password)) {
    throw new Error("Provide both --username and --password together.");
  }

  return {
    baseUrl,
    version: versionFlag,
    outputPath,
    username,
    password,
  };
}

function buildRegistry(version: SupportedSpecVersion) {
  if (version === "2.0.0") {
    return createProofSliceRegistry();
  }

  return createV103ProofSliceRegistry();
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const config = parseConfig(args);

  if (!config) {
    console.error(usage());
    return 1;
  }

  const registry = buildRegistry(config.version);
  const run = await runRegistryVersion(registry, config.version, {
    baseUrl: config.baseUrl,
    auth:
      config.username && config.password
        ? {
            basic: {
              username: config.username,
              password: config.password,
            },
          }
        : undefined,
  });

  const absoluteOutputPath = resolve(config.outputPath);
  await mkdir(dirname(absoluteOutputPath), { recursive: true });

  const payload = {
    generatedAt: new Date().toISOString(),
    target: {
      baseUrl: config.baseUrl,
      version: config.version,
      authMode: config.username && config.password ? "basic" : "default",
    },
    run,
  };

  await writeFile(absoluteOutputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath: absoluteOutputPath,
        version: run.version,
        status: run.status,
        events: run.events.length,
      },
      null,
      2,
    ),
  );

  return run.status === "failed" ? 1 : 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
