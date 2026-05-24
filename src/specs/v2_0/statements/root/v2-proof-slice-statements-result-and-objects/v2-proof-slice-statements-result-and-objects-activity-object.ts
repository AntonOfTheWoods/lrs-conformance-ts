import type { SuiteDefinition } from "../../../../../domain/contracts";
import { v2StatementsVerifyActivityTemplateStatementDefaultCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-default";
import { v2StatementsVerifyActivityTemplateSubstatementDefaultCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-substatement-default";
import { v2StatementsVerifyActivityTemplateStatementTrueFalseCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-true-false";
import { v2StatementsVerifyActivityTemplateStatementFillInCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-fill-in";
import { v2StatementsVerifyActivityTemplateStatementLongFillInCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-long-fill-in";
import { v2StatementsVerifyActivityTemplateStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-numeric";
import { v2StatementsVerifyActivityTemplateStatementOtherCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-other";
import { v2StatementsVerifyActivityTemplateStatementChoiceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-choice";
import { v2StatementsVerifyActivityTemplateStatementMatchingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-matching";
import { v2StatementsVerifyActivityTemplateStatementPerformanceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-performance";
import { v2StatementsVerifyActivityTemplateStatementSequencingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-sequencing";
import { v2StatementsVerifyActivityTemplateStatementLikertCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-statement-likert";
import { v2StatementsVerifyActivityTemplateSubstatementChoiceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-substatement-choice";
import { v2StatementsVerifyActivityTemplateSubstatementMatchingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-substatement-matching";
import { v2StatementsVerifyActivityTemplateSubstatementPerformanceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-substatement-performance";
import { v2StatementsVerifyActivityTemplateSubstatementSequencingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-substatement-sequencing";
import { v2StatementsVerifyActivityTemplateSubstatementLikertCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-template-substatement-likert";
import { v2StatementsVerifyActivityDefinitionStatementEmptyDefinitionCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-empty-definition";
import { v2StatementsVerifyActivityDefinitionStatementNameCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-name";
import { v2StatementsVerifyActivityDefinitionStatementDescriptionCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-description";
import { v2StatementsVerifyActivityDefinitionStatementTypeCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-type";
import { v2StatementsVerifyActivityDefinitionStatementMoreInfoCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-more-info";
import { v2StatementsVerifyActivityDefinitionStatementExtensionsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-extensions";
import { v2StatementsVerifyActivityDefinitionStatementInteractionTypeCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-statement-interaction-type";
import { v2StatementsVerifyActivityDefinitionSubstatementEmptyDefinitionCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-empty-definition";
import { v2StatementsVerifyActivityDefinitionSubstatementNameCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-name";
import { v2StatementsVerifyActivityDefinitionSubstatementDescriptionCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-description";
import { v2StatementsVerifyActivityDefinitionSubstatementTypeCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-type";
import { v2StatementsVerifyActivityDefinitionSubstatementMoreInfoCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-more-info";
import { v2StatementsVerifyActivityDefinitionSubstatementExtensionsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-extensions";
import { v2StatementsVerifyActivityDefinitionSubstatementInteractionTypeCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-verify-activity-definition-substatement-interaction-type";
import { v2StatementsObjectTypeVocabularyStatementActivityCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-statement-activity";
import { v2StatementsObjectTypeVocabularySubstatementActivityCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-substatement-activity";
import { v2StatementsObjectTypeVocabularyStatementAgentCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-statement-agent";
import { v2StatementsObjectTypeVocabularySubstatementAgentCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-substatement-agent";
import { v2StatementsObjectTypeVocabularyStatementGroupCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-statement-group";
import { v2StatementsObjectTypeVocabularySubstatementGroupCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-substatement-group";
import { v2StatementsObjectTypeVocabularyStatementStatementRefCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-statement-statement-ref";
import { v2StatementsObjectTypeVocabularySubstatementStatementRefCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-type-vocabulary-substatement-statement-ref";
import { v2StatementsActivityMissingIdStatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-missing-id-statement";
import { v2StatementsActivityMissingIdSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-missing-id-substatement";
import { v2StatementsActivityInvalidIdStatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-invalid-id-statement";
import { v2StatementsActivityInvalidIdSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-invalid-id-substatement";
import { v2StatementsActivityObjectTypeGeneratedStatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-object-type-generated-statement";
import { v2StatementsActivityObjectTypeGeneratedSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-object-type-generated-substatement";
import { v2StatementsActivityDefinitionTypeStatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-type-statement";
import { v2StatementsActivityDefinitionTypeSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-type-substatement";
import { v2StatementsActivityDefinitionNameTypeStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-name-type-statement-numeric";
import { v2StatementsActivityDefinitionNameTypeStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-name-type-statement-string";
import { v2StatementsActivityDefinitionNameTypeSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-name-type-substatement-numeric";
import { v2StatementsActivityDefinitionNameTypeSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-name-type-substatement-string";
import { v2StatementsActivityDefinitionDescriptionTypeStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-description-type-statement-numeric";
import { v2StatementsActivityDefinitionDescriptionTypeStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-description-type-statement-string";
import { v2StatementsActivityDefinitionDescriptionTypeSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-description-type-substatement-numeric";
import { v2StatementsActivityDefinitionDescriptionTypeSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-definition-description-type-substatement-string";
import { v2StatementsActivityInteractionTypeAcceptanceStatementTrueFalseCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-true-false";
import { v2StatementsActivityInteractionTypeAcceptanceStatementFillInCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-fill-in";
import { v2StatementsActivityInteractionTypeAcceptanceStatementLongFillInCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-long-fill-in";
import { v2StatementsActivityInteractionTypeAcceptanceStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-numeric";
import { v2StatementsActivityInteractionTypeAcceptanceStatementOtherCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-other";
import { v2StatementsActivityInteractionTypeAcceptanceStatementChoiceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-choice";
import { v2StatementsActivityInteractionTypeAcceptanceStatementMatchingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-matching";
import { v2StatementsActivityInteractionTypeAcceptanceStatementPerformanceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-performance";
import { v2StatementsActivityInteractionTypeAcceptanceStatementSequencingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-sequencing";
import { v2StatementsActivityInteractionTypeAcceptanceStatementLikertCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-statement-likert";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementTrueFalseCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-true-false";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementFillInCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-fill-in";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementLongFillInCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-long-fill-in";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-numeric";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementOtherCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-other";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementChoiceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-choice";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementMatchingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-matching";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementPerformanceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-performance";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementSequencingCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-sequencing";
import { v2StatementsActivityInteractionTypeAcceptanceSubstatementLikertCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-acceptance-substatement-likert";
import { v2StatementsActivityInteractionTypeInvalidStatementIriCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-statement-iri";
import { v2StatementsActivityInteractionTypeInvalidStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-statement-numeric";
import { v2StatementsActivityInteractionTypeInvalidStatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-statement-object";
import { v2StatementsActivityInteractionTypeInvalidStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-statement-string";
import { v2StatementsActivityInteractionTypeInvalidSubstatementIriCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-substatement-iri";
import { v2StatementsActivityInteractionTypeInvalidSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-substatement-numeric";
import { v2StatementsActivityInteractionTypeInvalidSubstatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-substatement-object";
import { v2StatementsActivityInteractionTypeInvalidSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-invalid-substatement-string";
import { v2StatementsActivityCorrectResponsesPatternStatementValidCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-statement-valid";
import { v2StatementsActivityCorrectResponsesPatternStatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-statement-object";
import { v2StatementsActivityCorrectResponsesPatternStatementArrayObjectCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-statement-array-object";
import { v2StatementsActivityCorrectResponsesPatternStatementArrayNumberCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-statement-array-number";
import { v2StatementsActivityCorrectResponsesPatternSubstatementValidCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-substatement-valid";
import { v2StatementsActivityCorrectResponsesPatternSubstatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-substatement-object";
import { v2StatementsActivityCorrectResponsesPatternSubstatementArrayObjectCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-substatement-array-object";
import { v2StatementsActivityCorrectResponsesPatternSubstatementArrayNumberCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-correct-responses-pattern-substatement-array-number";
import { v2StatementsActivityExtensionsTypeStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-extensions-type-statement-string";
import { v2StatementsActivityExtensionsTypeStatementInvalidKeyCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-extensions-type-statement-invalid-key";
import { v2StatementsActivityExtensionsTypeSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-extensions-type-substatement-string";
import { v2StatementsActivityExtensionsTypeSubstatementInvalidKeyCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-extensions-type-substatement-invalid-key";
import { v2StatementsActivityInteractionComponentsAcceptanceStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsAcceptanceStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsAcceptanceStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsAcceptanceStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-statement-matching-source";
import { v2StatementsActivityInteractionComponentsAcceptanceStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-statement-matching-target";
import { v2StatementsActivityInteractionComponentsAcceptanceStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsAcceptanceSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsAcceptanceSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsAcceptanceSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsAcceptanceSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsAcceptanceSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsAcceptanceSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-acceptance-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsNotArrayStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsNotArrayStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsNotArrayStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsNotArrayStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-statement-matching-source";
import { v2StatementsActivityInteractionComponentsNotArrayStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-statement-matching-target";
import { v2StatementsActivityInteractionComponentsNotArrayStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsNotArraySubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsNotArraySubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsNotArraySubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsNotArraySubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsNotArraySubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsNotArraySubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-not-array-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsEntryNotObjectStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsEntryNotObjectStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsEntryNotObjectStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsEntryNotObjectStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-statement-matching-source";
import { v2StatementsActivityInteractionComponentsEntryNotObjectStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-statement-matching-target";
import { v2StatementsActivityInteractionComponentsEntryNotObjectStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-entry-not-object-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsIdMissingStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsIdMissingStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsIdMissingStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsIdMissingStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-statement-matching-source";
import { v2StatementsActivityInteractionComponentsIdMissingStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-statement-matching-target";
import { v2StatementsActivityInteractionComponentsIdMissingStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsIdMissingSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsIdMissingSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsIdMissingSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsIdMissingSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsIdMissingSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsIdMissingSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-missing-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsIdInvalidStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsIdInvalidStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsIdInvalidStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsIdInvalidStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-statement-matching-source";
import { v2StatementsActivityInteractionComponentsIdInvalidStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-statement-matching-target";
import { v2StatementsActivityInteractionComponentsIdInvalidStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsIdInvalidSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsIdInvalidSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsIdInvalidSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsIdInvalidSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsIdInvalidSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsIdInvalidSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-id-invalid-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsDescriptionTypeStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsDescriptionTypeStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsDescriptionTypeStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsDescriptionTypeStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-statement-matching-source";
import { v2StatementsActivityInteractionComponentsDescriptionTypeStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-statement-matching-target";
import { v2StatementsActivityInteractionComponentsDescriptionTypeStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-type-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-statement-matching-source";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-statement-matching-target";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-description-language-substatement-performance-steps";
import { v2StatementsActivityInteractionComponentsDuplicateIdsStatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-statement-choice-choices";
import { v2StatementsActivityInteractionComponentsDuplicateIdsStatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-statement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsDuplicateIdsStatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-statement-likert-scale";
import { v2StatementsActivityInteractionComponentsDuplicateIdsStatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-statement-matching-source";
import { v2StatementsActivityInteractionComponentsDuplicateIdsStatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-statement-matching-target";
import { v2StatementsActivityInteractionComponentsDuplicateIdsStatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-statement-performance-steps";
import { v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementChoiceChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-substatement-choice-choices";
import { v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementSequencingChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-substatement-sequencing-choices";
import { v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementLikertScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-substatement-likert-scale";
import { v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementMatchingSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-substatement-matching-source";
import { v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementMatchingTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-substatement-matching-target";
import { v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementPerformanceStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-components-duplicate-ids-substatement-performance-steps";
import { v2StatementsActivityInteractionTypeRequiredStatementCorrectResponsesPatternCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-statement-correct-responses-pattern";
import { v2StatementsActivityInteractionTypeRequiredStatementChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-statement-choices";
import { v2StatementsActivityInteractionTypeRequiredStatementScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-statement-scale";
import { v2StatementsActivityInteractionTypeRequiredStatementSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-statement-source";
import { v2StatementsActivityInteractionTypeRequiredStatementTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-statement-target";
import { v2StatementsActivityInteractionTypeRequiredStatementStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-statement-steps";
import { v2StatementsActivityInteractionTypeRequiredSubstatementCorrectResponsesPatternCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-substatement-correct-responses-pattern";
import { v2StatementsActivityInteractionTypeRequiredSubstatementChoicesCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-substatement-choices";
import { v2StatementsActivityInteractionTypeRequiredSubstatementScaleCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-substatement-scale";
import { v2StatementsActivityInteractionTypeRequiredSubstatementSourceCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-substatement-source";
import { v2StatementsActivityInteractionTypeRequiredSubstatementTargetCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-substatement-target";
import { v2StatementsActivityInteractionTypeRequiredSubstatementStepsCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-activity-interaction-type-required-substatement-steps";
import { v2StatementsObjectAgentGroupRequiresObjectTypeStatementAgentCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-agent-group-requires-object-type-statement-agent";
import { v2StatementsObjectAgentGroupRequiresObjectTypeStatementGroupCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-agent-group-requires-object-type-statement-group";
import { v2StatementsObjectAgentGroupRequiresObjectTypeSubstatementAgentCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-agent-group-requires-object-type-substatement-agent";
import { v2StatementsObjectAgentGroupRequiresObjectTypeSubstatementGroupCase } from "./v2-proof-slice-statements-result-and-objects-activity-object/v2-statements-object-agent-group-requires-object-type-substatement-group";

export const v2ProofSliceStatementsResultAndObjectsActivityObjectSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.result-and-objects.activity-object",
  "title": "Activity And Object Typing",
  "specVersion": "2.0.0",
  "tags": [
    "activity",
    "object"
  ]
,
  "children": [
    v2StatementsVerifyActivityTemplateStatementDefaultCase,
    v2StatementsVerifyActivityTemplateSubstatementDefaultCase,
    v2StatementsVerifyActivityTemplateStatementTrueFalseCase,
    v2StatementsVerifyActivityTemplateStatementFillInCase,
    v2StatementsVerifyActivityTemplateStatementLongFillInCase,
    v2StatementsVerifyActivityTemplateStatementNumericCase,
    v2StatementsVerifyActivityTemplateStatementOtherCase,
    v2StatementsVerifyActivityTemplateStatementChoiceCase,
    v2StatementsVerifyActivityTemplateStatementMatchingCase,
    v2StatementsVerifyActivityTemplateStatementPerformanceCase,
    v2StatementsVerifyActivityTemplateStatementSequencingCase,
    v2StatementsVerifyActivityTemplateStatementLikertCase,
    v2StatementsVerifyActivityTemplateSubstatementChoiceCase,
    v2StatementsVerifyActivityTemplateSubstatementMatchingCase,
    v2StatementsVerifyActivityTemplateSubstatementPerformanceCase,
    v2StatementsVerifyActivityTemplateSubstatementSequencingCase,
    v2StatementsVerifyActivityTemplateSubstatementLikertCase,
    v2StatementsVerifyActivityDefinitionStatementEmptyDefinitionCase,
    v2StatementsVerifyActivityDefinitionStatementNameCase,
    v2StatementsVerifyActivityDefinitionStatementDescriptionCase,
    v2StatementsVerifyActivityDefinitionStatementTypeCase,
    v2StatementsVerifyActivityDefinitionStatementMoreInfoCase,
    v2StatementsVerifyActivityDefinitionStatementExtensionsCase,
    v2StatementsVerifyActivityDefinitionStatementInteractionTypeCase,
    v2StatementsVerifyActivityDefinitionSubstatementEmptyDefinitionCase,
    v2StatementsVerifyActivityDefinitionSubstatementNameCase,
    v2StatementsVerifyActivityDefinitionSubstatementDescriptionCase,
    v2StatementsVerifyActivityDefinitionSubstatementTypeCase,
    v2StatementsVerifyActivityDefinitionSubstatementMoreInfoCase,
    v2StatementsVerifyActivityDefinitionSubstatementExtensionsCase,
    v2StatementsVerifyActivityDefinitionSubstatementInteractionTypeCase,
    v2StatementsObjectTypeVocabularyStatementActivityCase,
    v2StatementsObjectTypeVocabularySubstatementActivityCase,
    v2StatementsObjectTypeVocabularyStatementAgentCase,
    v2StatementsObjectTypeVocabularySubstatementAgentCase,
    v2StatementsObjectTypeVocabularyStatementGroupCase,
    v2StatementsObjectTypeVocabularySubstatementGroupCase,
    v2StatementsObjectTypeVocabularyStatementStatementRefCase,
    v2StatementsObjectTypeVocabularySubstatementStatementRefCase,
    v2StatementsActivityMissingIdStatementCase,
    v2StatementsActivityMissingIdSubstatementCase,
    v2StatementsActivityInvalidIdStatementCase,
    v2StatementsActivityInvalidIdSubstatementCase,
    v2StatementsActivityObjectTypeGeneratedStatementCase,
    v2StatementsActivityObjectTypeGeneratedSubstatementCase,
    v2StatementsActivityDefinitionTypeStatementCase,
    v2StatementsActivityDefinitionTypeSubstatementCase,
    v2StatementsActivityDefinitionNameTypeStatementNumericCase,
    v2StatementsActivityDefinitionNameTypeStatementStringCase,
    v2StatementsActivityDefinitionNameTypeSubstatementNumericCase,
    v2StatementsActivityDefinitionNameTypeSubstatementStringCase,
    v2StatementsActivityDefinitionDescriptionTypeStatementNumericCase,
    v2StatementsActivityDefinitionDescriptionTypeStatementStringCase,
    v2StatementsActivityDefinitionDescriptionTypeSubstatementNumericCase,
    v2StatementsActivityDefinitionDescriptionTypeSubstatementStringCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementTrueFalseCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementFillInCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementLongFillInCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementNumericCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementOtherCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementChoiceCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementMatchingCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementPerformanceCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementSequencingCase,
    v2StatementsActivityInteractionTypeAcceptanceStatementLikertCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementTrueFalseCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementFillInCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementLongFillInCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementNumericCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementOtherCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementChoiceCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementMatchingCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementPerformanceCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementSequencingCase,
    v2StatementsActivityInteractionTypeAcceptanceSubstatementLikertCase,
    v2StatementsActivityInteractionTypeInvalidStatementIriCase,
    v2StatementsActivityInteractionTypeInvalidStatementNumericCase,
    v2StatementsActivityInteractionTypeInvalidStatementObjectCase,
    v2StatementsActivityInteractionTypeInvalidStatementStringCase,
    v2StatementsActivityInteractionTypeInvalidSubstatementIriCase,
    v2StatementsActivityInteractionTypeInvalidSubstatementNumericCase,
    v2StatementsActivityInteractionTypeInvalidSubstatementObjectCase,
    v2StatementsActivityInteractionTypeInvalidSubstatementStringCase,
    v2StatementsActivityCorrectResponsesPatternStatementValidCase,
    v2StatementsActivityCorrectResponsesPatternStatementObjectCase,
    v2StatementsActivityCorrectResponsesPatternStatementArrayObjectCase,
    v2StatementsActivityCorrectResponsesPatternStatementArrayNumberCase,
    v2StatementsActivityCorrectResponsesPatternSubstatementValidCase,
    v2StatementsActivityCorrectResponsesPatternSubstatementObjectCase,
    v2StatementsActivityCorrectResponsesPatternSubstatementArrayObjectCase,
    v2StatementsActivityCorrectResponsesPatternSubstatementArrayNumberCase,
    v2StatementsActivityExtensionsTypeStatementStringCase,
    v2StatementsActivityExtensionsTypeStatementInvalidKeyCase,
    v2StatementsActivityExtensionsTypeSubstatementStringCase,
    v2StatementsActivityExtensionsTypeSubstatementInvalidKeyCase,
    v2StatementsActivityInteractionComponentsAcceptanceStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsAcceptanceStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsAcceptanceStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsAcceptanceStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsAcceptanceStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsAcceptanceStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsAcceptanceSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsAcceptanceSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsAcceptanceSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsAcceptanceSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsAcceptanceSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsAcceptanceSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsNotArrayStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsNotArrayStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsNotArrayStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsNotArrayStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsNotArrayStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsNotArrayStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsNotArraySubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsNotArraySubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsNotArraySubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsNotArraySubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsNotArraySubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsNotArraySubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsEntryNotObjectSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsIdMissingStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsIdMissingStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsIdMissingStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsIdMissingStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsIdMissingStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsIdMissingStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsIdMissingSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsIdMissingSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsIdMissingSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsIdMissingSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsIdMissingSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsIdMissingSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsIdInvalidStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsIdInvalidStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsIdInvalidStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsIdInvalidStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsIdInvalidStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsIdInvalidStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsIdInvalidSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsIdInvalidSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsIdInvalidSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsIdInvalidSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsIdInvalidSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsIdInvalidSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsDescriptionTypeSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsDescriptionLanguageSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsStatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsStatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsStatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsStatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsStatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsStatementPerformanceStepsCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementChoiceChoicesCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementSequencingChoicesCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementLikertScaleCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementMatchingSourceCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementMatchingTargetCase,
    v2StatementsActivityInteractionComponentsDuplicateIdsSubstatementPerformanceStepsCase,
    v2StatementsActivityInteractionTypeRequiredStatementCorrectResponsesPatternCase,
    v2StatementsActivityInteractionTypeRequiredStatementChoicesCase,
    v2StatementsActivityInteractionTypeRequiredStatementScaleCase,
    v2StatementsActivityInteractionTypeRequiredStatementSourceCase,
    v2StatementsActivityInteractionTypeRequiredStatementTargetCase,
    v2StatementsActivityInteractionTypeRequiredStatementStepsCase,
    v2StatementsActivityInteractionTypeRequiredSubstatementCorrectResponsesPatternCase,
    v2StatementsActivityInteractionTypeRequiredSubstatementChoicesCase,
    v2StatementsActivityInteractionTypeRequiredSubstatementScaleCase,
    v2StatementsActivityInteractionTypeRequiredSubstatementSourceCase,
    v2StatementsActivityInteractionTypeRequiredSubstatementTargetCase,
    v2StatementsActivityInteractionTypeRequiredSubstatementStepsCase,
    v2StatementsObjectAgentGroupRequiresObjectTypeStatementAgentCase,
    v2StatementsObjectAgentGroupRequiresObjectTypeStatementGroupCase,
    v2StatementsObjectAgentGroupRequiresObjectTypeSubstatementAgentCase,
    v2StatementsObjectAgentGroupRequiresObjectTypeSubstatementGroupCase,
  ]
} as unknown as SuiteDefinition;
