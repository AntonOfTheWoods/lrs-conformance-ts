import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type LegacyVersionFolder = "v1_0_3" | "v2_0";

let cachedUpstreamRoot: string | null = null;

function isUpstreamSuiteRoot(candidateRoot: string): boolean {
  return (
    existsSync(join(candidateRoot, "batteries.js")) &&
    existsSync(join(candidateRoot, "test", "v2_0")) &&
    existsSync(join(candidateRoot, "test", "v1_0_3"))
  );
}

function discoverSiblingUpstreamRoot(projectRoot: string): string | null {
  const parentDir = resolve(projectRoot, "..");

  for (const entry of readdirSync(parentDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const candidate = join(parentDir, entry.name);
    if (isUpstreamSuiteRoot(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function resolveUpstreamRoot(): string {
  if (cachedUpstreamRoot) {
    return cachedUpstreamRoot;
  }

  const envRoot = process.env.LRS_UPSTREAM_ROOT;
  if (envRoot) {
    const resolvedEnvRoot = resolve(envRoot);
    if (!isUpstreamSuiteRoot(resolvedEnvRoot)) {
      throw new Error(`LRS_UPSTREAM_ROOT does not look like an upstream suite root: ${resolvedEnvRoot}`);
    }

    cachedUpstreamRoot = resolvedEnvRoot;
    return cachedUpstreamRoot;
  }

  const sourceDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = resolve(sourceDir, "..", "..");
  const discovered = discoverSiblingUpstreamRoot(projectRoot);

  if (!discovered) {
    throw new Error(
      "Unable to resolve upstream suite root. Set LRS_UPSTREAM_ROOT to the upstream test-suite directory.",
    );
  }

  cachedUpstreamRoot = discovered;
  return cachedUpstreamRoot;
}

export function resolveLegacyVersionRoot(version: LegacyVersionFolder): string {
  return join(resolveUpstreamRoot(), "test", version);
}

export function resolveLegacyConfigRoot(version: LegacyVersionFolder): string {
  return join(resolveLegacyVersionRoot(version), "configs");
}

export function resolveLegacyTemplateRoot(version: LegacyVersionFolder): string {
  return join(resolveLegacyVersionRoot(version), "templates");
}
