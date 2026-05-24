type TreeNodeLike = {
  title?: string;
  name?: string;
  status?: string;
  id?: string;
  requirement?: string;
  error?: string;
  log?: string[];
  children?: unknown[];
  tests?: unknown[];
};

export type ParitySource = "rewrite" | "upstream";

export interface NormalizedParityRecord {
  source: ParitySource;
  kind: "suite" | "case";
  key: string;
  path: string[];
  title: string;
  status: "passed" | "failed" | "skipped" | "cancelled";
  id?: string;
  requirement?: string;
  error?: string;
}

export interface ParityComparisonMatch {
  key: string;
  left: NormalizedParityRecord;
  right: NormalizedParityRecord;
}

export interface ParityComparisonResult {
  matched: ParityComparisonMatch[];
  statusMismatches: Array<ParityComparisonMatch & { leftStatus: string; rightStatus: string }>;
  leftOnly: NormalizedParityRecord[];
  rightOnly: NormalizedParityRecord[];
}

export interface NormalizeParityTreeOptions {
  includeRoot?: boolean;
}

export interface CompareParityTreesOptions {
  leftIncludeRoot?: boolean;
  rightIncludeRoot?: boolean;
}

export interface RuntimeParityResultLike {
  root: unknown;
}

export interface UpstreamParityRecordLike {
  log?: unknown;
}

export interface RuntimeRunOutputLike {
  root?: unknown;
  log?: unknown;
  run?: {
    root?: unknown;
    log?: unknown;
  };
}

function toTreeNodeLike(value: unknown): TreeNodeLike | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  return value as TreeNodeLike;
}

function normalizeStatus(value: unknown): NormalizedParityRecord["status"] {
  return value === "passed" || value === "failed" || value === "skipped" || value === "cancelled" ? value : "failed";
}

function normalizeTitleSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\brequirements?\b/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[/]+/g, " /")
    .trim();
}

function buildKey(path: string[]): string {
  return path.map(normalizeTitleSegment).join(" / ");
}

function getChildren(node: TreeNodeLike): unknown[] {
  if (Array.isArray(node.children)) {
    return node.children;
  }

  if (Array.isArray(node.tests)) {
    return node.tests;
  }

  return [];
}

export function normalizeParityTree(
  root: unknown,
  source: ParitySource,
  options: NormalizeParityTreeOptions = {},
): NormalizedParityRecord[] {
  const records: NormalizedParityRecord[] = [];
  const includeRoot = options.includeRoot ?? true;

  const walk = (nodeValue: unknown, path: string[], isRoot: boolean): void => {
    const node = toTreeNodeLike(nodeValue);
    if (!node) {
      return;
    }

    const title = node.title ?? node.name ?? "(untitled)";
    const nextPath = isRoot && !includeRoot ? path : [...path, title];
    const children = getChildren(node);
    const kind: NormalizedParityRecord["kind"] = children.length > 0 ? "suite" : "case";

    if (!isRoot || includeRoot) {
      records.push({
        source,
        kind,
        key: buildKey(nextPath),
        path: nextPath,
        title,
        status: normalizeStatus(node.status),
        id: typeof node.id === "string" ? node.id : undefined,
        requirement: typeof node.requirement === "string" ? node.requirement : undefined,
        error: typeof node.error === "string" ? node.error : undefined,
      });
    }

    for (const child of children) {
      walk(child, nextPath, false);
    }
  };

  walk(root, [], true);
  return records;
}

export function compareParityTrees(
  leftRoot: unknown,
  rightRoot: unknown,
  options: CompareParityTreesOptions = {},
): ParityComparisonResult {
  const leftRecords = normalizeParityTree(leftRoot, "rewrite", { includeRoot: options.leftIncludeRoot ?? true }).filter(
    (record) => record.kind === "case",
  );
  const rightRecords = normalizeParityTree(rightRoot, "upstream", {
    includeRoot: options.rightIncludeRoot ?? true,
  }).filter((record) => record.kind === "case");

  const leftByKey = new Map<string, NormalizedParityRecord[]>();
  const rightByKey = new Map<string, NormalizedParityRecord[]>();

  for (const record of leftRecords) {
    const bucket = leftByKey.get(record.key) ?? [];
    bucket.push(record);
    leftByKey.set(record.key, bucket);
  }

  for (const record of rightRecords) {
    const bucket = rightByKey.get(record.key) ?? [];
    bucket.push(record);
    rightByKey.set(record.key, bucket);
  }

  const allKeys = [...new Set([...leftByKey.keys(), ...rightByKey.keys()])].sort();
  const matched: ParityComparisonMatch[] = [];
  const statusMismatches: Array<ParityComparisonMatch & { leftStatus: string; rightStatus: string }> = [];
  const leftOnly: NormalizedParityRecord[] = [];
  const rightOnly: NormalizedParityRecord[] = [];

  for (const key of allKeys) {
    const leftBucket = leftByKey.get(key) ?? [];
    const rightBucket = rightByKey.get(key) ?? [];
    const pairCount = Math.min(leftBucket.length, rightBucket.length);

    for (let index = 0; index < pairCount; index += 1) {
      const left = leftBucket[index];
      const right = rightBucket[index];
      if (!left || !right) {
        continue;
      }

      const match: ParityComparisonMatch = { key, left, right };
      matched.push(match);

      if (left.status !== right.status) {
        statusMismatches.push({
          ...match,
          leftStatus: left.status,
          rightStatus: right.status,
        });
      }
    }

    if (leftBucket.length > pairCount) {
      leftOnly.push(...leftBucket.slice(pairCount));
    }

    if (rightBucket.length > pairCount) {
      rightOnly.push(...rightBucket.slice(pairCount));
    }
  }

  return {
    matched,
    statusMismatches,
    leftOnly,
    rightOnly,
  };
}

export function getRewriteParityRoot(runResult: RuntimeParityResultLike): unknown {
  return runResult.root;
}

export function getUpstreamParityRoot(record: UpstreamParityRecordLike): unknown {
  return record.log ?? record;
}

export function getRuntimeRunRoot(runOutput: RuntimeRunOutputLike): unknown {
  if (runOutput.run && typeof runOutput.run === "object") {
    return runOutput.run.root ?? runOutput.run.log ?? runOutput.run;
  }

  return runOutput.root ?? runOutput.log ?? runOutput;
}

export function compareRuntimeRunOutputs(
  leftRun: RuntimeRunOutputLike,
  rightRun: RuntimeRunOutputLike,
  options: CompareParityTreesOptions = {},
): ParityComparisonResult {
  return compareParityTrees(getRuntimeRunRoot(leftRun), getRuntimeRunRoot(rightRun), {
    leftIncludeRoot: options.leftIncludeRoot ?? false,
    rightIncludeRoot: options.rightIncludeRoot ?? false,
  });
}

export function compareParityRunOutputs(
  rewriteRun: RuntimeParityResultLike,
  upstreamRecord: UpstreamParityRecordLike,
  options: CompareParityTreesOptions = {},
): ParityComparisonResult {
  return compareParityTrees(getRewriteParityRoot(rewriteRun), getUpstreamParityRoot(upstreamRecord), {
    leftIncludeRoot: options.leftIncludeRoot ?? false,
    rightIncludeRoot: options.rightIncludeRoot ?? true,
  });
}
