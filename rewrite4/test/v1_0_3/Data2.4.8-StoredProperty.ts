/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "chai";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { endAsync } from "../super-request.ts";

const helper: any = helperImport;
let request: any = requestBase;


if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

function parseMillisecondsFromIso(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  if (Number.isNaN(Date.parse(value))) {
    return null;
  }

  const fractionMatch = /\.(\d+)/.exec(value);
  if (!fractionMatch || !fractionMatch[1]) {
    return null;
  }

  const milliseconds = Number.parseInt(fractionMatch[1].slice(0, 3).padEnd(3, "0"), 10);
  return Number.isNaN(milliseconds) ? null : milliseconds;
}

describe("Stored Property Requirements (Data 2.4.8)", () => {
  let param: any;

  /**  Matchup with Conformance Requirements Document
   * XAPI-00097 - below
   *
   * Note XAPI-00023 - below
   */

  /**  XAPI-00097, Data 2.4.8 Stored
   * An LRS MUST assign the "stored" property timestamp upon receiving a statement.
   */
  describe("An LRS MUST accept statements with the stored property (Data 2.4.8.s3.b2, XAPI-00097)", function () {
    this.timeout(0);
    let storedTime = new Date("July 15, 2011").toISOString();
    let template = [{ statement: "{{statements.default}}" }, { stored: storedTime }];
    let data = helper.createFromTemplate(template).statement;
    let postId: string;
    let putId: string;

    it("using POST", async function () {
      let stmtTime = Date.now();
            const res = await endAsync(
request(helper.getEndpointAndAuth())
        .post(helper.getEndpointStatements())
        .headers(helper.addAllHeaders())
        .json(data)
        .expect(200)
      );

postId = ((res.body as string[])[0] as string);
let query = "?statementId=" + postId;
request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + query)
              .wait(helper.genDelay(stmtTime, query, postId))
              .headers(helper.addAllHeaders())
              .expect(200)
              .end((err: unknown, res: any) => {
                if (err) {
                  throw err;
                } else {
                  let result = helper.parse(res.body);
                  expect(result).to.have.property("stored");
                  let stmtStored = result.stored;
                  expect(stmtStored).to.not.eql(storedTime);
                  
                }
              });
    });

    it("using PUT", async function () {
      putId = helper.generateUUID();
      param = "?statementId=" + putId;
      let stmtTime = Date.now();

            await endAsync(
request(helper.getEndpointAndAuth())
        .put(helper.getEndpointStatements() + param)
        .headers(helper.addAllHeaders())
        .json(data)
        .expect(204)
      );

request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + param)
              .wait(helper.genDelay(stmtTime, param, putId))
              .headers(helper.addAllHeaders())
              .expect(200)
              .end((err: unknown, res: any) => {
                if (err) {
                  throw err;
                } else {
                  let result = helper.parse(res.body);
                  expect(result).to.have.property("stored");
                  let stmtStored = result.stored;
                  expect(stmtStored).to.not.eql(storedTime);
                  
                }
              });
    });
  });

  /**  XAPI-00023,  2.4 Statement Properties
   * A "stored" property is a TimeStamp, per section 4.5. An LRS assigns the “stored” property upon receipt with a valid TimeStamp.
   */
  describe("A stored property must be a TimeStamp (Data 2.4.8.s2, XAPI-00023)", function () {
    it("retrieve statements, test a stored property", async function () {
            const res = await endAsync(
request(helper.getEndpointAndAuth())
        .get(helper.getEndpointStatements())
        .headers(helper.addAllHeaders())
        .expect(200)
      );

let result = helper.parse(res.body);
let stmts = result.statements;
let milliChecker = (num: number) => {
              expect(stmts[num]).to.have.property("stored");
              const milliseconds = parseMillisecondsFromIso(stmts[num].stored);
              expect(milliseconds).to.not.equal(null);
              //precision to milliseconds
              if ((milliseconds as number) % 10 > 0) {
                expect((milliseconds as number) % 10).to.be.above(0);
                
              } else {
                if (++num < stmts.length) {
                  milliChecker(num);
                } else {
                  expect((milliseconds as number) % 10).to.be.above(0);
                  
                }
              }
            };
milliChecker(0);
    });
  });
});
