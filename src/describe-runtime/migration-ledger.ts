export type MigrationMode = "dual-run-compare" | "excluded" | "rewrite-active" | "upstream-oracle";

export interface MigrationLedgerUnit {
  directory: string;
  mode: MigrationMode;
  rewriteRegistrarFilePath: string | null;
  rewriteRegistrarSymbol: string | null;
  unitKey: string;
  upstreamFilePath: string;
  version: "1.0.3" | "2.0.0" | null;
}

export interface MigrationLedger {
  defaultMode: MigrationMode;
  schemaVersion: "migration-ledger.v1";
  units: readonly MigrationLedgerUnit[];
  updatedAt: string;
}

export interface MigrationUnitBinding {
  sourceFilePath: string | null;
  sourceSymbol: string | null;
  unitKey: string;
}

type UnitSpec = readonly [
  upstreamFileStem: string,
  rewriteRegistrarFilePath: string,
  rewriteRegistrarSymbol: string,
  version: "1.0.3" | "2.0.0" | null,
];

const activeRegistryModes = new Set<MigrationMode>(["dual-run-compare", "rewrite-active"]);
const observedUnitByDirectoryAndTitle = new Map<string, MigrationLedgerUnit>();

function defineUnit(
  directory: string,
  [upstreamFileStem, rewriteRegistrarFilePath, rewriteRegistrarSymbol, version]: UnitSpec,
): MigrationLedgerUnit {
  return {
    directory,
    mode: "rewrite-active",
    rewriteRegistrarFilePath,
    rewriteRegistrarSymbol,
    unitKey: upstreamFileStem,
    upstreamFilePath: `${upstreamFileStem}.js`,
    version,
  };
}

