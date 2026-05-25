import { registerStatementPostConfigSuite } from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { formattingMissingPropertyGroups } from "../shared/formatting-missing-properties.ts";

/**
 * Description : This is a test suite that tests an LRS endpoint based on the testing requirements document
 * found at https://github.com/adlnet/xapi-lrs-conformance-requirements
 */
export function registerFormattingRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  runtime.before("Before all tests are run", async () => {
    await context.setTimeMargin();
  });

  runtime.describe("Formatting Requirements (Data 2.2)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00001 - in formatting.js
     * XAPI-00002 - below
     * XAPI-00003 - in formatting.js
     * XAPI-00004 - in formatting.js
     * XAPI-00005 - in formatting.js
     * XAPI-00006 - in formatting.js
     * XAPI-00007 - in formatting.js
     * XAPI-00008 - in formatting.js
     * XAPI-00009 - in formatting.js
     * XAPI-00010 - in formatting.js
     * XAPI-00011 - below
     * XAPI-00012 - below
     * XAPI-00013 - in formatting.js
     * XAPI-00014 - below and in verify.js
     * XAPI-00015 - in Communication 1.4 - should stay in Comm 1.4 Encoding
     */
    registerStatementPostConfigSuite(runtime, context, formattingMissingPropertyGroups);
  });
}
