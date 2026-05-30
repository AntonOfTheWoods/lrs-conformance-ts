/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "bun:test";
import extend from "../../bun-runtime/extend-compat.ts";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { expectAsync } from "../super-request.ts";

const helper: any = helperImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

describe("Document Resource Requirements (Communication 2.2)", function (this: { timeout(ms: number): void }) {
  /**  Macthup with Conformance Requirements Document
   * XAPI-00182 - below
   * XAPI-00183 - below
   * XAPI-00184 - below
   * XAPI-00185 - untestable
   * XAPI-00186 - untestable
   */

  /**  XAPI-00182, Communication 2.2 Documents Resources
   * An LRS makes no modifications to stored data for any rejected request.
   */
  it("An LRS makes no modifications to stored data for any rejected request (Multiple, including Communication 2.1.2.s2.b4, XAPI-00182)", async function (this: {
    timeout(ms: number): void;
  }) {
    this.timeout(0);
    const templates = [{ statement: "{{statements.default}}" }];
    const correct = helper.createFromTemplate(templates).statement;
    const incorrect = extend(true, {}, correct);

    correct.id = helper.generateUUID();
    incorrect.id = helper.generateUUID();

    incorrect.verb.id = "should fail";
    const stmtTime = Date.now();

    await expectAsync(
      request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders({}))
        .json([correct, incorrect]),
      400,
    );

    await expectAsync(
      request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements() + "?statementId=" + correct.id)
        .wait(helper.genDelay(stmtTime, "?statementId=" + correct.id, correct.id))
        .headers(helper.addAllHeaders({})),
      404,
    );
  });

  /**  XAPI-00184, Communication 2.2 Documents Resources
   * A Document Merge overwrites any duplicate values from the previous document with the new document.
   */
  it("A Document Merge overwrites any duplicate Objects from the previous document with the new document. (Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3, XAPI-00184)", function (this: {
    timeout(ms: number): void;
  }) {
    const parameters = helper.buildState();
    const document = {
      car: "MKX",
    };
    const anotherDocument = {
      car: "MKZ",
    };
    return helper.sendRequest("post", helper.getEndpointActivitiesState(), parameters, document, 204).then(() => {
      return helper
        .sendRequest("post", helper.getEndpointActivitiesState(), parameters, anotherDocument, 204)
        .then(() => {
          return helper
            .sendRequest("get", helper.getEndpointActivitiesState(), parameters, undefined, 200)
            .then((res: any) => {
              const body = res.body;
              expect(body).toEqual({
                car: "MKZ",
              });
            });
        });
    });
  });

  /**  XAPI-00183, Communication 2.2 Documents Resources
   * A Document Merge only performs overwrites at one level deep, although the entire object is replaced.
   */
  it("A Document Merge only performs overwrites at one level deep, although the entire object is replaced. (Communication 2.2.s7.b1, Communication 2.2.s7.b2, Communication 2.2.s7.b3, XAPI-00183)", function (this: {
    timeout(ms: number): void;
  }) {
    const parameters = helper.buildState();
    const document = {
      car: {
        make: "Ford",
        model: "Escape",
      },
      driver: "Dale",
      series: {
        nascar: {
          series: "sprint",
        },
      },
    };
    const anotherDocument = {
      car: {
        make: "Dodge",
        model: "Ram",
      },
      driver: "Jeff",
      series: {
        nascar: {
          series: "nextel",
        },
      },
    };
    return helper.sendRequest("post", helper.getEndpointActivitiesState(), parameters, document, 204).then(() => {
      return helper
        .sendRequest("post", helper.getEndpointActivitiesState(), parameters, anotherDocument, 204)
        .then(() => {
          return helper
            .sendRequest("get", helper.getEndpointActivitiesState(), parameters, undefined, 200)
            .then((res: any) => {
              const body = res.body;
              expect(body).toEqual({
                car: {
                  make: "Dodge",
                  model: "Ram",
                },
                driver: "Jeff",
                series: {
                  nascar: {
                    series: "nextel",
                  },
                },
              });
            });
        });
    });
  });
});