const v103UnitSpecs = [
  [
    "test/v1_0_3/Data2.2-FormattingRequirements",
    "src/specs/v1_0_3/Data2.2-FormattingRequirements.ts",
    "registerFormattingRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.3-StatementLifecycle",
    "src/specs/v1_0_3/Data2.3-StatementLifecycle.ts",
    "registerStatementLifecycleRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.1-IDProperty",
    "src/specs/v1_0_3/Data2.4.1-IDProperty.ts",
    "registerIdPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.2-ActorProperty",
    "src/specs/v1_0_3/Data2.4.2-ActorProperty.ts",
    "registerActorPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.3-VerbProperty",
    "src/specs/v1_0_3/Data2.4.3-VerbProperty.ts",
    "registerVerbPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.4-ObjectProperty",
    "src/specs/v1_0_3/Data2.4.4-ObjectProperty.ts",
    "registerObjectPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.5-ResultProperty",
    "src/specs/v1_0_3/Data2.4.5-ResultProperty.ts",
    "registerResultPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.6-ContextProperty",
    "src/specs/v1_0_3/Data2.4.6-ContextProperty.ts",
    "registerContextPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.7-TimestampProperty",
    "src/specs/v1_0_3/Data2.4.7-TimestampProperty.ts",
    "registerTimestampPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.8-StoredProperty",
    "src/specs/v1_0_3/Data2.4.8-StoredProperty.ts",
    "registerStoredPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/Data2.4.9-AuthorityProperty",
    "src/specs/v1_0_3/Data2.4.9-AuthorityProperty.ts",
    "registerAuthorityPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/E.Data2.4.10-VersionProperty",
    "src/specs/v1_0_3/E.Data2.4.10-VersionProperty.ts",
    "registerVersionPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/E.Data2.4.11-AttachmentsProperty",
    "src/specs/v1_0_3/E.Data2.4.11-AttachmentsProperty.ts",
    "registerAttachmentsPropertyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/E.Data2.5-RetrievalofStatements",
    "src/specs/v1_0_3/E.Data2.5-RetrievalofStatements.ts",
    "registerRetrievalOfStatementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/E.Data2.6-SignedStatements",
    "src/specs/v1_0_3/E.Data2.6-SignedStatements.ts",
    "registerSignedStatementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/E.Data4.0-SpecialDataTypesAndRules",
    "src/specs/v1_0_3/E.Data4.0-SpecialDataTypesAndRules.ts",
    "registerSpecialDataTypesAndRulesV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication1.1-HeadRequestImplementation",
    "src/specs/v1_0_3/H.Communication1.1-HeadRequestImplementation.ts",
    "registerHeadRequestImplementationV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication1.3-AlternateRequestSyntax",
    "src/specs/v1_0_3/H.Communication1.3-AlternateRequestSyntax.ts",
    "registerAlternateRequestSyntaxRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication1.4-Encoding",
    "src/specs/v1_0_3/H.Communication1.4-Encoding.ts",
    "registerEncodingRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication1.5-ContentTypes",
    "src/specs/v1_0_3/H.Communication1.5-ContentTypes.ts",
    "registerContentTypeRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.1-StatementResource",
    "src/specs/v1_0_3/H.Communication2.1-StatementResource.ts",
    "registerStatementResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.2-DocumentResources",
    "src/specs/v1_0_3/H.Communication2.2-DocumentResources.ts",
    "registerDocumentResourcesRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.3-StateResource",
    "src/specs/v1_0_3/H.Communication2.3-StateResource.ts",
    "registerStateResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.4-AgentsResource",
    "src/specs/v1_0_3/H.Communication2.4-AgentsResource.ts",
    "registerAgentsResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.5-ActivitiesResource",
    "src/specs/v1_0_3/H.Communication2.5-ActivitiesResource.ts",
    "registerActivitiesResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.6-AgentProfileResource",
    "src/specs/v1_0_3/H.Communication2.6-AgentProfileResource.ts",
    "registerAgentProfileResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.7-ActivityProfileResource",
    "src/specs/v1_0_3/H.Communication2.7-ActivityProfileResource.ts",
    "registerActivityProfileResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication2.8-AboutResource",
    "src/specs/v1_0_3/H.Communication2.8-AboutResource.ts",
    "registerAboutResourceRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication3.1-Concurrency",
    "src/specs/v1_0_3/H.Communication3.1-Concurrency.ts",
    "registerConcurrencyRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication3.2-ErrorCodes",
    "src/specs/v1_0_3/H.Communication3.2-ErrorCodes.ts",
    "registerErrorCodesRequirementsV103",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication3.3-Versioning",
    "src/specs/v1_0_3/H.Communication3.3-Versioning.ts",
    "registerVersioningRequirementsV103Protocol",
    "1.0.3",
  ],
  [
    "test/v1_0_3/H.Communication4.0-Authentication",
    "src/specs/v1_0_3/H.Communication4.0-Authentication.ts",
    "registerAuthenticationRequirementsV103",
    "1.0.3",
  ],
] as const satisfies readonly UnitSpec[];

