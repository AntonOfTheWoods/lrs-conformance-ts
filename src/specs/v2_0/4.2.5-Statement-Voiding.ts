import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerStatementLifecycleRequirementsSuite as registerSharedStatementLifecycleRequirementsSuite } from "../shared/statement-lifecycle.ts";

export function registerStatementLifecycleRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedStatementLifecycleRequirementsSuite(runtime, context, {
    includeNeverRejectVoidedVerbCase: true,
  });
}
