/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import helperImport from "../helper.ts";
import requestBase from "super-request";

const helper: any = helperImport;
let request: any = requestBase;

if (global.OAUTH) request = helper.OAuthRequest(request);

describe("Headers Requirements (Communication 1.2)", () => {});
