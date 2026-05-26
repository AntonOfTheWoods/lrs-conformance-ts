import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerHeadRequestImplementationSuite as registerSharedHeadRequestImplementationSuite } from "../shared/protocol-requirements.ts";

export function registerHeadRequestImplementationSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedHeadRequestImplementationSuite(runtime, context);
}
