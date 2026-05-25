import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerRetrievalOfStatementsSuite as registerSharedRetrievalOfStatementsSuite } from "../shared/retrieval-of-statements.ts";

export function registerRetrievalOfStatementsSuite(runtime: DescribeRuntime, context: DescribeRuntimeContext): void {
  registerSharedRetrievalOfStatementsSuite(runtime, context);
}
