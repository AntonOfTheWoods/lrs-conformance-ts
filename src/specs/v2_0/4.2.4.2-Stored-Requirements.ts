import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { registerStoredPropertyRequirementsSuite as registerSharedStoredPropertyRequirementsSuite } from "../shared/stored-property.ts";

export function registerStoredPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedStoredPropertyRequirementsSuite(runtime, context);
}
