import { runWithExecutionPath } from "./execution-owner.ts";

export type RuntimeStatus = "passed" | "failed" | "skipped" | "cancelled";

export interface RuntimeNodeBase {
  title: string;
  name: string;
  requirement: string;
  status: RuntimeStatus;
  error?: string;
  log: string[];
}

export interface RuntimeSuiteResult extends RuntimeNodeBase {
  kind: "suite";
  children: RuntimeNodeResult[];
}

export interface RuntimeCaseResult extends RuntimeNodeBase {
  kind: "case";
  children: [];
}

export type RuntimeNodeResult = RuntimeSuiteResult | RuntimeCaseResult;

export interface RuntimeRunSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  cancelled: number;
  version?: string;
}

export interface RuntimeRunResult {
  root: RuntimeSuiteResult;
  summary: RuntimeRunSummary;
  state: "finished" | "cancelled";
  startTime: number;
  endTime: number;
  duration: number;
}

export interface DescribeRuntimeOptions {
  rootTitle: string;
  version?: string;
  bail?: boolean;
  grep?: RegExp;
  now?: () => number;
}

export type DoneCallback = (error?: unknown) => void;

type Runnable = ((done: DoneCallback) => unknown) | (() => unknown);
type SuiteBuilder = () => void;

interface HookDefinition {
  title: string;
  fn: Runnable;
}

interface SuiteDefinition {
  kind: "suite";
  title: string;
  synthetic: boolean;
  beforeHooks: HookDefinition[];
  children: DefinitionNode[];
}

interface CaseDefinition {
  kind: "case";
  title: string;
  fn?: Runnable;
}

type DefinitionNode = SuiteDefinition | CaseDefinition;

interface TitleMetadata {
  name: string;
  requirement: string;
}

interface ExecutionState {
  summary: RuntimeRunSummary;
  cancelRemaining: boolean;
  bail: boolean;
  grep?: RegExp;
}

export interface DescribeRuntime {
  describe(title: string, build: SuiteBuilder): void;
  it(title: string, fn?: Runnable): void;
  before(title: string, fn: Runnable): void;
  before(fn: Runnable): void;
  run(): Promise<RuntimeRunResult>;
}

function parseTitleMetadata(title: string): TitleMetadata {
  const match = /\(([^)]*\d[^)]*)\)/.exec(title);
  if (!match) {
    return {
      name: title,
      requirement: "",
    };
  }

  return {
    name: title.slice(0, match.index).trim(),
    requirement: match[1] ?? "",
  };
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.toString();
  }

  return String(error);
}

function matchesPattern(pattern: RegExp | undefined, value: string): boolean {
  if (!pattern) {
    return true;
  }

  pattern.lastIndex = 0;
  return pattern.test(value);
}

function buildFullTitle(path: string[], title: string): string {
  return [...path, title].join(" ");
}

function countMatchingCases(definition: SuiteDefinition, path: string[], pattern: RegExp | undefined): number {
  const suitePath = definition.synthetic ? path : [...path, definition.title];

  return definition.children.reduce((count, child) => {
    if (child.kind === "suite") {
      return count + countMatchingCases(child, suitePath, pattern);
    }

    return count + (matchesPattern(pattern, buildFullTitle(suitePath, child.title)) ? 1 : 0);
  }, 0);
}

function hasMatchingDescendant(definition: SuiteDefinition, path: string[], pattern: RegExp | undefined): boolean {
  return countMatchingCases(definition, path, pattern) > 0;
}

function rollupSuiteStatus(children: RuntimeNodeResult[]): RuntimeStatus {
  let sawCancelled = false;

  for (const child of children) {
    if (child.status === "failed") {
      return "failed";
    }

    if (child.status === "cancelled") {
      sawCancelled = true;
    }
  }

  return sawCancelled ? "cancelled" : "passed";
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (typeof value === "object" || typeof value === "function") && value !== null && "then" in value;
}

