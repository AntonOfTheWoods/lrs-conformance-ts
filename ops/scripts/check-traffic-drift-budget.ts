import { readFileSync } from "node:fs";
import { resolve, relative } from "node:path";

type CompareMismatch = {
  leftCount?: number;
  rightCount?: number;
  sample?: {
    execution?: {
      ownerLabel?: string;
      unitKey?: string;
    };
    method?: string;
    path?: string;
  };
};

type CompareReport = {
  leftCount?: number;
  rightCount?: number;
  matchedCount?: number;
  signatureMismatches?: CompareMismatch[];
  orderedMismatches?: CompareMismatch[];
};

type SuiteFailureParity = {
  runtimeOnlySuiteFailures?: unknown[];
  sharedSuiteFailures?: unknown[];
  upstreamOnlySuiteFailures?: unknown[];
};

type Allowlist = {
  ownerLabelContains?: string[];
};

const repoRoot = resolve(import.meta.dir, "..");

function getArg(flag: string): string | undefined {
  const args = process.argv.slice(2);
  const i = args.indexOf(flag);
  if (i === -1) {
    return undefined;
  }
  return args[i + 1];
}

function getNumberArg(flag: string, fallback: number): number {
  const raw = getArg(flag);
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rel(pathValue: string): string {
  return relative(repoRoot, pathValue).replaceAll("\\", "/");
}

function readJson<T>(pathValue: string): T {
  const text = readFileSync(pathValue, "utf8");
  return JSON.parse(text) as T;
}

function isAllowedOwner(ownerLabel: string, allowlist: Allowlist): boolean {
  const matchers = allowlist.ownerLabelContains ?? [];
  return matchers.some((needle) => ownerLabel.includes(needle));
}

function main(): void {
  const comparePathArg = getArg("--compare");
  if (!comparePathArg) {
    console.error(
      "Usage: bun ./ops/scripts/check-traffic-drift-budget.ts --compare <compare.json> [--suite-failures <suite-failure-parity.json>] [--allowlist <allowlist.json>] [--max-mismatches <n>]",
    );
    process.exitCode = 1;
    return;
  }

  const comparePath = resolve(repoRoot, comparePathArg);
  const suitePath = resolve(
    repoRoot,
    getArg("--suite-failures") ?? comparePath.replace(/compare\.json$/, "suite-failure-parity.json"),
  );
  const allowlistPath = resolve(repoRoot, getArg("--allowlist") ?? "tmp/agents/traffic-drift-allowlist.json");
  const maxMismatches = getNumberArg("--max-mismatches", 8);

  const compare = readJson<CompareReport>(comparePath);
  const suiteParity = readJson<SuiteFailureParity>(suitePath);
  const allowlist = readJson<Allowlist>(allowlistPath);

  const signatureMismatches = compare.signatureMismatches ?? [];
  const mismatchCount = signatureMismatches.reduce(
    (sum, m) => sum + Math.abs((m.leftCount ?? 0) - (m.rightCount ?? 0)),
    0,
  );

  const disallowed = signatureMismatches.filter((m) => {
    const owner = m.sample?.execution?.ownerLabel ?? "(unknown-owner)";
    return !isAllowedOwner(owner, allowlist);
  });

  const runtimeOnlyFailures = (suiteParity.runtimeOnlySuiteFailures ?? []).length;
  const sharedFailures = (suiteParity.sharedSuiteFailures ?? []).length;
  const upstreamOnlyFailures = (suiteParity.upstreamOnlySuiteFailures ?? []).length;

  const summary = {
    comparePath: rel(comparePath),
    suiteFailurePath: rel(suitePath),
    allowlistPath: rel(allowlistPath),
    counts: {
      leftCount: compare.leftCount ?? null,
      rightCount: compare.rightCount ?? null,
      matchedCount: compare.matchedCount ?? null,
      mismatchCount,
      signatureMismatchEntries: signatureMismatches.length,
      runtimeOnlySuiteFailures: runtimeOnlyFailures,
      sharedSuiteFailures: sharedFailures,
      upstreamOnlySuiteFailures: upstreamOnlyFailures,
    },
    maxMismatches,
    disallowedOwners: disallowed.map((m) => ({
      ownerLabel: m.sample?.execution?.ownerLabel ?? "(unknown-owner)",
      unitKey: m.sample?.execution?.unitKey ?? "(unknown-unit)",
      method: m.sample?.method ?? "(unknown-method)",
      path: m.sample?.path ?? "(unknown-path)",
      delta: Math.abs((m.leftCount ?? 0) - (m.rightCount ?? 0)),
    })),
  };

  console.log(JSON.stringify(summary, null, 2));

  if (runtimeOnlyFailures > 0 || sharedFailures > 0 || upstreamOnlyFailures > 0) {
    console.error("Traffic drift budget failed: suite failure parity is not clean.");
    process.exitCode = 1;
    return;
  }

  if (mismatchCount > maxMismatches) {
    console.error(`Traffic drift budget failed: mismatchCount ${mismatchCount} exceeded max ${maxMismatches}.`);
    process.exitCode = 1;
    return;
  }

  if (disallowed.length > 0) {
    console.error(`Traffic drift budget failed: found ${disallowed.length} disallowed mismatch owner(s).`);
    process.exitCode = 1;
    return;
  }

  console.log("Traffic drift budget passed.");
}

main();
