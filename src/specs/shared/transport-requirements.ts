import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext, JsonResponse } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, JsonValue, TemplateLayer } from "../../describe-runtime/templates.ts";

type AttachmentFixture = {
  bodyText: string;
  contentType: string;
  hash: string;
  length: number;
};

type MultipartSection = {
  bodyText: string;
  headers: Record<string, string>;
  includeBoundary?: boolean;
};

type ContentTypeSuiteOptions = {
  includeMultipartWithoutAttachmentsCases?: boolean;
};

const multipartBoundary = "-------314159265358979323846";

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

function expectObjectProperty(parent: JsonObject, key: string, name: string): JsonObject {
  return expectJsonObject(parent[key], `${name} ${key}`);
}

function expectStatementArray(parent: JsonObject, name: string): JsonObject[] {
  const statements = expectJsonArray(parent.statements, `${name} statements`);
  if (statements.some((statement) => !isJsonObject(statement))) {
    throw new Error(`Expected ${name} statements to contain only objects.`);
  }

  return statements as JsonObject[];
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
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

async function createTemplateStatement(
  context: DescribeRuntimeContext,
  layers: TemplateLayer[],
  name: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(layers);
  return structuredClone(expectJsonObject(payload.statement, name));
}

async function createStatementWithAttachments(
  context: DescribeRuntimeContext,
  attachments: readonly AttachmentFixture[],
  name: string,
): Promise<JsonObject> {
  const statement = await createTemplateStatement(context, [{ statement: "{{statements.attachment}}" }], name);
  statement.attachments = attachments.map((attachment) => ({
    usageType: "http://example.com/attachment-usage/test",
    display: { "en-US": "A test attachment" },
    description: { "en-US": "A test attachment (description)" },
    contentType: attachment.contentType,
    length: attachment.length,
    sha2: attachment.hash,
  }));
  return statement;
}

function buildMultipartMessage(boundary: string, sections: readonly MultipartSection[]): string {
  const lines: string[] = [];

  for (const section of sections) {
    if (section.includeBoundary !== false) {
      lines.push(`--${boundary}`);
    }

    for (const [key, value] of Object.entries(section.headers)) {
      lines.push(`${key}: ${value}`);
    }
    lines.push("");
    lines.push(section.bodyText);
  }

  lines.push(`--${boundary}--`);
  lines.push("");
  return lines.join("\r\n");
}

function buildMultipartJsonAndAttachments(
  statement: JsonObject,
  attachments: readonly AttachmentFixture[],
  overrides?: {
    attachmentTransferEncoding?: string;
    attachmentHashOverride?: string;
    firstPartContentType?: string;
    includeHashHeader?: boolean;
    includeInitialBoundary?: boolean;
  },
): string {
  const sections: MultipartSection[] = [
    {
      includeBoundary: overrides?.includeInitialBoundary,
      headers: {
        "Content-Type": overrides?.firstPartContentType ?? "application/json",
      },
      bodyText: JSON.stringify(statement),
    },
  ];

  for (const attachment of attachments) {
    const headers: Record<string, string> = {
      "Content-Type": attachment.contentType,
      "Content-Transfer-Encoding": overrides?.attachmentTransferEncoding ?? "binary",
    };
    if (overrides?.includeHashHeader !== false) {
      headers["X-Experience-API-Hash"] = overrides?.attachmentHashOverride ?? attachment.hash;
    }

    sections.push({
      headers,
      bodyText: attachment.bodyText,
    });
  }

  return buildMultipartMessage(multipartBoundary, sections);
}

async function sendStatementRequest(
  context: DescribeRuntimeContext,
  request: {
    body: JsonValue | string;
    contentType?: string;
    expectedStatus: number;
    name: string;
  },
): Promise<JsonResponse> {
  const headers = request.contentType ? { "Content-Type": request.contentType } : undefined;
  const response = await context.sendRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    headers,
    body: request.body,
  });

  if (response.status !== request.expectedStatus) {
    throw new Error(`Expected ${request.name} to return ${request.expectedStatus}, received ${response.status}.`);
  }

  return response;
}

async function fetchStatementsByVerb(
  context: DescribeRuntimeContext,
  verb: string,
  name: string,
): Promise<JsonObject[]> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const response = await context.sendRequest({
      method: "GET",
      path: context.getEndpointStatements(),
      query: { verb },
    });

    if (response.status !== 200) {
      throw new Error(`Expected ${name} to return 200, received ${response.status}.`);
    }

    const result = parseJsonObject(response, name);
    const statements = expectStatementArray(result, name);
    const matchingStatements = statements.filter(
      (statement) => expectObjectProperty(statement, "verb", `${name} verb`).id === verb,
    );
    if (matchingStatements.length > 0) {
      return matchingStatements;
    }

    await wait(200);
  }

  throw new Error(`Expected ${name} to return a statement matching the verb ${verb}.`);
}

