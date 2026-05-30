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

describe("Attachments Property Requirements (Data 2.4.11)", function () {
  /**  Matchup with Conformance Requirements Document
 * XAPI-00102 - in attachments.js
 * XAPI-00103 - in attachments.js
 * XAPI-00104 - in attachments.js
 * XAPI-00105 - in attachments.js
 * XAPI-00106 - in attachments.js
 * XAPI-00107 - in attachments.js

 * Note XAPI-00025 - in attachments.js
 */

  templatingSelection.createTemplate("attachments.ts");
});
