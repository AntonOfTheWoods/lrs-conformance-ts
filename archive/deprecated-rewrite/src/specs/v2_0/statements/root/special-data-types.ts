import type { SuiteDefinition } from "../../../../domain/contracts";
import { v2StatementsSpecialDataTypesExtensionsStatementActivityEmptyExtensionsCase } from "./special-data-types/extensions-statement-activity-empty-extensions";
import { v2StatementsSpecialDataTypesExtensionsStatementActivityEmptyStringCase } from "./special-data-types/extensions-statement-activity-empty-string";
import { v2StatementsSpecialDataTypesExtensionsStatementActivityNullCase } from "./special-data-types/extensions-statement-activity-null";
import { v2StatementsSpecialDataTypesExtensionsStatementActivityEmptyObjectCase } from "./special-data-types/extensions-statement-activity-empty-object";
import { v2StatementsSpecialDataTypesExtensionsStatementResultEmptyExtensionsCase } from "./special-data-types/extensions-statement-result-empty-extensions";
import { v2StatementsSpecialDataTypesExtensionsStatementResultEmptyStringCase } from "./special-data-types/extensions-statement-result-empty-string";
import { v2StatementsSpecialDataTypesExtensionsStatementResultNullCase } from "./special-data-types/extensions-statement-result-null";
import { v2StatementsSpecialDataTypesExtensionsStatementResultEmptyObjectCase } from "./special-data-types/extensions-statement-result-empty-object";
import { v2StatementsSpecialDataTypesExtensionsStatementContextEmptyExtensionsCase } from "./special-data-types/extensions-statement-context-empty-extensions";
import { v2StatementsSpecialDataTypesExtensionsStatementContextEmptyStringCase } from "./special-data-types/extensions-statement-context-empty-string";
import { v2StatementsSpecialDataTypesExtensionsStatementContextNullCase } from "./special-data-types/extensions-statement-context-null";
import { v2StatementsSpecialDataTypesExtensionsStatementContextEmptyObjectCase } from "./special-data-types/extensions-statement-context-empty-object";
import { v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyExtensionsCase } from "./special-data-types/extensions-substatement-activity-empty-extensions";
import { v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyStringCase } from "./special-data-types/extensions-substatement-activity-empty-string";
import { v2StatementsSpecialDataTypesExtensionsSubstatementActivityNullCase } from "./special-data-types/extensions-substatement-activity-null";
import { v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyObjectCase } from "./special-data-types/extensions-substatement-activity-empty-object";
import { v2StatementsSpecialDataTypesExtensionsSubstatementResultEmptyExtensionsCase } from "./special-data-types/extensions-substatement-result-empty-extensions";
import { v2StatementsSpecialDataTypesExtensionsSubstatementResultEmptyStringCase } from "./special-data-types/extensions-substatement-result-empty-string";
import { v2StatementsSpecialDataTypesExtensionsSubstatementResultNullCase } from "./special-data-types/extensions-substatement-result-null";
import { v2StatementsSpecialDataTypesExtensionsSubstatementResultEmptyObjectCase } from "./special-data-types/extensions-substatement-result-empty-object";
import { v2StatementsSpecialDataTypesExtensionsSubstatementContextEmptyExtensionsCase } from "./special-data-types/extensions-substatement-context-empty-extensions";
import { v2StatementsSpecialDataTypesExtensionsSubstatementContextEmptyStringCase } from "./special-data-types/extensions-substatement-context-empty-string";
import { v2StatementsSpecialDataTypesExtensionsSubstatementContextNullCase } from "./special-data-types/extensions-substatement-context-null";
import { v2StatementsSpecialDataTypesExtensionsSubstatementContextEmptyObjectCase } from "./special-data-types/extensions-substatement-context-empty-object";
import { v2StatementsLanguageMapsLegacyRejectedVerbDisplayCase } from "./special-data-types/language-maps-legacy-rejected-verb-display";
import { v2StatementsLanguageMapsLegacyRejectedObjectNameCase } from "./special-data-types/language-maps-legacy-rejected-object-name";
import { v2StatementsLanguageMapsLegacyRejectedObjectDescriptionCase } from "./special-data-types/language-maps-legacy-rejected-object-description";
import { v2StatementsLanguageMapsLegacyRejectedAttachmentDisplayCase } from "./special-data-types/language-maps-legacy-rejected-attachment-display";
import { v2StatementsLanguageMapsLegacyRejectedAttachmentDescriptionCase } from "./special-data-types/language-maps-legacy-rejected-attachment-description";
import { v2StatementsLanguageMapsLegacyRejectedSubstatementVerbDisplayCase } from "./special-data-types/language-maps-legacy-rejected-substatement-verb-display";
import { v2StatementsLanguageMapsLegacyRejectedSubstatementObjectNameCase } from "./special-data-types/language-maps-legacy-rejected-substatement-object-name";
import { v2StatementsLanguageMapsLegacyRejectedSubstatementObjectDescriptionCase } from "./special-data-types/language-maps-legacy-rejected-substatement-object-description";
import { v2StatementsExtensionsLegacyInvalidKeyStatementActivityCase } from "./special-data-types/extensions-legacy-invalid-key-statement-activity";
import { v2StatementsExtensionsLegacyInvalidKeyStatementResultCase } from "./special-data-types/extensions-legacy-invalid-key-statement-result";
import { v2StatementsExtensionsLegacyInvalidKeyStatementContextCase } from "./special-data-types/extensions-legacy-invalid-key-statement-context";
import { v2StatementsExtensionsLegacyInvalidKeySubstatementActivityCase } from "./special-data-types/extensions-legacy-invalid-key-substatement-activity";
import { v2StatementsExtensionsLegacyInvalidKeySubstatementResultCase } from "./special-data-types/extensions-legacy-invalid-key-substatement-result";
import { v2StatementsExtensionsLegacyInvalidKeySubstatementContextCase } from "./special-data-types/extensions-legacy-invalid-key-substatement-context";
import { v2StatementsSpecialDataTypesTimestampMillisecondPrecisionCase } from "./special-data-types/timestamp-millisecond-precision";
import { v2StatementsSpecialDataTypesStoredMillisecondPrecisionCase } from "./special-data-types/stored-millisecond-precision";