const v20UnitSpecs = [
  [
    "test/v2_0/Data2.2-FormattingRequirements",
    "src/specs/v2_0/Data2.2-FormattingRequirements.ts",
    "registerFormattingRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication1.1-HeadRequestImplementation",
    "src/specs/v2_0/H.Communication1.1-HeadRequestImplementation.ts",
    "registerHeadRequestImplementationV20",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication1.2-Headers",
    "src/specs/v2_0/H.Communication1.2-Headers.ts",
    "registerHeadersRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication1.3-AlternateRequestSyntax",
    "src/specs/v2_0/H.Communication1.3-AlternateRequestSyntax.ts",
    "registerAlternateRequestSyntaxRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication1.4-Encoding",
    "src/specs/v2_0/H.Communication1.4-Encoding.ts",
    "registerEncodingRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.3-Content-Types",
    "src/specs/v2_0/4.1.3-Content-Types.ts",
    "registerContentTypeRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.4.2-ID-Requirements",
    "src/specs/v2_0/4.2.4.2-ID-Requirements.ts",
    "registerIdPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.4.2-Timestamp-Requirements",
    "src/specs/v2_0/4.2.4.2-Timestamp-Requirements.ts",
    "registerTimestampPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.4.2-Stored-Requirements",
    "src/specs/v2_0/4.2.4.2-Stored-Requirements.ts",
    "registerStoredPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.2.2-Verb-Requirements",
    "src/specs/v2_0/4.2.2.2-Verb-Requirements.ts",
    "registerVerbPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.4.3-Version-Requirements",
    "src/specs/v2_0/4.2.4.3-Version-Requirements.ts",
    "registerVersionPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.2.4-Result-Requirements",
    "src/specs/v2_0/4.2.2.4-Result-Requirements.ts",
    "registerResultPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.2.1-Actor-Requirements",
    "src/specs/v2_0/4.2.2.1-Actor-Requirements.ts",
    "registerActorPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.2.3-Object-Requirements",
    "src/specs/v2_0/4.2.2.3-Object-Requirements.ts",
    "registerObjectPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.2.5-Context-Requirements",
    "src/specs/v2_0/4.2.2.5-Context-Requirements.ts",
    "registerContextPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.4.2-Authority-Requirements",
    "src/specs/v2_0/4.2.4.2-Authority-Requirements.ts",
    "registerAuthorityPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.2.6-Attachment-Requirements",
    "src/specs/v2_0/4.2.2.6-Attachment-Requirements.ts",
    "registerAttachmentsPropertyRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.5-Statement-Voiding",
    "src/specs/v2_0/4.2.5-Statement-Voiding.ts",
    "registerStatementLifecycleRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/E.Data2.5-RetrievalofStatements",
    "src/specs/v2_0/E.Data2.5-RetrievalofStatements.ts",
    "registerRetrievalOfStatementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/E.Data2.6-SignedStatements",
    "src/specs/v2_0/E.Data2.6-SignedStatements.ts",
    "registerSignedStatementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/E.Data4.0-SpecialDataTypesAndRules",
    "src/specs/v2_0/E.Data4.0-SpecialDataTypesAndRules.ts",
    "registerSpecialDataTypesAndRulesV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.2.7-Additional-Requirements-for-Data-Types",
    "src/specs/v2_0/4.2.7-Additional-Requirements-for-Data-Types.ts",
    "registerAdditionalRequirementsForDataTypesV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.1-Statement-Resource",
    "src/specs/v2_0/4.1.6.1-Statement-Resource.ts",
    "registerStatementResourceRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication2.2-DocumentResources",
    "src/specs/v2_0/H.Communication2.2-DocumentResources.ts",
    "registerDocumentResourcesRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.2-State-Resource",
    "src/specs/v2_0/4.1.6.2-State-Resource.ts",
    "registerStateResourceRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.3-Agents-Resource",
    "src/specs/v2_0/4.1.6.3-Agents-Resource.ts",
    "registerAgentsResourceRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.4-Activity-Resource",
    "src/specs/v2_0/4.1.6.4-Activity-Resource.ts",
    "registerActivitiesResourceRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.5-Agent-Profile-Resource",
    "src/specs/v2_0/4.1.6.5-Agent-Profile-Resource.ts",
    "registerAgentProfileResourceRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.6-Activity-Profile-Resource",
    "src/specs/v2_0/4.1.6.6-Activity-Profile-Resource.ts",
    "registerActivityProfileResourceRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/4.1.6.7-About-Resource",
    "src/specs/v2_0/4.1.6.7-About-Resource.ts",
    "registerAboutResourceRequirementsV20",
    "2.0.0",
  ],
  ["test/v2_0/4.1.4-Concurrency", "src/specs/v2_0/4.1.4-Concurrency.ts", "registerConcurrencyRequirementsV20", "2.0.0"],
  [
    "test/v2_0/H.Communication3.2-ErrorCodes",
    "src/specs/v2_0/H.Communication3.2-ErrorCodes.ts",
    "registerErrorCodesRequirementsV20",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication3.3-Versioning",
    "src/specs/v2_0/H.Communication3.3-Versioning.ts",
    "registerVersioningRequirementsV20Protocol",
    "2.0.0",
  ],
  [
    "test/v2_0/H.Communication4.0-Authentication",
    "src/specs/v2_0/H.Communication4.0-Authentication.ts",
    "registerAuthenticationRequirementsV20",
    "2.0.0",
  ],
] as const satisfies readonly UnitSpec[];

