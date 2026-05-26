import { createHash } from "node:crypto";

const defaultCaptureBasePath = "/capture/xapi";
const jsonContentTypes = new Set(["application/json", "application/octet-stream+json"]);
const requestHeaderAllowList = new Set(["content-type", "if-match", "if-none-match", "x-experience-api-version"]);
const responseHeaderAllowList = new Set([
  "content-type",
  "etag",
  "last-modified",
  "location",
  "x-experience-api-consistent-through",
]);

type PlaceholderKind = "httpDate" | "isoTimestamp" | "uuid";

type JsonValue = boolean | number | string | null | JsonValue[] | { [key: string]: JsonValue };

type PlaceholderState = {
  counters: Record<PlaceholderKind, number>;
  values: Record<PlaceholderKind, Map<string, string>>;
};

export interface RawTrafficMessage {
  bodyBase64: string;
  headers: Array<[string, string]>;
}

export interface RawTrafficExchange {
  durationMs: number;
  endedAt: string;
  request: RawTrafficMessage & {
    method: string;
    targetUrl: string;
  };
  response: RawTrafficMessage & {
    status: number;
  };
  sequence: number;
  startedAt: string;
}

export interface RawTrafficArtifact {
  captureBaseUrl: string;
  compareMode: TrafficCompareMode;
  completedAt: string;
  exitCode: number;
  exchanges: RawTrafficExchange[];
  generatedAt: string;
  runner: "rewrite" | "upstream";
  targetBaseUrl: string;
  version: "1.0.3" | "2.0.0";
}

export interface NormalizedBody {
  body?: unknown;
  byteLength?: number;
  kind: "binary" | "empty" | "form" | "json" | "multipart" | "text";
  sha256?: string;
}

export interface NormalizedExchange {
  attempts: number;
  method: string;
  path: string;
  query: Array<[string, string]>;
  request: {
    body: NormalizedBody;
    headers: Record<string, string>;
  };
  response: {
    body: NormalizedBody;
    headers: Record<string, string>;
    status: number;
  };
}

export interface NormalizedTrafficArtifact {
  captureBaseUrl: string;
  compareMode: TrafficCompareMode;
  completedAt: string;
  exitCode: number;
  exchanges: NormalizedExchange[];
  generatedAt: string;
  runner: "rewrite" | "upstream";
  targetBaseUrl: string;
  version: "1.0.3" | "2.0.0";
}

export interface TrafficComparisonCountMismatch {
  key: string;
  leftCount: number;
  rightCount: number;
  sample: NormalizedExchange;
}

export interface TrafficOrderedMismatch {
  index: number;
  left?: NormalizedExchange;
  right?: NormalizedExchange;
}

export type TrafficCompareMode = "bag" | "ordered";

export interface TrafficComparisonResult {
  leftCount: number;
  matchedCount: number;
  mode: TrafficCompareMode;
  orderedMismatches: TrafficOrderedMismatch[];
  rightCount: number;
  signatureMismatches: TrafficComparisonCountMismatch[];
}

export interface TrafficRecorderHandle {
  captureBaseUrl: string;
  stop(): Promise<void>;
  takeArtifact(
    metadata: Omit<
      RawTrafficArtifact,
      "captureBaseUrl" | "completedAt" | "exchanges" | "generatedAt" | "targetBaseUrl"
    >,
  ): RawTrafficArtifact;
}

export interface TrafficRecorderOptions {
  captureBasePath?: string;
  targetBaseUrl: string;
}

function arrayBufferToBase64(value: ArrayBuffer): string {
  return Buffer.from(value).toString("base64");
}

function base64ToBuffer(value: string): Buffer {
  return Buffer.from(value, "base64");
}

