import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerAdditionalRequirementsForDataTypesSuite as registerSharedAdditionalRequirementsForDataTypesSuite } from "../shared/special-data-types.ts";

export function registerAdditionalRequirementsForDataTypesSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedAdditionalRequirementsForDataTypesSuite(runtime, context);
}
