import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type NodeStatus = "passed" | "failed" | "cancelled" | "";

interface RunNode {
  title?: string;
  name?: string;
  status?: NodeStatus;
  error?: string;
  tests?: RunNode[];
}

interface UpstreamArtifact {
  summary?: {
    total?: number;
    passed?: number;
    failed?: number;
    started?: number;
    completed?: number;
    pending?: number;
    suitesStarted?: number;
    suitesCompleted?: number;
    hookFailures?: number;
    version?: string;
  };
  log?: RunNode;
}

interface RankedRow {
  key: string;
  count: number;
}

function rankMap(map: Map<string, number>, limit = 20): RankedRow[] {
  return [...map.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function firstLine(text: string | undefined): string {
  if (!text) {
    return "(no error message)";
  }
  return text.split("\n")[0] || "(no error message)";
}

async function main(): Promise<void> {
  const version = process.env.XAPI_VERSION ?? "2.0.0";
  const artifactPath = resolve(
    process.env.UPSTREAM_RUN_IN ?? `tmp/validation/oracles/upstream-baselines/upstream-run-${version}.json`,
  );
  const reportPath = resolve(
    process.env.UPSTREAM_RUN_REPORT_OUT ??
      `tmp/validation/oracles/upstream-baselines/upstream-blockers-report-${version}.json`,
  );

  const raw = await readFile(artifactPath, "utf8");
  const artifact = JSON.parse(raw) as UpstreamArtifact;
  const summary = artifact.summary ?? {};

  const failedByError = new Map<string, number>();
  const failedByTopSuite = new Map<string, number>();
  const failedByTitle = new Map<string, number>();
  const failedLeaves: Array<{ path: string; error: string }> = [];

  const root = artifact.log;
  const topLevelSuites = (root?.tests ?? []).map((suite) => suite.title || suite.name || "(untitled suite)");

  function walk(node: RunNode | undefined, path: string[] = []): void {
    if (!node) {
      return;
    }

    const here = (node.title || node.name || "").trim();
    const currentPath = here ? [...path, here] : path;

    if (node.status === "failed") {
      const top = currentPath[0] ?? "(root)";
      const title = here || "(untitled failed node)";
      const error = firstLine(node.error);

      failedByTopSuite.set(top, (failedByTopSuite.get(top) ?? 0) + 1);
      failedByTitle.set(title, (failedByTitle.get(title) ?? 0) + 1);
      failedByError.set(error, (failedByError.get(error) ?? 0) + 1);

      if (!node.tests || node.tests.length === 0) {
        failedLeaves.push({
          path: currentPath.join(" > "),
          error,
        });
      }
    }

    for (const child of node.tests ?? []) {
      walk(child, currentPath);
    }
  }

  walk(root, []);

  const total = summary.total ?? null;
  const started = summary.started ?? null;
  const completed = summary.completed ?? null;
  const pending = summary.pending ?? null;
  const notStarted = typeof total === "number" && typeof started === "number" ? Math.max(total - started, 0) : null;

  const report = {
    generatedAt: new Date().toISOString(),
    artifactPath,
    execution: {
      version: summary.version ?? null,
      total,
      started,
      completed,
      pending,
      passed: summary.passed ?? null,
      failed: summary.failed ?? null,
      hookFailures: summary.hookFailures ?? null,
      suitesStarted: summary.suitesStarted ?? null,
      suitesCompleted: summary.suitesCompleted ?? null,
      notStarted,
      completedAllStarted: started !== null && completed !== null ? started === completed : null,
    },
    discovery: {
      topLevelSuiteCount: topLevelSuites.length,
      topLevelSuites,
    },
    blockers: {
      topFailedSuites: rankMap(failedByTopSuite),
      topFailedTitles: rankMap(failedByTitle),
      topFailureErrors: rankMap(failedByError),
      failedLeafCount: failedLeaves.length,
      failedLeafSample: failedLeaves.slice(0, 50),
    },
  };

  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        artifactPath,
        reportPath,
        execution: report.execution,
        topFailedSuites: report.blockers.topFailedSuites.slice(0, 5),
        topFailureErrors: report.blockers.topFailureErrors.slice(0, 5),
      },
      null,
      2,
    ),
  );
}

await main();