function canonicalizeContentType(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const [mediaType, ...parameterParts] = value
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (!mediaType) {
    return undefined;
  }

  const parameters = parameterParts
    .map((part) => {
      const [rawName = "", rawValue = ""] = part.split("=", 2);
      return [rawName.trim().toLowerCase(), rawValue.trim()] as const;
    })
    .filter(([name]) => name !== "boundary")
    .sort(([left], [right]) => left.localeCompare(right));

  if (parameters.length === 0) {
    return mediaType.toLowerCase();
  }

  return `${mediaType.toLowerCase()}; ${parameters.map(([name, rawValue]) => `${name}=${rawValue}`).join("; ")}`;
}

function createPlaceholderState(): PlaceholderState {
  return {
    counters: {
      uuid: 0,
      isoTimestamp: 0,
      httpDate: 0,
    },
    values: {
      uuid: new Map<string, string>(),
      isoTimestamp: new Map<string, string>(),
      httpDate: new Map<string, string>(),
    },
  };
}

function normalizeWithPlaceholder(value: string, kind: PlaceholderKind, state: PlaceholderState): string {
  const existing = state.values[kind].get(value);
  if (existing) {
    return existing;
  }

  const nextValue = `{{${kind}:${state.counters[kind]}}}`;
  state.counters[kind] += 1;
  state.values[kind].set(value, nextValue);
  return nextValue;
}

function normalizeStringValue(value: string, state: PlaceholderState): string {
  const withHttpDates = value.replace(
    /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT\b/g,
    (match) => normalizeWithPlaceholder(match, "httpDate", state),
  );

  const withIsoTimestamps = withHttpDates.replace(
    /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})\b/g,
    (match) => normalizeWithPlaceholder(match, "isoTimestamp", state),
  );

  return withIsoTimestamps.replace(
    /(?<![0-9a-f])[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?![0-9a-f])/gi,
    (match) => normalizeWithPlaceholder(match.toLowerCase(), "uuid", state),
  );
}

function canonicalizeJsonValue(value: unknown, state: PlaceholderState): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeJsonValue(item, state));
  }

  if (typeof value === "string") {
    return normalizeStringValue(value, state);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(
          ([key, childValue]) => [normalizeStringValue(key, state), canonicalizeJsonValue(childValue, state)] as const,
        )
        .sort(([left], [right]) => left.localeCompare(right)),
    );
  }

  return value;
}

function normalizeScalarText(value: string, state: PlaceholderState): string {
  return normalizeStringValue(value.trim(), state);
}

function normalizeHeaderValue(name: string, value: string, state: PlaceholderState): string {
  if (name === "authorization") {
    const scheme = value.trim().split(/\s+/, 2)[0] ?? "";
    return scheme.length > 0 ? scheme.toLowerCase() : "present";
  }

  if (name === "content-type") {
    return canonicalizeContentType(value) ?? "unknown";
  }

  if (name === "etag" || name === "if-match") {
    const trimmed = value.trim();
    if (trimmed === "*") {
      return "*";
    }

    const weak = trimmed.startsWith("W/");
    return `${weak ? "W/" : ""}"<etag>"`;
  }

  if (name === "if-none-match") {
    return value.trim() === "*" ? "*" : normalizeStringValue(value.trim(), state);
  }

  if (name === "last-modified" || name === "x-experience-api-consistent-through") {
    return name === "last-modified"
      ? normalizeWithPlaceholder(value.trim(), "httpDate", state)
      : normalizeWithPlaceholder(value.trim(), "isoTimestamp", state);
  }

  return normalizeStringValue(value.trim(), state);
}

function normalizeHeaders(
  entries: Array<[string, string]>,
  allowList: Set<string>,
  state: PlaceholderState,
): Record<string, string> {
  const normalizedEntries = entries
    .map(([name, value]) => [name.toLowerCase(), value] as const)
    .filter(([name]) => allowList.has(name))
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName));

  return Object.fromEntries(normalizedEntries.map(([name, value]) => [name, normalizeHeaderValue(name, value, state)]));
}

