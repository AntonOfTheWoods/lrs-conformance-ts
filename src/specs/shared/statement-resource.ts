import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue } from "../../describe-runtime/templates.ts";

type QueryCase = {
  expectedStatus?: number;
  headers?: Record<string, string>;
  name: string;
  query?: Record<string, unknown>;
  rawPath?: string;
};

type StatementResourceOptions = {
  includeLegacyStatementResultAttachmentCases?: boolean;
  includeV2DuplicateBatchIdCase?: boolean;
  includeV2SupplementalCases?: boolean;
  includeV2LastModifiedCase?: boolean;
};

type AttachmentFixture = {
  bodyText: string;
  contentType: string;
  hash: string;
  length: number;
};

type MultipartPart = {
  bodyText: string;
  headers: Record<string, string>;
};

const multipartBoundary = "-------314159265358979323846";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectJsonObject(value: unknown, name: string): JsonObject {
  if (!isJsonObject(value)) {
    throw new Error(`Expected ${name} to resolve to a JSON object.`);
  }

  return value;
}

function expectJsonArray(value: unknown, name: string): JsonValue[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected ${name} to resolve to a JSON array.`);
  }

  return value;
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!isJsonObject(parsed)) {
    throw new Error(`Expected "${name}" to return a JSON object response.`);
  }

  return parsed;
}

function parseJsonArray(response: JsonResponse, name: string): JsonValue[] {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected "${name}" to return a JSON array response.`);
  }

  return parsed;
}

function parseJsonObjectText(bodyText: string, name: string): JsonObject {
  const parsed = JSON.parse(bodyText) as unknown;
  if (!isJsonObject(parsed)) {
    throw new Error(`Expected "${name}" to return a JSON object response.`);
  }

  return parsed;
}

function expectObjectProperty(parent: JsonObject, key: string, name: string): JsonObject {
  return expectJsonObject(parent[key], name);
}

function expectArrayProperty(parent: JsonObject, key: string, name: string): JsonValue[] {
  return expectJsonArray(parent[key], name);
}

function createVoidedVerb(): JsonObject {
  return {
    id: "http://adlnet.gov/expapi/verbs/voided",
    display: {
      "en-US": "voided",
      "en-GB": "voided",
    },
  };
}

function createModifiedStatement(statement: JsonObject): JsonObject {
  const modified = structuredClone(statement);
  const verb = expectObjectProperty(modified, "verb", "modified statement verb");
  verb.id = `http://example.com/different/verb/${crypto.randomUUID()}`;
  return modified;
}

function parseHttpDate(value: string | null, name: string): number {
  const parsed = Date.parse(value ?? "");
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected ${name} to be a parseable HTTP date but received "${value ?? ""}".`);
  }

  return parsed;
}

function parseStoredDate(value: unknown, name: string): number {
  if (typeof value !== "string") {
    throw new Error(`Expected ${name} to be a timestamp string.`);
  }

  const parsed = Date.parse(value.replace(/\.(\d{3})\d+Z$/, ".$1Z"));
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected ${name} to be a parseable timestamp but received "${value}".`);
  }

  return parsed;
}

function getAttachmentFixturePath(directory: string, fileName: string): string {
  return join(
    import.meta.dir,
    "..",
    "..",
    "..",
    "node_modules",
    "adl-lrs-conformance-tests",
    "test",
    directory,
    "templates",
    "attachments",
    fileName,
  );
}

function loadAttachmentFixture(context: DescribeRuntimeContext, fileName: string): AttachmentFixture {
  const bodyText = readFileSync(getAttachmentFixturePath(context.directory, fileName), "utf8");
  return {
    bodyText,
    contentType: "text/plain",
    hash: createHash("sha256").update(bodyText).digest("hex"),
    length: new TextEncoder().encode(bodyText).length,
  };
}

function parseMultipartBoundary(contentType: string | null): string | undefined {
  if (!contentType) {
    return undefined;
  }

  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  return match?.[1] ?? match?.[2]?.trim();
}

function parseMultipartHeaders(rawHeaders: string): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const line of rawHeaders.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    if (key.length > 0) {
      headers[key] = value;
    }
  }

  return headers;
}

function parseMultipartParts(bodyText: string, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const marker = `--${boundary}`;
  for (const rawPart of bodyText.split(marker)) {
    let normalized = rawPart;
    if (normalized.startsWith("\r\n")) {
      normalized = normalized.slice(2);
    } else if (normalized.startsWith("\n")) {
      normalized = normalized.slice(1);
    }

    if (normalized.endsWith("--\r\n")) {
      normalized = normalized.slice(0, -4);
    } else if (normalized.endsWith("--")) {
      normalized = normalized.slice(0, -2);
    }

    normalized = normalized.replace(/\r?\n$/, "");
    if (normalized.trim().length === 0) {
      continue;
    }

    const separatorIndex = normalized.indexOf("\r\n\r\n");
    const separatorLength = separatorIndex >= 0 ? 4 : 0;
    const fallbackSeparatorIndex = separatorIndex >= 0 ? separatorIndex : normalized.indexOf("\n\n");
    if (fallbackSeparatorIndex < 0) {
      continue;
    }

    const bodyStart = fallbackSeparatorIndex + (separatorIndex >= 0 ? separatorLength : 2);
    parts.push({
      bodyText: normalized.slice(bodyStart),
      headers: parseMultipartHeaders(normalized.slice(0, fallbackSeparatorIndex)),
    });
  }

  return parts;
}

function buildMultipartBody(json: JsonValue, attachments: readonly AttachmentFixture[]): string {
  const lines: string[] = [];
  lines.push(`--${multipartBoundary}`);
  lines.push("Content-Type: application/json");
  lines.push("");
  lines.push(JSON.stringify(json));

  for (const attachment of attachments) {
    lines.push(`--${multipartBoundary}`);
    lines.push(`Content-Type: ${attachment.contentType}`);
    lines.push("Content-Transfer-Encoding: binary");
    lines.push(`X-Experience-API-Hash: ${attachment.hash}`);
    lines.push("");
    lines.push(attachment.bodyText);
  }

  lines.push(`--${multipartBoundary}--`);
  lines.push("");
  return lines.join("\r\n");
}

function expectMultipartResponse(response: JsonResponse, name: string): MultipartPart[] {
  const boundary = parseMultipartBoundary(response.headers.get("content-type"));
  if (!boundary) {
    throw new Error(`Expected ${name} to return multipart content-type with a boundary.`);
  }

  const parts = parseMultipartParts(response.bodyText, boundary);
  if (parts.length === 0) {
    throw new Error(`Expected ${name} to return multipart parts.`);
  }

  return parts;
}

function deepIncludesValue(value: unknown, expected: string): boolean {
  if (typeof value === "string") {
    return value === expected;
  }

  if (Array.isArray(value)) {
    return value.some((item) => deepIncludesValue(item, expected));
  }

  if (!isJsonObject(value)) {
    return false;
  }

  return Object.values(value).some((item) => deepIncludesValue(item, expected));
}

async function createStatement(
  context: DescribeRuntimeContext,
  templates: Array<Record<string, JsonValue>>,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(templates);
  return expectJsonObject(payload.statement, "statement payload");
}

async function createTemplateObject(
  context: DescribeRuntimeContext,
  key: string,
  reference: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate([{ [key]: reference }]);
  return expectJsonObject(payload[key], `${key} payload`);
}

async function postStatement(
  context: DescribeRuntimeContext,
  json: JsonValue,
  expectedStatus: number,
  name: string,
): Promise<JsonResponse> {
  const response = await context.sendJsonRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    json,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} for "${name}" but received ${response.status}.`);
  }

  return response;
}

function expectAllowedStatus(response: JsonResponse, allowedStatuses: readonly number[], name: string): void {
  if (!allowedStatuses.includes(response.status)) {
    throw new Error(`Expected status ${allowedStatuses.join(" or ")} for "${name}" but received ${response.status}.`);
  }
}

async function postMultipartStatement(
  context: DescribeRuntimeContext,
  statement: JsonObject,
  attachments: readonly AttachmentFixture[],
  expectedStatus: number,
  name: string,
): Promise<JsonResponse> {
  const response = await context.sendRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    headers: {
      "Content-Type": `multipart/mixed; boundary=${multipartBoundary}`,
    },
    body: buildMultipartBody(statement, attachments),
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} for "${name}" but received ${response.status}.`);
  }

  return response;
}

async function putStatement(
  context: DescribeRuntimeContext,
  statementId: string,
  statement: JsonObject,
  expectedStatus: number,
  name: string,
): Promise<JsonResponse> {
  const response = await context.sendJsonRequest({
    method: "PUT",
    path: context.getEndpointStatements(),
    query: { statementId },
    json: statement,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} for "${name}" but received ${response.status}.`);
  }

  return response;
}

async function fetchStatements(
  context: DescribeRuntimeContext,
  name: string,
  query?: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<JsonResponse> {
  return context.sendRequest({
    method: "GET",
    path: context.getEndpointStatements(),
    query,
    headers,
  });
}

async function fetchRawStatements(
  context: DescribeRuntimeContext,
  name: string,
  rawPath: string,
  headers?: Record<string, string>,
): Promise<JsonResponse> {
  return context.sendRequest({
    method: "GET",
    path: rawPath,
    headers,
  });
}

async function fetchStatement(
  context: DescribeRuntimeContext,
  queryKey: "statementId" | "voidedStatementId",
  statementId: string,
  expectedStatus: number,
  name: string,
  query?: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<JsonResponse> {
  const response = await fetchStatements(context, name, { [queryKey]: statementId, ...(query ?? {}) }, headers);
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} for "${name}" but received ${response.status}.`);
  }

  return response;
}