export function registerEncodingRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Encoding Requirements (Communication 1.4)", () => {
    runtime.it("All Strings are encoded and interpreted as UTF-8 (Communication 1.4.s1.b1, XAPI-00015)", async () => {
      const statement = await createTemplateStatement(
        context,
        [{ statement: "{{statements.unicode}}" }],
        "UTF-8 statement",
      );
      const verb = expectObjectProperty(statement, "verb", "UTF-8 verb");
      const verbId = `http://adlnet.gov/expapi/test/unicode/target/${context.generateUuid()}`;
      verb.id = verbId;

      const postResponse = await context.sendRequest({
        method: "POST",
        path: context.getEndpointStatements(),
        body: statement,
      });
      if (postResponse.status !== 200) {
        throw new Error(`Expected UTF-8 statement POST to return 200, received ${postResponse.status}.`);
      }

      const matchingStatements = await fetchStatementsByVerb(context, verbId, "UTF-8 statement GET");
      const storedVerb = expectObjectProperty(matchingStatements[0] ?? {}, "verb", "UTF-8 stored verb");
      const storedDisplay = expectObjectProperty(storedVerb, "display", "UTF-8 stored display");
      const originalDisplay = expectObjectProperty(verb, "display", "UTF-8 original display");

      for (const [languageTag, value] of Object.entries(originalDisplay)) {
        if (storedDisplay[languageTag] !== value) {
          throw new Error(`Expected UTF-8 display entry ${languageTag} to round-trip without modification.`);
        }
      }
    });
  });
}

