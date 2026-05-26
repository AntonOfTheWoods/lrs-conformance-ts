import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue } from "../../describe-runtime/templates.ts";

type DocumentMethod = "DELETE" | "GET" | "POST" | "PUT";

type ConcurrencyResourceConfig = {
  buildParams: (context: DescribeRuntimeContext) => JsonObject;
  name: string;
  path: (context: DescribeRuntimeContext) => string;
};

type ConcurrencySuiteOptions = {
  etagPattern: RegExp;
  includeIfMatchPostAndDeleteCases?: boolean;
  includeIfNoneMatchCases?: boolean;
  requirementTitle: string;
  resources: readonly ConcurrencyResourceConfig[];
};

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonObject(response: JsonResponse, name: string): JsonObject {
  const parsed = JSON.parse(response.bodyText) as unknown;
  if (!isJsonObject(parsed)) {
    throw new Error(`Expected ${name} to return a JSON object response.`);
  }

  return parsed;
}

function expectJsonEquals(actual: unknown, expected: JsonObject, name: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${name} to equal the stored document.`);
  }
}

async function sendDocumentRequest(
  context: DescribeRuntimeContext,
  method: DocumentMethod,
  path: string,
  query: Record<string, unknown>,
  expectedStatus: number,
  name: string,
  body?: JsonValue | string,
  headers?: Record<string, string>,
): Promise<JsonResponse> {
  const response = await context.sendRequest({
    method,
    path,
    query,
    body,
    headers,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${name} to return ${expectedStatus}, received ${response.status}.`);
  }

  return response;
}

async function fetchDocumentObject(
  context: DescribeRuntimeContext,
  resource: ConcurrencyResourceConfig,
  query: Record<string, unknown>,
  name: string,
): Promise<JsonObject> {
  const response = await sendDocumentRequest(context, "GET", resource.path(context), query, 200, name);
  return parseJsonObject(response, name);
}

function createUpdatedDocument(document: JsonObject, suffix: string): JsonObject {
  return {
    ...structuredClone(document),
    name: `Updated Name:${suffix}`,
  };
}

function expectQuotedEtag(etag: string, name: string): void {
  const normalized = etag.startsWith("W/") ? etag.slice(2) : etag;
  if (!normalized.startsWith('"') || !normalized.endsWith('"') || normalized.length < 3) {
    throw new Error(`Expected ${name} to include a quoted ETag, received ${etag}.`);
  }
}

function expectEtag(response: JsonResponse, pattern: RegExp, name: string): string {
  const etag = response.headers.get("etag");
  if (!etag || !pattern.test(etag)) {
    throw new Error(`Expected ${name} to include an ETag matching ${pattern}, received ${etag ?? "missing"}.`);
  }

  expectQuotedEtag(etag, name);
  return etag;
}

async function createDocument(
  context: DescribeRuntimeContext,
  resource: ConcurrencyResourceConfig,
  parameters: JsonObject,
  name: string,
  document: JsonObject,
): Promise<void> {
  await sendDocumentRequest(context, "POST", resource.path(context), parameters, 204, name, document);
}

function registerResourceConcurrencySuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  resource: ConcurrencyResourceConfig,
  options: ConcurrencySuiteOptions,
): void {
  runtime.describe(`Concurrency for the ${resource.name} Resource.`, () => {
    runtime.it("An LRS responding to a GET request SHALL add an ETag HTTP header to the response.", async () => {
      const parameters = resource.buildParams(context);
      await createDocument(context, resource, parameters, `${resource.name} ETag setup`, context.buildDocument());

      const response = await sendDocumentRequest(
        context,
        "GET",
        resource.path(context),
        parameters,
        200,
        `${resource.name} GET ETag`,
      );
      expectEtag(response, options.etagPattern, `${resource.name} GET ETag`);
    });

    runtime.it("When responding to a GET Request the Etag header must be enclosed in quotes", async () => {
      const parameters = resource.buildParams(context);
      await createDocument(
        context,
        resource,
        parameters,
        `${resource.name} quoted ETag setup`,
        context.buildDocument(),
      );

      const response = await sendDocumentRequest(
        context,
        "GET",
        resource.path(context),
        parameters,
        200,
        `${resource.name} quoted ETag GET`,
      );
      expectEtag(response, options.etagPattern, `${resource.name} quoted ETag GET`);
    });

    runtime.describe(
      "When responding to a PUT request, must handle the If-Match header as described in RFC 2616, HTTP/1.1 if it contains an ETag",
      () => {
        runtime.it(
          "Should reject a PUT request with a 412 Precondition Failed when using an incorrect ETag",
          async () => {
            const parameters = resource.buildParams(context);
            const document = context.buildDocument();

            await createDocument(context, resource, parameters, `${resource.name} PUT If-Match reject setup`, document);

            await sendDocumentRequest(
              context,
              "PUT",
              resource.path(context),
              parameters,
              412,
              `${resource.name} PUT incorrect If-Match`,
              createUpdatedDocument(document, context.generateUuid()),
              { "If-Match": '"1234"' },
            );
          },
        );

        runtime.it("Should not have modified the document for PUT requests with an incorrect ETag", async () => {
          const parameters = resource.buildParams(context);
          const document = context.buildDocument();

          await createDocument(
            context,
            resource,
            parameters,
            `${resource.name} PUT If-Match unchanged setup`,
            document,
          );
          await sendDocumentRequest(
            context,
            "PUT",
            resource.path(context),
            parameters,
            412,
            `${resource.name} PUT incorrect If-Match unchanged`,
            createUpdatedDocument(document, context.generateUuid()),
            { "If-Match": '"1234"' },
          );

          const fetchedDocument = await fetchDocumentObject(
            context,
            resource,
            parameters,
            `${resource.name} PUT incorrect If-Match fetch`,
          );
          expectJsonEquals(fetchedDocument, document, `${resource.name} PUT incorrect If-Match unchanged`);
        });

        runtime.it("Should accept a PUT request with a correct ETag", async () => {
          const parameters = resource.buildParams(context);
          const document = context.buildDocument();
          const updatedDocument = createUpdatedDocument(document, context.generateUuid());

          await createDocument(context, resource, parameters, `${resource.name} PUT If-Match accept setup`, document);

          const getResponse = await sendDocumentRequest(
            context,
            "GET",
            resource.path(context),
            parameters,
            200,
            `${resource.name} PUT correct If-Match GET`,
          );
          const etag = expectEtag(getResponse, options.etagPattern, `${resource.name} PUT correct If-Match GET`);

          await sendDocumentRequest(
            context,
            "PUT",
            resource.path(context),
            parameters,
            204,
            `${resource.name} PUT correct If-Match`,
            updatedDocument,
            { "If-Match": etag },
          );

          const fetchedDocument = await fetchDocumentObject(
            context,
            resource,
            parameters,
            `${resource.name} PUT correct If-Match fetch`,
          );
          expectJsonEquals(fetchedDocument, updatedDocument, `${resource.name} PUT correct If-Match`);
        });
      },
    );

    if (options.includeIfMatchPostAndDeleteCases) {
      runtime.describe(
        "When responding to a POST request, must handle the If-Match header as described in RFC 2616, HTTP/1.1 if it contains an ETag",
        () => {
          runtime.it(
            "Should reject a POST request with a 412 Precondition Failed when using an incorrect ETag",
            async () => {
              const parameters = resource.buildParams(context);
              const document = context.buildDocument();

              await createDocument(
                context,
                resource,
                parameters,
                `${resource.name} POST If-Match reject setup`,
                document,
              );

              await sendDocumentRequest(
                context,
                "POST",
                resource.path(context),
                parameters,
                412,
                `${resource.name} POST incorrect If-Match`,
                createUpdatedDocument(document, context.generateUuid()),
                { "If-Match": '"1234"' },
              );
            },
          );

          runtime.it("Should not have modified the document for POST requests with an incorrect ETag", async () => {
            const parameters = resource.buildParams(context);
            const document = context.buildDocument();

            await createDocument(
              context,
              resource,
              parameters,
              `${resource.name} POST If-Match unchanged setup`,
              document,
            );
            await sendDocumentRequest(
              context,
              "POST",
              resource.path(context),
              parameters,
              412,
              `${resource.name} POST incorrect If-Match unchanged`,
              createUpdatedDocument(document, context.generateUuid()),
              { "If-Match": '"1234"' },
            );

            const fetchedDocument = await fetchDocumentObject(
              context,
              resource,
              parameters,
              `${resource.name} POST incorrect If-Match fetch`,
            );
            expectJsonEquals(fetchedDocument, document, `${resource.name} POST incorrect If-Match unchanged`);
          });

          runtime.it("Should accept a POST request with a correct ETag", async () => {
            const parameters = resource.buildParams(context);
            const document = context.buildDocument();
            const updatedDocument = createUpdatedDocument(document, context.generateUuid());

            await createDocument(
              context,
              resource,
              parameters,
              `${resource.name} POST If-Match accept setup`,
              document,
            );

            const getResponse = await sendDocumentRequest(
              context,
              "GET",
              resource.path(context),
              parameters,
              200,
              `${resource.name} POST correct If-Match GET`,
            );
            const etag = expectEtag(getResponse, options.etagPattern, `${resource.name} POST correct If-Match GET`);

            await sendDocumentRequest(
              context,
              "POST",
              resource.path(context),
              parameters,
              204,
              `${resource.name} POST correct If-Match`,
              updatedDocument,
              { "If-Match": etag },
            );

            const fetchedDocument = await fetchDocumentObject(
              context,
              resource,
              parameters,
              `${resource.name} POST correct If-Match fetch`,
            );
            expectJsonEquals(fetchedDocument, updatedDocument, `${resource.name} POST correct If-Match`);
          });
        },
      );

      runtime.describe(
        "When responding to a DELETE request, must handle the If-Match header as described in RFC 2616, HTTP/1.1 if it contains an ETag",
        () => {
          runtime.it(
            "Should reject a DELETE request with a 412 Precondition Failed when using an incorrect ETag",
            async () => {
              const parameters = resource.buildParams(context);
              const document = context.buildDocument();

              await createDocument(
                context,
                resource,
                parameters,
                `${resource.name} DELETE If-Match reject setup`,
                document,
              );

              await sendDocumentRequest(
                context,
                "DELETE",
                resource.path(context),
                parameters,
                412,
                `${resource.name} DELETE incorrect If-Match`,
                undefined,
                { "If-Match": '"1234"' },
              );
            },
          );

          runtime.it("Should not have modified the document for DELETE requests with an incorrect ETag", async () => {
            const parameters = resource.buildParams(context);
            const document = context.buildDocument();

            await createDocument(
              context,
              resource,
              parameters,
              `${resource.name} DELETE If-Match unchanged setup`,
              document,
            );
            await sendDocumentRequest(
              context,
              "DELETE",
              resource.path(context),
              parameters,
              412,
              `${resource.name} DELETE incorrect If-Match unchanged`,
              undefined,
              { "If-Match": '"1234"' },
            );

            const fetchedDocument = await fetchDocumentObject(
              context,
              resource,
              parameters,
              `${resource.name} DELETE incorrect If-Match fetch`,
            );
            expectJsonEquals(fetchedDocument, document, `${resource.name} DELETE incorrect If-Match unchanged`);
          });

          runtime.it("Should accept a DELETE request with a correct ETag", async () => {
            const parameters = resource.buildParams(context);
            const document = context.buildDocument();

            await createDocument(
              context,
              resource,
              parameters,
              `${resource.name} DELETE If-Match accept setup`,
              document,
            );

            const getResponse = await sendDocumentRequest(
              context,
              "GET",
              resource.path(context),
              parameters,
              200,
              `${resource.name} DELETE correct If-Match GET`,
            );
            const etag = expectEtag(getResponse, options.etagPattern, `${resource.name} DELETE correct If-Match GET`);

            await sendDocumentRequest(
              context,
              "DELETE",
              resource.path(context),
              parameters,
              204,
              `${resource.name} DELETE correct If-Match`,
              undefined,
              { "If-Match": etag },
            );

            await sendDocumentRequest(
              context,
              "GET",
              resource.path(context),
              parameters,
              404,
              `${resource.name} DELETE correct If-Match fetch`,
            );
          });
        },
      );
    }

    if (options.includeIfNoneMatchCases) {
      runtime.describe(
        'When responding to a PUT request, handle the If-None-Match header as described in RFC 2616, HTTP/1.1 if it contains "*"',
        () => {
          runtime.it("succeeds when no document exists", async () => {
            const parameters = resource.buildParams(context);
            await sendDocumentRequest(
              context,
              "PUT",
              resource.path(context),
              parameters,
              204,
              `${resource.name} PUT If-None-Match create`,
              context.buildDocument(),
              { "If-None-Match": "*" },
            );
          });

          runtime.it("rejects if a document already exists", async () => {
            const parameters = resource.buildParams(context);
            const document = context.buildDocument();
            await createDocument(
              context,
              resource,
              parameters,
              `${resource.name} PUT If-None-Match reject setup`,
              document,
            );

            await sendDocumentRequest(
              context,
              "PUT",
              resource.path(context),
              parameters,
              412,
              `${resource.name} PUT If-None-Match existing`,
              createUpdatedDocument(document, context.generateUuid()),
              { "If-None-Match": "*" },
            );
          });
        },
      );
    }

    runtime.describe("If a PUT request is received without either header for a resource that already exists", () => {
      runtime.it("Return 409 conflict", async () => {
        const parameters = resource.buildParams(context);
        const document = context.buildDocument();
        await createDocument(context, resource, parameters, `${resource.name} 409 setup`, document);

        await sendDocumentRequest(
          context,
          "PUT",
          resource.path(context),
          parameters,
          409,
          `${resource.name} PUT without precondition`,
          createUpdatedDocument(document, context.generateUuid()),
        );
      });

      runtime.it("Return error message explaining the situation", async () => {
        const parameters = resource.buildParams(context);
        const document = context.buildDocument();
        await createDocument(context, resource, parameters, `${resource.name} 409 message setup`, document);

        const response = await sendDocumentRequest(
          context,
          "PUT",
          resource.path(context),
          parameters,
          409,
          `${resource.name} PUT without precondition message`,
          createUpdatedDocument(document, context.generateUuid()),
        );

        if (response.bodyText.length === 0) {
          throw new Error(`Expected ${resource.name} PUT without precondition to include an error message.`);
        }
      });

      runtime.it("Do not modify the resource", async () => {
        const parameters = resource.buildParams(context);
        const document = context.buildDocument();
        await createDocument(context, resource, parameters, `${resource.name} 409 unchanged setup`, document);

        await sendDocumentRequest(
          context,
          "PUT",
          resource.path(context),
          parameters,
          409,
          `${resource.name} PUT without precondition unchanged`,
          createUpdatedDocument(document, context.generateUuid()),
        );

        const fetchedDocument = await fetchDocumentObject(
          context,
          resource,
          parameters,
          `${resource.name} PUT without precondition fetch`,
        );
        expectJsonEquals(fetchedDocument, document, `${resource.name} PUT without precondition unchanged`);
      });
    });
  });
}

export function registerConcurrencyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: ConcurrencySuiteOptions,
): void {
  runtime.describe("Concurrency Requirements (Communication 3.1)", () => {
    runtime.describe(options.requirementTitle, () => {
      for (const resource of options.resources) {
        registerResourceConcurrencySuite(runtime, context, resource, options);
      }
    });
  });
}
