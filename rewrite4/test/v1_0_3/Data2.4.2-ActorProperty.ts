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

  /**  Matchup with Conformance Requirements Document
 * XAPI-00031 - in actors.js

 * 2.4.2.1 Actor is Agent - may have more in agents.js
 * XAPI-00032 - in agents.js
 * XAPI-00033 - in agents.js
 * XAPI-00034 - in agents.js

 * 2.4.2.2 Actor is Group
 * XAPI-00035 - in groups.js
 * XAPI-00036 - in groups.js
 * XAPI-00037 - in groups.js - multiple suites

 * 2.4.2.3 Inverse Function Identifier
 * XAPI-00038 - in ifis.js - two suites
 * XAPI-00039 - in ifis.js
 * XAPI-00040 - in ifis.js
 * XAPI-00041 - in ifis.js

 * 2.4.2.4 Account Object
 * XAPI-00042 - in accountobjects.js
 * XAPI-00043 - in accountobjects.js
 */

  describe("Actor Property Requirements (Data 2.4.2)", () => {
    //Data 2.4.2
    templatingSelection.createTemplate("actors.ts");
    //Data 2.4.2.1
    templatingSelection.createTemplate("agents.ts");
    //Data 2.4.2.2
    templatingSelection.createTemplate("groups.ts");
    //Data 2.4.2.3
    templatingSelection.createTemplate("ifis.ts");
    //Data 2.4.2.4
    templatingSelection.createTemplate("accountobjects.ts");
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
