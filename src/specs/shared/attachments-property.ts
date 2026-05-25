import { registerStatementPostConfigSuite } from "../../describe-runtime/config-suite.ts";
import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { attachmentsPropertyGroups } from "./attachments-property-groups.ts";

export function registerAttachmentsPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  runtime.describe("Attachments Property Requirements (Data 2.4.11)", () => {
    /**  Matchup with Conformance Requirements Document
     * XAPI-00025 - in attachments.js
     * XAPI-00102..XAPI-00107 - in attachments.js
     */
    registerStatementPostConfigSuite(runtime, context, attachmentsPropertyGroups);
  });
}
