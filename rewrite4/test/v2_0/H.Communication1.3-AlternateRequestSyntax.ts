/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements.
 */

import { expect } from "bun:test";
import oldHelpers from "../helper.ts";
import superRequestBase from "../super-request.ts";

const helper: any = oldHelpers;
let superRequest = superRequestBase;

if (process.env["OAUTH1_ENABLED"] === "true") superRequest = helper.OAuthRequest(superRequest);

describe("Alternate Request Syntax Requirements", () => {
  it("The LRS Spec does not mandate any properties regarding Alternate Request Syntax in xAPI 2.0", async () => {
    expect(true).toEqual(true);
  });
});
