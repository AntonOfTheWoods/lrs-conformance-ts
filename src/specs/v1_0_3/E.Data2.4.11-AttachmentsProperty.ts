import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAttachmentsPropertyRequirementsSuite as registerSharedAttachmentsPropertyRequirementsSuite } from "../shared/attachments-property.ts";

export function registerAttachmentsPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAttachmentsPropertyRequirementsSuite(runtime, context);
}
