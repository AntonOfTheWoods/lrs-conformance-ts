import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { CaseDefinition, RegistryDefinition, RegistryNode, SuiteDefinition } from "../src/domain/contracts";
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
  mirrorUpstreamArtifactPath?: string;
  allowMirrorGaps: boolean;
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
    "  bun run validate:export:run -- --base-url <url> [--version 2.0.0|1.0.3] [--out <path>] [--username <user> --password <pass>] [--mirror-upstream-artifact <path>] [--allow-mirror-gaps]",
    "",
    "Examples:",
    "  bun run validate:export:run -- --base-url http://localhost:8080/xapi --username janedoe --password supersecret --out tmp/agents/lrsql-run.json",
    "  bun run validate:export:run -- --base-url http://localhost:8080/xapi --version 1.0.3 --out tmp/agents/lrsql-v103-run.json",
    "  bun run validate:export:run -- --base-url http://localhost:8080/xapi --version 2.0.0 --mirror-upstream-artifact tmp/agents/upstream-run-2.0.0.json",
  ].join("\n");
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

function parseConfig(args: string[]): ExportRunConfig | undefined {
  const baseUrl = getFlagValue(args, "--base-url");
  const versionFlag = getFlagValue(args, "--version") ?? "2.0.0";
  const outputPath = getFlagValue(args, "--out") ?? "tmp/agents/validate-run.json";
  const username = getFlagValue(args, "--username");
  const password = getFlagValue(args, "--password");
  const mirrorUpstreamArtifactPath = getFlagValue(args, "--mirror-upstream-artifact");
  const allowMirrorGaps = hasFlag(args, "--allow-mirror-gaps");

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
    mirrorUpstreamArtifactPath,
    allowMirrorGaps,
  };
}

function buildRegistry(version: SupportedSpecVersion) {
  if (version === "2.0.0") {
    return createProofSliceRegistry();
  }

  return createV103ProofSliceRegistry();
}

function collectXapiRequirementIdsFromCase(caseNode: CaseDefinition): string[] {
  return caseNode.requirementRefs
    .map((ref) => ref.id)
    .filter((id) => /^XAPI-\d{5}$/.test(id));
}

function collectRegistryRequirementIds(nodes: RegistryNode[]): Set<string> {
  const ids = new Set<string>();

  const visit = (node: RegistryNode): void => {
    if (node.type === "case") {
      for (const requirementId of collectXapiRequirementIdsFromCase(node)) {
        ids.add(requirementId);
      }
      return;
    }

    for (const child of node.children) {
      visit(child);
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  return ids;
}

function countCases(nodes: RegistryNode[]): number {
  let total = 0;

  const visit = (node: RegistryNode): void => {
    if (node.type === "case") {
      total += 1;
      return;
    }

    for (const child of node.children) {
      visit(child);
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  return total;
}

function filterNodeByRequirementIds(node: RegistryNode, upstreamRequirementIds: Set<string>): RegistryNode | null {
  if (node.type === "case") {
    const hasOverlap = collectXapiRequirementIdsFromCase(node).some((id) => upstreamRequirementIds.has(id));
    return hasOverlap ? node : null;
  }

  const filteredChildren = node.children
    .map((child) => filterNodeByRequirementIds(child, upstreamRequirementIds))
    .filter((child): child is RegistryNode => child !== null);

  if (filteredChildren.length === 0) {
    return null;
  }

  return {
    ...(node as SuiteDefinition),
    children: filteredChildren,
  };
}

function filterRegistryByRequirementIds(
  registry: RegistryDefinition,
  version: SupportedSpecVersion,
  upstreamRequirementIds: Set<string>,
): { registry: RegistryDefinition; beforeCaseCount: number; afterCaseCount: number } {
  const targetSuites = registry.versions[version];
  const filteredTargetSuites = targetSuites
    .map((suite) => filterNodeByRequirementIds(suite, upstreamRequirementIds))
    .filter((suite): suite is SuiteDefinition => suite !== null && suite.type === "suite");

  const nextRegistry: RegistryDefinition = {
    versions: {
      ...registry.versions,
      [version]: filteredTargetSuites,
    },
  };

  return {
    registry: nextRegistry,
    beforeCaseCount: countCases(targetSuites),
    afterCaseCount: countCases(filteredTargetSuites),
  };
}

async function collectUpstreamRequirementIds(upstreamArtifactPath: string): Promise<Set<string>> {
  const text = await readFile(resolve(upstreamArtifactPath), "utf8");
  const ids = text.match(/XAPI-\d{5}/g) ?? [];
  return new Set(ids);
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const config = parseConfig(args);

  if (!config) {
    console.error(usage());
    return 1;
  }

  const initialRegistry = buildRegistry(config.version);
  let effectiveRegistry = initialRegistry;
  let mirrorSummary:
    | {
        upstreamArtifactPath: string;
        upstreamRequirementIdCount: number;
        registryRequirementIdCount: number;
        beforeCaseCount: number;
        afterCaseCount: number;
        missingRequirementIds: string[];
      }
    | undefined;

  if (config.mirrorUpstreamArtifactPath) {
    const upstreamRequirementIds = await collectUpstreamRequirementIds(config.mirrorUpstreamArtifactPath);
    const targetSuites = initialRegistry.versions[config.version];
    const registryRequirementIds = collectRegistryRequirementIds(targetSuites);
    const missingRequirementIds = [...upstreamRequirementIds].filter((id) => !registryRequirementIds.has(id)).sort();
    const filtered = filterRegistryByRequirementIds(initialRegistry, config.version, upstreamRequirementIds);

    mirrorSummary = {
      upstreamArtifactPath: resolve(config.mirrorUpstreamArtifactPath),
      upstreamRequirementIdCount: upstreamRequirementIds.size,
      registryRequirementIdCount: registryRequirementIds.size,
      beforeCaseCount: filtered.beforeCaseCount,
      afterCaseCount: filtered.afterCaseCount,
      missingRequirementIds,
    };

    if (missingRequirementIds.length > 0 && !config.allowMirrorGaps) {
      throw new Error(
        [
          "Mirror mode failed: upstream requirement IDs are missing from rewrite registry.",
          JSON.stringify(
            {
              upstreamArtifactPath: mirrorSummary.upstreamArtifactPath,
              missingRequirementIdCount: missingRequirementIds.length,
              missingRequirementIds,
            },
            null,
            2,
          ),
          "Use --allow-mirror-gaps to run intersection-only mode while parity work is in progress.",
        ].join("\n"),
      );
    }

    effectiveRegistry = filtered.registry;
  }

  const run = await runRegistryVersion(effectiveRegistry, config.version, {
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
    scope: mirrorSummary
      ? {
          mode: "mirror-upstream-requirement-ids",
          ...mirrorSummary,
          allowMirrorGaps: config.allowMirrorGaps,
        }
      : {
          mode: "full-registry",
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
