import type { DescribeRuntime } from "../../describe-runtime/runtime.ts";
import type { DescribeRuntimeContext } from "../../describe-runtime/suite-context.ts";

import { registerActivityProfileResourceRequirementsSuite as registerSharedActivityProfileResourceRequirementsSuite } from "../shared/document-resource.ts";

export function registerActivityProfileResourceRequirementsSuite(
  runtime: DescribeRuntime,
  context: DescribeRuntimeContext,
): void {
  registerSharedActivityProfileResourceRequirementsSuite(runtime, context, {
    includeLastModifiedCases: true,
    nestPutAcceptance: true,
    putAcceptancePassTitle: "passes with 204 no content",
  });
}
