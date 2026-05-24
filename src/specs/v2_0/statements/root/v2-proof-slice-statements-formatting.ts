import type { SuiteDefinition } from "../../../../domain/contracts";
import { v2StatementsRequiredFieldsMissingActorCase } from "./v2-proof-slice-statements-formatting/v2-statements-required-fields-missing-actor";
import { v2StatementsRequiredFieldsMissingVerbCase } from "./v2-proof-slice-statements-formatting/v2-statements-required-fields-missing-verb";
import { v2StatementsRequiredFieldsMissingObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-required-fields-missing-object";
import { v2StatementsInvalidValuesActorNameNullCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-values-actor-name-null";
import { v2StatementsInvalidValuesVerbDisplayNullCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-values-verb-display-null";
import { v2StatementsInvalidValuesObjectIdNullCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-values-object-id-null";
import { v2StatementsInvalidTypesScoreMaxStringCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-types-score-max-string";
import { v2StatementsInvalidTypesScoreMaxNumericStringCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-types-score-max-numeric-string";
import { v2StatementsInvalidTypesResultSuccessStringCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-types-result-success-string";
import { v2StatementsInvalidTypesResultCompletionStringCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-types-result-completion-string";
import { v2StatementsInvalidFormatStatementIdNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-format-statement-id-numeric";
import { v2StatementsInvalidFormatStatementIdObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-format-statement-id-object";
import { v2StatementsInvalidFormatStatementIdTooManyDigitsCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-format-statement-id-too-many-digits";
import { v2StatementsInvalidFormatStatementIdInvalidLetterCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-format-statement-id-invalid-letter";
import { v2StatementsInvalidIriSchemesVerbIdNoSchemeCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-iri-schemes-verb-id-no-scheme";
import { v2StatementsInvalidIriSchemesObjectIdNoSchemeCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-iri-schemes-object-id-no-scheme";
import { v2StatementsInvalidIriSchemesDefinitionTypeNoSchemeCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-iri-schemes-definition-type-no-scheme";
import { v2StatementsInvalidIriSchemesDefinitionMoreInfoNoSchemeCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-iri-schemes-definition-more-info-no-scheme";
import { v2StatementsInvalidMboxIriActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-actor-agent";
import { v2StatementsInvalidMboxIriActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-actor-group";
import { v2StatementsInvalidMboxIriAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-authority-agent";
import { v2StatementsInvalidMboxIriAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-authority-group";
import { v2StatementsInvalidMboxIriContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-context-instructor-agent";
import { v2StatementsInvalidMboxIriContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-context-instructor-group";
import { v2StatementsInvalidMboxIriContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-context-team-group";
import { v2StatementsInvalidMboxIriObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-object-agent";
import { v2StatementsInvalidMboxIriObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-object-group";
import { v2StatementsInvalidMboxIriSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-substatement-actor-agent";
import { v2StatementsInvalidMboxIriSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-substatement-actor-group";
import { v2StatementsInvalidMboxIriSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-substatement-context-instructor-agent";
import { v2StatementsInvalidMboxIriSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-substatement-context-instructor-group";
import { v2StatementsInvalidMboxIriSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-iri-substatement-context-team-group";
import { v2StatementsInvalidMboxMailtoActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-actor-agent";
import { v2StatementsInvalidMboxMailtoActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-actor-group";
import { v2StatementsInvalidMboxMailtoAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-authority-agent";
import { v2StatementsInvalidMboxMailtoAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-authority-group";
import { v2StatementsInvalidMboxMailtoContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-context-instructor-agent";
import { v2StatementsInvalidMboxMailtoContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-context-instructor-group";
import { v2StatementsInvalidMboxMailtoContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-context-team-group";
import { v2StatementsInvalidMboxMailtoObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-object-agent";
import { v2StatementsInvalidMboxMailtoObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-object-group";
import { v2StatementsInvalidMboxMailtoSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-substatement-actor-agent";
import { v2StatementsInvalidMboxMailtoSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-substatement-actor-group";
import { v2StatementsInvalidMboxMailtoSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-substatement-context-instructor-agent";
import { v2StatementsInvalidMboxMailtoSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-substatement-context-instructor-group";
import { v2StatementsInvalidMboxMailtoSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-mailto-substatement-context-team-group";
import { v2StatementsInvalidMboxSha1sumActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-actor-agent";
import { v2StatementsInvalidMboxSha1sumActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-actor-group";
import { v2StatementsInvalidMboxSha1sumAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-authority-agent";
import { v2StatementsInvalidMboxSha1sumAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-authority-group";
import { v2StatementsInvalidMboxSha1sumContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-context-instructor-agent";
import { v2StatementsInvalidMboxSha1sumContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-context-instructor-group";
import { v2StatementsInvalidMboxSha1sumContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-context-team-group";
import { v2StatementsInvalidMboxSha1sumObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-object-agent";
import { v2StatementsInvalidMboxSha1sumObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-object-group";
import { v2StatementsInvalidMboxSha1sumSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-substatement-actor-agent";
import { v2StatementsInvalidMboxSha1sumSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-substatement-actor-group";
import { v2StatementsInvalidMboxSha1sumSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-substatement-context-instructor-agent";
import { v2StatementsInvalidMboxSha1sumSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-substatement-context-instructor-group";
import { v2StatementsInvalidMboxSha1sumSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-mbox-sha1sum-substatement-context-team-group";
import { v2StatementsInvalidOpenidActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-actor-agent";
import { v2StatementsInvalidOpenidActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-actor-group";
import { v2StatementsInvalidOpenidAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-authority-agent";
import { v2StatementsInvalidOpenidAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-authority-group";
import { v2StatementsInvalidOpenidContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-context-instructor-agent";
import { v2StatementsInvalidOpenidContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-context-instructor-group";
import { v2StatementsInvalidOpenidContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-context-team-group";
import { v2StatementsInvalidOpenidObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-object-agent";
import { v2StatementsInvalidOpenidObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-object-group";
import { v2StatementsInvalidOpenidSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-substatement-actor-agent";
import { v2StatementsInvalidOpenidSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-substatement-actor-group";
import { v2StatementsInvalidOpenidSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-substatement-context-instructor-agent";
import { v2StatementsInvalidOpenidSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-substatement-context-instructor-group";
import { v2StatementsInvalidOpenidSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-openid-substatement-context-team-group";
import { v2StatementsVerifyStatementTemplateDefaultCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-statement-template-default";
import { v2StatementsVerifyAgentTemplateActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-agent-template-actor-agent";
import { v2StatementsVerifyAgentTemplateAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-agent-template-authority-agent";
import { v2StatementsVerifyAgentTemplateContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-agent-template-context-instructor-agent";
import { v2StatementsVerifyAgentTemplateObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-agent-template-object-agent";
import { v2StatementsVerifyAgentTemplateSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-agent-template-substatement-actor-agent";
import { v2StatementsVerifyAgentTemplateSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-agent-template-substatement-context-instructor-agent";
import { v2StatementsVerifyGroupTemplateActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-actor-group";
import { v2StatementsVerifyGroupTemplateAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-authority-group";
import { v2StatementsVerifyGroupTemplateContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-context-instructor-group";
import { v2StatementsVerifyGroupTemplateContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-context-team-group";
import { v2StatementsVerifyGroupTemplateObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-object-group";
import { v2StatementsVerifyGroupTemplateSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-substatement-actor-group";
import { v2StatementsVerifyGroupTemplateSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-substatement-context-instructor-group";
import { v2StatementsVerifyGroupTemplateSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-group-template-substatement-context-team-group";
import { v2StatementsVerifyVerbTemplateStatementCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-verb-template-statement";
import { v2StatementsVerifyVerbTemplateSubstatementCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-verb-template-substatement";
import { v2StatementsAccountHomePageMissingActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-actor-agent";
import { v2StatementsAccountHomePageMissingActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-actor-group";
import { v2StatementsAccountHomePageMissingAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-authority-agent";
import { v2StatementsAccountHomePageMissingAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-authority-group";
import { v2StatementsAccountHomePageMissingContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-context-instructor-agent";
import { v2StatementsAccountHomePageMissingContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-context-instructor-group";
import { v2StatementsAccountHomePageMissingContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-context-team-group";
import { v2StatementsAccountHomePageMissingObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-object-agent";
import { v2StatementsAccountHomePageMissingObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-object-group";
import { v2StatementsAccountHomePageMissingSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-substatement-actor-agent";
import { v2StatementsAccountHomePageMissingSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-substatement-actor-group";
import { v2StatementsAccountHomePageMissingSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-substatement-context-instructor-agent";
import { v2StatementsAccountHomePageMissingSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-substatement-context-instructor-group";
import { v2StatementsAccountHomePageMissingSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-missing-substatement-context-team-group";
import { v2StatementsAccountHomePageInvalidActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-actor-agent";
import { v2StatementsAccountHomePageInvalidActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-actor-group";
import { v2StatementsAccountHomePageInvalidAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-authority-agent";
import { v2StatementsAccountHomePageInvalidAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-authority-group";
import { v2StatementsAccountHomePageInvalidContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-context-instructor-agent";
import { v2StatementsAccountHomePageInvalidContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-context-instructor-group";
import { v2StatementsAccountHomePageInvalidContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-context-team-group";
import { v2StatementsAccountHomePageInvalidObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-object-agent";
import { v2StatementsAccountHomePageInvalidObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-object-group";
import { v2StatementsAccountHomePageInvalidSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-substatement-actor-agent";
import { v2StatementsAccountHomePageInvalidSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-substatement-actor-group";
import { v2StatementsAccountHomePageInvalidSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-substatement-context-instructor-agent";
import { v2StatementsAccountHomePageInvalidSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-substatement-context-instructor-group";
import { v2StatementsAccountHomePageInvalidSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-home-page-invalid-substatement-context-team-group";
import { v2StatementsAccountNameMissingActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-actor-agent";
import { v2StatementsAccountNameMissingActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-actor-group";
import { v2StatementsAccountNameMissingAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-authority-agent";
import { v2StatementsAccountNameMissingAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-authority-group";
import { v2StatementsAccountNameMissingContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-context-instructor-agent";
import { v2StatementsAccountNameMissingContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-context-instructor-group";
import { v2StatementsAccountNameMissingContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-context-team-group";
import { v2StatementsAccountNameMissingObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-object-agent";
import { v2StatementsAccountNameMissingObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-object-group";
import { v2StatementsAccountNameMissingSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-substatement-actor-agent";
import { v2StatementsAccountNameMissingSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-substatement-actor-group";
import { v2StatementsAccountNameMissingSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-substatement-context-instructor-agent";
import { v2StatementsAccountNameMissingSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-substatement-context-instructor-group";
import { v2StatementsAccountNameMissingSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-name-missing-substatement-context-team-group";
import { v2StatementsActorObjectTypeVocabularyActorAgentAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-actor-agent-agent";
import { v2StatementsActorObjectTypeVocabularyActorAgentGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-actor-agent-group";
import { v2StatementsActorObjectTypeVocabularyAuthorityAgentAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-authority-agent-agent";
import { v2StatementsActorObjectTypeVocabularyAuthorityAgentGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-authority-agent-group";
import { v2StatementsActorObjectTypeVocabularyContextInstructorAgentAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-context-instructor-agent-agent";
import { v2StatementsActorObjectTypeVocabularyContextInstructorAgentGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-context-instructor-agent-group";
import { v2StatementsActorObjectTypeVocabularyObjectAgentAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-object-agent-agent";
import { v2StatementsActorObjectTypeVocabularyObjectAgentGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-object-agent-group";
import { v2StatementsActorObjectTypeVocabularySubstatementActorAgentAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-substatement-actor-agent-agent";
import { v2StatementsActorObjectTypeVocabularySubstatementActorAgentGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-substatement-actor-agent-group";
import { v2StatementsActorObjectTypeVocabularySubstatementContextInstructorAgentAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-substatement-context-instructor-agent-agent";
import { v2StatementsActorObjectTypeVocabularySubstatementContextInstructorAgentGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-vocabulary-substatement-context-instructor-agent-group";
import { v2StatementsActorObjectTypeTypeActorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-actor-agent-numeric";
import { v2StatementsActorObjectTypeTypeActorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-actor-agent-object";
import { v2StatementsActorObjectTypeTypeAuthorityAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-authority-agent-numeric";
import { v2StatementsActorObjectTypeTypeAuthorityAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-authority-agent-object";
import { v2StatementsActorObjectTypeTypeContextInstructorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-context-instructor-agent-numeric";
import { v2StatementsActorObjectTypeTypeContextInstructorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-context-instructor-agent-object";
import { v2StatementsActorObjectTypeTypeObjectAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-object-agent-numeric";
import { v2StatementsActorObjectTypeTypeObjectAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-object-agent-object";
import { v2StatementsActorObjectTypeTypeSubstatementActorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-substatement-actor-agent-numeric";
import { v2StatementsActorObjectTypeTypeSubstatementActorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-substatement-actor-agent-object";
import { v2StatementsActorObjectTypeTypeSubstatementContextInstructorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-substatement-context-instructor-agent-numeric";
import { v2StatementsActorObjectTypeTypeSubstatementContextInstructorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-object-type-type-substatement-context-instructor-agent-object";
import { v2StatementsActorNameTypeActorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-actor-agent-numeric";
import { v2StatementsActorNameTypeActorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-actor-agent-object";
import { v2StatementsActorNameTypeAuthorityAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-authority-agent-numeric";
import { v2StatementsActorNameTypeAuthorityAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-authority-agent-object";
import { v2StatementsActorNameTypeContextInstructorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-context-instructor-agent-numeric";
import { v2StatementsActorNameTypeContextInstructorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-context-instructor-agent-object";
import { v2StatementsActorNameTypeObjectAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-object-agent-numeric";
import { v2StatementsActorNameTypeObjectAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-object-agent-object";
import { v2StatementsActorNameTypeSubstatementActorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-substatement-actor-agent-numeric";
import { v2StatementsActorNameTypeSubstatementActorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-substatement-actor-agent-object";
import { v2StatementsActorNameTypeSubstatementContextInstructorAgentNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-substatement-context-instructor-agent-numeric";
import { v2StatementsActorNameTypeSubstatementContextInstructorAgentObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-actor-name-type-substatement-context-instructor-agent-object";
import { v2StatementsGroupMemberRequiredActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-actor-group";
import { v2StatementsGroupMemberRequiredAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-authority-group";
import { v2StatementsGroupMemberRequiredContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-context-instructor-group";
import { v2StatementsGroupMemberRequiredContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-context-team-group";
import { v2StatementsGroupMemberRequiredObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-object-group";
import { v2StatementsGroupMemberRequiredSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-substatement-actor-group";
import { v2StatementsGroupMemberRequiredSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-substatement-context-instructor-group";
import { v2StatementsGroupMemberRequiredSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-required-substatement-context-team-group";
import { v2StatementsGroupMemberTypeActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-actor-group";
import { v2StatementsGroupMemberTypeAuthorityGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-authority-group";
import { v2StatementsGroupMemberTypeContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-context-instructor-group";
import { v2StatementsGroupMemberTypeContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-context-team-group";
import { v2StatementsGroupMemberTypeObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-object-group";
import { v2StatementsGroupMemberTypeSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-substatement-actor-group";
import { v2StatementsGroupMemberTypeSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-substatement-context-instructor-group";
import { v2StatementsGroupMemberTypeSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-member-type-substatement-context-team-group";
import { v2StatementsVerbIdRequiredStatementCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-id-required-statement";
import { v2StatementsVerbIdRequiredSubstatementCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-id-required-substatement";
import { v2StatementsVerbIdIriStatementCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-id-iri-statement";
import { v2StatementsVerbIdIriSubstatementCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-id-iri-substatement";
import { v2StatementsVerbDisplayTypeStatementNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-display-type-statement-numeric";
import { v2StatementsVerbDisplayTypeStatementStringCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-display-type-statement-string";
import { v2StatementsVerbDisplayTypeSubstatementNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-display-type-substatement-numeric";
import { v2StatementsVerbDisplayTypeSubstatementStringCase } from "./v2-proof-slice-statements-formatting/v2-statements-verb-display-type-substatement-string";
import { v2StatementsAgentIfiAcceptanceActorAgentMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-actor-agent-mbox";
import { v2StatementsAgentIfiAcceptanceActorAgentMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-actor-agent-mbox-sha1sum";
import { v2StatementsAgentIfiAcceptanceActorAgentOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-actor-agent-openid";
import { v2StatementsAgentIfiAcceptanceActorAgentAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-actor-agent-account";
import { v2StatementsAgentIfiAcceptanceAuthorityAgentMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-authority-agent-mbox";
import { v2StatementsAgentIfiAcceptanceAuthorityAgentMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-authority-agent-mbox-sha1sum";
import { v2StatementsAgentIfiAcceptanceAuthorityAgentOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-authority-agent-openid";
import { v2StatementsAgentIfiAcceptanceAuthorityAgentAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-authority-agent-account";
import { v2StatementsAgentIfiAcceptanceContextInstructorAgentMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-context-instructor-agent-mbox";
import { v2StatementsAgentIfiAcceptanceContextInstructorAgentMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-context-instructor-agent-mbox-sha1sum";
import { v2StatementsAgentIfiAcceptanceContextInstructorAgentOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-context-instructor-agent-openid";
import { v2StatementsAgentIfiAcceptanceContextInstructorAgentAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-context-instructor-agent-account";
import { v2StatementsAgentIfiAcceptanceObjectAgentMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-object-agent-mbox";
import { v2StatementsAgentIfiAcceptanceObjectAgentMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-object-agent-mbox-sha1sum";
import { v2StatementsAgentIfiAcceptanceObjectAgentOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-object-agent-openid";
import { v2StatementsAgentIfiAcceptanceObjectAgentAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-object-agent-account";
import { v2StatementsAgentIfiAcceptanceSubstatementActorAgentMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-actor-agent-mbox";
import { v2StatementsAgentIfiAcceptanceSubstatementActorAgentMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-actor-agent-mbox-sha1sum";
import { v2StatementsAgentIfiAcceptanceSubstatementActorAgentOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-actor-agent-openid";
import { v2StatementsAgentIfiAcceptanceSubstatementActorAgentAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-actor-agent-account";
import { v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-context-instructor-agent-mbox";
import { v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-context-instructor-agent-mbox-sha1sum";
import { v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-context-instructor-agent-openid";
import { v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-acceptance-substatement-context-instructor-agent-account";
import { v2StatementsAgentIfiRequiredActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-required-actor-agent";
import { v2StatementsAgentIfiRequiredAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-required-authority-agent";
import { v2StatementsAgentIfiRequiredContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-required-context-instructor-agent";
import { v2StatementsAgentIfiRequiredObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-required-object-agent";
import { v2StatementsAgentIfiRequiredSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-required-substatement-actor-agent";
import { v2StatementsAgentIfiRequiredSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-required-substatement-context-instructor-agent";
import { v2StatementsGroupIfiOrMemberRequiredActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-actor-group";
import { v2StatementsGroupIfiOrMemberRequiredContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-context-instructor-group";
import { v2StatementsGroupIfiOrMemberRequiredContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-context-team-group";
import { v2StatementsGroupIfiOrMemberRequiredObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-object-group";
import { v2StatementsGroupIfiOrMemberRequiredSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-substatement-actor-group";
import { v2StatementsGroupIfiOrMemberRequiredSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-substatement-context-instructor-group";
import { v2StatementsGroupIfiOrMemberRequiredSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-or-member-required-substatement-context-team-group";
import { v2StatementsGroupIfiAcceptanceActorGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-actor-group-mbox";
import { v2StatementsGroupIfiAcceptanceActorGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-actor-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceActorGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-actor-group-openid";
import { v2StatementsGroupIfiAcceptanceActorGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-actor-group-account";
import { v2StatementsGroupIfiAcceptanceContextInstructorGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-instructor-group-mbox";
import { v2StatementsGroupIfiAcceptanceContextInstructorGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-instructor-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceContextInstructorGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-instructor-group-openid";
import { v2StatementsGroupIfiAcceptanceContextInstructorGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-instructor-group-account";
import { v2StatementsGroupIfiAcceptanceContextTeamGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-team-group-mbox";
import { v2StatementsGroupIfiAcceptanceContextTeamGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-team-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceContextTeamGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-team-group-openid";
import { v2StatementsGroupIfiAcceptanceContextTeamGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-context-team-group-account";
import { v2StatementsGroupIfiAcceptanceObjectGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-object-group-mbox";
import { v2StatementsGroupIfiAcceptanceObjectGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-object-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceObjectGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-object-group-openid";
import { v2StatementsGroupIfiAcceptanceObjectGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-object-group-account";
import { v2StatementsGroupIfiAcceptanceSubstatementActorGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-actor-group-mbox";
import { v2StatementsGroupIfiAcceptanceSubstatementActorGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-actor-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceSubstatementActorGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-actor-group-openid";
import { v2StatementsGroupIfiAcceptanceSubstatementActorGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-actor-group-account";
import { v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-instructor-group-mbox";
import { v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-instructor-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-instructor-group-openid";
import { v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-instructor-group-account";
import { v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-team-group-mbox";
import { v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-team-group-mbox-sha1sum";
import { v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-team-group-openid";
import { v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-substatement-context-team-group-account";
import { v2StatementsGroupIfiAcceptanceNoMemberActorGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-actor-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberActorGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-actor-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberActorGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-actor-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberActorGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-actor-group-account-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-instructor-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-instructor-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-instructor-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-instructor-group-account-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-team-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-team-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-team-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-context-team-group-account-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberObjectGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-object-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberObjectGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-object-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberObjectGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-object-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberObjectGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-object-group-account-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-actor-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-actor-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-actor-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-actor-group-account-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-instructor-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-instructor-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-instructor-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-instructor-group-account-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupMboxNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-team-group-mbox-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupMboxSha1sumNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-team-group-mbox-sha1sum-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupOpenidNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-team-group-openid-no-member";
import { v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupAccountNoMemberCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-acceptance-no-member-substatement-context-team-group-account-no-member";
import { v2StatementsAccountPropertyAcceptanceActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-actor-agent";
import { v2StatementsAccountPropertyAcceptanceAuthorityAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-authority-agent";
import { v2StatementsAccountPropertyAcceptanceContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-context-instructor-agent";
import { v2StatementsAccountPropertyAcceptanceObjectAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-object-agent";
import { v2StatementsAccountPropertyAcceptanceSubstatementActorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-substatement-actor-agent";
import { v2StatementsAccountPropertyAcceptanceSubstatementContextInstructorAgentCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-substatement-context-instructor-agent";
import { v2StatementsAccountPropertyAcceptanceActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-actor-group";
import { v2StatementsAccountPropertyAcceptanceContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-context-instructor-group";
import { v2StatementsAccountPropertyAcceptanceContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-context-team-group";
import { v2StatementsAccountPropertyAcceptanceObjectGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-object-group";
import { v2StatementsAccountPropertyAcceptanceSubstatementActorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-substatement-actor-group";
import { v2StatementsAccountPropertyAcceptanceSubstatementContextInstructorGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-substatement-context-instructor-group";
import { v2StatementsAccountPropertyAcceptanceSubstatementContextTeamGroupCase } from "./v2-proof-slice-statements-formatting/v2-statements-account-property-acceptance-substatement-context-team-group";
import { v2StatementsAgentIfiExclusivityActorAgentMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-mbox-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityActorAgentMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-mbox-with-openid";
import { v2StatementsAgentIfiExclusivityActorAgentMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-mbox-with-account";
import { v2StatementsAgentIfiExclusivityActorAgentMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-mbox-sha1sum-with-mbox";
import { v2StatementsAgentIfiExclusivityActorAgentMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-mbox-sha1sum-with-openid";
import { v2StatementsAgentIfiExclusivityActorAgentMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-mbox-sha1sum-with-account";
import { v2StatementsAgentIfiExclusivityActorAgentOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-openid-with-mbox";
import { v2StatementsAgentIfiExclusivityActorAgentOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-openid-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityActorAgentOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-openid-with-account";
import { v2StatementsAgentIfiExclusivityActorAgentAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-account-with-mbox";
import { v2StatementsAgentIfiExclusivityActorAgentAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-account-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityActorAgentAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-actor-agent-account-with-openid";
import { v2StatementsAgentIfiExclusivityAuthorityAgentMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-mbox-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityAuthorityAgentMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-mbox-with-openid";
import { v2StatementsAgentIfiExclusivityAuthorityAgentMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-mbox-with-account";
import { v2StatementsAgentIfiExclusivityAuthorityAgentMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-mbox-sha1sum-with-mbox";
import { v2StatementsAgentIfiExclusivityAuthorityAgentMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-mbox-sha1sum-with-openid";
import { v2StatementsAgentIfiExclusivityAuthorityAgentMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-mbox-sha1sum-with-account";
import { v2StatementsAgentIfiExclusivityAuthorityAgentOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-openid-with-mbox";
import { v2StatementsAgentIfiExclusivityAuthorityAgentOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-openid-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityAuthorityAgentOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-openid-with-account";
import { v2StatementsAgentIfiExclusivityAuthorityAgentAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-account-with-mbox";
import { v2StatementsAgentIfiExclusivityAuthorityAgentAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-account-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityAuthorityAgentAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-authority-agent-account-with-openid";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-mbox-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-mbox-with-openid";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-mbox-with-account";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-mbox-sha1sum-with-mbox";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-mbox-sha1sum-with-openid";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-mbox-sha1sum-with-account";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-openid-with-mbox";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-openid-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-openid-with-account";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-account-with-mbox";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-account-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityContextInstructorAgentAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-context-instructor-agent-account-with-openid";
import { v2StatementsAgentIfiExclusivityObjectAgentMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-mbox-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityObjectAgentMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-mbox-with-openid";
import { v2StatementsAgentIfiExclusivityObjectAgentMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-mbox-with-account";
import { v2StatementsAgentIfiExclusivityObjectAgentMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-mbox-sha1sum-with-mbox";
import { v2StatementsAgentIfiExclusivityObjectAgentMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-mbox-sha1sum-with-openid";
import { v2StatementsAgentIfiExclusivityObjectAgentMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-mbox-sha1sum-with-account";
import { v2StatementsAgentIfiExclusivityObjectAgentOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-openid-with-mbox";
import { v2StatementsAgentIfiExclusivityObjectAgentOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-openid-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityObjectAgentOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-openid-with-account";
import { v2StatementsAgentIfiExclusivityObjectAgentAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-account-with-mbox";
import { v2StatementsAgentIfiExclusivityObjectAgentAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-account-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivityObjectAgentAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-object-agent-account-with-openid";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-mbox-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-mbox-with-openid";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-mbox-with-account";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-mbox-sha1sum-with-mbox";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-mbox-sha1sum-with-openid";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-mbox-sha1sum-with-account";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-openid-with-mbox";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-openid-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-openid-with-account";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-account-with-mbox";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-account-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivitySubstatementActorAgentAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-actor-agent-account-with-openid";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-mbox-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-mbox-with-openid";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-mbox-with-account";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-mbox-sha1sum-with-mbox";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-mbox-sha1sum-with-openid";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-mbox-sha1sum-with-account";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-openid-with-mbox";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-openid-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-openid-with-account";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-account-with-mbox";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-account-with-mbox-sha1sum";
import { v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-agent-ifi-exclusivity-substatement-context-instructor-agent-account-with-openid";
import { v2StatementsGroupIfiExclusivityActorGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityActorGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivityActorGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivityActorGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivityActorGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivityActorGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivityActorGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivityActorGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityActorGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-openid-with-account";
import { v2StatementsGroupIfiExclusivityActorGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivityActorGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityActorGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-actor-group-account-with-openid";
import { v2StatementsGroupIfiExclusivityAuthorityGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityAuthorityGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivityAuthorityGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivityAuthorityGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivityAuthorityGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivityAuthorityGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivityAuthorityGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivityAuthorityGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityAuthorityGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-openid-with-account";
import { v2StatementsGroupIfiExclusivityAuthorityGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivityAuthorityGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityAuthorityGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-authority-group-account-with-openid";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-openid-with-account";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityContextInstructorGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-instructor-group-account-with-openid";
import { v2StatementsGroupIfiExclusivityContextTeamGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityContextTeamGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivityContextTeamGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivityContextTeamGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivityContextTeamGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivityContextTeamGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivityContextTeamGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivityContextTeamGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityContextTeamGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-openid-with-account";
import { v2StatementsGroupIfiExclusivityContextTeamGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivityContextTeamGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityContextTeamGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-context-team-group-account-with-openid";
import { v2StatementsGroupIfiExclusivityObjectGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityObjectGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivityObjectGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivityObjectGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivityObjectGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivityObjectGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivityObjectGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivityObjectGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityObjectGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-openid-with-account";
import { v2StatementsGroupIfiExclusivityObjectGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivityObjectGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivityObjectGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-object-group-account-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-openid-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementActorGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-actor-group-account-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-openid-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-instructor-group-account-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-mbox-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-mbox-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-mbox-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxSha1sumWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-mbox-sha1sum-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxSha1sumWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-mbox-sha1sum-with-openid";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxSha1sumWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-mbox-sha1sum-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupOpenidWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-openid-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupOpenidWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-openid-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupOpenidWithAccountCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-openid-with-account";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupAccountWithMboxCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-account-with-mbox";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupAccountWithMboxSha1sumCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-account-with-mbox-sha1sum";
import { v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupAccountWithOpenidCase } from "./v2-proof-slice-statements-formatting/v2-statements-group-ifi-exclusivity-substatement-context-team-group-account-with-openid";
import { v2StatementsInvalidAttachmentIriUsageTypeNoSchemeCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-attachment-iri-usage-type-no-scheme";
import { v2StatementsInvalidAttachmentIriFileUrlNoSchemeCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-attachment-iri-file-url-no-scheme";
import { v2StatementsCaseSensitiveKeysIdCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-id";
import { v2StatementsCaseSensitiveKeysActorCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-actor";
import { v2StatementsCaseSensitiveKeysVerbCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-verb";
import { v2StatementsCaseSensitiveKeysObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-object";
import { v2StatementsCaseSensitiveKeysResultCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-result";
import { v2StatementsCaseSensitiveKeysContextCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-context";
import { v2StatementsCaseSensitiveKeysTimestampCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-timestamp";
import { v2StatementsCaseSensitiveKeysStoredCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-stored";
import { v2StatementsCaseSensitiveKeysAuthorityCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-authority";
import { v2StatementsCaseSensitiveKeysVersionCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-version";
import { v2StatementsCaseSensitiveKeysAttachmentsCase } from "./v2-proof-slice-statements-formatting/v2-statements-case-sensitive-keys-attachments";
import { v2StatementsInteractionTypeCaseTrueFalseCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-true-false";
import { v2StatementsInteractionTypeCaseChoiceCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-choice";
import { v2StatementsInteractionTypeCaseFillInCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-fill-in";
import { v2StatementsInteractionTypeCaseLongFillInCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-long-fill-in";
import { v2StatementsInteractionTypeCaseMatchingCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-matching";
import { v2StatementsInteractionTypeCasePerformanceCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-performance";
import { v2StatementsInteractionTypeCaseSequencingCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-sequencing";
import { v2StatementsInteractionTypeCaseLikertCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-likert";
import { v2StatementsInteractionTypeCaseNumericCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-numeric";
import { v2StatementsInteractionTypeCaseOtherCase } from "./v2-proof-slice-statements-formatting/v2-statements-interaction-type-case-other";
import { v2StatementsInvalidExtensionIriObjectDefinitionCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-extension-iri-object-definition";
import { v2StatementsInvalidExtensionIriContextCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-extension-iri-context";
import { v2StatementsInvalidExtensionIriResultCase } from "./v2-proof-slice-statements-formatting/v2-statements-invalid-extension-iri-result";
import { v2StatementsVerifyLanguageTemplateStatementVerbCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-language-template-statement-verb";
import { v2StatementsVerifyLanguageTemplateStatementObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-language-template-statement-object";
import { v2StatementsVerifyLanguageTemplateStatementAttachmentCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-language-template-statement-attachment";
import { v2StatementsVerifyLanguageTemplateSubstatementVerbCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-language-template-substatement-verb";
import { v2StatementsVerifyLanguageTemplateSubstatementObjectCase } from "./v2-proof-slice-statements-formatting/v2-statements-verify-language-template-substatement-object";
import { v2StatementsLanguageTagsAcceptedVerbDisplayCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-verb-display";
import { v2StatementsLanguageTagsAcceptedObjectNameCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-object-name";
import { v2StatementsLanguageTagsAcceptedObjectDescriptionCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-object-description";
import { v2StatementsLanguageTagsAcceptedContextLanguageCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-context-language";
import { v2StatementsLanguageTagsAcceptedAttachmentDisplayCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-attachment-display";
import { v2StatementsLanguageTagsAcceptedAttachmentDescriptionCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-attachment-description";
import { v2StatementsLanguageTagsAcceptedSubstatementVerbDisplayCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-substatement-verb-display";
import { v2StatementsLanguageTagsAcceptedSubstatementObjectNameCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-substatement-object-name";
import { v2StatementsLanguageTagsAcceptedSubstatementObjectDescriptionCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-substatement-object-description";
import { v2StatementsLanguageTagsAcceptedSubstatementContextLanguageCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-accepted-substatement-context-language";
import { v2StatementsLanguageTagsRejectedVerbDisplayCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-verb-display";
import { v2StatementsLanguageTagsRejectedObjectNameCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-object-name";
import { v2StatementsLanguageTagsRejectedObjectDescriptionCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-object-description";
import { v2StatementsLanguageTagsRejectedContextLanguageCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-context-language";
import { v2StatementsLanguageTagsRejectedAttachmentDisplayCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-attachment-display";
import { v2StatementsLanguageTagsRejectedAttachmentDescriptionCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-attachment-description";
import { v2StatementsLanguageTagsRejectedSubstatementVerbDisplayCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-substatement-verb-display";
import { v2StatementsLanguageTagsRejectedSubstatementObjectNameCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-substatement-object-name";
import { v2StatementsLanguageTagsRejectedSubstatementObjectDescriptionCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-substatement-object-description";
import { v2StatementsLanguageTagsRejectedSubstatementContextLanguageCase } from "./v2-proof-slice-statements-formatting/v2-statements-language-tags-rejected-substatement-context-language";
import { v2StatementsMalformedObjectTypeActorCase } from "./v2-proof-slice-statements-formatting/v2-statements-malformed-object-type-actor";
import { v2StatementsMalformedObjectTypeSubstatementActorCase } from "./v2-proof-slice-statements-formatting/v2-statements-malformed-object-type-substatement-actor";
import { v2StatementsNumericPrecisionScoreRoundtripCase } from "./v2-proof-slice-statements-formatting/v2-statements-numeric-precision-score-roundtrip";

export const v2ProofSliceStatementsFormattingSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.formatting",
  "title": "Statement Formatting",
  "specVersion": "2.0.0",
  "tags": [
    "formatting"
  ]
,
  "children": [
    v2StatementsRequiredFieldsMissingActorCase,
    v2StatementsRequiredFieldsMissingVerbCase,
    v2StatementsRequiredFieldsMissingObjectCase,
    v2StatementsInvalidValuesActorNameNullCase,
    v2StatementsInvalidValuesVerbDisplayNullCase,
    v2StatementsInvalidValuesObjectIdNullCase,
    v2StatementsInvalidTypesScoreMaxStringCase,
    v2StatementsInvalidTypesScoreMaxNumericStringCase,
    v2StatementsInvalidTypesResultSuccessStringCase,
    v2StatementsInvalidTypesResultCompletionStringCase,
    v2StatementsInvalidFormatStatementIdNumericCase,
    v2StatementsInvalidFormatStatementIdObjectCase,
    v2StatementsInvalidFormatStatementIdTooManyDigitsCase,
    v2StatementsInvalidFormatStatementIdInvalidLetterCase,
    v2StatementsInvalidIriSchemesVerbIdNoSchemeCase,
    v2StatementsInvalidIriSchemesObjectIdNoSchemeCase,
    v2StatementsInvalidIriSchemesDefinitionTypeNoSchemeCase,
    v2StatementsInvalidIriSchemesDefinitionMoreInfoNoSchemeCase,
    v2StatementsInvalidMboxIriActorAgentCase,
    v2StatementsInvalidMboxIriActorGroupCase,
    v2StatementsInvalidMboxIriAuthorityAgentCase,
    v2StatementsInvalidMboxIriAuthorityGroupCase,
    v2StatementsInvalidMboxIriContextInstructorAgentCase,
    v2StatementsInvalidMboxIriContextInstructorGroupCase,
    v2StatementsInvalidMboxIriContextTeamGroupCase,
    v2StatementsInvalidMboxIriObjectAgentCase,
    v2StatementsInvalidMboxIriObjectGroupCase,
    v2StatementsInvalidMboxIriSubstatementActorAgentCase,
    v2StatementsInvalidMboxIriSubstatementActorGroupCase,
    v2StatementsInvalidMboxIriSubstatementContextInstructorAgentCase,
    v2StatementsInvalidMboxIriSubstatementContextInstructorGroupCase,
    v2StatementsInvalidMboxIriSubstatementContextTeamGroupCase,
    v2StatementsInvalidMboxMailtoActorAgentCase,
    v2StatementsInvalidMboxMailtoActorGroupCase,
    v2StatementsInvalidMboxMailtoAuthorityAgentCase,
    v2StatementsInvalidMboxMailtoAuthorityGroupCase,
    v2StatementsInvalidMboxMailtoContextInstructorAgentCase,
    v2StatementsInvalidMboxMailtoContextInstructorGroupCase,
    v2StatementsInvalidMboxMailtoContextTeamGroupCase,
    v2StatementsInvalidMboxMailtoObjectAgentCase,
    v2StatementsInvalidMboxMailtoObjectGroupCase,
    v2StatementsInvalidMboxMailtoSubstatementActorAgentCase,
    v2StatementsInvalidMboxMailtoSubstatementActorGroupCase,
    v2StatementsInvalidMboxMailtoSubstatementContextInstructorAgentCase,
    v2StatementsInvalidMboxMailtoSubstatementContextInstructorGroupCase,
    v2StatementsInvalidMboxMailtoSubstatementContextTeamGroupCase,
    v2StatementsInvalidMboxSha1sumActorAgentCase,
    v2StatementsInvalidMboxSha1sumActorGroupCase,
    v2StatementsInvalidMboxSha1sumAuthorityAgentCase,
    v2StatementsInvalidMboxSha1sumAuthorityGroupCase,
    v2StatementsInvalidMboxSha1sumContextInstructorAgentCase,
    v2StatementsInvalidMboxSha1sumContextInstructorGroupCase,
    v2StatementsInvalidMboxSha1sumContextTeamGroupCase,
    v2StatementsInvalidMboxSha1sumObjectAgentCase,
    v2StatementsInvalidMboxSha1sumObjectGroupCase,
    v2StatementsInvalidMboxSha1sumSubstatementActorAgentCase,
    v2StatementsInvalidMboxSha1sumSubstatementActorGroupCase,
    v2StatementsInvalidMboxSha1sumSubstatementContextInstructorAgentCase,
    v2StatementsInvalidMboxSha1sumSubstatementContextInstructorGroupCase,
    v2StatementsInvalidMboxSha1sumSubstatementContextTeamGroupCase,
    v2StatementsInvalidOpenidActorAgentCase,
    v2StatementsInvalidOpenidActorGroupCase,
    v2StatementsInvalidOpenidAuthorityAgentCase,
    v2StatementsInvalidOpenidAuthorityGroupCase,
    v2StatementsInvalidOpenidContextInstructorAgentCase,
    v2StatementsInvalidOpenidContextInstructorGroupCase,
    v2StatementsInvalidOpenidContextTeamGroupCase,
    v2StatementsInvalidOpenidObjectAgentCase,
    v2StatementsInvalidOpenidObjectGroupCase,
    v2StatementsInvalidOpenidSubstatementActorAgentCase,
    v2StatementsInvalidOpenidSubstatementActorGroupCase,
    v2StatementsInvalidOpenidSubstatementContextInstructorAgentCase,
    v2StatementsInvalidOpenidSubstatementContextInstructorGroupCase,
    v2StatementsInvalidOpenidSubstatementContextTeamGroupCase,
    v2StatementsVerifyStatementTemplateDefaultCase,
    v2StatementsVerifyAgentTemplateActorAgentCase,
    v2StatementsVerifyAgentTemplateAuthorityAgentCase,
    v2StatementsVerifyAgentTemplateContextInstructorAgentCase,
    v2StatementsVerifyAgentTemplateObjectAgentCase,
    v2StatementsVerifyAgentTemplateSubstatementActorAgentCase,
    v2StatementsVerifyAgentTemplateSubstatementContextInstructorAgentCase,
    v2StatementsVerifyGroupTemplateActorGroupCase,
    v2StatementsVerifyGroupTemplateAuthorityGroupCase,
    v2StatementsVerifyGroupTemplateContextInstructorGroupCase,
    v2StatementsVerifyGroupTemplateContextTeamGroupCase,
    v2StatementsVerifyGroupTemplateObjectGroupCase,
    v2StatementsVerifyGroupTemplateSubstatementActorGroupCase,
    v2StatementsVerifyGroupTemplateSubstatementContextInstructorGroupCase,
    v2StatementsVerifyGroupTemplateSubstatementContextTeamGroupCase,
    v2StatementsVerifyVerbTemplateStatementCase,
    v2StatementsVerifyVerbTemplateSubstatementCase,
    v2StatementsAccountHomePageMissingActorAgentCase,
    v2StatementsAccountHomePageMissingActorGroupCase,
    v2StatementsAccountHomePageMissingAuthorityAgentCase,
    v2StatementsAccountHomePageMissingAuthorityGroupCase,
    v2StatementsAccountHomePageMissingContextInstructorAgentCase,
    v2StatementsAccountHomePageMissingContextInstructorGroupCase,
    v2StatementsAccountHomePageMissingContextTeamGroupCase,
    v2StatementsAccountHomePageMissingObjectAgentCase,
    v2StatementsAccountHomePageMissingObjectGroupCase,
    v2StatementsAccountHomePageMissingSubstatementActorAgentCase,
    v2StatementsAccountHomePageMissingSubstatementActorGroupCase,
    v2StatementsAccountHomePageMissingSubstatementContextInstructorAgentCase,
    v2StatementsAccountHomePageMissingSubstatementContextInstructorGroupCase,
    v2StatementsAccountHomePageMissingSubstatementContextTeamGroupCase,
    v2StatementsAccountHomePageInvalidActorAgentCase,
    v2StatementsAccountHomePageInvalidActorGroupCase,
    v2StatementsAccountHomePageInvalidAuthorityAgentCase,
    v2StatementsAccountHomePageInvalidAuthorityGroupCase,
    v2StatementsAccountHomePageInvalidContextInstructorAgentCase,
    v2StatementsAccountHomePageInvalidContextInstructorGroupCase,
    v2StatementsAccountHomePageInvalidContextTeamGroupCase,
    v2StatementsAccountHomePageInvalidObjectAgentCase,
    v2StatementsAccountHomePageInvalidObjectGroupCase,
    v2StatementsAccountHomePageInvalidSubstatementActorAgentCase,
    v2StatementsAccountHomePageInvalidSubstatementActorGroupCase,
    v2StatementsAccountHomePageInvalidSubstatementContextInstructorAgentCase,
    v2StatementsAccountHomePageInvalidSubstatementContextInstructorGroupCase,
    v2StatementsAccountHomePageInvalidSubstatementContextTeamGroupCase,
    v2StatementsAccountNameMissingActorAgentCase,
    v2StatementsAccountNameMissingActorGroupCase,
    v2StatementsAccountNameMissingAuthorityAgentCase,
    v2StatementsAccountNameMissingAuthorityGroupCase,
    v2StatementsAccountNameMissingContextInstructorAgentCase,
    v2StatementsAccountNameMissingContextInstructorGroupCase,
    v2StatementsAccountNameMissingContextTeamGroupCase,
    v2StatementsAccountNameMissingObjectAgentCase,
    v2StatementsAccountNameMissingObjectGroupCase,
    v2StatementsAccountNameMissingSubstatementActorAgentCase,
    v2StatementsAccountNameMissingSubstatementActorGroupCase,
    v2StatementsAccountNameMissingSubstatementContextInstructorAgentCase,
    v2StatementsAccountNameMissingSubstatementContextInstructorGroupCase,
    v2StatementsAccountNameMissingSubstatementContextTeamGroupCase,
    v2StatementsActorObjectTypeVocabularyActorAgentAgentCase,
    v2StatementsActorObjectTypeVocabularyActorAgentGroupCase,
    v2StatementsActorObjectTypeVocabularyAuthorityAgentAgentCase,
    v2StatementsActorObjectTypeVocabularyAuthorityAgentGroupCase,
    v2StatementsActorObjectTypeVocabularyContextInstructorAgentAgentCase,
    v2StatementsActorObjectTypeVocabularyContextInstructorAgentGroupCase,
    v2StatementsActorObjectTypeVocabularyObjectAgentAgentCase,
    v2StatementsActorObjectTypeVocabularyObjectAgentGroupCase,
    v2StatementsActorObjectTypeVocabularySubstatementActorAgentAgentCase,
    v2StatementsActorObjectTypeVocabularySubstatementActorAgentGroupCase,
    v2StatementsActorObjectTypeVocabularySubstatementContextInstructorAgentAgentCase,
    v2StatementsActorObjectTypeVocabularySubstatementContextInstructorAgentGroupCase,
    v2StatementsActorObjectTypeTypeActorAgentNumericCase,
    v2StatementsActorObjectTypeTypeActorAgentObjectCase,
    v2StatementsActorObjectTypeTypeAuthorityAgentNumericCase,
    v2StatementsActorObjectTypeTypeAuthorityAgentObjectCase,
    v2StatementsActorObjectTypeTypeContextInstructorAgentNumericCase,
    v2StatementsActorObjectTypeTypeContextInstructorAgentObjectCase,
    v2StatementsActorObjectTypeTypeObjectAgentNumericCase,
    v2StatementsActorObjectTypeTypeObjectAgentObjectCase,
    v2StatementsActorObjectTypeTypeSubstatementActorAgentNumericCase,
    v2StatementsActorObjectTypeTypeSubstatementActorAgentObjectCase,
    v2StatementsActorObjectTypeTypeSubstatementContextInstructorAgentNumericCase,
    v2StatementsActorObjectTypeTypeSubstatementContextInstructorAgentObjectCase,
    v2StatementsActorNameTypeActorAgentNumericCase,
    v2StatementsActorNameTypeActorAgentObjectCase,
    v2StatementsActorNameTypeAuthorityAgentNumericCase,
    v2StatementsActorNameTypeAuthorityAgentObjectCase,
    v2StatementsActorNameTypeContextInstructorAgentNumericCase,
    v2StatementsActorNameTypeContextInstructorAgentObjectCase,
    v2StatementsActorNameTypeObjectAgentNumericCase,
    v2StatementsActorNameTypeObjectAgentObjectCase,
    v2StatementsActorNameTypeSubstatementActorAgentNumericCase,
    v2StatementsActorNameTypeSubstatementActorAgentObjectCase,
    v2StatementsActorNameTypeSubstatementContextInstructorAgentNumericCase,
    v2StatementsActorNameTypeSubstatementContextInstructorAgentObjectCase,
    v2StatementsGroupMemberRequiredActorGroupCase,
    v2StatementsGroupMemberRequiredAuthorityGroupCase,
    v2StatementsGroupMemberRequiredContextInstructorGroupCase,
    v2StatementsGroupMemberRequiredContextTeamGroupCase,
    v2StatementsGroupMemberRequiredObjectGroupCase,
    v2StatementsGroupMemberRequiredSubstatementActorGroupCase,
    v2StatementsGroupMemberRequiredSubstatementContextInstructorGroupCase,
    v2StatementsGroupMemberRequiredSubstatementContextTeamGroupCase,
    v2StatementsGroupMemberTypeActorGroupCase,
    v2StatementsGroupMemberTypeAuthorityGroupCase,
    v2StatementsGroupMemberTypeContextInstructorGroupCase,
    v2StatementsGroupMemberTypeContextTeamGroupCase,
    v2StatementsGroupMemberTypeObjectGroupCase,
    v2StatementsGroupMemberTypeSubstatementActorGroupCase,
    v2StatementsGroupMemberTypeSubstatementContextInstructorGroupCase,
    v2StatementsGroupMemberTypeSubstatementContextTeamGroupCase,
    v2StatementsVerbIdRequiredStatementCase,
    v2StatementsVerbIdRequiredSubstatementCase,
    v2StatementsVerbIdIriStatementCase,
    v2StatementsVerbIdIriSubstatementCase,
    v2StatementsVerbDisplayTypeStatementNumericCase,
    v2StatementsVerbDisplayTypeStatementStringCase,
    v2StatementsVerbDisplayTypeSubstatementNumericCase,
    v2StatementsVerbDisplayTypeSubstatementStringCase,
    v2StatementsAgentIfiAcceptanceActorAgentMboxCase,
    v2StatementsAgentIfiAcceptanceActorAgentMboxSha1sumCase,
    v2StatementsAgentIfiAcceptanceActorAgentOpenidCase,
    v2StatementsAgentIfiAcceptanceActorAgentAccountCase,
    v2StatementsAgentIfiAcceptanceAuthorityAgentMboxCase,
    v2StatementsAgentIfiAcceptanceAuthorityAgentMboxSha1sumCase,
    v2StatementsAgentIfiAcceptanceAuthorityAgentOpenidCase,
    v2StatementsAgentIfiAcceptanceAuthorityAgentAccountCase,
    v2StatementsAgentIfiAcceptanceContextInstructorAgentMboxCase,
    v2StatementsAgentIfiAcceptanceContextInstructorAgentMboxSha1sumCase,
    v2StatementsAgentIfiAcceptanceContextInstructorAgentOpenidCase,
    v2StatementsAgentIfiAcceptanceContextInstructorAgentAccountCase,
    v2StatementsAgentIfiAcceptanceObjectAgentMboxCase,
    v2StatementsAgentIfiAcceptanceObjectAgentMboxSha1sumCase,
    v2StatementsAgentIfiAcceptanceObjectAgentOpenidCase,
    v2StatementsAgentIfiAcceptanceObjectAgentAccountCase,
    v2StatementsAgentIfiAcceptanceSubstatementActorAgentMboxCase,
    v2StatementsAgentIfiAcceptanceSubstatementActorAgentMboxSha1sumCase,
    v2StatementsAgentIfiAcceptanceSubstatementActorAgentOpenidCase,
    v2StatementsAgentIfiAcceptanceSubstatementActorAgentAccountCase,
    v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentMboxCase,
    v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentMboxSha1sumCase,
    v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentOpenidCase,
    v2StatementsAgentIfiAcceptanceSubstatementContextInstructorAgentAccountCase,
    v2StatementsAgentIfiRequiredActorAgentCase,
    v2StatementsAgentIfiRequiredAuthorityAgentCase,
    v2StatementsAgentIfiRequiredContextInstructorAgentCase,
    v2StatementsAgentIfiRequiredObjectAgentCase,
    v2StatementsAgentIfiRequiredSubstatementActorAgentCase,
    v2StatementsAgentIfiRequiredSubstatementContextInstructorAgentCase,
    v2StatementsGroupIfiOrMemberRequiredActorGroupCase,
    v2StatementsGroupIfiOrMemberRequiredContextInstructorGroupCase,
    v2StatementsGroupIfiOrMemberRequiredContextTeamGroupCase,
    v2StatementsGroupIfiOrMemberRequiredObjectGroupCase,
    v2StatementsGroupIfiOrMemberRequiredSubstatementActorGroupCase,
    v2StatementsGroupIfiOrMemberRequiredSubstatementContextInstructorGroupCase,
    v2StatementsGroupIfiOrMemberRequiredSubstatementContextTeamGroupCase,
    v2StatementsGroupIfiAcceptanceActorGroupMboxCase,
    v2StatementsGroupIfiAcceptanceActorGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceActorGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceActorGroupAccountCase,
    v2StatementsGroupIfiAcceptanceContextInstructorGroupMboxCase,
    v2StatementsGroupIfiAcceptanceContextInstructorGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceContextInstructorGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceContextInstructorGroupAccountCase,
    v2StatementsGroupIfiAcceptanceContextTeamGroupMboxCase,
    v2StatementsGroupIfiAcceptanceContextTeamGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceContextTeamGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceContextTeamGroupAccountCase,
    v2StatementsGroupIfiAcceptanceObjectGroupMboxCase,
    v2StatementsGroupIfiAcceptanceObjectGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceObjectGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceObjectGroupAccountCase,
    v2StatementsGroupIfiAcceptanceSubstatementActorGroupMboxCase,
    v2StatementsGroupIfiAcceptanceSubstatementActorGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceSubstatementActorGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceSubstatementActorGroupAccountCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupMboxCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextInstructorGroupAccountCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupMboxCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupMboxSha1sumCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupOpenidCase,
    v2StatementsGroupIfiAcceptanceSubstatementContextTeamGroupAccountCase,
    v2StatementsGroupIfiAcceptanceNoMemberActorGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberActorGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberActorGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberActorGroupAccountNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextInstructorGroupAccountNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberContextTeamGroupAccountNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberObjectGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberObjectGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberObjectGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberObjectGroupAccountNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementActorGroupAccountNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextInstructorGroupAccountNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupMboxNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupMboxSha1sumNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupOpenidNoMemberCase,
    v2StatementsGroupIfiAcceptanceNoMemberSubstatementContextTeamGroupAccountNoMemberCase,
    v2StatementsAccountPropertyAcceptanceActorAgentCase,
    v2StatementsAccountPropertyAcceptanceAuthorityAgentCase,
    v2StatementsAccountPropertyAcceptanceContextInstructorAgentCase,
    v2StatementsAccountPropertyAcceptanceObjectAgentCase,
    v2StatementsAccountPropertyAcceptanceSubstatementActorAgentCase,
    v2StatementsAccountPropertyAcceptanceSubstatementContextInstructorAgentCase,
    v2StatementsAccountPropertyAcceptanceActorGroupCase,
    v2StatementsAccountPropertyAcceptanceContextInstructorGroupCase,
    v2StatementsAccountPropertyAcceptanceContextTeamGroupCase,
    v2StatementsAccountPropertyAcceptanceObjectGroupCase,
    v2StatementsAccountPropertyAcceptanceSubstatementActorGroupCase,
    v2StatementsAccountPropertyAcceptanceSubstatementContextInstructorGroupCase,
    v2StatementsAccountPropertyAcceptanceSubstatementContextTeamGroupCase,
    v2StatementsAgentIfiExclusivityActorAgentMboxWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityActorAgentMboxWithOpenidCase,
    v2StatementsAgentIfiExclusivityActorAgentMboxWithAccountCase,
    v2StatementsAgentIfiExclusivityActorAgentMboxSha1sumWithMboxCase,
    v2StatementsAgentIfiExclusivityActorAgentMboxSha1sumWithOpenidCase,
    v2StatementsAgentIfiExclusivityActorAgentMboxSha1sumWithAccountCase,
    v2StatementsAgentIfiExclusivityActorAgentOpenidWithMboxCase,
    v2StatementsAgentIfiExclusivityActorAgentOpenidWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityActorAgentOpenidWithAccountCase,
    v2StatementsAgentIfiExclusivityActorAgentAccountWithMboxCase,
    v2StatementsAgentIfiExclusivityActorAgentAccountWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityActorAgentAccountWithOpenidCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentMboxWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentMboxWithOpenidCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentMboxWithAccountCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentMboxSha1sumWithMboxCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentMboxSha1sumWithOpenidCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentMboxSha1sumWithAccountCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentOpenidWithMboxCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentOpenidWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentOpenidWithAccountCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentAccountWithMboxCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentAccountWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityAuthorityAgentAccountWithOpenidCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentMboxWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentMboxWithOpenidCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentMboxWithAccountCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentMboxSha1sumWithMboxCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentMboxSha1sumWithOpenidCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentMboxSha1sumWithAccountCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentOpenidWithMboxCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentOpenidWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentOpenidWithAccountCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentAccountWithMboxCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentAccountWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityContextInstructorAgentAccountWithOpenidCase,
    v2StatementsAgentIfiExclusivityObjectAgentMboxWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityObjectAgentMboxWithOpenidCase,
    v2StatementsAgentIfiExclusivityObjectAgentMboxWithAccountCase,
    v2StatementsAgentIfiExclusivityObjectAgentMboxSha1sumWithMboxCase,
    v2StatementsAgentIfiExclusivityObjectAgentMboxSha1sumWithOpenidCase,
    v2StatementsAgentIfiExclusivityObjectAgentMboxSha1sumWithAccountCase,
    v2StatementsAgentIfiExclusivityObjectAgentOpenidWithMboxCase,
    v2StatementsAgentIfiExclusivityObjectAgentOpenidWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityObjectAgentOpenidWithAccountCase,
    v2StatementsAgentIfiExclusivityObjectAgentAccountWithMboxCase,
    v2StatementsAgentIfiExclusivityObjectAgentAccountWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivityObjectAgentAccountWithOpenidCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxWithOpenidCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxWithAccountCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxSha1sumWithMboxCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxSha1sumWithOpenidCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentMboxSha1sumWithAccountCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentOpenidWithMboxCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentOpenidWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentOpenidWithAccountCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentAccountWithMboxCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentAccountWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivitySubstatementActorAgentAccountWithOpenidCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxWithOpenidCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxWithAccountCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxSha1sumWithMboxCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxSha1sumWithOpenidCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentMboxSha1sumWithAccountCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentOpenidWithMboxCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentOpenidWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentOpenidWithAccountCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentAccountWithMboxCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentAccountWithMboxSha1sumCase,
    v2StatementsAgentIfiExclusivitySubstatementContextInstructorAgentAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivityActorGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityActorGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivityActorGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivityActorGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivityActorGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivityActorGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivityActorGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivityActorGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityActorGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivityActorGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivityActorGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityActorGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityAuthorityGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityContextInstructorGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityContextTeamGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivityObjectGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityObjectGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivityObjectGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivityObjectGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivityObjectGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivityObjectGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivityObjectGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivityObjectGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityObjectGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivityObjectGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivityObjectGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivityObjectGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementActorGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementContextInstructorGroupAccountWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxSha1sumWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxSha1sumWithOpenidCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupMboxSha1sumWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupOpenidWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupOpenidWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupOpenidWithAccountCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupAccountWithMboxCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupAccountWithMboxSha1sumCase,
    v2StatementsGroupIfiExclusivitySubstatementContextTeamGroupAccountWithOpenidCase,
    v2StatementsInvalidAttachmentIriUsageTypeNoSchemeCase,
    v2StatementsInvalidAttachmentIriFileUrlNoSchemeCase,
    v2StatementsCaseSensitiveKeysIdCase,
    v2StatementsCaseSensitiveKeysActorCase,
    v2StatementsCaseSensitiveKeysVerbCase,
    v2StatementsCaseSensitiveKeysObjectCase,
    v2StatementsCaseSensitiveKeysResultCase,
    v2StatementsCaseSensitiveKeysContextCase,
    v2StatementsCaseSensitiveKeysTimestampCase,
    v2StatementsCaseSensitiveKeysStoredCase,
    v2StatementsCaseSensitiveKeysAuthorityCase,
    v2StatementsCaseSensitiveKeysVersionCase,
    v2StatementsCaseSensitiveKeysAttachmentsCase,
    v2StatementsInteractionTypeCaseTrueFalseCase,
    v2StatementsInteractionTypeCaseChoiceCase,
    v2StatementsInteractionTypeCaseFillInCase,
    v2StatementsInteractionTypeCaseLongFillInCase,
    v2StatementsInteractionTypeCaseMatchingCase,
    v2StatementsInteractionTypeCasePerformanceCase,
    v2StatementsInteractionTypeCaseSequencingCase,
    v2StatementsInteractionTypeCaseLikertCase,
    v2StatementsInteractionTypeCaseNumericCase,
    v2StatementsInteractionTypeCaseOtherCase,
    v2StatementsInvalidExtensionIriObjectDefinitionCase,
    v2StatementsInvalidExtensionIriContextCase,
    v2StatementsInvalidExtensionIriResultCase,
    v2StatementsVerifyLanguageTemplateStatementVerbCase,
    v2StatementsVerifyLanguageTemplateStatementObjectCase,
    v2StatementsVerifyLanguageTemplateStatementAttachmentCase,
    v2StatementsVerifyLanguageTemplateSubstatementVerbCase,
    v2StatementsVerifyLanguageTemplateSubstatementObjectCase,
    v2StatementsLanguageTagsAcceptedVerbDisplayCase,
    v2StatementsLanguageTagsAcceptedObjectNameCase,
    v2StatementsLanguageTagsAcceptedObjectDescriptionCase,
    v2StatementsLanguageTagsAcceptedContextLanguageCase,
    v2StatementsLanguageTagsAcceptedAttachmentDisplayCase,
    v2StatementsLanguageTagsAcceptedAttachmentDescriptionCase,
    v2StatementsLanguageTagsAcceptedSubstatementVerbDisplayCase,
    v2StatementsLanguageTagsAcceptedSubstatementObjectNameCase,
    v2StatementsLanguageTagsAcceptedSubstatementObjectDescriptionCase,
    v2StatementsLanguageTagsAcceptedSubstatementContextLanguageCase,
    v2StatementsLanguageTagsRejectedVerbDisplayCase,
    v2StatementsLanguageTagsRejectedObjectNameCase,
    v2StatementsLanguageTagsRejectedObjectDescriptionCase,
    v2StatementsLanguageTagsRejectedContextLanguageCase,
    v2StatementsLanguageTagsRejectedAttachmentDisplayCase,
    v2StatementsLanguageTagsRejectedAttachmentDescriptionCase,
    v2StatementsLanguageTagsRejectedSubstatementVerbDisplayCase,
    v2StatementsLanguageTagsRejectedSubstatementObjectNameCase,
    v2StatementsLanguageTagsRejectedSubstatementObjectDescriptionCase,
    v2StatementsLanguageTagsRejectedSubstatementContextLanguageCase,
    v2StatementsMalformedObjectTypeActorCase,
    v2StatementsMalformedObjectTypeSubstatementActorCase,
    v2StatementsNumericPrecisionScoreRoundtripCase,
  ]
} as unknown as SuiteDefinition;
