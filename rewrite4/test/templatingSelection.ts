import { describe, it } from "bun:test";

type TemplateMapping = Record<string, string>;

type TemplateTest = {
  name: string;
  expect: unknown[];
  json?: unknown;
  templates?: TemplateMapping[];
};

type TemplateConfiguration = {
  name: string;
  config: TemplateTest[];
};

type TemplateHelper = {
  OAuthRequest(request: unknown): unknown;
  getSingleTestConfiguration(templateName: string): TemplateConfiguration[];
  convertTemplate(templates: TemplateMapping[]): unknown;
  createTestObject(converted: unknown): Record<string, unknown>;
  getEndpointAndAuth(): string;
  getEndpointStatements(): string;
  addAllHeaders(headers: Record<string, string>): Record<string, string>;
};

type RequestChain = {
  post(url: string): RequestChain;
  headers(headers: Record<string, string>): RequestChain;
  json(data: unknown): RequestChain;
  expect: (...args: unknown[]) => RequestChain;
  end(done: (error?: unknown) => void): void;
};

import helperImport from "./helper.ts";
import requestModule from "./super-request.ts";

const helper = helperImport as TemplateHelper;

const activeRequest =
  process.env["OAUTH1_ENABLED"] === "true"
    ? (helper.OAuthRequest(requestModule) as (target: unknown) => RequestChain)
    : requestModule;

export function createTemplate(templateName: string): void {
  const configurations = helper.getSingleTestConfiguration(templateName);

  configurations.forEach((configuration) => {
    describe(configuration.name, () => {
      configuration.config.forEach((templateTest) => {
        it(templateTest.name, (done) => {
          if (!templateTest.templates && !templateTest.json) {
            done(`Invalid test: "${templateTest.name}`);
            return;
          }

          try {
            let data: unknown = {};

            if (templateTest.templates) {
              const converted = helper.convertTemplate(templateTest.templates);
              const mockObject = helper.createTestObject(converted);
              const key = Object.keys(mockObject)[0];
              if (typeof key !== "undefined") {
                data = mockObject[key];
              }
            } else {
              data = templateTest.json;
            }

            const promise = activeRequest(helper.getEndpointAndAuth())
              .post(helper.getEndpointStatements())
              .headers(helper.addAllHeaders({}))
              .json(data);

            (promise.expect as (...args: unknown[]) => RequestChain)(...templateTest.expect).end(done);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            done(`Invalid test: "${templateTest.name}" with error: ${message}`);
          }
        });
      });
    });
  });
}

export default {
  createTemplate,
};
