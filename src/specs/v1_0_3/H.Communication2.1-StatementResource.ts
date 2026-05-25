import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerStatementResourceRequirementsSuite as registerSharedStatementResourceRequirementsSuite } from "../shared/statement-resource.ts";

export function registerStatementResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedStatementResourceRequirementsSuite(runtime, context);
}
