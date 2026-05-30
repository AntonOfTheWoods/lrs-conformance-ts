/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { expect } from "bun:test";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { endAsync } from "../super-request.ts";
import templatingSelectionImport from "../templatingSelection.ts";

const helper: any = helperImport;
const templatingSelection: any = templatingSelectionImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

describe("Context Property Requirements (Data 2.4.6)", function () {
  //Data 2.4.6.s3
  /**  Matchup with Conformance Requirements Document
   * XAPI-00084 - in contexts.js
   * XAPI-00085 - in contexts.js
   * XAPI-00086 - in contexts.js
   * XAPI-00087-1 - in contexts.js
   * XAPI-00087-2 - in contexts.js
   * XAPI-00088 - in contexts.js
   * XAPI-00089 - in contexts.js
   * XAPI-00090 - in contexts.js
   * XAPI-00091 - in contexts.js
   * XAPI-00092 - in contexts.js
   */
  templatingSelection.createTemplate("contexts.ts");

  //Data 2.4.6.2
  /**  Matchup with Conformance Requirements Document
   * XAPI-00093 - in contextactivities.js
   * XAPI-00094 - in contextactivities.js
   * XAPI-00095 - removed per 02/08/2017 spec call
   * XAPI-00096 - below
   */
  templatingSelection.createTemplate("contextactivities.ts");

  /**  XAPI-00096, Data 2.4.6.2 ContextActivities Property
   * An LRS's Statement Resource returns a ContextActivity in an array, even if only a single ContextActivity is returned.
   */
  describe("An LRS returns a ContextActivity in an array, even if only a single ContextActivity is returned (Data 2.4.6.2.s4.b3, XAPI-00096)", function () {
    let types = ["parent", "grouping", "category", "other"];
    this.timeout(0);

    types.forEach(function (type) {
      it(
        'should return array for statement context "' + type + '"  when single ContextActivity is passed',
        async function () {
          let templates = [{ statement: "{{statements.context}}" }, { context: "{{contexts." + type + "}}" }];
          let data = helper.createFromTemplate(templates);
          data = data.statement;
          data.id = helper.generateUUID();
          let query = "?statementId=" + data.id;
          let stmtTime = Date.now();
          await endAsync(
            request(helper.getEndpointAndAuth())
              .post(helper.getEndpointStatements())
              .headers(helper.addAllHeaders({}))
              .json(data)
              .expect(200),
          );

          const res = await endAsync(
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + query)
              .wait(helper.genDelay(stmtTime, query, data.id))
              .headers(helper.addAllHeaders({}))
              .expect(200),
          );

          let statement = helper.parse(res.body);
          expect(statement).toHaveProperty("context");
          expect(statement.context).toHaveProperty("contextActivities");
          expect(statement.context.contextActivities).toHaveProperty(type);
          expect(statement.context.contextActivities[type]).toSatisfy((v: any) => Array.isArray(v));
        },
      );
    });

    types.forEach(function (type) {
      it(
        'should return array for statement substatement context "' + type + '"  when single ContextActivity is passed',
        async function () {
          let templates = [
            { statement: "{{statements.object_substatement}}" },
            { object: "{{substatements.context}}" },
            { context: "{{contexts." + type + "}}" },
          ];
          let data = helper.createFromTemplate(templates);
          data = data.statement;
          data.id = helper.generateUUID();
          let query = "?statementId=" + data.id;
          let stmtTime = Date.now();

          await endAsync(
            request(helper.getEndpointAndAuth())
              .post(helper.getEndpointStatements())
              .headers(helper.addAllHeaders({}))
              .json(data)
              .expect(200),
          );

          const res = await endAsync(
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + query)
              .wait(helper.genDelay(stmtTime, query, data.id))
              .headers(helper.addAllHeaders({}))
              .expect(200),
          );

          let statement = helper.parse(res.body);
          expect(statement).toHaveProperty("object");
          expect(statement.object).toHaveProperty("context");
          expect(statement.object.context).toHaveProperty("contextActivities");
          expect(statement.object.context.contextActivities).toHaveProperty(type);
          expect(statement.object.context.contextActivities[type]).toSatisfy((v: any) => Array.isArray(v));
        },
      );
    });
  });
});