async function runRunnable(fn: Runnable): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const resolveOnce = (): void => {
      if (settled) {
        return;
      }

      settled = true;
      resolve();
    };

    const rejectOnce = (error: unknown): void => {
      if (settled) {
        return;
      }

      settled = true;
      reject(error);
    };

    try {
      if (fn.length > 0) {
        const maybeResult = (fn as (done: DoneCallback) => unknown)((error?: unknown) => {
          if (typeof error !== "undefined") {
            rejectOnce(error);
            return;
          }

          resolveOnce();
        });

        if (isPromiseLike(maybeResult)) {
          Promise.resolve(maybeResult).then(resolveOnce, rejectOnce);
        }

        return;
      }

      const maybeResult = (fn as () => unknown)();
      if (isPromiseLike(maybeResult)) {
        Promise.resolve(maybeResult).then(resolveOnce, rejectOnce);
        return;
      }

      resolveOnce();
    } catch (error) {
      rejectOnce(error);
    }
  });
}

function createSuiteResult(title: string): RuntimeSuiteResult {
  const metadata = parseTitleMetadata(title);

  return {
    kind: "suite",
    title,
    name: metadata.name,
    requirement: metadata.requirement,
    status: "passed",
    log: [],
    children: [],
  };
}

function createCaseResult(title: string, status: RuntimeStatus, error?: string): RuntimeCaseResult {
  const metadata = parseTitleMetadata(title);

  return {
    kind: "case",
    title,
    name: metadata.name,
    requirement: metadata.requirement,
    status,
    error,
    log: [],
    children: [],
  };
}

function buildCancelledSuite(
  definition: SuiteDefinition,
  path: string[],
  state: ExecutionState,
): RuntimeSuiteResult | undefined {
  if (!hasMatchingDescendant(definition, path, state.grep)) {
    return undefined;
  }

  const suitePath = definition.synthetic ? path : [...path, definition.title];
  const result = createSuiteResult(definition.title);
  result.status = "cancelled";

  for (const child of definition.children) {
    if (child.kind === "suite") {
      const childResult = buildCancelledSuite(child, suitePath, state);
      if (childResult) {
        result.children.push(childResult);
      }
      continue;
    }

    if (!matchesPattern(state.grep, buildFullTitle(suitePath, child.title))) {
      continue;
    }

    state.summary.cancelled += 1;
    result.children.push(createCaseResult(child.title, "cancelled"));
  }

  result.status = rollupSuiteStatus(result.children);
  return result;
}

async function executeCase(
  definition: CaseDefinition,
  path: string[],
  state: ExecutionState,
): Promise<RuntimeCaseResult> {
  const runnable = definition.fn;
  if (!runnable) {
    state.summary.skipped += 1;
    return createCaseResult(definition.title, "skipped");
  }

  try {
    await runWithExecutionPath([...path, definition.title], () => runRunnable(runnable));
    state.summary.passed += 1;
    return createCaseResult(definition.title, "passed");
  } catch (error) {
    state.summary.failed += 1;
    if (state.bail) {
      state.cancelRemaining = true;
    }

    return createCaseResult(definition.title, "failed", toErrorMessage(error));
  }
}