export const v2ProofSliceStatementsSpecialDataTypesSuite = {
  "type": "suite",
  "id": "v2.proof-slice.statements.special-data-types",
  "title": "Special Data Types And Rules",
  "specVersion": "2.0.0",
  "tags": [
    "special-data-types"
  ]
,
  "children": [
    v2StatementsSpecialDataTypesExtensionsStatementActivityEmptyExtensionsCase,
    v2StatementsSpecialDataTypesExtensionsStatementActivityEmptyStringCase,
    v2StatementsSpecialDataTypesExtensionsStatementActivityNullCase,
    v2StatementsSpecialDataTypesExtensionsStatementActivityEmptyObjectCase,
    v2StatementsSpecialDataTypesExtensionsStatementResultEmptyExtensionsCase,
    v2StatementsSpecialDataTypesExtensionsStatementResultEmptyStringCase,
    v2StatementsSpecialDataTypesExtensionsStatementResultNullCase,
    v2StatementsSpecialDataTypesExtensionsStatementResultEmptyObjectCase,
    v2StatementsSpecialDataTypesExtensionsStatementContextEmptyExtensionsCase,
    v2StatementsSpecialDataTypesExtensionsStatementContextEmptyStringCase,
    v2StatementsSpecialDataTypesExtensionsStatementContextNullCase,
    v2StatementsSpecialDataTypesExtensionsStatementContextEmptyObjectCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyExtensionsCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyStringCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementActivityNullCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementActivityEmptyObjectCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementResultEmptyExtensionsCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementResultEmptyStringCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementResultNullCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementResultEmptyObjectCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementContextEmptyExtensionsCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementContextEmptyStringCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementContextNullCase,
    v2StatementsSpecialDataTypesExtensionsSubstatementContextEmptyObjectCase,
    v2StatementsLanguageMapsLegacyRejectedVerbDisplayCase,
    v2StatementsLanguageMapsLegacyRejectedObjectNameCase,
    v2StatementsLanguageMapsLegacyRejectedObjectDescriptionCase,
    v2StatementsLanguageMapsLegacyRejectedAttachmentDisplayCase,
    v2StatementsLanguageMapsLegacyRejectedAttachmentDescriptionCase,
    v2StatementsLanguageMapsLegacyRejectedSubstatementVerbDisplayCase,
    v2StatementsLanguageMapsLegacyRejectedSubstatementObjectNameCase,
    v2StatementsLanguageMapsLegacyRejectedSubstatementObjectDescriptionCase,
    v2StatementsExtensionsLegacyInvalidKeyStatementActivityCase,
    v2StatementsExtensionsLegacyInvalidKeyStatementResultCase,
    v2StatementsExtensionsLegacyInvalidKeyStatementContextCase,
    v2StatementsExtensionsLegacyInvalidKeySubstatementActivityCase,
    v2StatementsExtensionsLegacyInvalidKeySubstatementResultCase,
    v2StatementsExtensionsLegacyInvalidKeySubstatementContextCase,
    v2StatementsSpecialDataTypesTimestampMillisecondPrecisionCase,
    v2StatementsSpecialDataTypesStoredMillisecondPrecisionCase,
  ]
} as unknown as SuiteDefinition;
