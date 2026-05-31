/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import { describe, expect, it } from "bun:test";
import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import { expectAsync } from "../super-request.ts";
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
  templatingSelection.createTemplate("contextagents.ts");
  templatingSelection.createTemplate("contextgroups.ts");

  /**  XAPI-00096, Data 2.4.6.2 ContextActivities Property
   * An LRS's Statement Resource returns a ContextActivity in an array, even if only a single ContextActivity is returned.
   */
  describe("An LRS returns a ContextActivity in an array, even if only a single ContextActivity is returned (Data 2.4.6.2.s4.b3, XAPI-00096)", function () {
    const types = ["parent", "grouping", "category", "other"];
    types.forEach(function (type) {
      it(
        'should return array for statement context "' + type + '"  when single ContextActivity is passed',
        async function () {
          const templates = [{ statement: "{{statements.context}}" }, { context: "{{contexts." + type + "}}" }];
          let data = helper.createFromTemplate(templates);
          data = data.statement;
          data.id = helper.generateUUID();
          const query = "?statementId=" + data.id;
          const stmtTime = Date.now();
          await expectAsync(
            request(helper.getEndpointAndAuth())
              .post(helper.getEndpointStatements())
              .headers(helper.addAllHeaders({}))
              .json(data),
            200,
          );

          const getRes = await expectAsync(
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + query)
              .wait(helper.genDelay(stmtTime, query, data.id))
              .headers(helper.addAllHeaders({})),
            200,
          );

          const statement = helper.parse(getRes.body);
          expect(statement).toHaveProperty("context.contextActivities");
          expect(statement.context.contextActivities).toHaveProperty(type);
          expect(Array.isArray(statement.context.contextActivities[type])).toBe(true);
        },
      );
    });

    types.forEach(function (type) {
      it(
        'should return array for statement substatement context "' + type + '"  when single ContextActivity is passed',
        async function () {
          const templates = [
            { statement: "{{statements.object_substatement}}" },
            { object: "{{substatements.context}}" },
            { context: "{{contexts." + type + "}}" },
          ];
          let data = helper.createFromTemplate(templates);
          data = data.statement;
          data.id = helper.generateUUID();
          const query = "?statementId=" + data.id;
          const stmtTime = Date.now();

          await expectAsync(
            request(helper.getEndpointAndAuth())
              .post(helper.getEndpointStatements())
              .headers(helper.addAllHeaders({}))
              .json(data),
            200,
          );

          const getRes = await expectAsync(
            request(helper.getEndpointAndAuth())
              .get(helper.getEndpointStatements() + query)
              .wait(helper.genDelay(stmtTime, query, data.id))
              .headers(helper.addAllHeaders({})),
            200,
          );

          const statement = helper.parse(getRes.body);
          expect(statement).toHaveProperty("object.context.contextActivities");
          expect(statement.object.context.contextActivities).toHaveProperty(type);
          expect(Array.isArray(statement.object.context.contextActivities[type])).toBe(true);
        },
      );
    });
  });
});
