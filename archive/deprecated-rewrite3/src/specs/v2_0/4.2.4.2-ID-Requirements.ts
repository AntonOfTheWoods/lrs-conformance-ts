import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { registerIdPropertyRequirementsSuite as registerSharedIdPropertyRequirementsSuite } from "../shared/id-property.ts";

export function registerIdPropertyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedIdPropertyRequirementsSuite(runtime, context);
}
