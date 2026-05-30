/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "bun:test";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { expectAsync, endAsync } from "../super-request.ts";
import templatingSelectionImport from "../templatingSelection.ts";

const helper: any = helperImport;
const templatingSelection: any = templatingSelectionImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

describe("Statement Lifecycle Requirements (Data 2.3)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00016 - below
   * XAPI-00017 - in voiding.js
   * XAPI-00018 - below
   * XAPI-00019 - in voiding.js
   * XAPI-00020 - in voiding.js
   */

  templatingSelection.createTemplate("voiding.ts");

  /**  XAPI-00018, Data 2.3.2 Voiding
   * An LRS MUST consider a Statement it contains voided if the Statement is not itself a voiding Statement and the LRS also contains a voiding Statement referring to the first Statement.
   * Test: Void a statement and then send a GET for that statement which uses “statementId” instead of “voidedStatementId.” The statement should then not be returned in the GET request, which should return a 404.
   */
  describe("A Voided Statement is defined as a Statement that is not a Voiding Statement and is the Target of a Voiding Statement within the LRS (Data 2.3.2.s2.b3, XAPI-00018)", function () {
    let voidedId = helper.generateUUID();
    let stmtTime: number;

    before("persist voided statement", async function () {
      let templates = [{ statement: "{{statements.default}}" }];
      let voided = helper.createFromTemplate(templates);
      voided = voided.statement;
      voided.id = voidedId;

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(voided),
        200,
      );
    });

    before("persist voiding statement", async function () {
      let templates = [{ statement: "{{statements.voiding}}" }];
      let voiding = helper.createFromTemplate(templates);
      voiding = voiding.statement;
      voiding.object.id = voidedId;
      stmtTime = Date.now();

      await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(voiding),
        200,
      );
    });

    it('should return a voided statement when using GET "voidedStatementId"', async function () {
      this.timeout(0);
      let query = helper.getUrlEncoding({ voidedStatementId: voidedId });
      const res = await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + "?" + query)
          .wait(helper.genDelay(stmtTime, "?" + query, voidedId))
          .headers(helper.addAllHeaders({})),
        200,
      );

      let statement = helper.parse(res.body);
      expect(statement.id).toEqual(voidedId);
    });

    it('should return 404 when using GET with "statementId"', async function () {
      this.timeout(0);
      let query = helper.getUrlEncoding({ statementId: voidedId });
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + "?" + query)
          .wait(helper.genDelay(stmtTime, "?" + query, voidedId))
          .headers(helper.addAllHeaders({})),
        404,
      );
    });
  });

  /**  XAPI-00016, Data 2.3.2 Voiding
   * A Voiding Statement cannot Target another Voiding Statement.
   * LRS behavior this new VOIDING statement MAY be rejected.
   * If the LRS accepts that statement, the violating VOIDING statement SHOULD be ignored.
   * Adjust this test accordingly
   */
  describe("A Voiding Statement cannot Target another Voiding Statement (Data 2.3.2.s2.b7, XAPI-00016)", function () {
    let voidedId: string;
    let voidingId: string;

    before("persist voided statement", async function () {
      let templates = [{ statement: "{{statements.default}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;

      const res = await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
        200,
      );

      voidedId = (res.body as string[])[0] as string;
    });

    before("persist voiding statement", async function () {
      let templates = [{ statement: "{{statements.voiding}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.object.id = voidedId;

      const res = await expectAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
        200,
      );

      voidingId = (res.body as string[])[0] as string;
    });

    it("should not void an already voided statement", async function () {
      this.timeout(0);
      let templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.object.id = voidedId;
      let stmtTime = Date.now();

      await endAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
      );

      let query = "?voidedStatementId=" + voidedId;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements())
          .wait(helper.genDelay(stmtTime, query, voidedId))
          .headers(helper.addAllHeaders({})),
        200,
      );
    });

    it("should not void a voiding statement", async function () {
      this.timeout(0);
      let templates = [{ statement: "{{statements.object_statementref}}" }, { verb: "{{verbs.voided}}" }];
      let data = helper.createFromTemplate(templates);
      data = data.statement;
      data.object.id = voidingId;
      let stmtTime = Date.now();

      await endAsync(
        request(helper.getEndpointAndAuth())
          .post(helper.getEndpointStatements())
          .headers(helper.addAllHeaders({}))
          .json(data),
      );

      let query = "?statementId=" + voidingId;
      await expectAsync(
        request(helper.getEndpointAndAuth())
          .get(helper.getEndpointStatements() + query)
          .headers(helper.addAllHeaders({}))
          .wait(helper.genDelay(stmtTime, query, voidingId)),
        200,
      );
    });
  });
});
