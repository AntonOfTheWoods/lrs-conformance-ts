/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import __esmDep1 from "fs";
import __esmDep2 from "extend";
import __esmDep3 from "moment";
import __esmDep4 from "super-request";
import __esmDep5 from "supertest-as-promised";
import __esmDep6 from "chai";
import __esmDep7 from "url";
import __esmDep8 from "joi";
import __esmDep9 from "./../helper.ts";
import __esmDep10 from "./../multipartParser.ts";
import __esmDep11 from "./../redirect.ts";
import __esmDep12 from "./../templatingSelection.ts";

(function (
  module: any,
  fs: any,
  extend: any,
  moment: any,
  request: any,
  requestPromise: any,
  chai: any,
  liburl: any,
  Joi: any,
  helper: any,
  multipartParser: any,
  redirect: any,
  templatingSelection: any,
) {
  // "use strict";

  if (global.OAUTH) request = helper.OAuthRequest(request);

  describe("Result Property Requirements (Data 2.4.5)", () => {
    /**  Matchup with Conformance Requirements Document
 * Data 2.4.5 Result
 * XAPI-00074 - in results.js
 * XAPI-00075 - in results.js
 * XAPI-00076 - in results.js
 * XAPI-00077 - in results.js
 * XAPI-00078 - in results.js

 * Data 2.4.5.1 Score
 * XAPI-00079 - in scores.js
 * XAPI-00080 - in scores.js
 * XAPI-00081 - in scores.js
 * XAPI-00082 - in scores.js
 * XAPI-00083 - in scores.js
 */
    templatingSelection.createTemplate("results.ts");
    templatingSelection.createTemplate("scores.ts");
  });
})(undefined,__esmDep1,
  __esmDep2,
  __esmDep3,
  __esmDep4,
  __esmDep5,
  __esmDep6,
  __esmDep7,
  __esmDep8,
  __esmDep9,
  __esmDep10,
  __esmDep11,
  __esmDep12,
);
