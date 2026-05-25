import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerContextPropertyRequirementsSuite as registerSharedContextPropertyRequirementsSuite } from "../shared/context-property.ts";
import { contextPropertyV2Groups } from "../shared/context-property-v2-groups.ts";

export function registerContextPropertyRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedContextPropertyRequirementsSuite(runtime, context, contextPropertyV2Groups);
}
