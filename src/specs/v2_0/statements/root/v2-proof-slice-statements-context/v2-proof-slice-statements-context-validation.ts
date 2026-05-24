import type { SuiteDefinition } from "../../../../../domain/contracts";
import { v2StatementsVerifyContextTemplateStatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-verify-context-template-statement";
import { v2StatementsVerifyContextTemplateSubstatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-verify-context-template-substatement";
import { v2StatementsContextInvalidRegistrationStatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-registration-statement-object";
import { v2StatementsContextInvalidRegistrationStatementStringCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-registration-statement-string";
import { v2StatementsContextInvalidRegistrationSubstatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-registration-substatement-object";
import { v2StatementsContextInvalidRegistrationSubstatementStringCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-registration-substatement-string";
import { v2StatementsContextInvalidTeamStatementAgentCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-team-statement-agent";
import { v2StatementsContextInvalidTeamStatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-team-statement-object";
import { v2StatementsContextInvalidTeamStatementStringCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-team-statement-string";
import { v2StatementsContextInvalidTeamSubstatementAgentCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-team-substatement-agent";
import { v2StatementsContextInvalidTeamSubstatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-team-substatement-object";
import { v2StatementsContextInvalidTeamSubstatementStringCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-team-substatement-string";
import { v2StatementsContextInvalidContextActivitiesTypeStatementStringCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-context-activities-type-statement-string";
import { v2StatementsContextInvalidContextActivitiesTypeSubstatementStringCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-context-activities-type-substatement-string";
import { v2StatementsContextInvalidRevisionTypeStatementNumberCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-revision-type-statement-number";
import { v2StatementsContextInvalidRevisionTypeStatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-revision-type-statement-object";
import { v2StatementsContextInvalidRevisionTypeSubstatementNumberCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-revision-type-substatement-number";
import { v2StatementsContextInvalidRevisionTypeSubstatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-revision-type-substatement-object";
import { v2StatementsContextRevisionActivityOnlyStatementAgentCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-statement-agent";
import { v2StatementsContextRevisionActivityOnlyStatementGroupCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-statement-group";
import { v2StatementsContextRevisionActivityOnlyStatementStatementRefCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-statement-statement-ref";
import { v2StatementsContextRevisionActivityOnlyStatementSubstatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-statement-substatement";
import { v2StatementsContextRevisionActivityOnlySubstatementAgentCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-substatement-agent";
import { v2StatementsContextRevisionActivityOnlySubstatementGroupCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-substatement-group";
import { v2StatementsContextRevisionActivityOnlySubstatementStatementRefCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-activity-only-substatement-statement-ref";
import { v2StatementsContextRevisionNoObjectTypeStatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-no-object-type-statement";
import { v2StatementsContextRevisionNoObjectTypeSubstatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-revision-no-object-type-substatement";
import { v2StatementsContextInvalidPlatformTypeStatementNumberCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-platform-type-statement-number";
import { v2StatementsContextInvalidPlatformTypeStatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-platform-type-statement-object";
import { v2StatementsContextInvalidPlatformTypeSubstatementNumberCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-platform-type-substatement-number";
import { v2StatementsContextInvalidPlatformTypeSubstatementObjectCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-platform-type-substatement-object";
import { v2StatementsContextPlatformActivityOnlyStatementAgentCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-statement-agent";
import { v2StatementsContextPlatformActivityOnlyStatementGroupCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-statement-group";
import { v2StatementsContextPlatformActivityOnlyStatementStatementRefCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-statement-statement-ref";
import { v2StatementsContextPlatformActivityOnlyStatementSubstatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-statement-substatement";
import { v2StatementsContextPlatformActivityOnlySubstatementAgentCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-substatement-agent";
import { v2StatementsContextPlatformActivityOnlySubstatementGroupCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-substatement-group";
import { v2StatementsContextPlatformActivityOnlySubstatementStatementRefCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-activity-only-substatement-statement-ref";
import { v2StatementsContextPlatformNoObjectTypeStatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-no-object-type-statement";
import { v2StatementsContextPlatformNoObjectTypeSubstatementCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-platform-no-object-type-substatement";
import { v2StatementsContextInvalidStatementRefStatementObjectTypeCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-statement-ref-statement-object-type";
import { v2StatementsContextInvalidStatementRefStatementIdCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-statement-ref-statement-id";
import { v2StatementsContextInvalidStatementRefSubstatementObjectTypeCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-statement-ref-substatement-object-type";
import { v2StatementsContextInvalidStatementRefSubstatementIdCase } from "./v2-proof-slice-statements-context-validation/v2-statements-context-invalid-statement-ref-substatement-id";

export const v2ProofSliceStatementsContextValidationSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.context.validation",
  "title": "Context Validation",
  "specVersion": "2.0.0",
  "tags": [
    "validation"
  ]
,
  "children": [
    v2StatementsVerifyContextTemplateStatementCase,
    v2StatementsVerifyContextTemplateSubstatementCase,
    v2StatementsContextInvalidRegistrationStatementObjectCase,
    v2StatementsContextInvalidRegistrationStatementStringCase,
    v2StatementsContextInvalidRegistrationSubstatementObjectCase,
    v2StatementsContextInvalidRegistrationSubstatementStringCase,
    v2StatementsContextInvalidTeamStatementAgentCase,
    v2StatementsContextInvalidTeamStatementObjectCase,
    v2StatementsContextInvalidTeamStatementStringCase,
    v2StatementsContextInvalidTeamSubstatementAgentCase,
    v2StatementsContextInvalidTeamSubstatementObjectCase,
    v2StatementsContextInvalidTeamSubstatementStringCase,
    v2StatementsContextInvalidContextActivitiesTypeStatementStringCase,
    v2StatementsContextInvalidContextActivitiesTypeSubstatementStringCase,
    v2StatementsContextInvalidRevisionTypeStatementNumberCase,
    v2StatementsContextInvalidRevisionTypeStatementObjectCase,
    v2StatementsContextInvalidRevisionTypeSubstatementNumberCase,
    v2StatementsContextInvalidRevisionTypeSubstatementObjectCase,
    v2StatementsContextRevisionActivityOnlyStatementAgentCase,
    v2StatementsContextRevisionActivityOnlyStatementGroupCase,
    v2StatementsContextRevisionActivityOnlyStatementStatementRefCase,
    v2StatementsContextRevisionActivityOnlyStatementSubstatementCase,
    v2StatementsContextRevisionActivityOnlySubstatementAgentCase,
    v2StatementsContextRevisionActivityOnlySubstatementGroupCase,
    v2StatementsContextRevisionActivityOnlySubstatementStatementRefCase,
    v2StatementsContextRevisionNoObjectTypeStatementCase,
    v2StatementsContextRevisionNoObjectTypeSubstatementCase,
    v2StatementsContextInvalidPlatformTypeStatementNumberCase,
    v2StatementsContextInvalidPlatformTypeStatementObjectCase,
    v2StatementsContextInvalidPlatformTypeSubstatementNumberCase,
    v2StatementsContextInvalidPlatformTypeSubstatementObjectCase,
    v2StatementsContextPlatformActivityOnlyStatementAgentCase,
    v2StatementsContextPlatformActivityOnlyStatementGroupCase,
    v2StatementsContextPlatformActivityOnlyStatementStatementRefCase,
    v2StatementsContextPlatformActivityOnlyStatementSubstatementCase,
    v2StatementsContextPlatformActivityOnlySubstatementAgentCase,
    v2StatementsContextPlatformActivityOnlySubstatementGroupCase,
    v2StatementsContextPlatformActivityOnlySubstatementStatementRefCase,
    v2StatementsContextPlatformNoObjectTypeStatementCase,
    v2StatementsContextPlatformNoObjectTypeSubstatementCase,
    v2StatementsContextInvalidStatementRefStatementObjectTypeCase,
    v2StatementsContextInvalidStatementRefStatementIdCase,
    v2StatementsContextInvalidStatementRefSubstatementObjectTypeCase,
    v2StatementsContextInvalidStatementRefSubstatementIdCase,
  ]
} as unknown as SuiteDefinition;
