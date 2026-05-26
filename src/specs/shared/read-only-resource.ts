import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue, TemplateLayer } from "../../describe-runtime/templates.ts";

import { registerAboutVersionHeaderExceptionCases } from "./protocol-requirements.ts";

type ActivitiesResourceOptions = {
  includeUnseenActivityCase?: boolean;
};

const aboutVersionPattern = /^(?:0\.9|0\.95|1\.0\.\d+|2\.0\.0)$/;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectJsonObject(value: unknown, name: string): JsonObject {
  if (!isJsonObject(value)) {
    throw new Error(`Expected ${name} to be a JSON object.`);
  }

  return value;
}

function expectJsonArray(value: unknown, name: string): JsonValue[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected ${name} to be a JSON array.`);
  }

  return value;
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  return expectJsonObject(JSON.parse(response.bodyText) as unknown, name);
}

function expectStringProperty(parent: JsonObject, key: string, name: string): string {
  const value = parent[key];
  if (typeof value !== "string") {
    throw new Error(`Expected ${name} to include a string "${key}" property.`);
  }

  return value;
}

function expectObjectProperty(parent: JsonObject, key: string, name: string): JsonObject {
  return expectJsonObject(parent[key], `${name} ${key}`);
}

function expectStringArrayProperty(parent: JsonObject, key: string, name: string): string[] {
  const values = expectJsonArray(parent[key], `${name} ${key}`);
  if (values.some((value) => typeof value !== "string")) {
    throw new Error(`Expected ${name} ${key} to contain only strings.`);
  }

  return values as string[];
}

function expectObjectArrayProperty(parent: JsonObject, key: string, name: string): JsonObject[] {
  const values = expectJsonArray(parent[key], `${name} ${key}`);
  if (values.some((value) => !isJsonObject(value))) {
    throw new Error(`Expected ${name} ${key} to contain only objects.`);
  }

  return values as JsonObject[];
}

async function sendRequest(
  context: DescribeRuntimeContext,
  method: "GET" | "POST",
  path: string,
  expectedStatus: number,
  name: string,
  query?: Record<string, unknown>,
  body?: JsonValue,
): Promise<JsonResponse> {
  const response = await context.sendRequest({
    method,
    path,
    query,
    body,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${name} to return ${expectedStatus}, received ${response.status}.`);
  }

  return response;
}

async function postStatements(context: DescribeRuntimeContext, statements: JsonObject[], name: string): Promise<void> {
  await sendRequest(context, "POST", context.getEndpointStatements(), 200, name, undefined, statements);
}

async function createTemplateStatement(
  context: DescribeRuntimeContext,
  layers: TemplateLayer[],
  name: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(layers);
  return structuredClone(expectJsonObject(payload.statement, name));
}

async function createDefaultStatement(context: DescribeRuntimeContext, name: string): Promise<JsonObject> {
  return createTemplateStatement(context, [{ statement: "{{statements.default}}" }], name);
}

async function createActorStatement(
  context: DescribeRuntimeContext,
  actorTemplate: string,
  name: string,
): Promise<JsonObject> {
  return createTemplateStatement(context, [{ statement: "{{statements.no_actor}}" }, { actor: actorTemplate }], name);
}

async function createActivityStatement(context: DescribeRuntimeContext, name: string): Promise<JsonObject> {
  return createTemplateStatement(
    context,
    [{ statement: "{{statements.object_activity}}" }, { object: "{{activities.default}}" }],
    name,
  );
}

