import { createHash } from "node:crypto";

import {
  CaseResultSchema,
  ExecutionEventSchema,
  type AssertionPlan,
  type CaseDefinition,
  type CaseResult,
  type ExecutionEvent,
  type ExecutionPlan,
  type HeaderDateAfterStepExpectation,
  type HeaderExpectation,
  type HeaderPatternExpectation,
  type HttpRequest,
  type JsonPathExpectation,
  type JsonObject,
  type RequestAssertion,
  type RegistryDefinition,
  type SpecVersion,
  type SubmitQueryCaptureExpectation,
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
type FetchImpl = (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => ReturnType<typeof fetch>;
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

interface RuntimeBasicAuthOptions {
  username: string;
  password: string;
}

interface RuntimeOauth1AuthOptions {
  authorizationHeader: string;
}

interface RuntimeAuthOptions {
  basic?: RuntimeBasicAuthOptions;
  oauth1?: RuntimeOauth1AuthOptions;
}

export interface RuntimeRunOptions {
  baseUrl: string;
  fetchImpl?: FetchImpl;
  onEvent?: (event: ExecutionEvent) => void | Promise<void>;
  auth?: RuntimeAuthOptions;
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

const defaultBasicAuth: RuntimeBasicAuthOptions = {
  username: "proof-basic-user",
  password: "proof-basic-password",
};

const defaultOauth1Auth: RuntimeOauth1AuthOptions = {
  authorizationHeader: 'OAuth oauth_consumer_key="proof-consumer-key"',
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

const proofUuidPattern = /\b(?:33333333-3333-4333-8333|11111111-1111-4111-8111)-[0-9a-f]{12}\b/gi;

function replaceProofDataInString(value: string, rewriteUuid: (uuid: string) => string, caseToken: string): string {
  const withRemappedUuids = value.replace(proofUuidPattern, (matched) => rewriteUuid(matched));
  if (caseToken.length === 0) {
    return withRemappedUuids;
  }

  return withRemappedUuids.replace(/\bexample\.test\b/gi, `${caseToken}.example.test`);
}

function replaceProofDataInUnknown(value: unknown, rewriteUuid: (uuid: string) => string, caseToken: string): unknown {
  if (typeof value === "string") {
    return replaceProofDataInString(value, rewriteUuid, caseToken);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceProofDataInUnknown(item, rewriteUuid, caseToken));
  }

  if (!isJsonObject(value)) {
    return value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    output[key] = replaceProofDataInUnknown(nestedValue, rewriteUuid, caseToken);
  }

  return output;
}

function normalizeExpectedVersionHeader(value: string, version: SpecVersion): string {
  if (version === "1.0.3" && value === "2.0.0") {
    return "1.0.3";
  }

  return value;
}

function rewriteRequestAssertion(
  assertion: RequestAssertion,
  version: SpecVersion,
  rewriteUuid: (uuid: string) => string,
  caseToken: string,
): RequestAssertion {
  return {
    ...assertion,
    expectedHeaders: assertion.expectedHeaders.map((header) =>
      header.key.toLowerCase() === "x-experience-api-version"
        ? {
            ...header,
            equals: normalizeExpectedVersionHeader(header.equals, version),
          }
        : header,
    ),
    jsonPathEquals: assertion.jsonPathEquals.map((expectation) => ({
      ...expectation,
      equals: replaceProofDataInUnknown(expectation.equals, rewriteUuid, caseToken),
    })),
    jsonPathNotEquals: assertion.jsonPathNotEquals.map((expectation) => ({
      ...expectation,
      equals: replaceProofDataInUnknown(expectation.equals, rewriteUuid, caseToken),
    })),
    textContains: assertion.textContains.map((text) => replaceProofDataInString(text, rewriteUuid, caseToken)),
  };
}

function rewriteHttpRequest(
  request: HttpRequest,
  rewriteUuid: (uuid: string) => string,
  caseToken: string,
): HttpRequest {
  const headers = Object.fromEntries(
    Object.entries(request.headers).map(([key, value]) => [
      key,
      replaceProofDataInString(value, rewriteUuid, caseToken),
    ]),
  );
  const query = Object.fromEntries(
    Object.entries(request.query).map(([key, value]) => [key, replaceProofDataInString(value, rewriteUuid, caseToken)]),
  );

  const body =
    request.body == null
      ? undefined
      : request.body.kind === "json"
        ? {
            ...request.body,
            value: replaceProofDataInUnknown(request.body.value, rewriteUuid, caseToken),
          }
        : {
            ...request.body,
            value: replaceProofDataInString(request.body.value, rewriteUuid, caseToken),
          };

  return {
    ...request,
    headers,
    query,
    body,
  };
}

function rewriteAssertionPlan(
  assertion: AssertionPlan,
  version: SpecVersion,
  rewriteUuid: (uuid: string) => string,
  caseToken: string,
): AssertionPlan {
  if (assertion.kind === "single-request") {
    return {
      ...assertion,
      expectedHeaders: assertion.expectedHeaders.map((header) =>
        header.key.toLowerCase() === "x-experience-api-version"
          ? {
              ...header,
              equals: normalizeExpectedVersionHeader(header.equals, version),
            }
          : header,
      ),
      jsonPathEquals: assertion.jsonPathEquals.map((expectation) => ({
        ...expectation,
        equals: replaceProofDataInUnknown(expectation.equals, rewriteUuid, caseToken),
      })),
      jsonPathNotEquals: assertion.jsonPathNotEquals.map((expectation) => ({
        ...expectation,
        equals: replaceProofDataInUnknown(expectation.equals, rewriteUuid, caseToken),
      })),
      textContains: assertion.textContains.map((text) => replaceProofDataInString(text, rewriteUuid, caseToken)),
    };
  }

  if (assertion.kind === "submit-and-query") {
    return {
      ...assertion,
      expectedHeaders: assertion.expectedHeaders.map((header) =>
        header.key.toLowerCase() === "x-experience-api-version"
          ? {
              ...header,
              equals: normalizeExpectedVersionHeader(header.equals, version),
            }
          : header,
      ),
      queryJsonPathEquals: assertion.queryJsonPathEquals.map((expectation) => ({
        ...expectation,
        equals: replaceProofDataInUnknown(expectation.equals, rewriteUuid, caseToken),
      })),
      queryTextContains: assertion.queryTextContains.map((text) =>
        replaceProofDataInString(text, rewriteUuid, caseToken),
      ),
    };
  }

  return {
    ...assertion,
    steps: assertion.steps.map((step) => rewriteRequestAssertion(step, version, rewriteUuid, caseToken)),
  };
}

function prepareCaseForRuntime(testCase: CaseDefinition, version: SpecVersion): CaseDefinition {
  const prepared = structuredClone(testCase) as CaseDefinition;
  const hasTextBody =
    prepared.execution.kind === "single-request"
      ? prepared.execution.request.body?.kind === "text"
      : prepared.execution.kind === "submit-and-query"
        ? prepared.execution.submit.body?.kind === "text" || prepared.execution.query.body?.kind === "text"
        : prepared.execution.steps.some((request) => request.body?.kind === "text");

  const remappedUuids = new Map<string, string>();
  const caseToken = hasTextBody ? "" : createHash("sha1").update(`${version}:${prepared.id}`).digest("hex").slice(0, 8);
  const rewriteUuid = (uuid: string): string => {
    if (hasTextBody) {
      return uuid;
    }

    const lowerUuid = uuid.toLowerCase();
    const existing = remappedUuids.get(lowerUuid);
    if (existing) {
      return existing;
    }

    const prefixLength = lowerUuid.length - 12;
    const prefix = lowerUuid.slice(0, prefixLength);
    const hashSuffix = createHash("sha1").update(`${version}:${prepared.id}:${lowerUuid}`).digest("hex").slice(0, 12);
    const remapped = `${prefix}${hashSuffix}`;
    remappedUuids.set(lowerUuid, remapped);
    return remapped;
  };

  if (prepared.execution.kind === "single-request") {
    prepared.execution.request = rewriteHttpRequest(prepared.execution.request, rewriteUuid, caseToken);
  } else if (prepared.execution.kind === "submit-and-query") {
    prepared.execution.submit = rewriteHttpRequest(prepared.execution.submit, rewriteUuid, caseToken);
    prepared.execution.query = rewriteHttpRequest(prepared.execution.query, rewriteUuid, caseToken);
  } else {
    prepared.execution.steps = prepared.execution.steps.map((request) =>
      rewriteHttpRequest(request, rewriteUuid, caseToken),
    );
  }

  prepared.assertion = rewriteAssertionPlan(prepared.assertion, version, rewriteUuid, caseToken);
  return prepared;
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

function parseRelativeEndpointFromMoreLink(moreLink: string): HttpRequest | null {
  if (!moreLink.startsWith("/xapi/")) {
    return null;
  }

  const [pathPart, queryPart = ""] = moreLink.slice("/xapi/".length).split("?", 2);
  const endpoint = (pathPart as HttpRequest["endpoint"]) || "";
  if (!Object.prototype.hasOwnProperty.call(endpointPaths, endpoint)) {
    return null;
  }

  const query: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(queryPart)) {
    query[key] = value;
  }

  return {
    method: "GET",
    endpoint,
    authMode: "basic",
    headers: {},
    query,
  };
}

function resolveRequestSequenceStepRequest(
  request: HttpRequest,
  previousBody: unknown,
  previousRequest: HttpRequest | null,
): HttpRequest {
  if (
    request.method === "GET" &&
    request.endpoint === "statements" &&
    request.query.offset != null &&
    previousRequest?.method === "GET" &&
    previousRequest.endpoint === "statements" &&
    isJsonObject(previousBody)
  ) {
    const moreLink = typeof previousBody.more === "string" ? previousBody.more : "";
    if (moreLink.length > 0) {
      const parsed = parseRelativeEndpointFromMoreLink(moreLink);
      if (parsed) {
        return {
          ...request,
          endpoint: parsed.endpoint,
          query: parsed.query,
        };
      }
    }
  }

  return request;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (text.length === 0) {
    return undefined;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }

  return text;
}

function assertHeaders(response: Response, expected: HeaderExpectation[]): string[] {
  return (expected ?? []).flatMap((header) => {
    const actual = response.headers.get(header.key);
    if (actual === header.equals) {
      return [];
    }

    return [`Expected header ${header.key}=${header.equals} but received ${actual ?? "<missing>"}.`];
  });
}

function assertHeaderPatterns(response: Response, expected: HeaderPatternExpectation[]): string[] {
  return (expected ?? []).flatMap((header) => {
    const actual = response.headers.get(header.key);
    if (actual !== null && new RegExp(header.pattern).test(actual)) {
      return [];
    }

    return [`Expected header ${header.key} to match /${header.pattern}/ but received ${actual ?? "<missing>"}.`];
  });
}

function assertHeaderDatesAfterSteps(
  response: Response,
  previousResponses: Response[],
  expected: HeaderDateAfterStepExpectation[],
): string[] {
  return (expected ?? []).flatMap((header) => {
    const previousResponse = previousResponses[header.fromStep - 1];
    if (!previousResponse) {
      return [
        `Expected step ${header.fromStep} to exist when comparing header ${header.key}, but only ${previousResponses.length} previous steps were recorded.`,
      ];
    }

    const previousValue = previousResponse.headers.get(header.key);
    const currentValue = response.headers.get(header.key);
    const previousDate = previousValue === null ? Number.NaN : Date.parse(previousValue);
    const currentDate = currentValue === null ? Number.NaN : Date.parse(currentValue);

    if (Number.isNaN(previousDate)) {
      return [
        `Expected header ${header.key} from step ${header.fromStep} to contain a valid date but received ${previousValue ?? "<missing>"}.`,
      ];
    }

    if (Number.isNaN(currentDate)) {
      return [`Expected header ${header.key} to contain a valid date but received ${currentValue ?? "<missing>"}.`];
    }

    if (currentDate > previousDate) {
      return [];
    }

    return [
      `Expected header ${header.key}=${currentValue} to be later than step ${header.fromStep} value ${previousValue}.`,
    ];
  });
}

function assertJsonPathMatches(body: unknown, expectations: JsonPathExpectation[]): string[] {
  return (expectations ?? []).flatMap((expectation) => {
    const actual = getValueAtPath(body, expectation.path);
    if (deepEqual(actual, expectation.equals)) {
      return [];
    }

    return [
      `Expected path ${expectation.path.join(".")} to equal ${JSON.stringify(expectation.equals)} but received ${JSON.stringify(actual)}.`,
    ];
  });
}

function assertJsonPathDoesNotMatch(body: unknown, expectations: JsonPathExpectation[]): string[] {
  return (expectations ?? []).flatMap((expectation) => {
    const actual = getValueAtPath(body, expectation.path);
    if (!deepEqual(actual, expectation.equals)) {
      return [];
    }

    return [
      `Expected path ${expectation.path.join(".")} not to equal ${JSON.stringify(expectation.equals)} but received ${JSON.stringify(actual)}.`,
    ];
  });
}

function assertTextContains(body: unknown, expected: string[]): string[] {
  if ((expected ?? []).length === 0) {
    return [];
  }

  const text = typeof body === "string" ? body : body === undefined ? "" : JSON.stringify(body);
  return expected.flatMap((fragment) =>
    text.includes(fragment) ? [] : [`Expected response body to contain ${JSON.stringify(fragment)}.`],
  );
}

function assertCapturedJsonPathMatches(
  submitBody: unknown,
  queryBody: unknown,
  expectations: SubmitQueryCaptureExpectation[],
): string[] {
  return (expectations ?? []).flatMap((expectation) => {
    const expected = getValueAtPath(submitBody, expectation.fromSubmitJsonPath);
    const actual = getValueAtPath(queryBody, expectation.queryPath);
    if (deepEqual(actual, expected)) {
      return [];
    }

    return [
      `Expected path ${expectation.queryPath.join(".")} to equal captured submit value at ${expectation.fromSubmitJsonPath.join(".")} but received ${JSON.stringify(actual)} instead of ${JSON.stringify(expected)}.`,
    ];
  });
}

type BasicRequestAssertion = Pick<
  RequestAssertion,
  "status" | "expectedHeaders" | "expectedHeaderPatterns" | "jsonPathEquals" | "jsonPathNotEquals" | "textContains"
>;

function assertRequestExpectation(response: Response, body: unknown, assertion: BasicRequestAssertion): string[] {
  const errors: string[] = [];

  if (response.status !== assertion.status) {
    errors.push(`Expected status ${assertion.status} but received ${response.status}.`);
  }

  errors.push(...assertHeaders(response, assertion.expectedHeaders));
  errors.push(...assertHeaderPatterns(response, assertion.expectedHeaderPatterns));
  errors.push(...assertJsonPathMatches(body, assertion.jsonPathEquals));
  errors.push(...assertJsonPathDoesNotMatch(body, assertion.jsonPathNotEquals));
  errors.push(...assertTextContains(body, assertion.textContains));

  return errors;
}

function buildBasicAuthorizationHeader(credentials: RuntimeBasicAuthOptions): string {
  return `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString("base64")}`;
}

function applyAuthorizationHeader(request: HttpRequest, headers: Headers, options: RuntimeRunOptions): void {
  if (headers.has("authorization")) {
    return;
  }

  switch (request.authMode) {
    case "none":
      return;
    case "basic": {
      const credentials = options.auth?.basic ?? defaultBasicAuth;
      headers.set("authorization", buildBasicAuthorizationHeader(credentials));
      return;
    }
    case "oauth1": {
      const oauth1 = options.auth?.oauth1 ?? defaultOauth1Auth;
      headers.set("authorization", oauth1.authorizationHeader);
      return;
    }
  }
}

async function executeHttpRequest(request: HttpRequest, options: RuntimeRunOptions): Promise<Response> {
  const url = new URL(endpointPaths[request.endpoint], withTrailingSlash(options.baseUrl));
  for (const [key, value] of Object.entries(request.query)) {
    url.searchParams.set(key, value);
  }

  const headers = new Headers(request.headers);
  applyAuthorizationHeader(request, headers, options);
  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.body) {
    if (request.body.kind === "json") {
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }

      init.body = JSON.stringify(request.body.value);
    } else {
      if (!headers.has("content-type")) {
        headers.set("content-type", "text/plain; charset=utf-8");
      }

      init.body = request.body.value;
    }
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

  let queryRequest = testCase.execution.query;
  if (testCase.execution.capture) {
    const capturedValue = getValueAtPath(submitBody, testCase.execution.capture.fromSubmitJsonPath);
    if (typeof capturedValue !== "string") {
      return CaseResultSchema.parse({
        id: testCase.id,
        title: testCase.title,
        status: "failed",
        log: [
          `Expected submit response path ${testCase.execution.capture.fromSubmitJsonPath.join(".")} to produce a string query value but received ${JSON.stringify(capturedValue)}.`,
          `Submit body: ${JSON.stringify(submitBody)}`,
        ],
      });
    }

    queryRequest = {
      ...queryRequest,
      query: {
        ...queryRequest.query,
        [testCase.execution.capture.toQueryParam]: capturedValue,
      },
    };
  }

  const maxAttempts = testCase.execution.polling?.maxAttempts ?? 1;
  const intervalMs = testCase.execution.polling?.intervalMs ?? 0;
  let lastErrors: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const queryResponse = await executeHttpRequest(queryRequest, options);
    const queryBody = await parseResponseBody(queryResponse);
    const attemptErrors: string[] = [];

    if (queryResponse.status !== testCase.assertion.queryStatus) {
      attemptErrors.push(
        `Expected query status ${testCase.assertion.queryStatus} but received ${queryResponse.status}.`,
      );
    }

    attemptErrors.push(...assertHeaders(queryResponse, testCase.assertion.expectedHeaders));
    attemptErrors.push(...assertHeaderPatterns(queryResponse, testCase.assertion.expectedHeaderPatterns));
    attemptErrors.push(...assertJsonPathMatches(queryBody, testCase.assertion.queryJsonPathEquals));
    attemptErrors.push(
      ...assertCapturedJsonPathMatches(submitBody, queryBody, testCase.assertion.queryJsonPathEqualsCaptured),
    );
    attemptErrors.push(...assertTextContains(queryBody, testCase.assertion.queryTextContains));

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

  const previousResponses: Response[] = [];
  let previousBody: unknown = undefined;
  let previousRequest: HttpRequest | null = null;

  for (const [index, request] of testCase.execution.steps.entries()) {
    const resolvedRequest = resolveRequestSequenceStepRequest(request, previousBody, previousRequest);
    const response = await executeHttpRequest(resolvedRequest, options);
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

    const errors = [
      ...assertRequestExpectation(response, body, assertion),
      ...assertHeaderDatesAfterSteps(response, previousResponses, assertion.expectedHeaderDateAfterStep),
    ];
    if (errors.length > 0) {
      return CaseResultSchema.parse({
        id: testCase.id,
        title: testCase.title,
        status: "failed",
        log: [
          `Step ${index + 1} ${resolvedRequest.method} ${resolvedRequest.endpoint} failed.`,
          ...errors,
          `Response body: ${JSON.stringify(body)}`,
        ],
      });
    }

    previousResponses.push(response);
    previousBody = body;
    previousRequest = resolvedRequest;
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
  const runtimeCase = prepareCaseForRuntime(testCase, version);

  await emitEvent(
    {
      kind: "case-start",
      version,
      caseId: runtimeCase.id,
      title: runtimeCase.title,
    },
    events,
    options,
  );

  let result: CaseResult;
  try {
    result =
      runtimeCase.execution.kind === "single-request"
        ? isSingleRequestCase(runtimeCase)
          ? await runSingleRequestCase(runtimeCase, options)
          : CaseResultSchema.parse({
              id: runtimeCase.id,
              title: runtimeCase.title,
              status: "failed",
              log: ["Execution and assertion kinds did not align for a single-request case."],
            })
        : runtimeCase.execution.kind === "submit-and-query"
          ? isSubmitAndQueryCase(runtimeCase)
            ? await runSubmitAndQueryCase(runtimeCase, options)
            : CaseResultSchema.parse({
                id: runtimeCase.id,
                title: runtimeCase.title,
                status: "failed",
                log: ["Execution and assertion kinds did not align for a submit-and-query case."],
              })
          : isRequestSequenceCase(runtimeCase)
            ? await runRequestSequenceCase(runtimeCase, options)
            : CaseResultSchema.parse({
                id: runtimeCase.id,
                title: runtimeCase.title,
                status: "failed",
                log: ["Execution and assertion kinds did not align for a request-sequence case."],
              });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result = CaseResultSchema.parse({
      id: runtimeCase.id,
      title: runtimeCase.title,
      status: "failed",
      log: [`Request execution failed with a transport/runtime error: ${message}`],
    });
  }

  await emitEvent(
    {
      kind: "case-finish",
      version,
      caseId: runtimeCase.id,
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