export function registerContentTypeRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
  options: ContentTypeSuiteOptions = {},
): void {
  runtime.describe("Content Type Requirements (Communication 1.5)", () => {
    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a Request which uses Attachments and does not have a "Content-Type" header with value "application/json" or "multipart/mixed" (Format, Data 2.4.11, XAPI-00127)',
      () => {
        runtime.it(
          'should succeed when attachment uses "fileUrl" and request content-type is "application/json"',
          async () => {
            const attachment = loadAttachmentFixture(context, "simple_text1.txt");
            const statement = await createStatementWithAttachments(context, [attachment], "fileUrl JSON statement");
            const attachments = expectJsonArray(statement.attachments, "fileUrl JSON attachments");
            const firstAttachment = expectJsonObject(attachments[0], "fileUrl JSON attachment");
            firstAttachment.fileUrl = "http://over.there.com/file.txt";

            await sendStatementRequest(context, {
              body: statement,
              expectedStatus: 200,
              name: "fileUrl JSON statement",
            });
          },
        );

        runtime.it(
          'should fail when attachment uses "fileUrl" and request content-type is "multipart/form-data"',
          async () => {
            const attachment = loadAttachmentFixture(context, "simple_text1.txt");
            const statement = await createStatementWithAttachments(
              context,
              [attachment],
              "fileUrl multipart/form-data statement",
            );
            const attachments = expectJsonArray(statement.attachments, "fileUrl multipart/form-data attachments");
            const firstAttachment = expectJsonObject(attachments[0], "fileUrl multipart/form-data attachment");
            firstAttachment.fileUrl = "http://over.there.com/file.txt";

            await sendStatementRequest(context, {
              body: JSON.stringify(statement),
              contentType: `multipart/form-data; boundary=${multipartBoundary}`,
              expectedStatus: 400,
              name: "fileUrl multipart/form-data statement",
            });
          },
        );

        runtime.it(
          'should succeed when attachment is raw data and request content-type is "multipart/mixed"',
          async () => {
            const attachment = loadAttachmentFixture(context, "simple_text1.txt");
            const statement = await createStatementWithAttachments(context, [attachment], "raw multipart statement");

            await sendStatementRequest(context, {
              body: buildMultipartJsonAndAttachments(statement, [attachment]),
              contentType: `multipart/mixed; boundary=${multipartBoundary}`,
              expectedStatus: 200,
              name: "raw multipart statement",
            });
          },
        );

        runtime.it(
          'should fail when attachment is raw data and request content-type is "multipart/form-data"',
          async () => {
            const attachment = loadAttachmentFixture(context, "simple_text1.txt");
            const statement = await createStatementWithAttachments(
              context,
              [attachment],
              "raw multipart/form-data statement",
            );

            await sendStatementRequest(context, {
              body: buildMultipartJsonAndAttachments(statement, [attachment]),
              contentType: `multipart/form-data; boundary=${multipartBoundary}`,
              expectedStatus: 400,
              name: "raw multipart/form-data statement",
            });
          },
        );

        if (options.includeMultipartWithoutAttachmentsCases) {
          runtime.it(
            'should succeed when attachment uses "fileUrl" and request content-type is "multipart/mixed"',
            async () => {
              const attachment = loadAttachmentFixture(context, "simple_text1.txt");
              const statement = await createStatementWithAttachments(
                context,
                [attachment],
                "fileUrl multipart/mixed statement",
              );
              const attachments = expectJsonArray(statement.attachments, "fileUrl multipart/mixed attachments");
              const firstAttachment = expectJsonObject(attachments[0], "fileUrl multipart/mixed attachment");
              firstAttachment.fileUrl = "http://over.there.com/file.txt";

              await sendStatementRequest(context, {
                body: buildMultipartMessage(multipartBoundary, [
                  {
                    headers: { "Content-Type": "application/json" },
                    bodyText: JSON.stringify(statement),
                  },
                ]),
                contentType: `multipart/mixed; boundary=${multipartBoundary}`,
                expectedStatus: 200,
                name: "fileUrl multipart/mixed statement",
              });
            },
          );

          runtime.it(
            'should succeed when no attachments are included, but request content-type is "multipart/mixed"',
            async () => {
              const attachment = loadAttachmentFixture(context, "simple_text1.txt");
              const statement = await createStatementWithAttachments(
                context,
                [attachment],
                "multipart/mixed without attachments statement",
              );
              delete statement.attachments;

              await sendStatementRequest(context, {
                body: buildMultipartMessage(multipartBoundary, [
                  {
                    headers: { "Content-Type": "application/json" },
                    bodyText: JSON.stringify(statement),
                  },
                ]),
                contentType: `multipart/mixed; boundary=${multipartBoundary}`,
                expectedStatus: 200,
                name: "multipart/mixed without attachments statement",
              });
            },
          );
        }
      },
    );

    runtime.describe(
      "An LRS rejects with error code 400 Bad Request, a PUT or POST Request which has excess multi-part sections that are not attachments. (Communication 1.5.1.s1.b2, Data 2.4.11, XAPI-00128)",
      () => {
        runtime.it("should fail when passing statement attachments with excess multipart sections", async () => {
          const attachments = [
            loadAttachmentFixture(context, "simple_text1.txt"),
            loadAttachmentFixture(context, "simple_text2.txt"),
          ];
          const extraAttachment = loadAttachmentFixture(context, "simple_text3.txt");
          const statement = await createStatementWithAttachments(
            context,
            attachments,
            "multipart excess sections statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartJsonAndAttachments(statement, [...attachments, extraAttachment]),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart excess sections statement",
          });
        });
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content-Type" header with value "application/json", and has a discrepancy in the number of Attachments vs. the number of fileURL members (Communication 1.5.1.s1.b2, Data 2.4.11, XAPI-00129)',
      () => {
        runtime.it('should fail when passing statement attachments and missing attachment"s binary', async () => {
          const attachments = [
            loadAttachmentFixture(context, "simple_text1.txt"),
            loadAttachmentFixture(context, "simple_text2.txt"),
          ];
          const statement = await createStatementWithAttachments(
            context,
            attachments,
            "multipart missing binary statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartJsonAndAttachments(statement, [attachments[0]!]),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart missing binary statement",
          });
        });
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content Type" header with value "multipart/mixed", and does not have a body header named "boundary" (Communication 1.5.2.s2.b2, Data 2.4.11, RFC 2046, XAPI-00131)',
      () => {
        runtime.it("should fail if boundary not provided in body", async () => {
          const attachment = loadAttachmentFixture(context, "simple_text1.txt");
          const statement = await createStatementWithAttachments(
            context,
            [attachment],
            "multipart missing body boundary statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartJsonAndAttachments(statement, [attachment], { includeInitialBoundary: false }),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart missing body boundary statement",
          });
        });
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content Type" header with value "multipart/mixed", and does not have a Boundary before each "Content-Type" header (Communication 1.5.2.s2.b2, Data 2.4.11, RFC 2046, XAPI-00130)',
      () => {
        runtime.it("should fail if boundary not provided in body", async () => {
          const attachment = loadAttachmentFixture(context, "simple_text1.txt");
          const statement = await createStatementWithAttachments(
            context,
            [attachment],
            "multipart missing per-part boundary statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartMessage(multipartBoundary, [
              {
                headers: { "Content-Type": "application/json" },
                bodyText: JSON.stringify(statement),
              },
              {
                headers: {
                  "Content-Type": attachment.contentType,
                  "Content-Transfer-Encoding": "binary",
                  "X-Experience-API-Hash": attachment.hash,
                },
                bodyText: attachment.bodyText,
                includeBoundary: false,
              },
            ]),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart missing per-part boundary statement",
          });
        });

        runtime.it("should fail if boundary not provided in header", async () => {
          const attachment = loadAttachmentFixture(context, "simple_text1.txt");
          const statement = await createStatementWithAttachments(
            context,
            [attachment],
            "multipart missing header boundary statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartJsonAndAttachments(statement, [attachment]),
            contentType: "multipart/mixed;",
            expectedStatus: 400,
            name: "multipart missing header boundary statement",
          });
        });
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content Type" header with value "multipart/mixed", and does not the first document part with a "Content-Type" header with a value of "application/json" (RFC 2046, Communication 1.5.2.s2.b2.b1, Data 2.4.11, XAPI-00134)',
      () => {
        runtime.it(
          'should fail when attachment is raw data and first part content type is not "application/json"',
          async () => {
            const attachment = loadAttachmentFixture(context, "simple_text1.txt");
            const statement = await createStatementWithAttachments(
              context,
              [attachment],
              "multipart invalid first-part content-type statement",
            );

            await sendStatementRequest(context, {
              body: buildMultipartJsonAndAttachments(statement, [attachment], { firstPartContentType: "text/plain" }),
              contentType: `multipart/mixed; boundary=${multipartBoundary}`,
              expectedStatus: 400,
              name: "multipart invalid first-part content-type statement",
            });
          },
        );
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content Type" header with value "multipart/mixed", and does not have all of the Statements in the first document part (RFC 2046, Data 2.4.11, Communication 1.5.2.s2.b2.b1, XAPI-00133)',
      () => {
        runtime.it("should fail when statements separated into multiple parts", async () => {
          const attachment = loadAttachmentFixture(context, "simple_text1.txt");
          const statement = await createStatementWithAttachments(
            context,
            [attachment],
            "multipart split statements statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartMessage(multipartBoundary, [
              {
                headers: { "Content-Type": "application/json" },
                bodyText: JSON.stringify(statement),
              },
              {
                headers: { "Content-Type": "application/json" },
                bodyText: JSON.stringify(statement),
              },
              {
                headers: {
                  "Content-Type": attachment.contentType,
                  "Content-Transfer-Encoding": "binary",
                  "X-Experience-API-Hash": attachment.hash,
                },
                bodyText: attachment.bodyText,
              },
            ]),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart split statements statement",
          });
        });
      },
    );

    runtime.describe(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content Type" header with value "multipart/mixed", and for any part except the first does not have a Header named "X-Experience-API-Hash" with a value of one of those found in a "sha2" property of a Statement in the first part of this document (Communication 1.5.2.s2.b2.b3", Communication 1.5.2.s1.b4, Data 2.4.11, XAPI-00132)',
      () => {
        runtime.it('should fail when attachments missing header "X-Experience-API-Hash"', async () => {
          const attachment = loadAttachmentFixture(context, "simple_text1.txt");
          const statement = await createStatementWithAttachments(
            context,
            [attachment],
            "multipart missing hash header statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartJsonAndAttachments(statement, [attachment], { includeHashHeader: false }),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart missing hash header statement",
          });
        });

        runtime.it('should fail when attachments header "X-Experience-API-Hash" does not match "sha2"', async () => {
          const attachment = loadAttachmentFixture(context, "simple_text1.txt");
          const statement = await createStatementWithAttachments(
            context,
            [attachment],
            "multipart mismatched hash statement",
          );

          await sendStatementRequest(context, {
            body: buildMultipartJsonAndAttachments(statement, [attachment], {
              attachmentHashOverride: "b018994f8bbe0f08992a65c48c8c8c56f09e9baceaa6227ed85c90ae52b73c89",
            }),
            contentType: `multipart/mixed; boundary=${multipartBoundary}`,
            expectedStatus: 400,
            name: "multipart mismatched hash statement",
          });
        });
      },
    );

    runtime.it(
      'An LRS rejects with error code 400 Bad Request, a PUT or POST Request which uses Attachments, has a "Content Type" header with value "multipart/mixed", and for any part except the first does not have a Header named "Content-Transfer-Encoding" with a value of "binary" (Data 2.4.11, XAPI-00135)',
      async () => {
        const attachment = loadAttachmentFixture(context, "simple_text1.txt");
        const statement = await createStatementWithAttachments(
          context,
          [attachment],
          "multipart invalid transfer encoding statement",
        );

        await sendStatementRequest(context, {
          body: buildMultipartJsonAndAttachments(statement, [attachment], { attachmentTransferEncoding: "base64" }),
          contentType: `multipart/mixed; boundary=${multipartBoundary}`,
          expectedStatus: 400,
          name: "multipart invalid transfer encoding statement",
        });
      },
    );
  });
}
