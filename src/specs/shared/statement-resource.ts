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
  includeV2DuplicateBatchIdCase?: boolean;
  includeV2LastModifiedCase?: boolean;
};

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
          await putStatement(
            context,
            statementId,
            createModifiedStatement(statement),
            204,
            "attempt to overwrite statement on PUT",
          );

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
          await postStatement(
            context,
            createModifiedStatement(statement),
            200,
            "attempt to overwrite statement on POST",
          );

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
            findStatementById(result, fixture.statementId, queryCase.title);
          });
        }
      },
    );

    runtime.describe("GET parameter acceptance (Communication 2.1.3.s1.table1)", () => {
      runtime.it('should process using GET with "statementId"', async () => {
        const statement = await createStatement(context, [{ statement: "{{statements.default}}" }]);
        const statementId = context.generateUuid();
        statement.id = statementId;
        await postStatement(context, statement, 200, "persist statement for GET statementId parameter");

        const response = await fetchStatement(context, "statementId", statementId, 200, "GET statementId parameter");
        if (response.status !== 200) {
          throw new Error(`Expected GET with statementId to return 200 but received ${response.status}.`);
        }
      });

      runtime.it('should process using GET with "voidedStatementId"', async () => {
        const { voidedId } = await persistVoidedAndVoidingStatements(context);
        const response = await fetchStatement(
          context,
          "voidedStatementId",
          voidedId,
          200,
          "GET voidedStatementId parameter",
        );
        if (response.status !== 200) {
          throw new Error(`Expected GET with voidedStatementId to return 200 but received ${response.status}.`);
        }
      });

      const queryCaseBuilders: Array<{
        createQuery: (fixture: Awaited<ReturnType<typeof persistCollectionQueryFixture>>) => Record<string, unknown>;
        title: string;
      }> = [
        {
          title: 'should process using GET with "agent"',
          createQuery: (fixture) => ({ agent: fixture.statement.actor }),
        },
        {
          title: 'should process using GET with "verb"',
          createQuery: (fixture) => ({ verb: expectObjectProperty(fixture.statement, "verb", "fixture verb").id }),
        },
        {
          title: 'should process using GET with "activity"',
          createQuery: (fixture) => ({
            activity: expectObjectProperty(fixture.statement, "object", "fixture object").id,
          }),
        },
        {
          title: 'should process using GET with "registration"',
          createQuery: (fixture) => ({ registration: fixture.registration }),
        },
        {
          title: 'should process using GET with "related_activities"',
          createQuery: (fixture) => ({ activity: fixture.categoryId, related_activities: true }),
        },
        {
          title: 'should process using GET with "related_agents"',
          createQuery: (fixture) => ({ agent: fixture.instructor, related_agents: true }),
        },
        {
          title: 'should process using GET with "since"',
          createQuery: () => ({ since: "2012-06-01T19:09:13.245Z" }),
        },
        {
          title: 'should process using GET with "until"',
          createQuery: () => ({ until: "2100-06-01T19:09:13.245Z" }),
        },
        {
          title: 'should process using GET with "limit"',
          createQuery: () => ({ limit: 1 }),
        },
        {
          title: 'should process using GET with "ascending"',
          createQuery: () => ({ ascending: true }),
        },
      ];

      for (const queryCase of queryCaseBuilders) {
        runtime.it(queryCase.title, async () => {
          const fixture = await persistCollectionQueryFixture(context);
          const response = await fetchStatements(context, queryCase.title, queryCase.createQuery(fixture));
          if (response.status !== 200) {
            throw new Error(`Expected ${queryCase.title} to return 200 but received ${response.status}.`);
          }
        });
      }
    });

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
