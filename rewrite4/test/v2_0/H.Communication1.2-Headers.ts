/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

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
) {
  // "use strict";
  if (global.OAUTH) request = helper.OAuthRequest(request);

  describe("Headers Requirements (Communication 1.2)", () => {});
})(
  module,
  require("fs"),
  require("extend"),
  require("moment"),
  require("super-request"),
  require("supertest-as-promised"),
  require("chai"),
  require("url"),
  require("joi"),
  require("./../helper.ts"),
  require("./../multipartParser.ts"),
  require("./../redirect.ts"),
);