function omitRequestContentTypeForEmptyBody(
  headers: Record<string, string>,
  body: NormalizedBody,
): Record<string, string> {
  if (body.kind !== "empty" || !("content-type" in headers)) {
    return headers;
  }

  const { ["content-type"]: _contentType, ...remainingHeaders } = headers;
  return remainingHeaders;
}

function tryParseJson(buffer: Buffer): JsonValue | undefined {
  try {
    return JSON.parse(buffer.toString("utf8")) as JsonValue;
  } catch {
    return undefined;
  }
}

function hashBuffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function extractBoundary(contentType: string | undefined): string | undefined {
  if (!contentType) {
    return undefined;
  }

  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  return match?.[1] ?? match?.[2]?.trim();
}

function parseMultipartParts(
  buffer: Buffer,
  contentType: string | undefined,
): Array<{ body: Buffer; headers: Array<[string, string]> }> | undefined {
  const boundary = extractBoundary(contentType);
  if (!boundary) {
    return undefined;
  }

  const text = buffer.toString("utf8");
  const delimiter = `--${boundary}`;
  const rawParts = text.split(delimiter).slice(1);
  const parts: Array<{ body: Buffer; headers: Array<[string, string]> }> = [];

  for (const rawPart of rawParts) {
    const trimmed = rawPart.trim();
    if (trimmed.length === 0 || trimmed === "--") {
      continue;
    }

    const normalizedPart = rawPart.replace(/^\r?\n/, "").replace(/\r?\n--$/, "");
    const separatorIndex = normalizedPart.search(/\r?\n\r?\n/);
    if (separatorIndex === -1) {
      return undefined;
    }

    const headerText = normalizedPart.slice(0, separatorIndex);
    const bodyText = normalizedPart
      .slice(separatorIndex)
      .replace(/^\r?\n\r?\n/, "")
      .replace(/\r?\n$/, "");
    const headers = headerText
      .split(/\r?\n/)
      .map((line) => {
        const [rawName = "", ...rest] = line.split(":");
        return [rawName.trim().toLowerCase(), rest.join(":").trim()] as [string, string];
      })
      .filter(([name]) => name.length > 0);

    parts.push({
      body: Buffer.from(bodyText, "utf8"),
      headers,
    });
  }

  return parts;
}

function normalizeFormBody(buffer: Buffer, state: PlaceholderState): NormalizedBody {
  const params = new URLSearchParams(buffer.toString("utf8"));
  const entries = [...params.entries()].map(
    ([name, value]) => [name, normalizeScalarText(value, state)] as [string, string],
  );
  entries.sort(([leftName, leftValue], [rightName, rightValue]) =>
    leftName === rightName ? leftValue.localeCompare(rightValue) : leftName.localeCompare(rightName),
  );

  return {
    kind: "form",
    body: entries,
  };
}

function normalizeMultipartBody(
  buffer: Buffer,
  contentType: string | undefined,
  state: PlaceholderState,
): NormalizedBody {
  const parts = parseMultipartParts(buffer, contentType);
  if (!parts) {
    return {
      kind: "binary",
      byteLength: buffer.byteLength,
      sha256: hashBuffer(buffer),
    };
  }

  return {
    kind: "multipart",
    body: parts.map((part) => {
      const partHeaders = normalizeHeaders(part.headers, new Set(["content-type", "content-disposition"]), state);
      const partContentType = part.headers.find(([name]) => name === "content-type")?.[1];

      return {
        body: normalizeBody(part.body, partContentType, state),
        headers: partHeaders,
      };
    }),
  };
}

function normalizeTextBody(buffer: Buffer, state: PlaceholderState): NormalizedBody {
  return {
    kind: "text",
    body: normalizeScalarText(buffer.toString("utf8"), state),
  };
}

