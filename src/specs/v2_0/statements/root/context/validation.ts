import type { SuiteDefinition } from "../../../../../domain/contracts";
import { v2StatementsVerifyContextTemplateStatementCase } from "./validation/verify-context-template-statement";
import { v2StatementsVerifyContextTemplateSubstatementCase } from "./validation/verify-context-template-substatement";
import { v2StatementsContextInvalidRegistrationStatementObjectCase } from "./validation/context-invalid-registration-statement-object";
import { v2StatementsContextInvalidRegistrationStatementStringCase } from "./validation/context-invalid-registration-statement-string";
import { v2StatementsContextInvalidRegistrationSubstatementObjectCase } from "./validation/context-invalid-registration-substatement-object";
import { v2StatementsContextInvalidRegistrationSubstatementStringCase } from "./validation/context-invalid-registration-substatement-string";
import { v2StatementsContextInvalidTeamStatementAgentCase } from "./validation/context-invalid-team-statement-agent";
import { v2StatementsContextInvalidTeamStatementObjectCase } from "./validation/context-invalid-team-statement-object";
import { v2StatementsContextInvalidTeamStatementStringCase } from "./validation/context-invalid-team-statement-string";
import { v2StatementsContextInvalidTeamSubstatementAgentCase } from "./validation/context-invalid-team-substatement-agent";
import { v2StatementsContextInvalidTeamSubstatementObjectCase } from "./validation/context-invalid-team-substatement-object";
import { v2StatementsContextInvalidTeamSubstatementStringCase } from "./validation/context-invalid-team-substatement-string";
import { v2StatementsContextInvalidContextActivitiesTypeStatementStringCase } from "./validation/context-invalid-context-activities-type-statement-string";
import { v2StatementsContextInvalidContextActivitiesTypeSubstatementStringCase } from "./validation/context-invalid-context-activities-type-substatement-string";
import { v2StatementsContextInvalidRevisionTypeStatementNumberCase } from "./validation/context-invalid-revision-type-statement-number";
import { v2StatementsContextInvalidRevisionTypeStatementObjectCase } from "./validation/context-invalid-revision-type-statement-object";
import { v2StatementsContextInvalidRevisionTypeSubstatementNumberCase } from "./validation/context-invalid-revision-type-substatement-number";
import { v2StatementsContextInvalidRevisionTypeSubstatementObjectCase } from "./validation/context-invalid-revision-type-substatement-object";
import { v2StatementsContextRevisionActivityOnlyStatementAgentCase } from "./validation/context-revision-activity-only-statement-agent";
import { v2StatementsContextRevisionActivityOnlyStatementGroupCase } from "./validation/context-revision-activity-only-statement-group";
import { v2StatementsContextRevisionActivityOnlyStatementStatementRefCase } from "./validation/context-revision-activity-only-statement-statement-ref";
import { v2StatementsContextRevisionActivityOnlyStatementSubstatementCase } from "./validation/context-revision-activity-only-statement-substatement";
import { v2StatementsContextRevisionActivityOnlySubstatementAgentCase } from "./validation/context-revision-activity-only-substatement-agent";
import { v2StatementsContextRevisionActivityOnlySubstatementGroupCase } from "./validation/context-revision-activity-only-substatement-group";
import { v2StatementsContextRevisionActivityOnlySubstatementStatementRefCase } from "./validation/context-revision-activity-only-substatement-statement-ref";
import { v2StatementsContextRevisionNoObjectTypeStatementCase } from "./validation/context-revision-no-object-type-statement";
import { v2StatementsContextRevisionNoObjectTypeSubstatementCase } from "./validation/context-revision-no-object-type-substatement";
import { v2StatementsContextInvalidPlatformTypeStatementNumberCase } from "./validation/context-invalid-platform-type-statement-number";
import { v2StatementsContextInvalidPlatformTypeStatementObjectCase } from "./validation/context-invalid-platform-type-statement-object";
import { v2StatementsContextInvalidPlatformTypeSubstatementNumberCase } from "./validation/context-invalid-platform-type-substatement-number";
import { v2StatementsContextInvalidPlatformTypeSubstatementObjectCase } from "./validation/context-invalid-platform-type-substatement-object";
import { v2StatementsContextPlatformActivityOnlyStatementAgentCase } from "./validation/context-platform-activity-only-statement-agent";
import { v2StatementsContextPlatformActivityOnlyStatementGroupCase } from "./validation/context-platform-activity-only-statement-group";
import { v2StatementsContextPlatformActivityOnlyStatementStatementRefCase } from "./validation/context-platform-activity-only-statement-statement-ref";
import { v2StatementsContextPlatformActivityOnlyStatementSubstatementCase } from "./validation/context-platform-activity-only-statement-substatement";
import { v2StatementsContextPlatformActivityOnlySubstatementAgentCase } from "./validation/context-platform-activity-only-substatement-agent";
import { v2StatementsContextPlatformActivityOnlySubstatementGroupCase } from "./validation/context-platform-activity-only-substatement-group";
import { v2StatementsContextPlatformActivityOnlySubstatementStatementRefCase } from "./validation/context-platform-activity-only-substatement-statement-ref";
import { v2StatementsContextPlatformNoObjectTypeStatementCase } from "./validation/context-platform-no-object-type-statement";
import { v2StatementsContextPlatformNoObjectTypeSubstatementCase } from "./validation/context-platform-no-object-type-substatement";
import { v2StatementsContextInvalidStatementRefStatementObjectTypeCase } from "./validation/context-invalid-statement-ref-statement-object-type";
import { v2StatementsContextInvalidStatementRefStatementIdCase } from "./validation/context-invalid-statement-ref-statement-id";
import { v2StatementsContextInvalidStatementRefSubstatementObjectTypeCase } from "./validation/context-invalid-statement-ref-substatement-object-type";
import { v2StatementsContextInvalidStatementRefSubstatementIdCase } from "./validation/context-invalid-statement-ref-substatement-id";

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
