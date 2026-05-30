import { readFile } from "node:fs/promises";

interface RunShape {
  summary?: {
    total?: number;
    passed?: number;
    failed?: number;
    version?: string;
  };
  run?: {
    root?: unknown;
    log?: unknown;
    events?: unknown[];
    status?: string;
    version?: string;
  };
  root?: unknown;
  log?: unknown;
}

type TreeStatusCounts = Record<string, number>;

interface TreeStats {
  nodes: number;
  leaves: number;
  status: TreeStatusCounts;
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
    "  bun ./rewrite/scripts/diagnose-scope.ts [--upstream <path>] [--live <path>]",
    "",
    "Defaults:",
    "  --upstream tmp/validation/oracles/upstream-baselines/upstream-run-<version>.json",
    "  --live tmp/validation/oracles/candidate-baselines/full-lrsql-candidate-<version>.json",
  ].join("\n");
}

async function loadJson(path: string): Promise<unknown> {
  const text = await readFile(path, "utf8");
  return JSON.parse(text);
}

function getRoot(value: unknown): unknown {
  const v = value as RunShape;
  if (v?.run && typeof v.run === "object") {
    return v.run.root ?? v.run.log ?? v.run;
  }

  return v?.root ?? v?.log ?? v;
}

function getChildren(node: unknown): unknown[] {
  if (typeof node !== "object" || node === null) {
    return [];
  }

  const candidate = node as { children?: unknown[]; tests?: unknown[] };
  if (Array.isArray(candidate.children)) {
    return candidate.children;
  }

  if (Array.isArray(candidate.tests)) {
    return candidate.tests;
  }

  return [];
}

function getNodeStatus(node: unknown): string {
  if (typeof node !== "object" || node === null) {
    return "(none)";
  }

  const status = (node as { status?: unknown }).status;
  return typeof status === "string" && status.length > 0 ? status : "(none)";
}

function treeStats(root: unknown): TreeStats {
  const walk = (node: unknown): TreeStats => {
    if (typeof node !== "object" || node === null) {
      return { nodes: 0, leaves: 0, status: {} };
    }

    const children = getChildren(node);
    const status = getNodeStatus(node);

    let nodes = 1;
    let leaves = children.length === 0 ? 1 : 0;
    const statusCounts: TreeStatusCounts = {
      [status]: 1,
    };

    for (const child of children) {
      const childStats = walk(child);
      nodes += childStats.nodes;
      leaves += childStats.leaves;

      for (const [name, count] of Object.entries(childStats.status)) {
        statusCounts[name] = (statusCounts[name] ?? 0) + count;
      }
    }

    return { nodes, leaves, status: statusCounts };
  };

  return walk(root);
}

function topLevelSuites(root: unknown): Array<{ title: string; status: string; childCount: number }> {
  return getChildren(root).map((child) => {
    const childNode = child as { title?: unknown; name?: unknown };
    const title =
      typeof childNode.title === "string"
        ? childNode.title
        : typeof childNode.name === "string"
          ? childNode.name
          : "(untitled)";

    return {
      title,
      status: getNodeStatus(child),
      childCount: getChildren(child).length,
    };
  });
}

function pct(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }

  return Math.round((numerator / denominator) * 10000) / 100;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return 0;
  }

  const version = process.env["XAPI_VERSION"] ?? "2.0.0";
  const upstreamPath =
    getFlagValue(args, "--upstream") ?? `tmp/validation/oracles/upstream-baselines/upstream-run-${version}.json`;
  const livePath =
    getFlagValue(args, "--live") ?? `tmp/validation/oracles/candidate-baselines/full-lrsql-candidate-${version}.json`;

  const upstreamPayload = (await loadJson(upstreamPath)) as RunShape;
  const livePayload = (await loadJson(livePath)) as RunShape;

  const upstreamRoot = getRoot(upstreamPayload);
  const liveRoot = getRoot(livePayload);

  const upstreamStats = treeStats(upstreamRoot);
  const liveStats = treeStats(liveRoot);

  const upstreamTotal = upstreamPayload.summary?.total ?? null;
  const upstreamPassed = upstreamPayload.summary?.passed ?? null;
  const upstreamFailed = upstreamPayload.summary?.failed ?? null;
  const upstreamExecuted =
    typeof upstreamPassed === "number" && typeof upstreamFailed === "number" ? upstreamPassed + upstreamFailed : null;
  const upstreamPendingEstimate =
    typeof upstreamTotal === "number" && typeof upstreamExecuted === "number" ? upstreamTotal - upstreamExecuted : null;

  const report = {
    upstream: {
      path: upstreamPath,
      summary: {
        total: upstreamTotal,
        passed: upstreamPassed,
        failed: upstreamFailed,
        executed: upstreamExecuted,
        pendingEstimate: upstreamPendingEstimate,
        executedPctOfTotal:
          typeof upstreamExecuted === "number" && typeof upstreamTotal === "number"
            ? pct(upstreamExecuted, upstreamTotal)
            : null,
      },
      tree: {
        nodes: upstreamStats.nodes,
        leaves: upstreamStats.leaves,
        leavesPctOfTotal: typeof upstreamTotal === "number" ? pct(upstreamStats.leaves, upstreamTotal) : null,
        status: upstreamStats.status,
      },
      topLevel: topLevelSuites(upstreamRoot),
    },
    live: {
      path: livePath,
      run: {
        status: livePayload.run?.status ?? null,
        version: livePayload.run?.version ?? null,
        events: Array.isArray(livePayload.run?.events) ? livePayload.run?.events.length : null,
      },
      tree: {
        nodes: liveStats.nodes,
        leaves: liveStats.leaves,
        status: liveStats.status,
      },
      topLevel: topLevelSuites(liveRoot),
    },
    parityReadiness: {
      sameScaleByLeaves: Math.min(upstreamStats.leaves, liveStats.leaves),
      leafRatioLiveToUpstream:
        upstreamStats.leaves > 0 ? Math.round((liveStats.leaves / upstreamStats.leaves) * 100) / 100 : null,
      likelyPartialUpstreamExecution: typeof upstreamPendingEstimate === "number" ? upstreamPendingEstimate > 0 : null,
    },
  };

  console.log(JSON.stringify(report, null, 2));

  if (typeof upstreamPendingEstimate === "number" && upstreamPendingEstimate > 0) {
    console.error(
      `WARNING: upstream summary reports ${upstreamPendingEstimate} tests not represented as pass/fail. Comparison against full rewrite tree will be misleading.`,
    );
    return 2;
  }

  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
