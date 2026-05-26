import { createHash } from "node:crypto";
import { createRequire } from "node:module";

import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import type { JsonObject, TemplateLayer } from "../../describe-runtime/templates.ts";

const signatureAttachmentBoundary = "-------271828182845904523536";
const signatureUsageType = "http://adlnet.gov/expapi/attachments/signature";
const signedStatementPrivateKey = [
  "-----BEGIN RSA PRIVATE KEY-----",
  "MIIEpAIBAAKCAQEAvZtrkWAFrUYi8zekTKheDM7tvfNIB7FVbLtkPArlFMQE1kOe",
  "8sBEvENiMKvI8kv1jLuzbd/iSWd1Wqt81ooDAMwcv54b26w0qyk58vKv+ZgNzvUZ",
  "XtpFS3euLcOVPZUyc7O4gMLtDNblNehplFMNUFvd8Yc2jKOi9/URyIHOVzJwhKU0",
  "63CY6S8MEbTjHdhcYa3TpeFFtL8YKoCxR2h4OCtbMe0ub2tOIwZ4jKNhQQ1/N6SJ",
  "VV4gNmq6WVLfRtLDop72r5o8UZyPBwN9S3CxGBPMI2dBFC7waQwQ8zyvL6Kp2ZuA",
  "Q2clHQzGTsDpREGNqzXDdgkUN0bOGJn/JRgU3QIDAQABAoIBABdJbFepdGkIkShP",
  "8CTeFNb73yUSKQmQ1Q4Koc/iAqqfPHzYR0BHLun0WK3jm0Vu4NSNBQd8lL0xMK+X",
  "Gjj7ME07xFggYgmDx+AxqwVUmxpLe36siZYltpcDNug1+jFbDpw5OXLO/fAywGnz",
  "hmwKGzuAXOzaD3AMdOqBNdLrZl09BUlorhugmrXJbJebo/q3f6yxUbjanR70UpMs",
  "youqDH7JEV6FjFofLj32RQWWtkTlOEjQ5QE353v22HEZXvyDuwr50cAGtRS4Sqjw",
  "vXCGoBwJIHX75P5PN+MY3IBo3pjaKHZlNnQDnX7FQw/nxbAObWLEAj8IGlocNsWK",
  "F5QKnp0CgYEA8mJcGK6EotykzX8aBCrka2K7p9l4AVBHnzXNniVCh0OhdrdzcDQO",
  "hbbAm0uM+cIwnPrORY2DhG5hO8vxtsfojI/dFVUiJWXE1D4WDqJ65HdHMNKWu4SR",
  "vf1OHk3bliif5dTvmNOGt0G/Ypu1OkDvQ3zs0VIyM44TWVP+O5nsbxsCgYEAyEIX",
  "gnM460EsYBABZGRrKqcRhI+vNSPCxTV5nJS5MbdDkPiV9VQ3l0+p7IZ2jk91ISWt",
  "VlHLw9QMiOQF1776xJV7J30fSTk2fzz4znLjpnDcflZuyPtElNkQfr1A0LYTCjn8",
  "wfaZ7sA2RbvMHjWaD13qpKEkBlfjkLNn+zLPM2cCgYEAxDSg7o3e6mMHuR1pNvRt",
  "oQv0cgQVI6MTxyprftgUiaBShOItvSc2lkEAmvVGcisi5QAVl7HdQ4eCiEAoM1iR",
  "w671PT6D/JfsBA8aFdCrAGQZqcjeoX7H5260HM3TsjLCdO6w4Rphk9jSDwWSZ0yH",
  "Ii9vGGacIqWgvg/C3gZUoP8CgYBfOSYqrpVjMENkjlfLIADhcD3hNd2PPCjyU2I3",
  "dXS2Ujl7pujPljM07PmU8b9QHjJJB7xrrkthG+S19w9cLoDZl2bPOSz2SZFDYX/B",
  "01mynDoMjRby1KAg0zKHwYAffmSBWV9578P0hkuITytZNg3CvtrDW6hgp8wa02Rf",
  "SyLBgwKBgQCl73rjxN9B55tdKdQUkXSAaYYebYzuDOa9vRcTOW5nbWf21ehUUKlU",
  "w/F6uHl5okTfASEGn8BFQwBnA/npUbbKzz2wIAiPnjC96RIzU7G5fJFjWRMURQi/",
  "Ibbd1wXGedfy4A7+S+Swn2B2fwuBUL0BUkUrqYPvK5X8IZUnM/30RQ==",
  "-----END RSA PRIVATE KEY-----",
].join("\n");

const require = createRequire(import.meta.url);
const jws = require("jws") as {
  sign(input: { header: { alg: string }; payload: JsonObject | string; privateKey: string }): string;
};

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function createTemplateStatement(
  context: DescribeRuntimeContext,
  layers: TemplateLayer[],
  name: string,
): Promise<JsonObject> {
  const payload = await context.createFromTemplate(layers);
  const statement = payload.statement;
  if (!isJsonObject(statement)) {
    throw new Error(`Expected ${name} to create a statement object.`);
  }

  return structuredClone(statement);
}

