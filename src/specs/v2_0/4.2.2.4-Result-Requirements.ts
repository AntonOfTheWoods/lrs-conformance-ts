import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { registerResultPropertyRequirementsSuite as registerSharedResultPropertyRequirementsSuite } from "../shared/result-property.ts";

export function registerResultPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedResultPropertyRequirementsSuite(runtime, context);
}