async function executeSuite(
  definition: SuiteDefinition,
  path: string[],
  state: ExecutionState,
): Promise<RuntimeSuiteResult | undefined> {
  if (!definition.synthetic && !hasMatchingDescendant(definition, path, state.grep)) {
    return undefined;
  }

  const suitePath = definition.synthetic ? path : [...path, definition.title];
  const result = createSuiteResult(definition.title);

  for (const hook of definition.beforeHooks) {
    try {
      await runWithExecutionPath([...suitePath, `[before] ${hook.title}`], () => runRunnable(hook.fn));
    } catch (error) {
      state.summary.failed += 1;
      result.status = "failed";
      result.error = toErrorMessage(error);

      for (const child of definition.children) {
        if (child.kind === "suite") {
          const childResult = buildCancelledSuite(child, suitePath, state);
          if (childResult) {
            result.children.push(childResult);
          }
          continue;
        }

        if (!matchesPattern(state.grep, buildFullTitle(suitePath, child.title))) {
          continue;
        }

        state.summary.cancelled += 1;
        result.children.push(createCaseResult(child.title, "cancelled"));
      }

      if (state.bail) {
        state.cancelRemaining = true;
      }

      return result;
    }
  }

  for (const child of definition.children) {
    if (child.kind === "suite") {
      const childResult = state.cancelRemaining
        ? buildCancelledSuite(child, suitePath, state)
        : await executeSuite(child, suitePath, state);

      if (childResult) {
        result.children.push(childResult);
      }
      continue;
    }

    if (!matchesPattern(state.grep, buildFullTitle(suitePath, child.title))) {
      continue;
    }

    const childResult = state.cancelRemaining
      ? (() => {
          state.summary.cancelled += 1;
          return createCaseResult(child.title, "cancelled");
        })()
      : await executeCase(child, suitePath, state);

    result.children.push(childResult);
  }

  result.status = rollupSuiteStatus(result.children);
  return result;
}

export function createDescribeRuntime(options: DescribeRuntimeOptions): DescribeRuntime {
  const rootDefinition: SuiteDefinition = {
    kind: "suite",
    title: options.rootTitle,
    synthetic: true,
    beforeHooks: [],
    children: [],
  };

  const suiteStack: SuiteDefinition[] = [rootDefinition];

  const getCurrentSuite = (): SuiteDefinition => {
    const currentSuite = suiteStack[suiteStack.length - 1];
    if (!currentSuite) {
      throw new Error("Describe runtime lost its active suite stack.");
    }

    return currentSuite;
  };

  const describe = (title: string, build: SuiteBuilder): void => {
    const suite: SuiteDefinition = {
      kind: "suite",
      title,
      synthetic: false,
      beforeHooks: [],
      children: [],
    };

    getCurrentSuite().children.push(suite);
    suiteStack.push(suite);

    try {
      build();
    } finally {
      suiteStack.pop();
    }
  };

  const it = (title: string, fn?: Runnable): void => {
    getCurrentSuite().children.push({
      kind: "case",
      title,
      fn,
    });
  };

  function before(title: string, fn: Runnable): void;
  function before(fn: Runnable): void;
  function before(titleOrFn: string | Runnable, maybeFn?: Runnable): void {
    const title = typeof titleOrFn === "string" ? titleOrFn : "before";
    const fn = typeof titleOrFn === "string" ? maybeFn : titleOrFn;

    if (!fn) {
      throw new Error(`Missing before hook implementation for "${title}".`);
    }

    getCurrentSuite().beforeHooks.push({ title, fn });
  }

  const run = async (): Promise<RuntimeRunResult> => {
    const now = options.now ?? Date.now;
    const startTime = now();
    const summary: RuntimeRunSummary = {
      total: countMatchingCases(rootDefinition, [], options.grep),
      passed: 0,
      failed: 0,
      skipped: 0,
      cancelled: 0,
      version: options.version,
    };

    const state: ExecutionState = {
      summary,
      cancelRemaining: false,
      bail: options.bail ?? false,
      grep: options.grep,
    };

    const root = (await executeSuite(rootDefinition, [], state)) ?? createSuiteResult(options.rootTitle);
    root.title = options.rootTitle;
    root.name = options.rootTitle;
    root.requirement = "";

    const endTime = now();

    return {
      root,
      summary,
      state: state.cancelRemaining && summary.failed === 0 ? "cancelled" : "finished",
      startTime,
      endTime,
      duration: endTime - startTime,
    };
  };

  return {
    describe,
    it,
    before,
    run,
  };
}