const optionalUnitSpecs = [
  ["test/Multiplicity/testing", "src/specs/Multiplicity/testing.ts", "registerMultiplicityTestingSuite", null],
  ["test/Parameters/testing", "src/specs/Parameters/testing.ts", "registerParametersTestingSuite", null],
] as const satisfies readonly UnitSpec[];

export const migrationLedgerUnits = [
  ...optionalUnitSpecs.map((spec) =>
    defineUnit(spec[0].includes("Multiplicity") ? "Multiplicity" : "Parameters", spec),
  ),
  ...v103UnitSpecs.map((spec) => defineUnit("v1_0_3", spec)),
  ...v20UnitSpecs.map((spec) => defineUnit("v2_0", spec)),
] as const satisfies readonly MigrationLedgerUnit[];

export const migrationLedger = {
  defaultMode: "upstream-oracle",
  schemaVersion: "migration-ledger.v1",
  units: migrationLedgerUnits,
  updatedAt: "2026-05-27T00:00:00.000Z",
} satisfies MigrationLedger;

const unitByDirectoryAndKey = new Map(
  migrationLedgerUnits.map((unit) => [`${unit.directory}\u0000${unit.unitKey}`, unit]),
);

for (const unit of migrationLedgerUnits) {
  const existing = unitByDirectoryAndKey.get(`${unit.directory}\u0000${unit.unitKey}`);
  if (!existing || existing === unit) {
    continue;
  }

  throw new Error(`Duplicate migration ledger unit key for directory ${unit.directory}: ${unit.unitKey}`);
}

function buildObservedTitleKey(directory: string, title: string): string {
  return `${directory}\u0000${title}`;
}

export function getMigrationLedgerUnitsForDirectory(directory: string): readonly MigrationLedgerUnit[] {
  return migrationLedger.units.filter(
    (unit) => unit.directory === directory && activeRegistryModes.has(unit.mode) && unit.rewriteRegistrarSymbol,
  );
}

export function getMigrationLedgerUnitByKey(directory: string, unitKey: string): MigrationLedgerUnit | undefined {
  return unitByDirectoryAndKey.get(`${directory}\u0000${unitKey}`);
}

export function getMigrationLedgerUnitByUnitKey(unitKey: string): MigrationLedgerUnit | undefined {
  return migrationLedger.units.find((unit) => unit.unitKey === unitKey);
}

export function recordObservedMigrationUnitTitle(directory: string, title: string, unit: MigrationLedgerUnit): void {
  const key = buildObservedTitleKey(directory, title);
  const existing = observedUnitByDirectoryAndTitle.get(key);
  if (existing && existing.unitKey !== unit.unitKey) {
    throw new Error(`Observed top-level suite title collision for ${directory}: ${title}`);
  }

  observedUnitByDirectoryAndTitle.set(key, unit);
}

export function getObservedMigrationUnitByDirectoryAndTitle(
  directory: string,
  title: string,
): MigrationLedgerUnit | undefined {
  return observedUnitByDirectoryAndTitle.get(buildObservedTitleKey(directory, title));
}

export function resolveMigrationUnitBinding(directory: string, suitePath: string[]): MigrationUnitBinding {
  const topLevelSuiteTitle = suitePath[0];
  const observedUnit = topLevelSuiteTitle
    ? getObservedMigrationUnitByDirectoryAndTitle(directory, topLevelSuiteTitle)
    : undefined;
  if (observedUnit) {
    return {
      sourceFilePath: observedUnit.rewriteRegistrarFilePath,
      sourceSymbol: observedUnit.rewriteRegistrarSymbol,
      unitKey: observedUnit.unitKey,
    };
  }

  return {
    sourceFilePath: null,
    sourceSymbol: null,
    unitKey: `${directory}:${topLevelSuiteTitle ?? "unmapped"}`,
  };
}
