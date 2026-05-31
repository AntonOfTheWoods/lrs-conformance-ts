/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import helperImport from "../helper.ts";
import requestBase from "../super-request.ts";
import templatingSelectionImport from "../templatingSelection.ts";

import { describe } from "bun:test";
const helper: any = helperImport;
const templatingSelection: any = templatingSelectionImport;
let request: any = requestBase;

if (process.env["OAUTH1_ENABLED"] === "true") request = helper.OAuthRequest(request);

/**  Matchup with Conformance Requirements Document
 * XAPI-00044 - in verbs.js - two suites
 * XAPI-00045 - in verbs.js
 */

describe("Verb Property Requirements (Data 2.4.3)", () => {
  templatingSelection.createTemplate("verbs.ts");
});
