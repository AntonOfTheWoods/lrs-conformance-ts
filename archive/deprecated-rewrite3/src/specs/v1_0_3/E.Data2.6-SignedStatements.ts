import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerSignedStatementsSuite as registerSharedSignedStatementsSuite } from "../shared/signed-statements.ts";

export function registerSignedStatementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedSignedStatementsSuite(runtime, context);
}
