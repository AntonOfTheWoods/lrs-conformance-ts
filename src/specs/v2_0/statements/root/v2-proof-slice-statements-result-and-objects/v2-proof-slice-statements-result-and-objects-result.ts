import type { SuiteDefinition } from "../../../../../domain/contracts";
import { v2StatementsVerifyResultTemplateStatementCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-verify-result-template-statement";
import { v2StatementsVerifyResultTemplateSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-verify-result-template-substatement";
import { v2StatementsResultSuccessTypeStatementTrueStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-success-type-statement-true-string";
import { v2StatementsResultSuccessTypeStatementFalseStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-success-type-statement-false-string";
import { v2StatementsResultSuccessTypeSubstatementTrueStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-success-type-substatement-true-string";
import { v2StatementsResultSuccessTypeSubstatementFalseStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-success-type-substatement-false-string";
import { v2StatementsResultCompletionTypeStatementTrueStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-completion-type-statement-true-string";
import { v2StatementsResultCompletionTypeStatementFalseStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-completion-type-statement-false-string";
import { v2StatementsResultCompletionTypeSubstatementTrueStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-completion-type-substatement-true-string";
import { v2StatementsResultCompletionTypeSubstatementFalseStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-completion-type-substatement-false-string";
import { v2StatementsResultResponseTypeStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-response-type-statement-numeric";
import { v2StatementsResultResponseTypeStatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-response-type-statement-object";
import { v2StatementsResultResponseTypeSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-response-type-substatement-numeric";
import { v2StatementsResultResponseTypeSubstatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-response-type-substatement-object";
import { v2StatementsResultDurationInvalidStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-statement-string";
import { v2StatementsResultDurationInvalidStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-statement-numeric";
import { v2StatementsResultDurationInvalidStatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-statement-object";
import { v2StatementsResultDurationInvalidStatementInvalidDesignatorCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-statement-invalid-designator";
import { v2StatementsResultDurationInvalidStatementMixedWeekDayCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-statement-mixed-week-day";
import { v2StatementsResultDurationInvalidSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-substatement-string";
import { v2StatementsResultDurationInvalidSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-substatement-numeric";
import { v2StatementsResultDurationInvalidSubstatementObjectCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-substatement-object";
import { v2StatementsResultDurationInvalidSubstatementInvalidDesignatorCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-substatement-invalid-designator";
import { v2StatementsResultDurationInvalidSubstatementMixedWeekDayCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-invalid-substatement-mixed-week-day";
import { v2StatementsResultDurationValidStatementHoursMinutesSecondsCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-statement-hours-minutes-seconds";
import { v2StatementsResultDurationValidStatementTimeOnlyCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-statement-time-only";
import { v2StatementsResultDurationValidStatementSecondsOnlyCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-statement-seconds-only";
import { v2StatementsResultDurationValidStatementDateTimeCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-statement-date-time";
import { v2StatementsResultDurationValidStatementYearsOnlyCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-statement-years-only";
import { v2StatementsResultDurationValidStatementWeeksCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-statement-weeks";
import { v2StatementsResultDurationValidSubstatementHoursMinutesSecondsCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-substatement-hours-minutes-seconds";
import { v2StatementsResultDurationValidSubstatementTimeOnlyCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-substatement-time-only";
import { v2StatementsResultDurationValidSubstatementSecondsOnlyCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-substatement-seconds-only";
import { v2StatementsResultDurationValidSubstatementDateTimeCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-substatement-date-time";
import { v2StatementsResultDurationValidSubstatementYearsOnlyCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-substatement-years-only";
import { v2StatementsResultDurationValidSubstatementWeeksCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-duration-valid-substatement-weeks";
import { v2StatementsResultExtensionsTypeStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-extensions-type-statement-numeric";
import { v2StatementsResultExtensionsTypeStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-extensions-type-statement-string";
import { v2StatementsResultExtensionsTypeSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-extensions-type-substatement-numeric";
import { v2StatementsResultExtensionsTypeSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-result-extensions-type-substatement-string";
import { v2StatementsScoreTypeStatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-type-statement-numeric";
import { v2StatementsScoreTypeStatementStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-type-statement-string";
import { v2StatementsScoreTypeSubstatementNumericCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-type-substatement-numeric";
import { v2StatementsScoreTypeSubstatementStringCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-type-substatement-string";
import { v2StatementsScoreScaledValidStatementDecimalCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-valid-statement-decimal";
import { v2StatementsScoreScaledValidStatementUpperBoundCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-valid-statement-upper-bound";
import { v2StatementsScoreScaledValidStatementLowerBoundCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-valid-statement-lower-bound";
import { v2StatementsScoreScaledValidSubstatementDecimalCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-valid-substatement-decimal";
import { v2StatementsScoreScaledValidSubstatementUpperBoundCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-valid-substatement-upper-bound";
import { v2StatementsScoreScaledValidSubstatementLowerBoundCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-valid-substatement-lower-bound";
import { v2StatementsScoreScaledInvalidStatementAboveOneCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-invalid-statement-above-one";
import { v2StatementsScoreScaledInvalidStatementBelowNegativeOneCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-invalid-statement-below-negative-one";
import { v2StatementsScoreScaledInvalidSubstatementAboveOneCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-invalid-substatement-above-one";
import { v2StatementsScoreScaledInvalidSubstatementBelowNegativeOneCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-scaled-invalid-substatement-below-negative-one";
import { v2StatementsScoreRawValidStatementUnrestrictedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-valid-statement-unrestricted";
import { v2StatementsScoreRawValidStatementBoundedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-valid-statement-bounded";
import { v2StatementsScoreRawValidSubstatementUnrestrictedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-valid-substatement-unrestricted";
import { v2StatementsScoreRawValidSubstatementBoundedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-valid-substatement-bounded";
import { v2StatementsScoreRawInvalidStatementAboveMaxCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-invalid-statement-above-max";
import { v2StatementsScoreRawInvalidStatementBelowMinCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-invalid-statement-below-min";
import { v2StatementsScoreRawInvalidSubstatementAboveMaxCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-invalid-substatement-above-max";
import { v2StatementsScoreRawInvalidSubstatementBelowMinCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-raw-invalid-substatement-below-min";
import { v2StatementsScoreMinValidStatementUnrestrictedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-min-valid-statement-unrestricted";
import { v2StatementsScoreMinValidStatementBoundedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-min-valid-statement-bounded";
import { v2StatementsScoreMinValidSubstatementUnrestrictedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-min-valid-substatement-unrestricted";
import { v2StatementsScoreMinValidSubstatementBoundedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-min-valid-substatement-bounded";
import { v2StatementsScoreMinInvalidStatementCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-min-invalid-statement";
import { v2StatementsScoreMinInvalidSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-min-invalid-substatement";
import { v2StatementsScoreMaxValidStatementUnrestrictedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-max-valid-statement-unrestricted";
import { v2StatementsScoreMaxValidStatementBoundedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-max-valid-statement-bounded";
import { v2StatementsScoreMaxValidSubstatementUnrestrictedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-max-valid-substatement-unrestricted";
import { v2StatementsScoreMaxValidSubstatementBoundedCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-max-valid-substatement-bounded";
import { v2StatementsScoreMaxInvalidStatementCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-max-invalid-statement";
import { v2StatementsScoreMaxInvalidSubstatementCase } from "./v2-proof-slice-statements-result-and-objects-result/v2-statements-score-max-invalid-substatement";

export const v2ProofSliceStatementsResultAndObjectsResultSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.result-and-objects.result",
  "title": "Result",
  "specVersion": "2.0.0",
  "tags": [
    "result"
  ]
,
  "children": [
    v2StatementsVerifyResultTemplateStatementCase,
    v2StatementsVerifyResultTemplateSubstatementCase,
    v2StatementsResultSuccessTypeStatementTrueStringCase,
    v2StatementsResultSuccessTypeStatementFalseStringCase,
    v2StatementsResultSuccessTypeSubstatementTrueStringCase,
    v2StatementsResultSuccessTypeSubstatementFalseStringCase,
    v2StatementsResultCompletionTypeStatementTrueStringCase,
    v2StatementsResultCompletionTypeStatementFalseStringCase,
    v2StatementsResultCompletionTypeSubstatementTrueStringCase,
    v2StatementsResultCompletionTypeSubstatementFalseStringCase,
    v2StatementsResultResponseTypeStatementNumericCase,
    v2StatementsResultResponseTypeStatementObjectCase,
    v2StatementsResultResponseTypeSubstatementNumericCase,
    v2StatementsResultResponseTypeSubstatementObjectCase,
    v2StatementsResultDurationInvalidStatementStringCase,
    v2StatementsResultDurationInvalidStatementNumericCase,
    v2StatementsResultDurationInvalidStatementObjectCase,
    v2StatementsResultDurationInvalidStatementInvalidDesignatorCase,
    v2StatementsResultDurationInvalidStatementMixedWeekDayCase,
    v2StatementsResultDurationInvalidSubstatementStringCase,
    v2StatementsResultDurationInvalidSubstatementNumericCase,
    v2StatementsResultDurationInvalidSubstatementObjectCase,
    v2StatementsResultDurationInvalidSubstatementInvalidDesignatorCase,
    v2StatementsResultDurationInvalidSubstatementMixedWeekDayCase,
    v2StatementsResultDurationValidStatementHoursMinutesSecondsCase,
    v2StatementsResultDurationValidStatementTimeOnlyCase,
    v2StatementsResultDurationValidStatementSecondsOnlyCase,
    v2StatementsResultDurationValidStatementDateTimeCase,
    v2StatementsResultDurationValidStatementYearsOnlyCase,
    v2StatementsResultDurationValidStatementWeeksCase,
    v2StatementsResultDurationValidSubstatementHoursMinutesSecondsCase,
    v2StatementsResultDurationValidSubstatementTimeOnlyCase,
    v2StatementsResultDurationValidSubstatementSecondsOnlyCase,
    v2StatementsResultDurationValidSubstatementDateTimeCase,
    v2StatementsResultDurationValidSubstatementYearsOnlyCase,
    v2StatementsResultDurationValidSubstatementWeeksCase,
    v2StatementsResultExtensionsTypeStatementNumericCase,
    v2StatementsResultExtensionsTypeStatementStringCase,
    v2StatementsResultExtensionsTypeSubstatementNumericCase,
    v2StatementsResultExtensionsTypeSubstatementStringCase,
    v2StatementsScoreTypeStatementNumericCase,
    v2StatementsScoreTypeStatementStringCase,
    v2StatementsScoreTypeSubstatementNumericCase,
    v2StatementsScoreTypeSubstatementStringCase,
    v2StatementsScoreScaledValidStatementDecimalCase,
    v2StatementsScoreScaledValidStatementUpperBoundCase,
    v2StatementsScoreScaledValidStatementLowerBoundCase,
    v2StatementsScoreScaledValidSubstatementDecimalCase,
    v2StatementsScoreScaledValidSubstatementUpperBoundCase,
    v2StatementsScoreScaledValidSubstatementLowerBoundCase,
    v2StatementsScoreScaledInvalidStatementAboveOneCase,
    v2StatementsScoreScaledInvalidStatementBelowNegativeOneCase,
    v2StatementsScoreScaledInvalidSubstatementAboveOneCase,
    v2StatementsScoreScaledInvalidSubstatementBelowNegativeOneCase,
    v2StatementsScoreRawValidStatementUnrestrictedCase,
    v2StatementsScoreRawValidStatementBoundedCase,
    v2StatementsScoreRawValidSubstatementUnrestrictedCase,
    v2StatementsScoreRawValidSubstatementBoundedCase,
    v2StatementsScoreRawInvalidStatementAboveMaxCase,
    v2StatementsScoreRawInvalidStatementBelowMinCase,
    v2StatementsScoreRawInvalidSubstatementAboveMaxCase,
    v2StatementsScoreRawInvalidSubstatementBelowMinCase,
    v2StatementsScoreMinValidStatementUnrestrictedCase,
    v2StatementsScoreMinValidStatementBoundedCase,
    v2StatementsScoreMinValidSubstatementUnrestrictedCase,
    v2StatementsScoreMinValidSubstatementBoundedCase,
    v2StatementsScoreMinInvalidStatementCase,
    v2StatementsScoreMinInvalidSubstatementCase,
    v2StatementsScoreMaxValidStatementUnrestrictedCase,
    v2StatementsScoreMaxValidStatementBoundedCase,
    v2StatementsScoreMaxValidSubstatementUnrestrictedCase,
    v2StatementsScoreMaxValidSubstatementBoundedCase,
    v2StatementsScoreMaxInvalidStatementCase,
    v2StatementsScoreMaxInvalidSubstatementCase,
  ]
} as unknown as SuiteDefinition;