function normalizeBody(buffer: Buffer, contentType: string | undefined, state: PlaceholderState): NormalizedBody {
  if (buffer.byteLength === 0) {
    return { kind: "empty" };
  }

  const canonicalContentType = canonicalizeContentType(contentType)?.split(";", 1)[0];

  if (canonicalContentType && jsonContentTypes.has(canonicalContentType)) {
    const parsed = tryParseJson(buffer);
    if (typeof parsed !== "undefined") {
      return {
        kind: "json",
        body: canonicalizeJsonValue(parsed, state),
      };
    }
  }

  if (canonicalContentType === "application/x-www-form-urlencoded") {
    return normalizeFormBody(buffer, state);
  }

  if (canonicalContentType?.startsWith("multipart/")) {
    return normalizeMultipartBody(buffer, contentType, state);
  }

  const parsedJson = tryParseJson(buffer);
  if (typeof parsedJson !== "undefined") {
    return {
      kind: "json",
      body: canonicalizeJsonValue(parsedJson, state),
    };
  }

  if (canonicalContentType?.startsWith("text/")) {
    return normalizeTextBody(buffer, state);
  }

  return {
    kind: "binary",
    byteLength: buffer.byteLength,
    sha256: hashBuffer(buffer),
  };
}

function normalizeQuery(url: URL, state: PlaceholderState): Array<[string, string]> {
  const entries = [...url.searchParams.entries()].map(
    ([name, value]) => [name, normalizeScalarText(value, state)] as [string, string],
  );
  entries.sort(([leftName, leftValue], [rightName, rightValue]) =>
    leftName === rightName ? leftValue.localeCompare(rightValue) : leftName.localeCompare(rightName),
  );
  return entries;
}

export function normalizeTrafficArtifact(rawArtifact: RawTrafficArtifact): NormalizedTrafficArtifact {
  const normalizedExchanges = rawArtifact.exchanges.map((exchange) => {
    const state = createPlaceholderState();
    const requestUrl = new URL(exchange.request.targetUrl);
    const requestContentType = exchange.request.headers.find(([name]) => name.toLowerCase() === "content-type")?.[1];
    const responseContentType = exchange.response.headers.find(([name]) => name.toLowerCase() === "content-type")?.[1];
    const requestBody = normalizeBody(base64ToBuffer(exchange.request.bodyBase64), requestContentType, state);

    return {
      attempts: 1,
      method: exchange.request.method,
      path: requestUrl.pathname,
      query: normalizeQuery(requestUrl, state),
      request: {
        headers: omitRequestContentTypeForEmptyBody(
          normalizeHeaders(exchange.request.headers, requestHeaderAllowList, state),
          requestBody,
        ),
        body: requestBody,
      },
      response: {
        status: exchange.response.status,
        headers: normalizeHeaders(exchange.response.headers, responseHeaderAllowList, state),
        body: normalizeBody(base64ToBuffer(exchange.response.bodyBase64), responseContentType, state),
      },
    } satisfies NormalizedExchange;
  });

  return {
    ...rawArtifact,
    exchanges: compressConsecutiveEquivalentExchanges(normalizedExchanges),
  };
}

export function createExchangeSignature(exchange: NormalizedExchange): string {
  return JSON.stringify({
    method: exchange.method,
    path: exchange.path,
    query: exchange.query,
    request: exchange.request,
    response: {
      status: exchange.response.status,
      headers: exchange.response.headers,
      body: exchange.response.body,
    },
  });
}

export function compressConsecutiveEquivalentExchanges(exchanges: NormalizedExchange[]): NormalizedExchange[] {
  const compressed: NormalizedExchange[] = [];

  for (const exchange of exchanges) {
    const previous = compressed.at(-1);
    if (!previous || createExchangeSignature(previous) !== createExchangeSignature(exchange)) {
      compressed.push({
        ...exchange,
      });
      continue;
    }

    previous.attempts += exchange.attempts;
  }

  return compressed;
}

