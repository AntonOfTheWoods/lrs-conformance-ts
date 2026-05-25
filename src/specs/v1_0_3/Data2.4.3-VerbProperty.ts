import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";
import { registerVerbPropertyRequirementsSuite as registerSharedVerbPropertyRequirementsSuite } from "../shared/verb-property.ts";

export function registerVerbPropertyRequirementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedVerbPropertyRequirementsSuite(runtime, context);
}
