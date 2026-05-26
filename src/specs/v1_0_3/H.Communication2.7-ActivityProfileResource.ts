import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerActivityProfileResourceRequirementsSuite as registerSharedActivityProfileResourceRequirementsSuite } from "../shared/document-resource.ts";

export function registerActivityProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedActivityProfileResourceRequirementsSuite(runtime, context, {
    nestPutAcceptance: true,
    putAcceptancePassTitle: "passes with 204 no content",
    putAcceptanceWithoutHeaderTitle: "fails without ETag header",
  });
}
