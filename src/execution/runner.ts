import {
  CaseResultSchema,
  ExecutionEventSchema,
  type AssertionPlan,
  type CaseDefinition,
  type CaseResult,
  type ExecutionEvent,
  type ExecutionPlan,
  type HeaderExpectation,
  type HttpRequest,
  type JsonPathExpectation,
  type JsonObject,
  type RequestAssertion,
  type RegistryDefinition,
  type SpecVersion,
  SuiteResultSchema,
  type SuiteDefinition,
  type SuiteResult,
} from "../domain/contracts";

type RunStatus = SuiteResult["status"];
type SingleRequestExecution = Extract<ExecutionPlan, { kind: "single-request" }>;
type SubmitAndQueryExecution = Extract<ExecutionPlan, { kind: "submit-and-query" }>;
type RequestSequenceExecution = Extract<ExecutionPlan, { kind: "request-sequence" }>;
type SingleRequestAssertion = Extract<AssertionPlan, { kind: "single-request" }>;
type SubmitAndQueryAssertion = Extract<AssertionPlan, { kind: "submit-and-query" }>;
type RequestSequenceAssertion = Extract<AssertionPlan, { kind: "request-sequence" }>;
type SingleRequestCase = Omit<CaseDefinition, "execution" | "assertion"> & {
  execution: SingleRequestExecution;
  assertion: SingleRequestAssertion;
};
type SubmitAndQueryCase = Omit<CaseDefinition, "execution" | "assertion"> & {
  execution: SubmitAndQueryExecution;
  assertion: SubmitAndQueryAssertion;
};
type RequestSequenceCase = Omit<CaseDefinition, "execution" | "assertion"> & {
  execution: RequestSequenceExecution;
  assertion: RequestSequenceAssertion;
};

export interface RuntimeRunOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  onEvent?: (event: ExecutionEvent) => void | Promise<void>;
}

export interface RuntimeRunResult {
  version: SpecVersion;
  status: RunStatus;
  root: SuiteResult;
  events: ExecutionEvent[];
}

const endpointPaths: Record<HttpRequest["endpoint"], string> = {
  about: "about",
  activities: "activities",
  "activities-profile": "activities/profile",
  "activities-state": "activities/state",
  agents: "agents",
  "agents-profile": "agents/profile",
  statements: "statements",
};

function withTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isSingleRequestCase(testCase: CaseDefinition): testCase is SingleRequestCase {
  return testCase.execution.kind === "single-request" && testCase.assertion.kind === "single-request";
}

function isSubmitAndQueryCase(testCase: CaseDefinition): testCase is SubmitAndQueryCase {
  return testCase.execution.kind === "submit-and-query" && testCase.assertion.kind === "submit-and-query";
}

function isRequestSequenceCase(testCase: CaseDefinition): testCase is RequestSequenceCase {
  return testCase.execution.kind === "request-sequence" && testCase.assertion.kind === "request-sequence";
}