async function persistCollectionQueryFixture(context: DescribeRuntimeContext): Promise<{
  categoryId: string;
  instructor: JsonObject;
  registration: string;
  statement: JsonObject;
  statementId: string;
}> {
  const statement = await createStatement(context, [
    { statement: "{{statements.context}}" },
    { context: "{{contexts.category}}" },
    {
      instructor: {
        objectType: "Agent",
        name: "xAPI mbox",
        mbox: `mailto:${context.generateUuid()}@adlnet.gov`,
      },
    },
  ]);
  const statementId = context.generateUuid();
  statement.id = statementId;

  const actor = expectObjectProperty(statement, "actor", "collection fixture actor");
  actor.mbox = `mailto:${context.generateUuid()}@adlnet.gov`;

  const verb = expectObjectProperty(statement, "verb", "collection fixture verb");
  verb.id = `http://example.com/verbs/${context.generateUuid()}`;

  const object = expectObjectProperty(statement, "object", "collection fixture object");
  object.id = `http://example.com/activity/${context.generateUuid()}`;

  const contextObject = expectObjectProperty(statement, "context", "collection fixture context");
  const registration = context.generateUuid();
  contextObject.registration = registration;

  const instructor = expectObjectProperty(contextObject, "instructor", "collection fixture instructor");
  const contextActivities = expectObjectProperty(
    contextObject,
    "contextActivities",
    "collection fixture context activities",
  );
  const category = expectObjectProperty(contextActivities, "category", "collection fixture category activity");
  const categoryId = `http://example.com/category/${context.generateUuid()}`;
  category.id = categoryId;

  await postStatement(context, statement, 200, "persist collection query fixture statement");

  return { categoryId, instructor, registration, statement, statementId };
}

async function persistVoidedAndVoidingStatements(
  context: DescribeRuntimeContext,
): Promise<{ voidedId: string; voidingId: string }> {
  const voidedId = context.generateUuid();
  const voidingId = context.generateUuid();

  const voidedStatement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
  voidedStatement.id = voidedId;
  await postStatement(context, voidedStatement, 200, "persist voided statement for statement resource");

  const voidingStatement = await createStatement(context, [
    { statement: "{{statements.object_statementref}}" },
    { verb: createVoidedVerb() },
  ]);
  voidingStatement.id = voidingId;

  const voidingObject = expectObjectProperty(voidingStatement, "object", "voiding statement object");
  voidingObject.id = voidedId;
  await postStatement(context, voidingStatement, 200, "persist voiding statement for statement resource");

  return { voidedId, voidingId };
}

async function persistRichFormatStatement(
  context: DescribeRuntimeContext,
): Promise<{ activity: JsonObject; statement: JsonObject; statementId: string }> {
  const statement = await createStatement(context, [
    { statement: "{{statements.object_substatement}}" },
    { object: "{{substatements.context}}" },
  ]);
  const statementId = context.generateUuid();
  statement.id = statementId;

  const actor = await createTemplateObject(context, "group", "{{groups.default}}");
  actor.mbox = `mailto:group-${context.generateUuid()}@adlnet.gov`;
  statement.actor = actor;

  const statementContext = await createTemplateObject(context, "context", "{{contexts.category}}");
  const contextActivities = expectJsonObject(statementContext.contextActivities, "format statement context activities");
  statement.context = {
    contextActivities: structuredClone(contextActivities),
  };

  const object = expectObjectProperty(statement, "object", "format statement object");
  const nestedActor = structuredClone(actor);
  nestedActor.name = "Nested Group";
  object.actor = nestedActor;

  const activity = await createTemplateObject(context, "activity", "{{activities.default}}");
  activity.id = `http://example.com/unicode/${context.generateUuid()}`;
  object.object = activity;

  await postStatement(context, statement, 200, "persist format fixture statement");

  return { activity, statement, statementId };
}

async function persistStatementWithAttachments(
  context: DescribeRuntimeContext,
  options: { twoAttachments?: boolean } = {},
): Promise<{ attachments: AttachmentFixture[]; statement: JsonObject; statementId: string }> {
  const statement = await createStatement(context, [{ statement: "{{statements.attachment}}" }]);
  const statementId = context.generateUuid();
  statement.id = statementId;

  const attachments = [loadAttachmentFixture(context, "simple_text1.txt")];
  if (options.twoAttachments) {
    attachments.push(loadAttachmentFixture(context, "simple_text2.txt"));
  }

  statement.attachments = attachments.map((attachment) => ({
    usageType: "http://example.com/attachment-usage/test",
    display: { "en-US": "A test attachment" },
    description: { "en-US": "A test attachment (description)" },
    contentType: attachment.contentType,
    length: attachment.length,
    sha2: attachment.hash,
    fileUrl: "http://over.there.com/file.txt",
  }));

  await postMultipartStatement(context, statement, attachments, 200, "persist statement with attachments");

  return { attachments, statement, statementId };
}

async function persistVoidedQueryFixture(
  context: DescribeRuntimeContext,
): Promise<{ statementRefId: string; voidedId: string; voidingId: string }> {
  const voidedId = context.generateUuid();
  const voidingId = context.generateUuid();
  const statementRefId = context.generateUuid();

  const voidedStatement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
  voidedStatement.id = voidedId;
  await postStatement(context, voidedStatement, 200, "persist voided query fixture statement");

  const voidingStatement = await createStatement(context, [
    { statement: "{{statements.object_statementref}}" },
    { verb: createVoidedVerb() },
  ]);
  voidingStatement.id = voidingId;
  expectObjectProperty(voidingStatement, "object", "voiding query fixture object").id = voidedId;
  await postStatement(context, voidingStatement, 200, "persist voiding query fixture statement");

  const statementRef = await createStatement(context, [{ statement: "{{statements.object_statementref}}" }]);
  statementRef.id = statementRefId;
  expectObjectProperty(statementRef, "object", "statement-ref query fixture object").id = voidedId;
  await postStatement(context, statementRef, 200, "persist statement-ref query fixture statement");

  return { statementRefId, voidedId, voidingId };
}

async function persistFilterCorrectnessFixture(
  context: DescribeRuntimeContext,
): Promise<{ statement: JsonObject; substatement: JsonObject }> {
  const statement = await createStatement(context, [
    { statement: "{{statements.context}}" },
    { context: "{{contexts.category}}" },
    {
      instructor: {
        objectType: "Agent",
        name: "xAPI mbox",
        mbox: `mailto:pri-${context.generateUuid()}@adlnet.gov`,
      },
    },
  ]);
  statement.id = context.generateUuid();
  expectObjectProperty(statement, "verb", "filter correctness statement verb").id =
    `http://example.com/filter/verb/${context.generateUuid()}`;
  expectObjectProperty(statement, "actor", "filter correctness statement actor").mbox =
    `mailto:${context.generateUuid()}@adlnet.gov`;
  expectObjectProperty(statement, "object", "filter correctness statement object").id =
    `http://example.com/filter/activity/${context.generateUuid()}`;
  const statementContext = expectObjectProperty(statement, "context", "filter correctness statement context");
  statementContext.registration = context.generateUuid();
  const statementContextActivities = expectObjectProperty(
    statementContext,
    "contextActivities",
    "filter correctness statement context activities",
  );
  expectObjectProperty(statementContextActivities, "category", "filter correctness statement category").id =
    "http://www.example.com/test/array/statements/pri";
  await postStatement(context, statement, 200, "persist filter correctness statement");

  const substatement = await createStatement(context, [
    { statement: "{{statements.object_substatement}}" },
    { object: "{{substatements.context}}" },
    { context: "{{contexts.category}}" },
    {
      instructor: {
        objectType: "Agent",
        name: "xAPI mbox",
        mbox: `mailto:sub-${context.generateUuid()}@adlnet.gov`,
      },
    },
  ]);
  substatement.id = context.generateUuid();
  expectObjectProperty(substatement, "verb", "filter correctness substatement verb").id =
    `http://example.com/filter/substatement-verb/${context.generateUuid()}`;
  expectObjectProperty(substatement, "actor", "filter correctness substatement actor").mbox =
    `mailto:${context.generateUuid()}@adlnet.gov`;

  const nestedSubstatement = expectObjectProperty(substatement, "object", "filter correctness nested substatement");
  expectObjectProperty(nestedSubstatement, "verb", "filter correctness nested verb").id =
    `http://example.com/filter/nested-verb/${context.generateUuid()}`;
  expectObjectProperty(nestedSubstatement, "actor", "filter correctness nested actor").mbox =
    `mailto:${context.generateUuid()}@adlnet.gov`;
  expectObjectProperty(nestedSubstatement, "object", "filter correctness nested object").id =
    `http://example.com/filter/nested-activity/${context.generateUuid()}`;
  const nestedContext = expectObjectProperty(nestedSubstatement, "context", "filter correctness nested context");
  const nestedContextActivities = expectObjectProperty(
    nestedContext,
    "contextActivities",
    "filter correctness nested context activities",
  );
  expectObjectProperty(nestedContextActivities, "category", "filter correctness nested category").id =
    "http://www.example.com/test/array/statements/sub";
  await postStatement(context, substatement, 200, "persist filter correctness substatement");

  return { statement, substatement };
}

function findStatementById(result: JsonObject, statementId: string, name: string): JsonObject {
  const statements = expectArrayProperty(result, "statements", `${name} statements`);
  const statement = statements.find((value) => isJsonObject(value) && value.id === statementId);
  if (!statement || !isJsonObject(statement)) {
    throw new Error(`Expected "${name}" to include statement ${statementId}.`);
  }

  return statement;
}

function expectSingleLanguageMap(value: unknown, language: string, name: string): void {
  const languageMap = expectJsonObject(value, name);
  const keys = Object.keys(languageMap);
  if (keys.length !== 1 || keys[0] !== language) {
    throw new Error(`Expected ${name} to contain only language ${language}.`);
  }
}

function getResultCount(result: JsonObject, name: string): number {
  return expectArrayProperty(result, "statements", `${name} statements`).length;
}

