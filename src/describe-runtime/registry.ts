import { registerFormattingRequirementsSuite as registerFormattingRequirementsV103 } from "../specs/v1_0_3/Data2.2-FormattingRequirements.ts";
import { registerFormattingRequirementsSuite as registerFormattingRequirementsV20 } from "../specs/v2_0/Data2.2-FormattingRequirements.ts";
import { registerParametersTestingSuite } from "../specs/Parameters/testing.ts";
import type { NormalizedRunnerOptions } from "./options.ts";
import type { DescribeRuntime } from "./runtime.ts";
import { createDescribeRuntimeContext, type DescribeRuntimeContext } from "./suite-context.ts";

type SuiteRegistrar = (runtime: DescribeRuntime, context: DescribeRuntimeContext) => void;

const registrarsByDirectory: Readonly<Record<string, readonly SuiteRegistrar[]>> = {
  Parameters: [registerParametersTestingSuite],
  v1_0_3: [registerFormattingRequirementsV103],
  v2_0: [registerFormattingRequirementsV20],
};

export function registerDirectorySuites(runtime: DescribeRuntime, options: NormalizedRunnerOptions): void {
  for (const directory of options.directory) {
    const registrars = registrarsByDirectory[directory];
    if (!registrars || registrars.length === 0) {
      throw new Error(`No suite definitions registered for directory: ${directory}`);
    }

    const context = createDescribeRuntimeContext(directory, options);
    for (const registrar of registrars) {
      registrar(runtime, context);
    }
  }
}