function expectJsonEquals(actual: unknown, expected: JsonObject, name: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${name} to equal the stored resource.`);
  }
}

export function registerAboutResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("About Resource Requirements (Communication 2.8)", () => {
    runtime.it(
      'An LRS has an About Resource with endpoint "base IRI"+"/about" (Communication 2.8, XAPI-00315)',
      async () => {
        await sendRequest(context, "GET", context.getEndpointAbout(), 200, "About endpoint existence");
      },
    );

    runtime.it(
      "An LRS's About Resource upon processing a successful GET request returns a version property and code 200 OK (multiplicity, Communication 2.8.s4, XAPI-00319)",
      async () => {
        const response = await sendRequest(context, "GET", context.getEndpointAbout(), 200, "About GET request");
        const about = parseJsonObject(response, "About GET request");
        expectStringArrayProperty(about, "version", "About GET request");
      },
    );

    runtime.it(
      "An LRS's About Resource's version property is an array of strings (format, Communication 2.8.s4.table1.row1, XAPI-00318)",
      async () => {
        const response = await sendRequest(
          context,
          "GET",
          context.getEndpointAbout(),
          200,
          "About version array check",
        );
        const about = parseJsonObject(response, "About version array check");
        expectStringArrayProperty(about, "version", "About version array check");
      },
    );

    runtime.it(
      `An LRS's About Resource's version property contains at least one string of "${context.options.xapiVersion}" (Communication 2.8.s5.b1.b1, XAPI-00317)`,
      async () => {
        const response = await sendRequest(
          context,
          "GET",
          context.getEndpointAbout(),
          200,
          "About version membership check",
        );
        const about = parseJsonObject(response, "About version membership check");
        const versions = expectStringArrayProperty(about, "version", "About version membership check");
        if (!versions.includes(context.options.xapiVersion)) {
          throw new Error(`Expected About version list to include ${context.options.xapiVersion}.`);
        }
      },
    );

    runtime.it(
      'An LRS\'s About Resource\'s version property can only have values of "0.9", "0.95", "1.0.0", or ""1.0." + X" with (Communication 2.8.s5.b1.b1, XAPI-00316)',
      async () => {
        const response = await sendRequest(
          context,
          "GET",
          context.getEndpointAbout(),
          200,
          "About allowed versions check",
        );
        const about = parseJsonObject(response, "About allowed versions check");
        const versions = expectStringArrayProperty(about, "version", "About allowed versions check");
        if (!versions.every((version) => aboutVersionPattern.test(version))) {
          throw new Error("Expected About version values to stay within the allowed version vocabulary.");
        }
      },
    );

    registerAboutVersionHeaderExceptionCases(runtime, context);
  });
}

export function registerAgentsResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Agents Resource Requirements (Communication 2.4)", () => {
    runtime.it(
      'An LRS has an Agents Resource with endpoint "base IRI" + /agents" (Communication 2.4, XAPI-00245) **Implicit** (in that it is not named this by the spec)',
      async () => {
        const statement = await createDefaultStatement(context, "Agents endpoint statement");
        const actor = expectJsonObject(statement.actor, "Agents endpoint actor");
        await postStatements(context, [statement], "Agents endpoint statement write");
        await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents endpoint GET", { agent: actor });
      },
    );

    runtime.it("An LRS's Agents Resource accepts GET requests (Communication 2.4.s2, XAPI-00236)", async () => {
      const statement = await createDefaultStatement(context, "Agents acceptance statement");
      const actor = expectJsonObject(statement.actor, "Agents acceptance actor");
      const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents acceptance GET", {
        agent: actor,
      });
      const person = parseJsonObject(response, "Agents acceptance GET");
      if (person.objectType !== "Person") {
        throw new Error("Expected the Agents resource to return a Person object.");
      }
    });

    runtime.it(
      'An LRS\'s Agent Resource upon processing a successful GET request returns a Person Object if the "agent" parameter can be found in the LRS and code 200 OK (Communication 2.4.s2.table1.row1, XAPI-00248)',
      async () => {
        const statement = await createDefaultStatement(context, "Agents found statement");
        const actor = expectJsonObject(statement.actor, "Agents found actor");
        await postStatements(context, [statement], "Agents found statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents found GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents found GET");
        if (person.objectType !== "Person") {
          throw new Error("Expected the Agents resource to return a Person object.");
        }
      },
    );

    runtime.it(
      'An LRS\'s Agents Resource rejects a GET request without "agent" as a parameter with error code 400 Bad Request (multiplicity, Communication 2.4.s2.table1.row1, XAPI-00243)',
      async () => {
        await sendRequest(context, "GET", context.getEndpointAgents(), 400, "Agents missing agent query");
      },
    );

    runtime.it(
      'A Person Object\'s "objectType" property is a String and is "Person" (Format, Vocabulary, Communication 2.4.s5.table1.row1, XAPI-00237)',
      async () => {
        const statement = await createDefaultStatement(context, "Agents objectType statement");
        const actor = expectJsonObject(statement.actor, "Agents objectType actor");
        await postStatements(context, [statement], "Agents objectType statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents objectType GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents objectType GET");
        if (person.objectType !== "Person") {
          throw new Error('Expected the Person objectType to be "Person".');
        }
      },
    );

    runtime.it(
      'A Person Object\'s "name" property is an Array of Strings (Multiplicity, Communication 2.4.s5.table1.row2, XAPI-00238)',
      async () => {
        const statement = await createDefaultStatement(context, "Agents name statement");
        const actor = expectJsonObject(statement.actor, "Agents name actor");
        await postStatements(context, [statement], "Agents name statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents name GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents name GET");
        expectStringArrayProperty(person, "name", "Agents name GET");
      },
    );

    runtime.it(
      'A Person Object\'s "mbox" property is an Array of IRIs (Multiplicity, Communication 2.4.s5.table1.row3, XAPI-00239)',
      async () => {
        const statement = await createDefaultStatement(context, "Agents mbox statement");
        const actor = expectJsonObject(statement.actor, "Agents mbox actor");
        await postStatements(context, [statement], "Agents mbox statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents mbox GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents mbox GET");
        const mboxes = expectStringArrayProperty(person, "mbox", "Agents mbox GET");
        if (mboxes.some((value) => !value.startsWith("mailto:"))) {
          throw new Error("Expected every Person mbox value to be a mailto IRI.");
        }
      },
    );

    runtime.it(
      'A Person Object\'s "mbox" entries have the form "mailto:emailaddress" (Format, Communication 2.4.s5.table1.row3, XAPI-00244)',
      async () => {
        const statement = await createDefaultStatement(context, "Agents mailto statement");
        const actor = expectJsonObject(statement.actor, "Agents mailto actor");
        await postStatements(context, [statement], "Agents mailto statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents mailto GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents mailto GET");
        const mboxes = expectStringArrayProperty(person, "mbox", "Agents mailto GET");
        if (mboxes.some((value) => !/^mailto:.+/.test(value))) {
          throw new Error("Expected every Person mbox entry to match the mailto:emailaddress form.");
        }
      },
    );

    runtime.it(
      'A Person Object\'s "mbox_sha1sum" property is an Array of Strings (Multiplicity, Communication 2.4.s5.table1.row4, XAPI-00240)',
      async () => {
        const statement = await createActorStatement(
          context,
          "{{agents.mbox_sha1sum}}",
          "Agents mbox_sha1sum statement",
        );
        const actor = expectJsonObject(statement.actor, "Agents mbox_sha1sum actor");
        await postStatements(context, [statement], "Agents mbox_sha1sum statement write");
        const response = await sendRequest(
          context,
          "GET",
          context.getEndpointAgents(),
          200,
          "Agents mbox_sha1sum GET",
          { agent: actor },
        );
        const person = parseJsonObject(response, "Agents mbox_sha1sum GET");
        expectStringArrayProperty(person, "mbox_sha1sum", "Agents mbox_sha1sum GET");
      },
    );

    runtime.it(
      'A Person Object\'s "openid" property is an Array of Strings (Multiplicity, Communication 2.4.s5.table1.row5, XAPI-00241)',
      async () => {
        const statement = await createActorStatement(context, "{{agents.openid}}", "Agents openid statement");
        const actor = expectJsonObject(statement.actor, "Agents openid actor");
        await postStatements(context, [statement], "Agents openid statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents openid GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents openid GET");
        expectStringArrayProperty(person, "openid", "Agents openid GET");
      },
    );

    runtime.it(
      'A Person Object\'s "account" property is an Array of Account Objects (Multiplicity, Communication 2.4.s5.table1.row6, XAPI-00242)',
      async () => {
        const statement = await createActorStatement(context, "{{agents.account}}", "Agents account statement");
        const actor = expectJsonObject(statement.actor, "Agents account actor");
        await postStatements(context, [statement], "Agents account statement write");
        const response = await sendRequest(context, "GET", context.getEndpointAgents(), 200, "Agents account GET", {
          agent: actor,
        });
        const person = parseJsonObject(response, "Agents account GET");
        expectObjectArrayProperty(person, "account", "Agents account GET");
      },
    );

    runtime.it(
      'An LRSs Agents Resource rejects a GET request with "agent" as a parameter if it is not a valid, in structure, Agent with error code 400 Bad Request (Communication 2.4, XAPI-00249)',
      async () => {
        await sendRequest(context, "GET", context.getEndpointAgents(), 400, "Agents invalid query", {
          agent: { objectType: "Agent" },
        });
      },
    );
  });
}

export function registerActivitiesResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: ActivitiesResourceOptions = {},
): void {
  runtime.describe("Activities Resource Requirements (Communication 2.5)", () => {
    runtime.it(
      'An LRS has an Activities Resource with endpoint "base IRI" + /activities" (Communication 2.5, Implicit) **Implicit** (in that it is not named this by the spec)',
      async () => {
        const statement = await createDefaultStatement(context, "Activities endpoint statement");
        const activity = expectJsonObject(statement.object, "Activities endpoint activity");
        await postStatements(context, [statement], "Activities endpoint statement write");
        await sendRequest(context, "GET", context.getEndpointActivities(), 200, "Activities endpoint GET", {
          activityId: expectStringProperty(activity, "id", "Activities endpoint activity"),
        });
      },
    );

    runtime.it("An LRS's Activities Resource accepts GET requests (Communication 2.5, XAPI-00253)", async () => {
      const statement = await createDefaultStatement(context, "Activities acceptance statement");
      const activity = expectJsonObject(statement.object, "Activities acceptance activity");
      await postStatements(context, [statement], "Activities acceptance statement write");
      await sendRequest(context, "GET", context.getEndpointActivities(), 200, "Activities acceptance GET", {
        activityId: expectStringProperty(activity, "id", "Activities acceptance activity"),
      });
    });

    runtime.it(
      "An LRS's Activities Resource upon processing a successful GET request returns the complete Activity Object (Communication 2.5.s1)",
      async () => {
        const statement = await createActivityStatement(context, "Activities complete object statement");
        const activity = expectJsonObject(statement.object, "Activities complete object activity");
        const activityId = `http://www.example.com/verify/complete/${context.generateUuid()}`;
        activity.id = activityId;

        await postStatements(context, [statement], "Activities complete object statement write");
        const response = await sendRequest(
          context,
          "GET",
          context.getEndpointActivities(),
          200,
          "Activities complete object GET",
          { activityId },
        );

        expectJsonEquals(parseJsonObject(response, "Activities complete object GET"), activity, "Activities resource");
      },
    );

    runtime.it(
      'An LRS\'s Activities Resource rejects a GET request without "activityId" as a parameter with error code 400 Bad Request (multiplicity, Communication.md#2.5.s1.table1.row1, XAPI-00250)',
      async () => {
        await sendRequest(context, "GET", context.getEndpointActivities(), 400, "Activities missing activityId");
      },
    );

    runtime.it(
      'An LRS\'s Activities Resource rejects a GET request with "activityId" as a parameter if it is not type "String" with error code 400 Bad Request (format, Communication 2.5.s1.table1.row1)',
      async () => {
        await sendRequest(context, "GET", context.getEndpointActivities(), 400, "Activities invalid activityId", {
          activityId: true,
        });
      },
    );

    runtime.it(
      'The Activity Object must contain all available information about an activity from any statements who target the same "activityId". For example, LRS accepts two statements each with a different language description of an activity using the exact same "activityId". The LRS must return both language descriptions when a GET request is made to the Activities endpoint for that "activityId" (multiplicity, Communication.md#2.5.s1.table1.row1, XAPI-00254)',
      async () => {
        const firstStatement = await createActivityStatement(context, "Activities merge first statement");
        const secondStatement = await createActivityStatement(context, "Activities merge second statement");
        const firstActivity = expectJsonObject(firstStatement.object, "Activities merge first activity");
        const secondActivity = expectJsonObject(secondStatement.object, "Activities merge second activity");
        const activityId = `http://www.example.com/verify/complete/${context.generateUuid()}`;
        firstActivity.id = activityId;
        secondActivity.id = activityId;

        const firstDefinition = expectObjectProperty(firstActivity, "definition", "Activities merge first definition");
        const firstNames = expectObjectProperty(firstDefinition, "name", "Activities merge first names");
        const englishName = expectStringProperty(firstNames, "en-US", "Activities merge English name");
        const secondDefinition = expectObjectProperty(
          secondActivity,
          "definition",
          "Activities merge second definition",
        );
        const secondNames = expectObjectProperty(secondDefinition, "name", "Activities merge second names");
        secondNames["fr-FR"] = "meeting-fr";
        delete secondNames["en-US"];

        await postStatements(context, [firstStatement, secondStatement], "Activities merge statements write");
        const response = await sendRequest(
          context,
          "GET",
          context.getEndpointActivities(),
          200,
          "Activities merge GET",
          {
            activityId,
          },
        );

        const activity = parseJsonObject(response, "Activities merge GET");
        const definition = expectObjectProperty(activity, "definition", "Activities merge response definition");
        const names = expectObjectProperty(definition, "name", "Activities merge response names");
        if (names["en-US"] !== englishName || names["fr-FR"] !== "meeting-fr") {
          throw new Error("Expected the Activities resource to merge language maps across matching activityIds.");
        }
      },
    );

    if (options.includeUnseenActivityCase) {
      runtime.it(
        "If an LRS does not have a canonical definition of the Activity to return, the LRS shall still return an Activity Object when queried.",
        async () => {
          const activityId = `http://www.example.com/never-before-seen-activityId/${context.generateUuid()}`;
          const response = await sendRequest(
            context,
            "GET",
            context.getEndpointActivities(),
            200,
            "Activities unseen activity GET",
            { activityId },
          );
          const activity = parseJsonObject(response, "Activities unseen activity GET");
          if (activity.id !== activityId || activity.objectType !== "Activity") {
            throw new Error("Expected unseen activity lookups to synthesize a minimal Activity object.");
          }
        },
      );
    }
  });
}