export function compareNormalizedTrafficRuns(
  left: NormalizedTrafficArtifact,
  right: NormalizedTrafficArtifact,
  mode: TrafficCompareMode = "bag",
): TrafficComparisonResult {
  const leftCount = left.exchanges.reduce((total, exchange) => total + exchange.attempts, 0);
  const rightCount = right.exchanges.reduce((total, exchange) => total + exchange.attempts, 0);

  if (mode === "ordered") {
    const maxLength = Math.max(left.exchanges.length, right.exchanges.length);
    const orderedMismatches: TrafficOrderedMismatch[] = [];
    let matchedCount = 0;

    for (let index = 0; index < maxLength; index += 1) {
      const leftExchange = left.exchanges[index];
      const rightExchange = right.exchanges[index];
      if (
        leftExchange &&
        rightExchange &&
        leftExchange.attempts === rightExchange.attempts &&
        createExchangeSignature(leftExchange) === createExchangeSignature(rightExchange)
      ) {
        matchedCount += leftExchange.attempts;
        continue;
      }

      orderedMismatches.push({
        index,
        left: leftExchange,
        right: rightExchange,
      });
    }

    return {
      leftCount,
      matchedCount,
      mode,
      orderedMismatches,
      rightCount,
      signatureMismatches: [],
    };
  }

  const leftCounts = new Map<string, { count: number; sample: NormalizedExchange }>();
  const rightCounts = new Map<string, { count: number; sample: NormalizedExchange }>();

  for (const exchange of left.exchanges) {
    const key = createExchangeSignature(exchange);
    const current = leftCounts.get(key);
    leftCounts.set(key, {
      count: (current?.count ?? 0) + exchange.attempts,
      sample: current?.sample ?? exchange,
    });
  }

  for (const exchange of right.exchanges) {
    const key = createExchangeSignature(exchange);
    const current = rightCounts.get(key);
    rightCounts.set(key, {
      count: (current?.count ?? 0) + exchange.attempts,
      sample: current?.sample ?? exchange,
    });
  }

  const allKeys = [...new Set([...leftCounts.keys(), ...rightCounts.keys()])].sort((leftKey, rightKey) =>
    leftKey.localeCompare(rightKey),
  );
  const signatureMismatches: TrafficComparisonCountMismatch[] = [];
  let matchedCount = 0;

  for (const key of allKeys) {
    const leftEntry = leftCounts.get(key);
    const rightEntry = rightCounts.get(key);
    const leftCount = leftEntry?.count ?? 0;
    const rightCount = rightEntry?.count ?? 0;

    matchedCount += Math.min(leftCount, rightCount);

    if (leftCount === rightCount) {
      continue;
    }

    signatureMismatches.push({
      key,
      leftCount,
      rightCount,
      sample: leftEntry?.sample ?? rightEntry?.sample ?? left.exchanges[0]!,
    });
  }

  return {
    leftCount,
    matchedCount,
    mode,
    orderedMismatches: [],
    rightCount,
    signatureMismatches,
  };
}

function summarizeMismatchBody(body: NormalizedBody): string {
  if (body.kind === "empty") {
    return "empty";
  }

  if (body.kind === "binary") {
    return `binary sha256=${body.sha256 ?? "unknown"} bytes=${body.byteLength ?? 0}`;
  }

  return JSON.stringify(body.body);
}