export function registerStatementResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: StatementResourceOptions = {},
): void {
  runtime.describe("Statement Resource Requirements (Communication 2.1)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00139 - below
     * XAPI-00142 - below
     * XAPI-00143 - below
     * XAPI-00144 - below
     * XAPI-00145 - below
     * XAPI-00146 - below
     * XAPI-00147 - below
     * XAPI-00149 - below
     * XAPI-00150 - below
     * XAPI-00151 - below
     * XAPI-00153 - below
     * XAPI-00154 - below
     * XAPI-00155 - below
     * XAPI-00156 - below
     * XAPI-00158 - below
     * XAPI-00159 - below
     * XAPI-00165 - below
     * XAPI-00166 - below
     * XAPI-00168 - below
     * XAPI-00169 - below
     * XAPI-00170 - below
     * XAPI-00171 - below
     * XAPI-00172 - below
     * XAPI-00173 - below
     * XAPI-00174 - below
     * XAPI-00175 - below
     * XAPI-00176 - below
     * XAPI-00177 - below
     * XAPI-00178 - below
     * XAPI-00179 - below
     * XAPI-00180 - below
     * XAPI-00181 - below
     */

    runtime.describe(
      'An LRS has a Statement Resource with endpoint "base IRI"+"/statements" (Communication 2.1, XAPI-00139)',
      () => {
        runtime.it('should allow "/statements" POST', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          await postStatement(context, statement, 200, "statement resource POST");
        });

        runtime.it('should allow "/statements" PUT', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await putStatement(context, statementId, statement, 204, "statement resource PUT");
        });

        runtime.it('should allow "/statements" GET', async () => {
          const response = await fetchStatements(context, "statement resource GET", {
            verb: "http://adlnet.gov/expapi/non/existent",
          });
          if (response.status !== 200) {
            throw new Error(`Expected statement resource GET to return 200 but received ${response.status}.`);
          }
        });
      },
    );

    runtime.describe(
      "An LRS's Statement Resource upon processing a successful PUT request returns code 204 No Content (Communication 2.1.1.s1, XAPI-00143)",
      () => {
        runtime.it("should persist statement and return status 204", async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await putStatement(context, statementId, statement, 204, "successful PUT request");
        });
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource accepts PUT requests only if it contains a "statementId" parameter (Multiplicity, Communication 2.1.1.s1.table1.row1, XAPI-00144, XAPI-00145)',
      () => {
        runtime.it('should persist statement using "statementId" parameter', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await putStatement(context, statementId, statement, 204, "PUT with statementId parameter");
        });

        runtime.it('should fail without using "statementId" parameter', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          statement.id = context.generateUuid();
          const response = await context.sendJsonRequest({
            method: "PUT",
            path: context.getEndpointStatements(),
            json: statement,
          });
          if (response.status !== 400) {
            throw new Error(`Expected PUT without statementId to return 400 but received ${response.status}.`);
          }
        });
      },
    );

    runtime.describe(
      "An LRS cannot modify a Statement, state, or Object in the event it receives a Statement with statementID equal to a Statement in the LRS already. (Communication 2.1.1.s2.b2, XAPI-00142)",
      () => {
        runtime.it('should not update statement with matching "statementId" on PUT', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;

          await putStatement(context, statementId, statement, 204, "persist initial PUT statement");
          const overwriteResponse = await context.sendJsonRequest({
            method: "PUT",
            path: context.getEndpointStatements(),
            query: { statementId },
            json: createModifiedStatement(statement),
          });
          expectAllowedStatus(overwriteResponse, [204, 409], "attempt to overwrite statement on PUT");

          const response = await fetchStatement(
            context,
            "statementId",
            statementId,
            200,
            "GET immutable PUT statement",
          );
          const retrieved = parseJsonObject(response, "GET immutable PUT statement");
          const originalVerb = expectObjectProperty(statement, "verb", "original PUT verb");
          const retrievedVerb = expectObjectProperty(retrieved, "verb", "retrieved PUT verb");
          if (retrievedVerb.id !== originalVerb.id) {
            throw new Error("Expected PUT re-write attempts to leave the original statement unchanged.");
          }
        });

        runtime.it('should not update statement with matching "statementId" on POST', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;

          await postStatement(context, statement, 200, "persist initial POST statement");
          const overwriteResponse = await context.sendJsonRequest({
            method: "POST",
            path: context.getEndpointStatements(),
            json: createModifiedStatement(statement),
          });
          expectAllowedStatus(overwriteResponse, [200, 409], "attempt to overwrite statement on POST");

          const response = await fetchStatement(
            context,
            "statementId",
            statementId,
            200,
            "GET immutable POST statement",
          );
          const retrieved = parseJsonObject(response, "GET immutable POST statement");
          const originalVerb = expectObjectProperty(statement, "verb", "original POST verb");
          const retrievedVerb = expectObjectProperty(retrieved, "verb", "retrieved POST verb");
          if (retrievedVerb.id !== originalVerb.id) {
            throw new Error("Expected POST re-write attempts to leave the original statement unchanged.");
          }
        });

        if (options.includeV2DuplicateBatchIdCase) {
          runtime.it(
            "should reject a batch of two or more statements where the same ID is used more than once.",
            async () => {
              const first = await createStatement(context, [{ statement: "{{statements.default}}" }]);
              const second = structuredClone(first);
              const duplicateId = context.generateUuid();
              first.id = duplicateId;
              second.id = duplicateId;

              await postStatement(context, [first, second], 400, "duplicate IDs in POST batch");
            },
          );
        }

        if (options.includeV2LastModifiedCase) {
          runtime.it(
            'should include a Last-Modified header which matches the "stored" Timestamp of the statement.',
            async () => {
              const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
              const postResponse = await postStatement(
                context,
                statement,
                200,
                "persist statement for Last-Modified check",
              );
              const statementIds = parseJsonArray(postResponse, "POST IDs for Last-Modified check");
              const statementId = statementIds[0];
              if (typeof statementId !== "string") {
                throw new Error("Expected the Last-Modified POST response to contain a statement ID string.");
              }

              const getResponse = await fetchStatement(
                context,
                "statementId",
                statementId,
                200,
                "GET statement for Last-Modified check",
              );
              const retrieved = parseJsonObject(getResponse, "GET statement for Last-Modified check");
              const stored = parseStoredDate(retrieved.stored, "retrieved stored timestamp");
              const lastModified = parseHttpDate(getResponse.headers.get("Last-Modified"), "Last-Modified header");
              if (stored - (stored % 1000) !== lastModified - (lastModified % 1000)) {
                throw new Error("Expected Last-Modified to match the stored timestamp to the second.");
              }
            },
          );
        }
      },
    );

    runtime.describe("An LRS's Statement Resource accepts POST requests (Communication 2.1.2.s1, XAPI-00147)", () => {
      runtime.it('should persist statement using "POST"', async () => {
        const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
        await postStatement(context, statement, 200, "POST acceptance");
      });
    });

    runtime.describe(
      "An LRS's Statement Resource upon processing a successful POST request returns code 200 OK and all Statement UUIDs within the POST **Implicit** (Communication 2.1.2.s1, XAPI-00146)",
      () => {
        runtime.it('should persist statement using "POST" and return array of IDs', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          statement.id = context.generateUuid();

          const response = await postStatement(context, statement, 200, "POST returning IDs");
          const ids = parseJsonArray(response, "POST returning IDs");
          if (ids.length === 0 || typeof ids[0] !== "string") {
            throw new Error("Expected a successful POST to return an array of statement IDs.");
          }
        });
      },
    );

    runtime.describe("LRS's Statement Resource accepts GET requests (Communication 2.1.3.s1, XAPI-00159)", () => {
      runtime.it("should return using GET", async () => {
        const response = await fetchStatements(context, "GET acceptance");
        if (response.status !== 200) {
          throw new Error(`Expected GET acceptance to return 200 but received ${response.status}.`);
        }
      });
    });

    runtime.describe(
      'An LRS\'s Statement Resource upon processing a successful GET request with a "statementId" parameter, returns code 200 OK and a single Statement with the corresponding "id".  (Communication 2.1.3.s1, XAPI-00156)',
      () => {
        runtime.it('should retrieve statement using "statementId"', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await postStatement(context, statement, 200, "persist statement for GET statementId");

          const response = await fetchStatement(context, "statementId", statementId, 200, "GET by statementId");
          const retrieved = parseJsonObject(response, "GET by statementId");
          if (retrieved.id !== statementId) {
            throw new Error("Expected GET with statementId to return the requested statement.");
          }
        });
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource upon processing a successful GET request with a "voidedStatementId" parameter, returns code 200 OK and a single Statement with the corresponding "id".  (Communication 2.1.3.s1, XAPI-00155)',
      () => {
        runtime.it('should return a voided statement when using GET "voidedStatementId"', async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          const response = await fetchStatement(
            context,
            "voidedStatementId",
            voidedId,
            200,
            "GET by voidedStatementId",
          );
          const retrieved = parseJsonObject(response, "GET by voidedStatementId");
          if (retrieved.id !== voidedId) {
            throw new Error("Expected GET with voidedStatementId to return the requested voided statement.");
          }
        });
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource upon processing a successful GET request with neither a "statementId" nor a "voidedStatementId" parameter, returns code 200 OK and a StatementResult Object.  (Communication 2.1.3.s1, XAPI-00154)',
      () => {
        runtime.it('should return StatementResult using GET without "statementId" or "voidedStatementId"', async () => {
          const fixture = await persistCollectionQueryFixture(context);
          const response = await fetchStatements(context, "GET StatementResult without IDs");
          if (response.status !== 200) {
            throw new Error(`Expected GET StatementResult without IDs to return 200 but received ${response.status}.`);
          }

          const result = parseJsonObject(response, "GET StatementResult without IDs");
          findStatementById(result, fixture.statementId, "GET StatementResult without IDs");
        });

        const queryCaseBuilders: Array<{
          createQuery: (fixture: Awaited<ReturnType<typeof persistCollectionQueryFixture>>) => Record<string, unknown>;
          requireFixtureInResult?: boolean;
          title: string;
        }> = [
          {
            title: 'should return StatementResult using GET with "agent"',
            createQuery: (fixture) => ({ agent: fixture.statement.actor }),
          },
          {
            title: 'should return StatementResult using GET with "verb"',
            createQuery: (fixture) => ({ verb: expectObjectProperty(fixture.statement, "verb", "fixture verb").id }),
          },
          {
            title: 'should return StatementResult using GET with "activity"',
            createQuery: (fixture) => ({
              activity: expectObjectProperty(fixture.statement, "object", "fixture object").id,
            }),
          },
          {
            title: 'should return StatementResult using GET with "registration"',
            createQuery: (fixture) => ({ registration: fixture.registration }),
          },
          {
            title: 'should return StatementResult using GET with "related_activities"',
            createQuery: (fixture) => ({ activity: fixture.categoryId, related_activities: true }),
          },
          {
            title: 'should return StatementResult using GET with "related_agents"',
            createQuery: (fixture) => ({ agent: fixture.instructor, related_agents: true }),
          },
          {
            title: 'should return StatementResult using GET with "since"',
            createQuery: () => ({ since: "2012-06-01T19:09:13.245Z" }),
          },
          {
            title: 'should return StatementResult using GET with "until"',
            createQuery: () => ({ until: "2100-06-01T19:09:13.245Z" }),
          },
          {
            title: 'should return StatementResult using GET with "limit"',
            createQuery: () => ({ limit: 1 }),
          },
          {
            title: 'should return StatementResult using GET with "ascending"',
            createQuery: () => ({ ascending: true }),
            requireFixtureInResult: false,
          },
          {
            title: 'should return StatementResult using GET with "format"',
            createQuery: () => ({ format: "ids" }),
          },
        ];

        for (const queryCase of queryCaseBuilders) {
          runtime.it(queryCase.title, async () => {
            const fixture = await persistCollectionQueryFixture(context);
            const response = await fetchStatements(context, queryCase.title, queryCase.createQuery(fixture));
            if (response.status !== 200) {
              throw new Error(`Expected ${queryCase.title} to return 200 but received ${response.status}.`);
            }

            const result = parseJsonObject(response, queryCase.title);
            if (!Array.isArray(result.statements)) {
              throw new Error(`Expected ${queryCase.title} to return a StatementResult with a statements array.`);
            }

            if (queryCase.requireFixtureInResult !== false) {
              findStatementById(result, fixture.statementId, queryCase.title);
            }
          });
        }

        if (options.includeLegacyStatementResultAttachmentCases) {
          runtime.it(
            'should return multipart response format StatementResult using GET with "attachments" parameter as true',
            async () => {
              const { statementId } = await persistStatementWithAttachments(context, { twoAttachments: true });
              const response = await fetchStatements(context, "GET collection with attachments=true", {
                attachments: true,
              });
              if (response.status !== 200) {
                throw new Error(
                  `Expected GET collection with attachments=true to return 200 but received ${response.status}.`,
                );
              }

              const parts = expectMultipartResponse(response, "GET collection with attachments=true");
              const result = parseJsonObjectText(parts[0]?.bodyText ?? "", "GET collection with attachments=true JSON");
              findStatementById(result, statementId, "GET collection with attachments=true JSON");
            },
          );

          runtime.it(
            'should not return multipart response format using GET with "attachments" parameter as false',
            async () => {
              await persistStatementWithAttachments(context, { twoAttachments: true });
              const response = await fetchStatements(context, "GET collection with attachments=false", {
                attachments: false,
              });
              if (response.status !== 200) {
                throw new Error(
                  `Expected GET collection with attachments=false to return 200 but received ${response.status}.`,
                );
              }

              const contentType = response.headers.get("content-type") ?? "";
              if (!contentType.startsWith("application/json")) {
                throw new Error("Expected attachments=false collection GET to return application/json.");
              }

              parseJsonObject(response, "GET collection with attachments=false");
            },
          );
        }
      },
    );

    const getParameterAcceptanceCases: Array<{
      suiteTitle: string;
      title: string;
      run: () => Promise<void>;
    }> = [
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "statementId" as a parameter (Communication 2.1.3.s1.table1.row1, XAPI-00158)',
        title: 'should process using GET with "statementId"',
        run: async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await postStatement(context, statement, 200, "persist statement for GET statementId parameter");

          const response = await fetchStatement(context, "statementId", statementId, 200, "GET statementId parameter");
          const retrieved = parseJsonObject(response, "GET statementId parameter");
          if (retrieved.id !== statementId) {
            throw new Error("Expected GET with statementId to return the requested statement.");
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "voidedStatementId" as a parameter  (Communication 2.1.3.s1.table1.row2, XAPI-00157)',
        title: 'should process using GET with "voidedStatementId"',
        run: async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          const response = await fetchStatement(
            context,
            "voidedStatementId",
            voidedId,
            200,
            "GET voidedStatementId parameter",
          );
          const retrieved = parseJsonObject(response, "GET voidedStatementId parameter");
          if (retrieved.id !== voidedId) {
            throw new Error("Expected GET with voidedStatementId to return the requested voided statement.");
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "agent" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row3, XAPI-00181)',
        title: 'should process using GET with "agent"',
        run: async () => {
          const agent = await createTemplateObject(context, "agent", "{{agents.default}}");
          const response = await fetchStatements(context, 'GET with "agent" parameter', { agent });
          if (response.status !== 200) {
            throw new Error(`Expected GET with agent to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "verb" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row4, XAPI-00180)',
        title: 'should process using GET with "verb"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "verb" parameter', {
            verb: "http://adlnet.gov/expapi/non/existent",
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with verb to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "activity" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row5, XAPI-00179)',
        title: 'should process using GET with "activity"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "activity" parameter', {
            activity: "http://www.example.com/meetings/occurances/12345",
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with activity to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "registration" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row6, XAPI-00178)',
        title: 'should process using GET with "registration"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "registration" parameter', {
            registration: context.generateUuid(),
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with registration to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "related_activities" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row7)',
        title: 'should process using GET with "related_activities"',
        run: async () => {
          const fixture = await persistCollectionQueryFixture(context);
          const response = await fetchStatements(context, 'GET with "related_activities" parameter', {
            activity: fixture.categoryId,
            related_activities: true,
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with related_activities to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "related_agents" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row8, XAPI-00176)',
        title: 'should process using GET with "related_agents"',
        run: async () => {
          const fixture = await persistCollectionQueryFixture(context);
          const response = await fetchStatements(context, 'GET with "related_agents" parameter', {
            agent: fixture.instructor,
            related_agents: true,
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with related_agents to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "since" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row9, XAPI-00175)',
        title: 'should process using GET with "since"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "since" parameter', {
            since: "2012-06-01T19:09:13.245Z",
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with since to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "until" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row10, XAPI-00174)',
        title: 'should process using GET with "until"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "until" parameter', {
            until: "2012-06-01T19:09:13.245Z",
          });
          if (response.status !== 200) {
            throw new Error(`Expected GET with until to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "limit" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row11, XAPI-00173)',
        title: 'should process using GET with "limit"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "limit" parameter', { limit: 1 });
          if (response.status !== 200) {
            throw new Error(`Expected GET with limit to return 200 but received ${response.status}.`);
          }
        },
      },
      {
        suiteTitle:
          'An LRS\'s Statement Resource can process a GET request with "ascending" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row14, XAPI-00166)',
        title: 'should process using GET with "ascending"',
        run: async () => {
          const response = await fetchStatements(context, 'GET with "ascending" parameter', { ascending: true });
          if (response.status !== 200) {
            throw new Error(`Expected GET with ascending to return 200 but received ${response.status}.`);
          }
        },
      },
    ];

    for (const queryCase of getParameterAcceptanceCases) {
      runtime.describe(queryCase.suiteTitle, () => {
        runtime.it(queryCase.title, queryCase.run);
      });
    }

    runtime.describe(
      'An LRS\'s Statement Resource can process a GET request with "format" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row12)',
      () => {
        runtime.it('should process using GET with "format" absent (XAPI-00168)', async () => {
          const { statement, statementId } = await persistRichFormatStatement(context);
          const response = await fetchStatements(context, "GET with format absent");
          if (response.status !== 200) {
            throw new Error(`Expected GET with format absent to return 200 but received ${response.status}.`);
          }

          const result = parseJsonObject(response, "GET with format absent");
          const retrieved = findStatementById(result, statementId, "GET with format absent");
          const retrievedVerb = expectObjectProperty(retrieved, "verb", "exact verb");
          if (
            !isJsonObject(retrievedVerb.display) ||
            !("en-US" in retrievedVerb.display) ||
            !("en-GB" in retrievedVerb.display)
          ) {
            throw new Error("Expected format absent to preserve the full verb display language map.");
          }

          const originalActor = expectObjectProperty(statement, "actor", "original actor");
          const exactActor = expectObjectProperty(retrieved, "actor", "exact actor");
          if (JSON.stringify(exactActor) !== JSON.stringify(originalActor)) {
            throw new Error("Expected format absent to preserve the stored actor object.");
          }
        });

        runtime.it('should process using GET with "format" canonical (XAPI-00169)', async () => {
          const { activity, statementId } = await persistRichFormatStatement(context);
          const response = await fetchStatements(
            context,
            "GET with format canonical",
            { format: "canonical" },
            { "Accept-Language": "en-GB" },
          );
          if (response.status !== 200) {
            throw new Error(`Expected GET with format canonical to return 200 but received ${response.status}.`);
          }

          const result = parseJsonObject(response, "GET with format canonical");
          const retrieved = findStatementById(result, statementId, "GET with format canonical");
          const retrievedVerb = expectObjectProperty(retrieved, "verb", "canonical verb");
          expectSingleLanguageMap(retrievedVerb.display, "en-GB", "canonical verb display");

          const retrievedContext = expectObjectProperty(retrieved, "context", "canonical context");
          const retrievedContextActivities = expectObjectProperty(
            retrievedContext,
            "contextActivities",
            "canonical context activities",
          );
          const retrievedCategoryList = expectArrayProperty(
            retrievedContextActivities,
            "category",
            "canonical category activities",
          );
          const retrievedCategory = expectJsonObject(retrievedCategoryList[0], "canonical category activity");
          const retrievedDefinition = expectObjectProperty(
            retrievedCategory,
            "definition",
            "canonical activity definition",
          );
          expectSingleLanguageMap(retrievedDefinition.name, "en-GB", "canonical activity name");
          expectSingleLanguageMap(retrievedDefinition.description, "en-GB", "canonical activity description");

          const retrievedSubStatement = expectObjectProperty(retrieved, "object", "canonical substatement");
          const nestedVerb = expectObjectProperty(retrievedSubStatement, "verb", "canonical nested verb");
          expectSingleLanguageMap(nestedVerb.display, "en-GB", "canonical nested verb display");
          const nestedActivity = expectObjectProperty(retrievedSubStatement, "object", "canonical nested activity");
          const nestedDefinition = expectObjectProperty(
            nestedActivity,
            "definition",
            "canonical nested activity definition",
          );
          expectSingleLanguageMap(nestedDefinition.name, "en-GB", "canonical nested activity name");
          expectSingleLanguageMap(nestedDefinition.description, "en-GB", "canonical nested activity description");

          if (nestedActivity.id !== activity.id) {
            throw new Error("Expected canonical format to preserve the nested activity identifier.");
          }
        });

        runtime.it('should process using GET with "format" exact (XAPI-00170)', async () => {
          const { statement, statementId } = await persistRichFormatStatement(context);
          const response = await fetchStatements(context, "GET with format exact", { format: "exact" });
          if (response.status !== 200) {
            throw new Error(`Expected GET with format exact to return 200 but received ${response.status}.`);
          }

          const result = parseJsonObject(response, "GET with format exact");
          const retrieved = findStatementById(result, statementId, "GET with format exact");
          const originalActor = expectObjectProperty(statement, "actor", "original exact actor");
          const exactActor = expectObjectProperty(retrieved, "actor", "exact actor");
          if (JSON.stringify(exactActor) !== JSON.stringify(originalActor)) {
            throw new Error("Expected format exact to preserve the top-level actor object exactly.");
          }

          const originalVerb = expectObjectProperty(statement, "verb", "original exact verb");
          const exactVerb = expectObjectProperty(retrieved, "verb", "exact verb");
          if (JSON.stringify(exactVerb) !== JSON.stringify(originalVerb)) {
            throw new Error("Expected format exact to preserve the top-level verb object exactly.");
          }

          const originalSubStatement = expectObjectProperty(statement, "object", "original exact substatement");
          const exactSubStatement = expectObjectProperty(retrieved, "object", "exact substatement");
          const originalNestedActor = expectObjectProperty(
            originalSubStatement,
            "actor",
            "original exact nested actor",
          );
          const exactNestedActor = expectObjectProperty(exactSubStatement, "actor", "exact nested actor");
          if (JSON.stringify(exactNestedActor) !== JSON.stringify(originalNestedActor)) {
            throw new Error("Expected format exact to preserve the nested actor object exactly.");
          }

          const originalNestedVerb = expectObjectProperty(originalSubStatement, "verb", "original exact nested verb");
          const exactNestedVerb = expectObjectProperty(exactSubStatement, "verb", "exact nested verb");
          if (JSON.stringify(exactNestedVerb) !== JSON.stringify(originalNestedVerb)) {
            throw new Error("Expected format exact to preserve the nested verb object exactly.");
          }

          const originalNestedActivity = expectObjectProperty(
            originalSubStatement,
            "object",
            "original exact nested activity",
          );
          const exactNestedActivity = expectObjectProperty(exactSubStatement, "object", "exact nested activity");
          if (JSON.stringify(exactNestedActivity) !== JSON.stringify(originalNestedActivity)) {
            throw new Error("Expected format exact to preserve the nested activity object exactly.");
          }

          const exactContext = expectObjectProperty(retrieved, "context", "exact context");
          const exactContextActivities = expectObjectProperty(
            exactContext,
            "contextActivities",
            "exact context activities",
          );
          const exactCategoryList = expectArrayProperty(
            exactContextActivities,
            "category",
            "exact category activities",
          );
          const exactCategory = expectJsonObject(exactCategoryList[0], "exact category activity");
          const exactDefinition = expectObjectProperty(exactCategory, "definition", "exact category definition");
          const exactName = expectObjectProperty(exactDefinition, "name", "exact category name");
          const exactDescription = expectObjectProperty(exactDefinition, "description", "exact category description");
          if (
            !("en-US" in exactName) ||
            !("en-GB" in exactName) ||
            !("en-US" in exactDescription) ||
            !("en-GB" in exactDescription)
          ) {
            throw new Error("Expected format exact to preserve both top-level context language map entries.");
          }
        });

        runtime.it('should process using GET with "format" ids (XAPI-00171)', async () => {
          const { activity, statement, statementId } = await persistRichFormatStatement(context);
          const response = await fetchStatements(context, "GET with format ids", { format: "ids" });
          if (response.status !== 200) {
            throw new Error(`Expected GET with format ids to return 200 but received ${response.status}.`);
          }

          const result = parseJsonObject(response, "GET with format ids");
          const retrieved = findStatementById(result, statementId, "GET with format ids");
          const idsActor = expectObjectProperty(retrieved, "actor", "ids actor");
          if (Object.keys(idsActor).length !== 2) {
            throw new Error("Expected format ids to reduce the top-level actor to identifier fields.");
          }

          const idsVerb = expectObjectProperty(retrieved, "verb", "ids verb");
          if (Object.keys(idsVerb).length !== 1) {
            throw new Error("Expected format ids to reduce the top-level verb to its identifier.");
          }

          const idsSubStatement = expectObjectProperty(retrieved, "object", "ids substatement");
          const idsNestedActor = expectObjectProperty(idsSubStatement, "actor", "ids nested actor");
          if (Object.keys(idsNestedActor).length !== 2) {
            throw new Error("Expected format ids to reduce the nested actor to identifier fields.");
          }

          const idsNestedVerb = expectObjectProperty(idsSubStatement, "verb", "ids nested verb");
          if (Object.keys(idsNestedVerb).length !== 1) {
            throw new Error("Expected format ids to reduce the nested verb to its identifier.");
          }

          const idsNestedActivity = expectObjectProperty(idsSubStatement, "object", "ids nested activity");
          if (Object.keys(idsNestedActivity).length !== 1 || idsNestedActivity.id !== activity.id) {
            throw new Error("Expected format ids to reduce the nested activity to its identifier.");
          }

          const originalActor = expectObjectProperty(statement, "actor", "original rich actor");
          if (idsActor.mbox !== originalActor.mbox) {
            throw new Error("Expected format ids to preserve the actor identifier value.");
          }
        });
      },
    );

    runtime.describe(
      'If the "Accept-Language" header is present as part of the GET request to the Statement API and the "format" parameter is set to "canonical", the LRS MUST apply this data to choose the matching language in the response. (Communication 2.1.3.s1.table1.row11, XAPI-00172)',
      () => {
        runtime.it("should apply this data to choose the matching language in the response", async () => {
          const { statementId } = await persistRichFormatStatement(context);
          const response = await fetchStatement(
            context,
            "statementId",
            statementId,
            200,
            "GET statementId canonical with Accept-Language",
            { format: "canonical" },
            { "Accept-Language": "en-GB" },
          );
          const statement = parseJsonObject(response, "GET statementId canonical with Accept-Language");
          const verb = expectObjectProperty(statement, "verb", "canonical Accept-Language verb");
          expectSingleLanguageMap(verb.display, "en-GB", "canonical Accept-Language verb display");

          const contextObject = expectObjectProperty(statement, "context", "canonical Accept-Language context");
          const contextActivities = expectObjectProperty(
            contextObject,
            "contextActivities",
            "canonical Accept-Language context activities",
          );
          const categoryList = expectArrayProperty(
            contextActivities,
            "category",
            "canonical Accept-Language category activities",
          );
          const category = expectJsonObject(categoryList[0], "canonical Accept-Language category activity");
          const definition = expectObjectProperty(
            category,
            "definition",
            "canonical Accept-Language category definition",
          );
          expectSingleLanguageMap(definition.name, "en-GB", "canonical Accept-Language category name");
          expectSingleLanguageMap(definition.description, "en-GB", "canonical Accept-Language category description");
        });

        runtime.it(
          "should NOT apply this data to choose the matching language in the response when format is not set",
          async () => {
            const { statementId } = await persistRichFormatStatement(context);
            const response = await fetchStatement(
              context,
              "statementId",
              statementId,
              200,
              "GET statementId exact with Accept-Language",
              undefined,
              { "Accept-Language": "en-GB" },
            );
            const statement = parseJsonObject(response, "GET statementId exact with Accept-Language");
            const verb = expectObjectProperty(statement, "verb", "exact Accept-Language verb");
            const verbDisplay = expectObjectProperty(verb, "display", "exact Accept-Language verb display");
            if (!("en-US" in verbDisplay) || !("en-GB" in verbDisplay)) {
              throw new Error("Expected format exact to preserve both verb display language entries.");
            }
          },
        );
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource rejects with error code 400 a GET request with both "statementId" and anything other than "attachments" or "format" as parameters (Communication 2.1.3.s2.b2, XAPI-00151)',
      () => {
        const invalidCases: Array<{ title: string; query: (statementId: string) => Record<string, unknown> }> = [
          {
            title: 'should fail when using "statementId" with "agent"',
            query: (statementId) => ({
              statementId,
              agent: { objectType: "Agent", mbox: `mailto:${statementId}@example.com` },
            }),
          },
          {
            title: 'should fail when using "statementId" with "verb"',
            query: (statementId) => ({ statementId, verb: "http://adlnet.gov/expapi/non/existent" }),
          },
          {
            title: 'should fail when using "statementId" with "activity"',
            query: (statementId) => ({ statementId, activity: "http://www.example.com/meetings/occurances/12345" }),
          },
          {
            title: 'should fail when using "statementId" with "registration"',
            query: (statementId) => ({ statementId, registration: context.generateUuid() }),
          },
          {
            title: 'should fail when using "statementId" with "related_activities"',
            query: (statementId) => ({ statementId, related_activities: true }),
          },
          {
            title: 'should fail when using "statementId" with "related_agents"',
            query: (statementId) => ({ statementId, related_agents: true }),
          },
          {
            title: 'should fail when using "statementId" with "since"',
            query: (statementId) => ({ statementId, since: "2012-06-01T19:09:13.245Z" }),
          },
          {
            title: 'should fail when using "statementId" with "until"',
            query: (statementId) => ({ statementId, until: "2100-06-01T19:09:13.245Z" }),
          },
          {
            title: 'should fail when using "statementId" with "limit"',
            query: (statementId) => ({ statementId, limit: 1 }),
          },
          {
            title: 'should fail when using "statementId" with "ascending"',
            query: (statementId) => ({ statementId, ascending: true }),
          },
        ];

        for (const invalidCase of invalidCases) {
          runtime.it(invalidCase.title, async () => {
            const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
            const statementId = context.generateUuid();
            statement.id = statementId;
            await postStatement(context, statement, 200, `persist statement for ${invalidCase.title}`);

            const response = await fetchStatements(context, invalidCase.title, invalidCase.query(statementId));
            if (response.status !== 400) {
              throw new Error(`Expected ${invalidCase.title} to return 400 but received ${response.status}.`);
            }
          });
        }

        runtime.it('should pass when using "statementId" with "format"', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await postStatement(context, statement, 200, "persist statement for statementId+format");

          const response = await fetchStatements(context, "statementId with format", { statementId, format: "ids" });
          if (response.status !== 200) {
            throw new Error(`Expected statementId with format to return 200 but received ${response.status}.`);
          }
        });

        runtime.it('should pass when using "statementId" with "attachments"', async () => {
          const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
          const statementId = context.generateUuid();
          statement.id = statementId;
          await postStatement(context, statement, 200, "persist statement for statementId+attachments");

          const response = await fetchStatements(context, "statementId with attachments", {
            statementId,
            attachments: true,
          });
          if (response.status !== 200) {
            throw new Error(`Expected statementId with attachments to return 200 but received ${response.status}.`);
          }
        });
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource rejects with error code 400 a GET request with both "voidedStatementId" and anything other than "attachments" or "format" as parameters (Communication 2.1.3.s2.b2, XAPI-00150)',
      () => {
        const invalidCases: Array<{ title: string; query: (voidedStatementId: string) => Record<string, unknown> }> = [
          {
            title: 'should fail when using "voidedStatementId" with "agent"',
            query: (voidedStatementId) => ({
              voidedStatementId,
              agent: { objectType: "Agent", mbox: `mailto:${voidedStatementId}@example.com` },
            }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "verb"',
            query: (voidedStatementId) => ({ voidedStatementId, verb: "http://adlnet.gov/expapi/non/existent" }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "activity"',
            query: (voidedStatementId) => ({
              voidedStatementId,
              activity: "http://www.example.com/meetings/occurances/12345",
            }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "registration"',
            query: (voidedStatementId) => ({ voidedStatementId, registration: context.generateUuid() }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "related_activities"',
            query: (voidedStatementId) => ({ voidedStatementId, related_activities: true }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "related_agents"',
            query: (voidedStatementId) => ({ voidedStatementId, related_agents: true }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "since"',
            query: (voidedStatementId) => ({ voidedStatementId, since: "2012-06-01T19:09:13.245Z" }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "until"',
            query: (voidedStatementId) => ({ voidedStatementId, until: "2100-06-01T19:09:13.245Z" }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "limit"',
            query: (voidedStatementId) => ({ voidedStatementId, limit: 1 }),
          },
          {
            title: 'should fail when using "voidedStatementId" with "ascending"',
            query: (voidedStatementId) => ({ voidedStatementId, ascending: true }),
          },
        ];

        for (const invalidCase of invalidCases) {
          runtime.it(invalidCase.title, async () => {
            const { voidedId } = await persistVoidedAndVoidingStatements(context);
            const response = await fetchStatements(context, invalidCase.title, invalidCase.query(voidedId));
            if (response.status !== 400) {
              throw new Error(`Expected ${invalidCase.title} to return 400 but received ${response.status}.`);
            }
          });
        }

        runtime.it('should pass when using "voidedStatementId" with "format"', async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          const response = await fetchStatements(context, "voidedStatementId with format", {
            voidedStatementId: voidedId,
            format: "ids",
          });
          if (response.status !== 200) {
            throw new Error(`Expected voidedStatementId with format to return 200 but received ${response.status}.`);
          }
        });

        runtime.it('should pass when using "voidedStatementId" with "attachments"', async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          const response = await fetchStatements(context, "voidedStatementId with attachments", {
            voidedStatementId: voidedId,
            attachments: true,
          });
          if (response.status !== 200) {
            throw new Error(
              `Expected voidedStatementId with attachments to return 200 but received ${response.status}.`,
            );
          }
        });
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource can process a GET request with "attachments" as a parameter  (**Implicit**, Communication 2.1.3.s1.table1.row13, XAPI-00167)',
      () => {
        if (!options.includeLegacyStatementResultAttachmentCases) {
          runtime.it(
            'should return multipart response format StatementResult using GET with "attachments" parameter as true',
            async () => {
              const { statementId } = await persistStatementWithAttachments(context, { twoAttachments: true });
              const response = await fetchStatements(context, "GET collection with attachments=true", {
                attachments: true,
              });
              if (response.status !== 200) {
                throw new Error(
                  `Expected GET collection with attachments=true to return 200 but received ${response.status}.`,
                );
              }

              const parts = expectMultipartResponse(response, "GET collection with attachments=true");
              const result = parseJsonObjectText(parts[0]?.bodyText ?? "", "GET collection with attachments=true JSON");
              findStatementById(result, statementId, "GET collection with attachments=true JSON");
            },
          );

          runtime.it(
            'should not return multipart response format using GET with "attachments" parameter as false',
            async () => {
              await persistStatementWithAttachments(context, { twoAttachments: true });
              const response = await fetchStatements(context, "GET collection with attachments=false", {
                attachments: false,
              });
              if (response.status !== 200) {
                throw new Error(
                  `Expected GET collection with attachments=false to return 200 but received ${response.status}.`,
                );
              }

              const contentType = response.headers.get("content-type") ?? "";
              if (!contentType.startsWith("application/json")) {
                throw new Error("Expected attachments=false collection GET to return application/json.");
              }

              parseJsonObject(response, "GET collection with attachments=false");
            },
          );
        }

        runtime.it('should process using GET with "attachments"', async () => {
          const { attachments, statementId } = await persistStatementWithAttachments(context, { twoAttachments: true });
          const response = await fetchStatements(context, "GET statementId with attachments=true", {
            attachments: true,
            statementId,
          });
          if (response.status !== 200) {
            throw new Error(
              `Expected GET statementId with attachments=true to return 200 but received ${response.status}.`,
            );
          }

          const parts = expectMultipartResponse(response, "GET statementId with attachments=true");
          const statement = parseJsonObjectText(parts[0]?.bodyText ?? "", "GET statementId with attachments=true JSON");
          if (statement.id !== statementId) {
            throw new Error(
              "Expected GET statementId with attachments=true to return the requested statement in the first multipart part.",
            );
          }

          const hashes = new Set(parts.slice(1).map((part) => part.headers["x-experience-api-hash"]));
          for (const attachment of attachments) {
            if (!hashes.has(attachment.hash)) {
              throw new Error(
                `Expected GET statementId with attachments=true to include attachment hash ${attachment.hash}.`,
              );
            }
          }
        });
      },
    );

    if (options.includeV2SupplementalCases) {
      runtime.describe(
        "An LRS's Statement Resource rejects with error code 400 a GET request with additional properties than extensions in the locations where extensions are allowed",
        () => {
          runtime.it("should fail when using property not defined in specification", async () => {
            const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
            statement.dummy = "dummy";
            await postStatement(context, statement, 400, "statement with property not defined in specification");
          });
        },
      );

      runtime.describe(
        'The LRS shall set the "timestamp" property to the value of the "stored" property if not provided.',
        () => {
          runtime.it(
            'should set timestamp property to equal "stored" value if retrieved statement does not have its own timestamp',
            async () => {
              const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
              const statementId = context.generateUuid();
              statement.id = statementId;
              delete statement.timestamp;

              await postStatement(context, statement, 200, "persist statement without timestamp");

              const response = await fetchStatement(
                context,
                "statementId",
                statementId,
                200,
                "GET statement without timestamp",
              );
              const retrieved = parseJsonObject(response, "GET statement without timestamp");
              if (retrieved.timestamp !== retrieved.stored) {
                throw new Error(
                  "Expected a retrieved statement without an explicit timestamp to use the stored value.",
                );
              }
            },
          );
        },
      );

      runtime.describe(
        "The LRS shall not reject a timestamp for having a greater value than the current time, within an acceptable margin of error",
        () => {
          runtime.it("accepts statements with greater value than current time", async () => {
            const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
            const futureTimestamp = new Date(Date.now() + 5 * 60_000).toISOString();
            statement.id = context.generateUuid();
            statement.timestamp = futureTimestamp;

            await postStatement(context, statement, 200, "persist statement with future timestamp");
          });
        },
      );
    }

    runtime.describe(
      'An LRSs Statement Resource does not return attachment data and only returns application/json if the "attachment" parameter set to "false" (Communication 2.1.3.s1.b1, XAPI-00161)',
      () => {
        runtime.it('should NOT return the attachment if "attachments" is missing', async () => {
          const { statementId } = await persistStatementWithAttachments(context);
          const response = await fetchStatement(
            context,
            "statementId",
            statementId,
            200,
            "GET single statement without attachments query",
          );
          const contentType = response.headers.get("content-type") ?? "";
          if (!contentType.startsWith("application/json")) {
            throw new Error("Expected single-statement GET without attachments query to return application/json.");
          }
        });

        runtime.it('should NOT return the attachment if "attachments" is false', async () => {
          const { statementId } = await persistStatementWithAttachments(context);
          const response = await fetchStatement(
            context,
            "statementId",
            statementId,
            200,
            "GET single statement with attachments=false",
            { attachments: false },
          );
          const contentType = response.headers.get("content-type") ?? "";
          if (!contentType.startsWith("application/json")) {
            throw new Error("Expected single-statement GET with attachments=false to return application/json.");
          }
        });

        runtime.it('should return the attachment when "attachment" is true', async () => {
          const { attachments, statementId } = await persistStatementWithAttachments(context);
          const response = await fetchStatement(
            context,
            "statementId",
            statementId,
            200,
            "GET single statement with attachments=true",
            { attachments: true },
          );
          const parts = expectMultipartResponse(response, "GET single statement with attachments=true");
          const hashSet = new Set(parts.slice(1).map((part) => part.headers["x-experience-api-hash"]));
          if (!hashSet.has(attachments[0]?.hash)) {
            throw new Error(
              "Expected single-statement GET with attachments=true to include the binary attachment part.",
            );
          }
        });
      },
    );

    runtime.describe(
      "An LRS's Statement Resource, upon processing a successful GET request, can only return a Voided Statement if that Statement is specified in the voidedStatementId parameter of that request (Communication 2.1.4.s1.b1, XAPI-00163)",
      () => {
        runtime.it('should not return a voided statement if using GET "statementId"', async () => {
          const { voidedId } = await persistVoidedAndVoidingStatements(context);
          await fetchStatement(context, "statementId", voidedId, 404, "GET statementId for voided statement");
        });
      },
    );

    runtime.describe(
      "An LRS's Statement Resource, upon processing a successful GET request wishing to return a Voided Statement still returns Statements which target it (Communication 2.1.4.s1.b2, XAPI-00162)",
      () => {
        runtime.it(
          'should only return statements stored after designated "since" timestamp when using "since" parameter',
          async () => {
            const { statementRefId, voidedId, voidingId } = await persistVoidedQueryFixture(context);
            const response = await fetchStatements(context, "GET since excluding voided statement", {
              since: new Date(Date.now() - 60_000).toISOString(),
            });
            const result = parseJsonObject(response, "GET since excluding voided statement");
            const ids = expectArrayProperty(result, "statements", "GET since excluding voided statement list")
              .filter(isJsonObject)
              .map((statement) => statement.id);
            if (!ids.includes(statementRefId) || !ids.includes(voidingId) || ids.includes(voidedId)) {
              throw new Error(
                "Expected GET with since to include the statement-ref and voiding statement, but not the voided statement.",
              );
            }
          },
        );

        runtime.it(
          'should only return statements stored at or before designated "before" timestamp when using "until" parameter',
          async () => {
            const { statementRefId, voidedId, voidingId } = await persistVoidedQueryFixture(context);
            const response = await fetchStatements(context, "GET until excluding voided statement", {
              until: new Date(Date.now() + 60_000).toISOString(),
            });
            const result = parseJsonObject(response, "GET until excluding voided statement");
            const ids = expectArrayProperty(result, "statements", "GET until excluding voided statement list")
              .filter(isJsonObject)
              .map((statement) => statement.id);
            if (!ids.includes(statementRefId) || !ids.includes(voidingId) || ids.includes(voidedId)) {
              throw new Error(
                "Expected GET with until to include the statement-ref and voiding statement, but not the voided statement.",
              );
            }
          },
        );

        runtime.it('should return the number of statements listed in "limit" parameter', async () => {
          const { statementRefId, voidedId, voidingId } = await persistVoidedQueryFixture(context);
          const response = await fetchStatements(context, "GET limit excluding voided statement", { limit: 1 });
          const result = parseJsonObject(response, "GET limit excluding voided statement");
          const statements = expectArrayProperty(result, "statements", "GET limit excluding voided statement list");
          if (
            statements.length !== 1 ||
            !isJsonObject(statements[0]) ||
            statements[0].id === voidedId ||
            (statements[0].id !== statementRefId && statements[0].id !== voidingId)
          ) {
            throw new Error(
              "Expected GET with limit=1 to return exactly one statement that targets the voided statement, but not the voided statement itself.",
            );
          }
        });

        runtime.it(
          'should return StatementRef and voiding statement when not using "since", "until", "limit"',
          async () => {
            const { statementRefId, voidedId, voidingId } = await persistVoidedQueryFixture(context);
            const response = await fetchStatements(context, "GET default excluding voided statement");
            const result = parseJsonObject(response, "GET default excluding voided statement");
            const ids = expectArrayProperty(result, "statements", "GET default excluding voided statement list")
              .filter(isJsonObject)
              .map((statement) => statement.id);
            if (!ids.includes(statementRefId) || !ids.includes(voidingId) || ids.includes(voidedId)) {
              throw new Error(
                "Expected default GET to include the statement-ref and voiding statement, but not the voided statement.",
              );
            }
          },
        );
      },
    );

    runtime.describe(
      'The Statements within the "statements" property will correspond to the filtering criterion sent in with the GET request (Communication 2.1.3.s1, XAPI-00164)',
      () => {
        runtime.it('should return StatementResult with statements as array using GET with "agent"', async () => {
          const { statement } = await persistFilterCorrectnessFixture(context);
          const actor = expectObjectProperty(statement, "actor", "filter correctness query actor");
          const response = await fetchStatements(context, "GET strict agent filter", { agent: actor });
          const result = parseJsonObject(response, "GET strict agent filter");
          const statements = expectArrayProperty(result, "statements", "GET strict agent filter list");
          if (
            statements.length === 0 ||
            statements.some(
              (value) => !isJsonObject(value) || !isJsonObject(value.actor) || value.actor.mbox !== actor.mbox,
            )
          ) {
            throw new Error(
              "Expected GET with agent to return only statements whose actor matches the requested agent.",
            );
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "verb"', async () => {
          const { statement } = await persistFilterCorrectnessFixture(context);
          const verb = expectObjectProperty(statement, "verb", "filter correctness query verb").id;
          const response = await fetchStatements(context, "GET strict verb filter", { verb });
          const result = parseJsonObject(response, "GET strict verb filter");
          const statements = expectArrayProperty(result, "statements", "GET strict verb filter list");
          if (
            statements.length === 0 ||
            statements.some((value) => !isJsonObject(value) || !isJsonObject(value.verb) || value.verb.id !== verb)
          ) {
            throw new Error("Expected GET with verb to return only statements whose verb matches the requested id.");
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "activity"', async () => {
          const { statement } = await persistFilterCorrectnessFixture(context);
          const activity = expectObjectProperty(statement, "object", "filter correctness query activity").id;
          const response = await fetchStatements(context, "GET strict activity filter", { activity });
          const result = parseJsonObject(response, "GET strict activity filter");
          const statements = expectArrayProperty(result, "statements", "GET strict activity filter list");
          if (
            statements.length === 0 ||
            statements.some(
              (value) => !isJsonObject(value) || !isJsonObject(value.object) || value.object.id !== activity,
            )
          ) {
            throw new Error(
              "Expected GET with activity to return only statements whose object activity matches the requested id.",
            );
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "registration"', async () => {
          const { statement } = await persistFilterCorrectnessFixture(context);
          const registration = expectObjectProperty(
            statement,
            "context",
            "filter correctness query context",
          ).registration;
          const response = await fetchStatements(context, "GET strict registration filter", { registration });
          const result = parseJsonObject(response, "GET strict registration filter");
          const statements = expectArrayProperty(result, "statements", "GET strict registration filter list");
          if (
            statements.length === 0 ||
            statements.some(
              (value) =>
                !isJsonObject(value) || !isJsonObject(value.context) || value.context.registration !== registration,
            )
          ) {
            throw new Error(
              "Expected GET with registration to return only statements whose context registration matches the requested id.",
            );
          }
        });

        runtime.it(
          'should return StatementResult with statements as array using GET with "related_activities"',
          async () => {
            const { statement } = await persistFilterCorrectnessFixture(context);
            const statementContext = expectObjectProperty(
              statement,
              "context",
              "filter correctness related activities context",
            );
            const statementContextActivities = expectObjectProperty(
              statementContext,
              "contextActivities",
              "filter correctness related activities context activities",
            );
            const categoryId = expectObjectProperty(
              statementContextActivities,
              "category",
              "filter correctness related activities category",
            ).id;
            if (typeof categoryId !== "string") {
              throw new Error("Expected the related_activities fixture category id to be a string.");
            }
            const response = await fetchStatements(context, "GET strict related_activities filter", {
              activity: categoryId,
              related_activities: true,
            });
            const result = parseJsonObject(response, "GET strict related_activities filter");
            const statements = expectArrayProperty(result, "statements", "GET strict related_activities filter list");
            if (statements.length === 0 || statements.some((value) => !deepIncludesValue(value, categoryId))) {
              throw new Error(
                "Expected GET with related_activities=true to return only statements that contain the requested activity id.",
              );
            }
          },
        );

        runtime.it(
          'should return StatementResult with statements as array using GET with "related_agents"',
          async () => {
            const { statement } = await persistFilterCorrectnessFixture(context);
            const statementContext = expectObjectProperty(
              statement,
              "context",
              "filter correctness related agents context",
            );
            const instructor = expectObjectProperty(
              statementContext,
              "instructor",
              "filter correctness related agents instructor",
            );
            const instructorMbox = instructor.mbox;
            if (typeof instructorMbox !== "string") {
              throw new Error("Expected the related_agents fixture instructor mbox to be a string.");
            }
            const response = await fetchStatements(context, "GET strict related_agents filter", {
              agent: instructor,
              related_agents: true,
            });
            const result = parseJsonObject(response, "GET strict related_agents filter");
            const statements = expectArrayProperty(result, "statements", "GET strict related_agents filter list");
            if (statements.length === 0 || statements.some((value) => !deepIncludesValue(value, instructorMbox))) {
              throw new Error(
                "Expected GET with related_agents=true to return only statements that contain the requested agent identifier.",
              );
            }
          },
        );

        runtime.it('should return StatementResult with statements as array using GET with "since"', async () => {
          await persistFilterCorrectnessFixture(context);
          const since = "2012-06-01T19:09:13.245Z";
          const response = await fetchStatements(context, "GET strict since filter", { since });
          const result = parseJsonObject(response, "GET strict since filter");
          const statements = expectArrayProperty(result, "statements", "GET strict since filter list");
          if (
            statements.some(
              (value) =>
                !isJsonObject(value) ||
                parseStoredDate(value.stored, "strict since stored timestamp") < Date.parse(since),
            )
          ) {
            throw new Error("Expected GET with since to return only statements stored after the requested timestamp.");
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "until"', async () => {
          await persistFilterCorrectnessFixture(context);
          const until = new Date(Date.now() + 60_000).toISOString();
          const response = await fetchStatements(context, "GET strict until filter", { until });
          const result = parseJsonObject(response, "GET strict until filter");
          const statements = expectArrayProperty(result, "statements", "GET strict until filter list");
          if (
            statements.some(
              (value) =>
                !isJsonObject(value) ||
                parseStoredDate(value.stored, "strict until stored timestamp") > Date.parse(until),
            )
          ) {
            throw new Error(
              "Expected GET with until to return only statements stored at or before the requested timestamp.",
            );
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "limit"', async () => {
          await persistFilterCorrectnessFixture(context);
          const response = await fetchStatements(context, "GET strict limit filter", { limit: 1 });
          const result = parseJsonObject(response, "GET strict limit filter");
          const statements = expectArrayProperty(result, "statements", "GET strict limit filter list");
          if (statements.length !== 1) {
            throw new Error("Expected GET with limit=1 to return exactly one statement.");
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "ascending"', async () => {
          await persistFilterCorrectnessFixture(context);
          const response = await fetchStatements(context, "GET strict ascending filter", { ascending: true });
          const result = parseJsonObject(response, "GET strict ascending filter");
          const statements = expectArrayProperty(result, "statements", "GET strict ascending filter list").filter(
            isJsonObject,
          );
          for (let index = 0; index < statements.length - 1; index += 1) {
            const current = parseStoredDate(statements[index]?.stored, "strict ascending current stored timestamp");
            const next = parseStoredDate(statements[index + 1]?.stored, "strict ascending next stored timestamp");
            if (current > next) {
              throw new Error(
                "Expected GET with ascending=true to return statements sorted by stored time in ascending order.",
              );
            }
          }
        });

        runtime.it('should return StatementResult with statements as array using GET with "format"', async () => {
          await persistFilterCorrectnessFixture(context);
          const response = await fetchStatements(context, "GET strict format filter", { format: "ids" });
          const result = parseJsonObject(response, "GET strict format filter");
          expectArrayProperty(result, "statements", "GET strict format filter list");
        });

        runtime.it('should return StatementResult with statements as array using GET with "attachments"', async () => {
          await persistStatementWithAttachments(context);
          const response = await fetchStatements(context, "GET strict attachments filter", { attachments: true });
          const parts = expectMultipartResponse(response, "GET strict attachments filter");
          const result = parseJsonObjectText(parts[0]?.bodyText ?? "", "GET strict attachments filter JSON");
          expectArrayProperty(result, "statements", "GET strict attachments filter list");
        });
      },
    );

    runtime.describe(
      'The LRS will NOT reject a GET request which returns an empty "statements" property (**Implicit**, Communication 2.1.3.s2.b4, XAPI-00149)',
      () => {
        runtime.it("should return empty array list", async () => {
          const response = await fetchStatements(context, "empty statement result", {
            verb: "http://adlnet.gov/expapi/non/existent",
          });
          if (response.status !== 200) {
            throw new Error(`Expected empty statement result to return 200 but received ${response.status}.`);
          }

          const result = parseJsonObject(response, "empty statement result");
          if (getResultCount(result, "empty statement result") !== 0) {
            throw new Error("Expected a GET with no matching statements to return an empty statements array.");
          }
        });
      },
    );

    runtime.describe(
      'An LRS\'s Statement Resource upon processing a GET request, returns a header with name "X-Experience-API-Consistent-Through" regardless of the code returned. (Communication 2.1.3.s2.b5, XAPI-00153)',
      () => {
        const consistentThroughCases: QueryCase[] = [
          { name: 'should return "X-Experience-API-Consistent-Through" using GET' },
          {
            name: 'should return "X-Experience-API-Consistent-Through" misusing GET (status code 400)',
            expectedStatus: 400,
            rawPath: `${context.getEndpointStatements()}?LIMIT=1`,
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "agent"',
            query: { agent: { objectType: "Agent", mbox: `mailto:${context.generateUuid()}@example.com` } },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "verb"',
            query: { verb: "http://adlnet.gov/expapi/non/existent" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "activity"',
            query: { activity: "http://www.example.com/meetings/occurances/12345" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "registration"',
            query: { registration: context.generateUuid() },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "related_activities"',
            query: { related_activities: true },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "related_agents"',
            query: { related_agents: true },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "since"',
            query: { since: "2012-06-01T19:09:13.245Z" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "until"',
            query: { until: "2100-06-01T19:09:13.245Z" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "limit"',
            query: { limit: 1 },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "ascending"',
            query: { ascending: true },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "format"',
            query: { format: "ids" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "attachments"',
            query: { attachments: true },
          },
        ];

        for (const queryCase of consistentThroughCases) {
          runtime.it(queryCase.name, async () => {
            const response = queryCase.rawPath
              ? await fetchRawStatements(context, queryCase.name, queryCase.rawPath, queryCase.headers)
              : await fetchStatements(context, queryCase.name, queryCase.query, queryCase.headers);
            const expectedStatus = queryCase.expectedStatus ?? 200;
            if (response.status !== expectedStatus) {
              throw new Error(
                `Expected ${queryCase.name} to return ${expectedStatus} but received ${response.status}.`,
              );
            }

            if (!response.headers.get("X-Experience-API-Consistent-Through")) {
              throw new Error(`Expected ${queryCase.name} to include X-Experience-API-Consistent-Through.`);
            }
          });
        }
      },
    );

    runtime.describe(
      'An LRS\'s "X-Experience-API-Consistent-Through" header is an ISO 8601 combined date and time (Type, Communication 2.1.3.s2.b5).',
      () => {
        const isoCases: QueryCase[] = [
          { name: 'should return valid "X-Experience-API-Consistent-Through" using GET' },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "agent"',
            query: { agent: { objectType: "Agent", mbox: `mailto:${context.generateUuid()}@example.com` } },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "verb"',
            query: { verb: "http://adlnet.gov/expapi/non/existent" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "activity"',
            query: { activity: "http://www.example.com/meetings/occurances/12345" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "registration"',
            query: { registration: context.generateUuid() },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "related_activities"',
            query: { related_activities: true },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "related_agents"',
            query: { related_agents: true },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "since"',
            query: { since: "2012-06-01T19:09:13.245Z" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "until"',
            query: { until: "2100-06-01T19:09:13.245Z" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "limit"',
            query: { limit: 1 },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "ascending"',
            query: { ascending: true },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "format"',
            query: { format: "ids" },
          },
          {
            name: 'should return "X-Experience-API-Consistent-Through" using GET with "attachments"',
            query: { attachments: true },
          },
        ];

        for (const queryCase of isoCases) {
          runtime.it(queryCase.name, async () => {
            const response = queryCase.rawPath
              ? await fetchRawStatements(context, queryCase.name, queryCase.rawPath, queryCase.headers)
              : await fetchStatements(context, queryCase.name, queryCase.query, queryCase.headers);
            if (response.status !== 200) {
              throw new Error(`Expected ${queryCase.name} to return 200 but received ${response.status}.`);
            }

            const value = response.headers.get("X-Experience-API-Consistent-Through");
            if (!value || Number.isNaN(Date.parse(value))) {
              throw new Error(`Expected ${queryCase.name} to return a valid ISO timestamp header.`);
            }
          });
        }
      },
    );

    runtime.describe(
      'An LRSs Statement Resource, upon receiving a GET request, MUST have a "Content-Type" header(**Implicit**, Communication 2.1.3.s1.table1.row14, XAPI-00165)',
      () => {
        runtime.it("should contain the content-type header", async () => {
          const response = await fetchStatements(context, "GET content-type header", { ascending: true });
          if (response.status !== 200) {
            throw new Error(`Expected GET content-type header to return 200 but received ${response.status}.`);
          }

          const contentType = response.headers.get("content-type");
          if (!contentType) {
            throw new Error("Expected GET statement responses to include a content-type header.");
          }
        });
      },
    );
  });
}
