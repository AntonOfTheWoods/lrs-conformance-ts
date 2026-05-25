import { registerActorPropertyRequirementsSuite as registerActorPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.2-ActorProperty.ts";
import { registerAttachmentsPropertyRequirementsSuite as registerAttachmentsPropertyRequirementsV103 } from "../specs/v1_0_3/E.Data2.4.11-AttachmentsProperty.ts";
import { registerAuthorityPropertyRequirementsSuite as registerAuthorityPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.9-AuthorityProperty.ts";
import { registerContextPropertyRequirementsSuite as registerContextPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.6-ContextProperty.ts";
import { registerFormattingRequirementsSuite as registerFormattingRequirementsV103 } from "../specs/v1_0_3/Data2.2-FormattingRequirements.ts";
import { registerVerbPropertyRequirementsSuite as registerVerbPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.3-VerbProperty.ts";
import { registerIdPropertyRequirementsSuite as registerIdPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.1-IDProperty.ts";
import { registerObjectPropertyRequirementsSuite as registerObjectPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.4-ObjectProperty.ts";
import { registerResultPropertyRequirementsSuite as registerResultPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.5-ResultProperty.ts";
import { registerRetrievalOfStatementsSuite as registerRetrievalOfStatementsV103 } from "../specs/v1_0_3/E.Data2.5-RetrievalofStatements.ts";
import { registerStatementResourceRequirementsSuite as registerStatementResourceRequirementsV103 } from "../specs/v1_0_3/H.Communication2.1-StatementResource.ts";
import { registerStatementLifecycleRequirementsSuite as registerStatementLifecycleRequirementsV103 } from "../specs/v1_0_3/Data2.3-StatementLifecycle.ts";
import { registerStoredPropertyRequirementsSuite as registerStoredPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.8-StoredProperty.ts";
import { registerTimestampPropertyRequirementsSuite as registerTimestampPropertyRequirementsV103 } from "../specs/v1_0_3/Data2.4.7-TimestampProperty.ts";
import { registerVersionPropertyRequirementsSuite as registerVersionPropertyRequirementsV103 } from "../specs/v1_0_3/E.Data2.4.10-VersionProperty.ts";
import { registerActorPropertyRequirementsSuite as registerActorPropertyRequirementsV20 } from "../specs/v2_0/4.2.2.1-Actor-Requirements.ts";
import { registerAttachmentsPropertyRequirementsSuite as registerAttachmentsPropertyRequirementsV20 } from "../specs/v2_0/4.2.2.6-Attachment-Requirements.ts";
import { registerAuthorityPropertyRequirementsSuite as registerAuthorityPropertyRequirementsV20 } from "../specs/v2_0/4.2.4.2-Authority-Requirements.ts";
import { registerContextPropertyRequirementsSuite as registerContextPropertyRequirementsV20 } from "../specs/v2_0/4.2.2.5-Context-Requirements.ts";
import { registerFormattingRequirementsSuite as registerFormattingRequirementsV20 } from "../specs/v2_0/Data2.2-FormattingRequirements.ts";
import { registerVerbPropertyRequirementsSuite as registerVerbPropertyRequirementsV20 } from "../specs/v2_0/4.2.2.2-Verb-Requirements.ts";
import { registerIdPropertyRequirementsSuite as registerIdPropertyRequirementsV20 } from "../specs/v2_0/4.2.4.2-ID-Requirements.ts";
import { registerObjectPropertyRequirementsSuite as registerObjectPropertyRequirementsV20 } from "../specs/v2_0/4.2.2.3-Object-Requirements.ts";
import { registerResultPropertyRequirementsSuite as registerResultPropertyRequirementsV20 } from "../specs/v2_0/4.2.2.4-Result-Requirements.ts";
import { registerRetrievalOfStatementsSuite as registerRetrievalOfStatementsV20 } from "../specs/v2_0/E.Data2.5-RetrievalofStatements.ts";
import { registerStatementResourceRequirementsSuite as registerStatementResourceRequirementsV20 } from "../specs/v2_0/4.1.6.1-Statement-Resource.ts";
import { registerStatementLifecycleRequirementsSuite as registerStatementLifecycleRequirementsV20 } from "../specs/v2_0/4.2.5-Statement-Voiding.ts";
import { registerStoredPropertyRequirementsSuite as registerStoredPropertyRequirementsV20 } from "../specs/v2_0/4.2.4.2-Stored-Requirements.ts";
import { registerTimestampPropertyRequirementsSuite as registerTimestampPropertyRequirementsV20 } from "../specs/v2_0/4.2.4.2-Timestamp-Requirements.ts";
import { registerVersionPropertyRequirementsSuite as registerVersionPropertyRequirementsV20 } from "../specs/v2_0/4.2.4.3-Version-Requirements.ts";
import { registerMultiplicityTestingSuite } from "../specs/Multiplicity/testing.ts";
import { registerParametersTestingSuite } from "../specs/Parameters/testing.ts";
import type { NormalizedRunnerOptions } from "./options.ts";
import type { DescribeRuntime } from "./runtime.ts";
import { createDescribeRuntimeContext, type DescribeRuntimeContext } from "./suite-context.ts";

type SuiteRegistrar = (runtime: DescribeRuntime, context: DescribeRuntimeContext) => void;

const registrarsByDirectory: Readonly<Record<string, readonly SuiteRegistrar[]>> = {
  Multiplicity: [registerMultiplicityTestingSuite],
  Parameters: [registerParametersTestingSuite],
  v1_0_3: [
    registerFormattingRequirementsV103,
    registerIdPropertyRequirementsV103,
    registerTimestampPropertyRequirementsV103,
    registerStoredPropertyRequirementsV103,
    registerVerbPropertyRequirementsV103,
    registerVersionPropertyRequirementsV103,
    registerResultPropertyRequirementsV103,
    registerActorPropertyRequirementsV103,
    registerObjectPropertyRequirementsV103,
    registerContextPropertyRequirementsV103,
    registerAuthorityPropertyRequirementsV103,
    registerAttachmentsPropertyRequirementsV103,
    registerStatementLifecycleRequirementsV103,
    registerRetrievalOfStatementsV103,
    registerStatementResourceRequirementsV103,
  ],
  v2_0: [
    registerFormattingRequirementsV20,
    registerIdPropertyRequirementsV20,
    registerTimestampPropertyRequirementsV20,
    registerStoredPropertyRequirementsV20,
    registerVerbPropertyRequirementsV20,
    registerVersionPropertyRequirementsV20,
    registerResultPropertyRequirementsV20,
    registerActorPropertyRequirementsV20,
    registerObjectPropertyRequirementsV20,
    registerContextPropertyRequirementsV20,
    registerAuthorityPropertyRequirementsV20,
    registerAttachmentsPropertyRequirementsV20,
    registerStatementLifecycleRequirementsV20,
    registerRetrievalOfStatementsV20,
    registerStatementResourceRequirementsV20,
  ],
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
