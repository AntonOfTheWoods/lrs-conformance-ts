/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */

import helperImport from "../helper.ts";
import requestBase from "super-request";
import templatingSelectionImport from "../templatingSelection.ts";

const helper: any = helperImport;
const templatingSelection: any = templatingSelectionImport;
let request: any = requestBase;

if (global.OAUTH) request = helper.OAuthRequest(request);

describe("Timestamp Property Requirements (Data 2.4.7)", () => {
  /**  Matchup with Conformance Requirements Document
   * XAPI-00022 - in timestamp_property.js
   */

  templatingSelection.createTemplate("timestamp_property.ts");
});
