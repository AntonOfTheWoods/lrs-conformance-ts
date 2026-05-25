import type { SuiteDefinition } from "../../../../../domain/contracts";
import { v2StatementsVerifyResultTemplateStatementCase } from "./result/verify-result-template-statement";
import { v2StatementsVerifyResultTemplateSubstatementCase } from "./result/verify-result-template-substatement";
import { v2StatementsResultSuccessTypeStatementTrueStringCase } from "./result/success-type-statement-true-string";
import { v2StatementsResultSuccessTypeStatementFalseStringCase } from "./result/success-type-statement-false-string";
import { v2StatementsResultSuccessTypeSubstatementTrueStringCase } from "./result/success-type-substatement-true-string";
import { v2StatementsResultSuccessTypeSubstatementFalseStringCase } from "./result/success-type-substatement-false-string";
import { v2StatementsResultCompletionTypeStatementTrueStringCase } from "./result/completion-type-statement-true-string";
import { v2StatementsResultCompletionTypeStatementFalseStringCase } from "./result/completion-type-statement-false-string";
import { v2StatementsResultCompletionTypeSubstatementTrueStringCase } from "./result/completion-type-substatement-true-string";
import { v2StatementsResultCompletionTypeSubstatementFalseStringCase } from "./result/completion-type-substatement-false-string";
import { v2StatementsResultResponseTypeStatementNumericCase } from "./result/response-type-statement-numeric";
import { v2StatementsResultResponseTypeStatementObjectCase } from "./result/response-type-statement-object";
import { v2StatementsResultResponseTypeSubstatementNumericCase } from "./result/response-type-substatement-numeric";
import { v2StatementsResultResponseTypeSubstatementObjectCase } from "./result/response-type-substatement-object";
import { v2StatementsResultDurationInvalidStatementStringCase } from "./result/duration-invalid-statement-string";
import { v2StatementsResultDurationInvalidStatementNumericCase } from "./result/duration-invalid-statement-numeric";
import { v2StatementsResultDurationInvalidStatementObjectCase } from "./result/duration-invalid-statement-object";
import { v2StatementsResultDurationInvalidStatementInvalidDesignatorCase } from "./result/duration-invalid-statement-invalid-designator";
import { v2StatementsResultDurationInvalidStatementMixedWeekDayCase } from "./result/duration-invalid-statement-mixed-week-day";
import { v2StatementsResultDurationInvalidSubstatementStringCase } from "./result/duration-invalid-substatement-string";
import { v2StatementsResultDurationInvalidSubstatementNumericCase } from "./result/duration-invalid-substatement-numeric";
import { v2StatementsResultDurationInvalidSubstatementObjectCase } from "./result/duration-invalid-substatement-object";
import { v2StatementsResultDurationInvalidSubstatementInvalidDesignatorCase } from "./result/duration-invalid-substatement-invalid-designator";
import { v2StatementsResultDurationInvalidSubstatementMixedWeekDayCase } from "./result/duration-invalid-substatement-mixed-week-day";
import { v2StatementsResultDurationValidStatementHoursMinutesSecondsCase } from "./result/duration-valid-statement-hours-minutes-seconds";
import { v2StatementsResultDurationValidStatementTimeOnlyCase } from "./result/duration-valid-statement-time-only";
import { v2StatementsResultDurationValidStatementSecondsOnlyCase } from "./result/duration-valid-statement-seconds-only";
import { v2StatementsResultDurationValidStatementDateTimeCase } from "./result/duration-valid-statement-date-time";
import { v2StatementsResultDurationValidStatementYearsOnlyCase } from "./result/duration-valid-statement-years-only";
import { v2StatementsResultDurationValidStatementWeeksCase } from "./result/duration-valid-statement-weeks";
import { v2StatementsResultDurationValidSubstatementHoursMinutesSecondsCase } from "./result/duration-valid-substatement-hours-minutes-seconds";
import { v2StatementsResultDurationValidSubstatementTimeOnlyCase } from "./result/duration-valid-substatement-time-only";
import { v2StatementsResultDurationValidSubstatementSecondsOnlyCase } from "./result/duration-valid-substatement-seconds-only";
import { v2StatementsResultDurationValidSubstatementDateTimeCase } from "./result/duration-valid-substatement-date-time";
import { v2StatementsResultDurationValidSubstatementYearsOnlyCase } from "./result/duration-valid-substatement-years-only";
import { v2StatementsResultDurationValidSubstatementWeeksCase } from "./result/duration-valid-substatement-weeks";
import { v2StatementsResultExtensionsTypeStatementNumericCase } from "./result/extensions-type-statement-numeric";
import { v2StatementsResultExtensionsTypeStatementStringCase } from "./result/extensions-type-statement-string";
import { v2StatementsResultExtensionsTypeSubstatementNumericCase } from "./result/extensions-type-substatement-numeric";
import { v2StatementsResultExtensionsTypeSubstatementStringCase } from "./result/extensions-type-substatement-string";
import { v2StatementsScoreTypeStatementNumericCase } from "./result/score-type-statement-numeric";
import { v2StatementsScoreTypeStatementStringCase } from "./result/score-type-statement-string";
import { v2StatementsScoreTypeSubstatementNumericCase } from "./result/score-type-substatement-numeric";
import { v2StatementsScoreTypeSubstatementStringCase } from "./result/score-type-substatement-string";
import { v2StatementsScoreScaledValidStatementDecimalCase } from "./result/score-scaled-valid-statement-decimal";
import { v2StatementsScoreScaledValidStatementUpperBoundCase } from "./result/score-scaled-valid-statement-upper-bound";
import { v2StatementsScoreScaledValidStatementLowerBoundCase } from "./result/score-scaled-valid-statement-lower-bound";
import { v2StatementsScoreScaledValidSubstatementDecimalCase } from "./result/score-scaled-valid-substatement-decimal";
import { v2StatementsScoreScaledValidSubstatementUpperBoundCase } from "./result/score-scaled-valid-substatement-upper-bound";
import { v2StatementsScoreScaledValidSubstatementLowerBoundCase } from "./result/score-scaled-valid-substatement-lower-bound";
import { v2StatementsScoreScaledInvalidStatementAboveOneCase } from "./result/score-scaled-invalid-statement-above-one";
import { v2StatementsScoreScaledInvalidStatementBelowNegativeOneCase } from "./result/score-scaled-invalid-statement-below-negative-one";
import { v2StatementsScoreScaledInvalidSubstatementAboveOneCase } from "./result/score-scaled-invalid-substatement-above-one";
import { v2StatementsScoreScaledInvalidSubstatementBelowNegativeOneCase } from "./result/score-scaled-invalid-substatement-below-negative-one";
import { v2StatementsScoreRawValidStatementUnrestrictedCase } from "./result/score-raw-valid-statement-unrestricted";
import { v2StatementsScoreRawValidStatementBoundedCase } from "./result/score-raw-valid-statement-bounded";
import { v2StatementsScoreRawValidSubstatementUnrestrictedCase } from "./result/score-raw-valid-substatement-unrestricted";
import { v2StatementsScoreRawValidSubstatementBoundedCase } from "./result/score-raw-valid-substatement-bounded";
import { v2StatementsScoreRawInvalidStatementAboveMaxCase } from "./result/score-raw-invalid-statement-above-max";
import { v2StatementsScoreRawInvalidStatementBelowMinCase } from "./result/score-raw-invalid-statement-below-min";
import { v2StatementsScoreRawInvalidSubstatementAboveMaxCase } from "./result/score-raw-invalid-substatement-above-max";
import { v2StatementsScoreRawInvalidSubstatementBelowMinCase } from "./result/score-raw-invalid-substatement-below-min";
import { v2StatementsScoreMinValidStatementUnrestrictedCase } from "./result/score-min-valid-statement-unrestricted";
import { v2StatementsScoreMinValidStatementBoundedCase } from "./result/score-min-valid-statement-bounded";
import { v2StatementsScoreMinValidSubstatementUnrestrictedCase } from "./result/score-min-valid-substatement-unrestricted";
import { v2StatementsScoreMinValidSubstatementBoundedCase } from "./result/score-min-valid-substatement-bounded";
import { v2StatementsScoreMinInvalidStatementCase } from "./result/score-min-invalid-statement";
import { v2StatementsScoreMinInvalidSubstatementCase } from "./result/score-min-invalid-substatement";
import { v2StatementsScoreMaxValidStatementUnrestrictedCase } from "./result/score-max-valid-statement-unrestricted";
import { v2StatementsScoreMaxValidStatementBoundedCase } from "./result/score-max-valid-statement-bounded";
import { v2StatementsScoreMaxValidSubstatementUnrestrictedCase } from "./result/score-max-valid-substatement-unrestricted";
import { v2StatementsScoreMaxValidSubstatementBoundedCase } from "./result/score-max-valid-substatement-bounded";
import { v2StatementsScoreMaxInvalidStatementCase } from "./result/score-max-invalid-statement";
import { v2StatementsScoreMaxInvalidSubstatementCase } from "./result/score-max-invalid-substatement";

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
