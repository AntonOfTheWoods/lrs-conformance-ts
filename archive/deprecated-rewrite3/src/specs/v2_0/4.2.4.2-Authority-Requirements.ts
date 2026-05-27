import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAuthorityPropertyRequirementsSuite as registerSharedAuthorityPropertyRequirementsSuite } from "../shared/authority-property.ts";

export function registerAuthorityPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAuthorityPropertyRequirementsSuite(runtime, context);
}