export function renderTrafficComparisonReport(
  left: NormalizedTrafficArtifact,
  right: NormalizedTrafficArtifact,
  comparison: TrafficComparisonResult,
): string {
  const lines = [
    `# Traffic Comparison ${left.version}`,
    "",
    `- mode: ${comparison.mode}`,
    `- left runner: ${left.runner}`,
    `- right runner: ${right.runner}`,
    `- left exit code: ${left.exitCode}`,
    `- right exit code: ${right.exitCode}`,
    `- left exchanges: ${comparison.leftCount}`,
    `- right exchanges: ${comparison.rightCount}`,
    `- matched exchanges: ${comparison.matchedCount}`,
    "",
  ];

  if (comparison.mode === "ordered") {
    lines.push("## Ordered Mismatches", "");
    if (comparison.orderedMismatches.length === 0) {
      lines.push("- none", "");
      return `${lines.join("\n")}\n`;
    }

    for (const mismatch of comparison.orderedMismatches.slice(0, 50)) {
      lines.push(`- index ${mismatch.index}`);
      if (mismatch.left) {
        lines.push(`  left: ${mismatch.left.method} ${mismatch.left.path} -> ${mismatch.left.response.status}`);
      }
      if (mismatch.right) {
        lines.push(`  right: ${mismatch.right.method} ${mismatch.right.path} -> ${mismatch.right.response.status}`);
      }
    }

    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  lines.push("## Signature Count Mismatches", "");
  if (comparison.signatureMismatches.length === 0) {
    lines.push("- none", "");
    return `${lines.join("\n")}\n`;
  }

  for (const mismatch of comparison.signatureMismatches.slice(0, 50)) {
    lines.push(
      `- ${mismatch.sample.method} ${mismatch.sample.path} -> ${mismatch.sample.response.status} (left=${mismatch.leftCount}, right=${mismatch.rightCount})`,
    );
    lines.push(`  query: ${JSON.stringify(mismatch.sample.query)}`);
    lines.push(`  request body: ${summarizeMismatchBody(mismatch.sample.request.body)}`);
    lines.push(`  response body: ${summarizeMismatchBody(mismatch.sample.response.body)}`);
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

export async function startTrafficRecorder(options: TrafficRecorderOptions): Promise<TrafficRecorderHandle> {
  const captureBasePath = options.captureBasePath ?? defaultCaptureBasePath;
  const normalizedCaptureBasePath = captureBasePath.startsWith("/") ? captureBasePath : `/${captureBasePath}`;
  const targetBaseUrl = options.targetBaseUrl.replace(/\/+$/, "");
  const exchanges: RawTrafficExchange[] = [];

  const server = Bun.serve({
    idleTimeout: 30,
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request) {
      const startedAt = new Date();
      const incomingUrl = new URL(request.url);
      if (!incomingUrl.pathname.startsWith(normalizedCaptureBasePath)) {
        return new Response("Not Found", { status: 404 });
      }

      const suffixPath = incomingUrl.pathname.slice(normalizedCaptureBasePath.length);
      const requestPath = suffixPath.length > 0 ? suffixPath : "";
      const targetUrl = `${targetBaseUrl}${requestPath}${incomingUrl.search}`;
      const requestHeaders = [...request.headers.entries()];
      const requestBody = await request.arrayBuffer();
      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.delete("host");
      forwardHeaders.delete("content-length");

      const forwardedResponse = await fetch(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: requestBody.byteLength > 0 ? requestBody : undefined,
        redirect: "manual",
      });

      const responseBody = await forwardedResponse.arrayBuffer();
      const endedAt = new Date();

      exchanges.push({
        durationMs: endedAt.valueOf() - startedAt.valueOf(),
        endedAt: endedAt.toISOString(),
        request: {
          bodyBase64: arrayBufferToBase64(requestBody),
          headers: requestHeaders,
          method: request.method,
          targetUrl,
        },
        response: {
          bodyBase64: arrayBufferToBase64(responseBody),
          headers: [...forwardedResponse.headers.entries()],
          status: forwardedResponse.status,
        },
        sequence: exchanges.length,
        startedAt: startedAt.toISOString(),
      });

      return new Response(responseBody, {
        headers: forwardedResponse.headers,
        status: forwardedResponse.status,
      });
    },
  });

  return {
    captureBaseUrl: `http://127.0.0.1:${server.port}${normalizedCaptureBasePath}`,
    async stop() {
      await server.stop(true);
    },
    takeArtifact(metadata) {
      return {
        ...metadata,
        captureBaseUrl: `http://127.0.0.1:${server.port}${normalizedCaptureBasePath}`,
        completedAt: new Date().toISOString(),
        exchanges: [...exchanges],
        generatedAt: exchanges[0]?.startedAt ?? new Date().toISOString(),
        targetBaseUrl,
      };
    },
  };
}
