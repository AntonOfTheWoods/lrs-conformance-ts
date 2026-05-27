import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { registerVersionPropertyRequirementsSuite as registerSharedVersionPropertyRequirementsSuite } from "../shared/version-property.ts";

export function registerVersionPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedVersionPropertyRequirementsSuite(runtime, context);
}