function getValueAtPath(value: unknown, path: string[]): unknown {
  let current: unknown = value;

  for (const segment of path) {
    if (!isJsonObject(current) && !Array.isArray(current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function aggregateStatus(children: Array<SuiteResult | CaseResult>): RunStatus {
  if (children.some((child) => child.status === "failed")) {
    return "failed";
  }

  if (children.some((child) => child.status === "cancelled")) {
    return "cancelled";
  }

  if (children.every((child) => child.status === "skipped")) {
    return "skipped";
  }

  return "passed";
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

function assertHeaders(response: Response, expected: HeaderExpectation[]): string[] {
  return expected.flatMap((header) => {
    const actual = response.headers.get(header.key);
    if (actual === header.equals) {
      return [];
    }

    return [`Expected header ${header.key}=${header.equals} but received ${actual ?? "<missing>"}.`];
  });
}

function assertJsonPathMatches(body: unknown, expectations: JsonPathExpectation[]): string[] {
  return expectations.flatMap((expectation) => {
    const actual = getValueAtPath(body, expectation.path);
    if (deepEqual(actual, expectation.equals)) {
      return [];
    }

    return [
      `Expected path ${expectation.path.join(".")} to equal ${JSON.stringify(expectation.equals)} but received ${JSON.stringify(actual)}.`,
    ];
  });
}

function assertRequestExpectation(response: Response, body: unknown, assertion: RequestAssertion): string[] {
  const errors: string[] = [];

  if (response.status !== assertion.status) {
    errors.push(`Expected status ${assertion.status} but received ${response.status}.`);
  }

  errors.push(...assertHeaders(response, assertion.expectedHeaders));
  errors.push(...assertJsonPathMatches(body, assertion.jsonPathEquals));

  return errors;
}

async function executeHttpRequest(request: HttpRequest, options: RuntimeRunOptions): Promise<Response> {
  const url = new URL(endpointPaths[request.endpoint], withTrailingSlash(options.baseUrl));
  for (const [key, value] of Object.entries(request.query)) {
    url.searchParams.set(key, value);
  }

  const headers = new Headers(request.headers);
  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.body) {
    headers.set("content-type", "application/json");
    init.body = JSON.stringify(request.body.value);
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  return fetchImpl(url, init);
}

async function runSingleRequestCase(testCase: SingleRequestCase, options: RuntimeRunOptions): Promise<CaseResult> {
  const response = await executeHttpRequest(testCase.execution.request, options);
  const body = await parseResponseBody(response);
  const errors = assertRequestExpectation(response, body, testCase.assertion);

  return CaseResultSchema.parse({
    id: testCase.id,
    title: testCase.title,
    status: errors.length === 0 ? "passed" : "failed",
    log: errors,
  });
}

async function runSubmitAndQueryCase(testCase: SubmitAndQueryCase, options: RuntimeRunOptions): Promise<CaseResult> {
  const submitResponse = await executeHttpRequest(testCase.execution.submit, options);
  const submitBody = await parseResponseBody(submitResponse);
  const submitErrors: string[] = [];

  if (submitResponse.status !== testCase.assertion.submitStatus) {
    submitErrors.push(
      `Expected submit status ${testCase.assertion.submitStatus} but received ${submitResponse.status}.`,
    );
  }

  if (submitErrors.length > 0) {
    return CaseResultSchema.parse({
      id: testCase.id,
      title: testCase.title,
      status: "failed",
      log: [...submitErrors, `Submit body: ${JSON.stringify(submitBody)}`],
    });
  }

  const maxAttempts = testCase.execution.polling?.maxAttempts ?? 1;
  const intervalMs = testCase.execution.polling?.intervalMs ?? 0;
  let lastErrors: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const queryResponse = await executeHttpRequest(testCase.execution.query, options);
    const queryBody = await parseResponseBody(queryResponse);
    const attemptErrors: string[] = [];

    if (queryResponse.status !== testCase.assertion.queryStatus) {
      attemptErrors.push(
        `Expected query status ${testCase.assertion.queryStatus} but received ${queryResponse.status}.`,
      );
    }

    attemptErrors.push(...assertHeaders(queryResponse, testCase.assertion.expectedHeaders));
    attemptErrors.push(...assertJsonPathMatches(queryBody, testCase.assertion.queryJsonPathEquals));

    if (attemptErrors.length === 0) {
      return CaseResultSchema.parse({
        id: testCase.id,
        title: testCase.title,
        status: "passed",
        log: [],
      });
    }

    lastErrors = [`Attempt ${attempt} failed.`, ...attemptErrors, `Query body: ${JSON.stringify(queryBody)}`];

    if (attempt < maxAttempts && intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  return CaseResultSchema.parse({
    id: testCase.id,
    title: testCase.title,
    status: "failed",
    log: lastErrors,
  });
}

async function runRequestSequenceCase(testCase: RequestSequenceCase, options: RuntimeRunOptions): Promise<CaseResult> {
  if (testCase.execution.steps.length !== testCase.assertion.steps.length) {
    return CaseResultSchema.parse({
      id: testCase.id,
      title: testCase.title,
      status: "failed",
      log: [
        `Execution defined ${testCase.execution.steps.length} steps but assertion defined ${testCase.assertion.steps.length}.`,
      ],
    });
  }

  for (const [index, request] of testCase.execution.steps.entries()) {
    const response = await executeHttpRequest(request, options);
    const body = await parseResponseBody(response);
    const assertion = testCase.assertion.steps[index];

    if (!assertion) {
      return CaseResultSchema.parse({
        id: testCase.id,
        title: testCase.title,
        status: "failed",
        log: [`Missing assertion for step ${index + 1}.`],
      });
    }

    const errors = assertRequestExpectation(response, body, assertion);
    if (errors.length > 0) {
      return CaseResultSchema.parse({
        id: testCase.id,
        title: testCase.title,
        status: "failed",
        log: [
          `Step ${index + 1} ${request.method} ${request.endpoint} failed.`,
          ...errors,
          `Response body: ${JSON.stringify(body)}`,
        ],
      });
    }
  }

  return CaseResultSchema.parse({
    id: testCase.id,
    title: testCase.title,
    status: "passed",
    log: [],
  });
}

async function runCase(
  testCase: CaseDefinition,
  version: SpecVersion,
  options: RuntimeRunOptions,
  events: ExecutionEvent[],
): Promise<CaseResult> {
  await emitEvent(
    {
      kind: "case-start",
      version,
      caseId: testCase.id,
      title: testCase.title,
    },
    events,
    options,
  );

  const result =
    testCase.execution.kind === "single-request"
      ? isSingleRequestCase(testCase)
        ? await runSingleRequestCase(testCase, options)
        : CaseResultSchema.parse({
            id: testCase.id,
            title: testCase.title,
            status: "failed",
            log: ["Execution and assertion kinds did not align for a single-request case."],
          })
      : testCase.execution.kind === "submit-and-query"
        ? isSubmitAndQueryCase(testCase)
          ? await runSubmitAndQueryCase(testCase, options)
          : CaseResultSchema.parse({
              id: testCase.id,
              title: testCase.title,
              status: "failed",
              log: ["Execution and assertion kinds did not align for a submit-and-query case."],
            })
        : isRequestSequenceCase(testCase)
          ? await runRequestSequenceCase(testCase, options)
          : CaseResultSchema.parse({
              id: testCase.id,
              title: testCase.title,
              status: "failed",
              log: ["Execution and assertion kinds did not align for a request-sequence case."],
            });

  await emitEvent(
    {
      kind: "case-finish",
      version,
      caseId: testCase.id,
      status: result.status,
    },
    events,
    options,
  );

  return result;
}

async function runSuite(
  suite: SuiteDefinition,
  version: SpecVersion,
  options: RuntimeRunOptions,
  events: ExecutionEvent[],
): Promise<SuiteResult> {
  await emitEvent(
    {
      kind: "suite-start",
      version,
      suiteId: suite.id,
      title: suite.title,
    },
    events,
    options,
  );

  const children: Array<SuiteResult | CaseResult> = [];
  for (const child of suite.children) {
    if (child.type === "suite") {
      children.push(await runSuite(child, version, options, events));
      continue;
    }

    children.push(await runCase(child, version, options, events));
  }

  return SuiteResultSchema.parse({
    id: suite.id,
    title: suite.title,
    status: aggregateStatus(children),
    children,
    log: [],
  });
}

async function emitEvent(event: ExecutionEvent, events: ExecutionEvent[], options: RuntimeRunOptions): Promise<void> {
  const parsedEvent = ExecutionEventSchema.parse(event);
  events.push(parsedEvent);
  await options.onEvent?.(parsedEvent);
}

export async function runRegistryVersion(
  registry: RegistryDefinition,
  version: SpecVersion,
  options: RuntimeRunOptions,
): Promise<RuntimeRunResult> {
  const events: ExecutionEvent[] = [];
  await emitEvent({ kind: "run-start", version }, events, options);

  const suites = registry.versions[version];
  const children: SuiteResult[] = [];

  for (const suite of suites) {
    children.push(await runSuite(suite, version, options, events));
  }

  const root = SuiteResultSchema.parse({
    id: `run.${version}`,
    title: `xAPI ${version}`,
    status: aggregateStatus(children),
    children,
    log: [],
  });

  await emitEvent({ kind: "run-finish", version }, events, options);

  return {
    version,
    status: root.status,
    root,
    events,
  };
}