function buildMultipartMessage(
  boundary: string,
  sections: Array<{ bodyText: string; headers: Record<string, string> }>,
): string {
  const lines: string[] = [];

  for (const section of sections) {
    lines.push(`--${boundary}`);
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

export function buildSignedStatementBody(
  statement: JsonObject,
  options: {
    algorithm?: string;
    attachmentContentType?: string;
    invalidJsonPayload?: boolean;
  } = {},
): { body: string; boundary: string } {
  const statementClone = structuredClone(statement);
  delete statementClone.attachments;

  const algorithm = options.algorithm ?? "RS256";
  const signatureText = jws.sign({
    header: { alg: algorithm },
    payload: options.invalidJsonPayload ? JSON.stringify(statementClone).replace('"', "'") : statementClone,
    privateKey: signedStatementPrivateKey,
  });
  const attachmentContentType = options.attachmentContentType ?? "application/octet-stream";
  const signatureHash = createHash("sha256").update(signatureText).digest("hex");
  const signatureLength = new TextEncoder().encode(signatureText).length;

  statementClone.attachments = [
    {
      usageType: signatureUsageType,
      display: { "en-US": "A signed statement" },
      description: { "en-US": "A signed statement" },
      contentType: attachmentContentType,
      length: signatureLength,
      sha2: signatureHash,
    },
  ];

  return {
    boundary: signatureAttachmentBoundary,
    body: buildMultipartMessage(signatureAttachmentBoundary, [
      {
        headers: {
          "Content-Type": "application/json",
        },
        bodyText: JSON.stringify(statementClone),
      },
      {
        headers: {
          "Content-Type": attachmentContentType,
          "Content-Transfer-Encoding": "binary",
          "X-Experience-API-Hash": signatureHash,
        },
        bodyText: signatureText,
      },
    ]),
  };
}

async function sendSignedStatementRequest(
  context: DescribeRuntimeContext,
  statement: JsonObject,
  request: {
    algorithm?: string;
    attachmentContentType?: string;
    expectedStatus: number;
    invalidJsonPayload?: boolean;
    name: string;
  },
): Promise<void> {
  const signedStatement = buildSignedStatementBody(statement, {
    algorithm: request.algorithm,
    attachmentContentType: request.attachmentContentType,
    invalidJsonPayload: request.invalidJsonPayload,
  });

  const response = await context.sendRequest({
    method: "POST",
    path: context.getEndpointStatements(),
    headers: {
      "Content-Type": `multipart/mixed; boundary=${signedStatement.boundary}`,
    },
    body: signedStatement.body,
  });

  if (response.status !== request.expectedStatus) {
    throw new Error(`Expected ${request.name} to return ${request.expectedStatus}, received ${response.status}.`);
  }
}

export function registerSignedStatementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.describe("Signed Statements (Data 2.6)", () => {
    runtime.describe("LRS must validate and store statement signatures if they are provided (Data 2.6)", () => {
      runtime.describe("A Signed Statement MUST include a JSON web signature, JWS (Data 2.6.s4.b1, XAPI-00115)", () => {
        runtime.it("rejects a signed statement with a malformed signature - bad content type", async () => {
          const statement = await createTemplateStatement(
            context,
            [{ statement: "{{statements.default}}" }],
            "Signed statement bad content type",
          );
          statement.id = context.generateUuid();

          await sendSignedStatementRequest(context, statement, {
            attachmentContentType: "text/plain; charset=ascii",
            expectedStatus: 400,
            name: "Signed statement bad content type",
          });
        });

        runtime.it("rejects a signed statement with a malformed signature - bad JWS", async () => {
          const statement = await createTemplateStatement(
            context,
            [{ statement: "{{statements.default}}" }],
            "Signed statement bad JWS",
          );
          statement.id = context.generateUuid();

          await sendSignedStatementRequest(context, statement, {
            expectedStatus: 400,
            invalidJsonPayload: true,
            name: "Signed statement bad JWS",
          });
        });
      });

      runtime.describe(
        "The JWS signature MUST have a payload of a valid JSON serialization of the complete Statement before the signature was added. (Data 2.6.s4.b3, XAPI-00116)",
        () => {
          runtime.it("rejects statement with invalid JSON serialization", async () => {
            const statement = await createTemplateStatement(
              context,
              [{ statement: "{{statements.default}}" }],
              "Signed statement invalid JSON",
            );
            statement.id = context.generateUuid();

            await sendSignedStatementRequest(context, statement, {
              expectedStatus: 400,
              invalidJsonPayload: true,
              name: "Signed statement invalid JSON",
            });
          });
        },
      );

      runtime.describe(
        'The JWS signature MUST use an algorithm of "RS256", "RS384", or "RS512". (Data 2.6.s4.b4, XAPI-00117)',
        () => {
          for (const algorithm of ["RS256", "RS384", "RS512"] as const) {
            runtime.it(`Accepts signed statement with "${algorithm}"`, async () => {
              const statement = await createTemplateStatement(
                context,
                [{ statement: "{{statements.default}}" }],
                `Signed statement ${algorithm}`,
              );
              statement.id = context.generateUuid();

              await sendSignedStatementRequest(context, statement, {
                algorithm,
                expectedStatus: 200,
                name: `Signed statement ${algorithm}`,
              });
            });
          }

          runtime.it("Rejects signed statement with another algorithm", async () => {
            const statement = await createTemplateStatement(
              context,
              [{ statement: "{{statements.default}}" }],
              "Signed statement invalid algorithm",
            );
            statement.id = context.generateUuid();

            await sendSignedStatementRequest(context, statement, {
              algorithm: "HS256",
              expectedStatus: 400,
              name: "Signed statement invalid algorithm",
            });
          });
        },
      );
    });
  });
}
