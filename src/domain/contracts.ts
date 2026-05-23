import { z } from "zod";

export const SpecVersionSchema = z.enum(["2.0.0", "1.0.3"]);
export type SpecVersion = z.infer<typeof SpecVersionSchema>;

export const EndpointKindSchema = z.enum([
  "about",
  "activities",
  "activities-profile",
  "activities-state",
  "agents",
  "agents-profile",
  "statements",
]);
export type EndpointKind = z.infer<typeof EndpointKindSchema>;

export const HttpMethodSchema = z.enum(["GET", "POST", "PUT", "DELETE"]);
export type HttpMethod = z.infer<typeof HttpMethodSchema>;

export const AuthModeSchema = z.enum(["none", "basic", "oauth1"]);
export type AuthMode = z.infer<typeof AuthModeSchema>;

export const RequirementRefSchema = z
  .object({
    id: z.string().min(1),
    section: z.string().min(1),
    title: z.string().min(1).optional(),
    legacyRef: z.string().min(1).optional(),
  })
  .strict();
export type RequirementRef = z.infer<typeof RequirementRefSchema>;

export const LegacyTraceSchema = z
  .object({
    suiteFile: z.string().min(1),
    configFile: z.string().min(1).optional(),
    referenceKey: z.string().min(1).optional(),
  })
  .strict();
export type LegacyTrace = z.infer<typeof LegacyTraceSchema>;

export const FixtureRefSchema = z
  .object({
    version: SpecVersionSchema,
    domain: z.string().min(1),
    name: z.string().min(1),
  })
  .strict();
export type FixtureRef = z.infer<typeof FixtureRefSchema>;

export const RequestBodySchema = z
  .object({
    kind: z.literal("json"),
    value: z.unknown(),
    sourceFixture: FixtureRefSchema.optional(),
  })
  .strict();
export type RequestBody = z.infer<typeof RequestBodySchema>;

export const HeaderExpectationSchema = z
  .object({
    key: z.string().min(1),
    equals: z.string().min(1),
  })
  .strict();
export type HeaderExpectation = z.infer<typeof HeaderExpectationSchema>;

export const JsonPathExpectationSchema = z
  .object({
    path: z.array(z.string().min(1)).min(0),
    equals: z.unknown(),
  })
  .strict();
export type JsonPathExpectation = z.infer<typeof JsonPathExpectationSchema>;

export const RequestAssertionSchema = z
  .object({
    status: z.number().int().min(100).max(599),
    expectedHeaders: z.array(HeaderExpectationSchema).default([]),
    jsonPathEquals: z.array(JsonPathExpectationSchema).default([]),
  })
  .strict();
export type RequestAssertion = z.infer<typeof RequestAssertionSchema>;

export const HttpRequestSchema = z
  .object({
    method: HttpMethodSchema,
    endpoint: EndpointKindSchema,
    authMode: AuthModeSchema.default("none"),
    headers: z.record(z.string(), z.string()).default({}),
    query: z.record(z.string(), z.string()).default({}),
    body: RequestBodySchema.optional(),
  })
  .strict();
export type HttpRequest = z.infer<typeof HttpRequestSchema>;

export const PollingPlanSchema = z
  .object({
    strategy: z.enum(["consistent-through", "fixed-interval"]),
    maxAttempts: z.number().int().positive(),
    intervalMs: z.number().int().positive(),
  })
  .strict();
export type PollingPlan = z.infer<typeof PollingPlanSchema>;

export const ExecutionPlanSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("single-request"),
      request: HttpRequestSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("submit-and-query"),
      submit: HttpRequestSchema,
      query: HttpRequestSchema,
      polling: PollingPlanSchema.optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("request-sequence"),
      steps: z.array(HttpRequestSchema).min(1),
    })
    .strict(),
]);
export type ExecutionPlan = z.infer<typeof ExecutionPlanSchema>;

export const AssertionPlanSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("single-request"),
      status: z.number().int().min(100).max(599),
      expectedHeaders: z.array(HeaderExpectationSchema).default([]),
      jsonPathEquals: z.array(JsonPathExpectationSchema).default([]),
      notes: z.array(z.string()).default([]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("submit-and-query"),
      submitStatus: z.number().int().min(100).max(599),
      queryStatus: z.number().int().min(100).max(599),
      expectedHeaders: z.array(HeaderExpectationSchema).default([]),
      queryJsonPathEquals: z.array(JsonPathExpectationSchema).default([]),
      notes: z.array(z.string()).default([]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("request-sequence"),
      steps: z.array(RequestAssertionSchema).min(1),
      notes: z.array(z.string()).default([]),
    })
    .strict(),
]);
export type AssertionPlan = z.infer<typeof AssertionPlanSchema>;

export const CaseDefinitionSchema = z
  .object({
    type: z.literal("case"),
    id: z.string().min(1),
    title: z.string().min(1),
    specVersion: SpecVersionSchema,
    requirementRefs: z.array(RequirementRefSchema).min(1),
    tags: z.array(z.string().min(1)).default([]),
    capabilityFlags: z.array(z.string().min(1)).default([]),
    legacyTrace: LegacyTraceSchema.optional(),
    execution: ExecutionPlanSchema,
    assertion: AssertionPlanSchema,
  })
  .strict();
export type CaseDefinition = z.infer<typeof CaseDefinitionSchema>;

export interface SuiteDefinition {
  type: "suite";
  id: string;
  title: string;
  specVersion: SpecVersion;
  tags: string[];
  children: RegistryNode[];
}

export type RegistryNode = SuiteDefinition | CaseDefinition;

export const SuiteDefinitionSchema: z.ZodType<SuiteDefinition> = z.lazy(() =>
  z
    .object({
      type: z.literal("suite"),
      id: z.string().min(1),
      title: z.string().min(1),
      specVersion: SpecVersionSchema,
      tags: z.array(z.string().min(1)).default([]),
      children: z.array(RegistryNodeSchema).min(1),
    })
    .strict(),
);

export const RegistryNodeSchema: z.ZodType<RegistryNode> = z.lazy(() =>
  z.union([SuiteDefinitionSchema, CaseDefinitionSchema]),
);

export const VersionedSuitesSchema = z
  .object({
    "2.0.0": z.array(SuiteDefinitionSchema).default([]),
    "1.0.3": z.array(SuiteDefinitionSchema).default([]),
  })
  .strict();
export type VersionedSuites = z.infer<typeof VersionedSuitesSchema>;

export const RegistryDefinitionSchema = z
  .object({
    versions: VersionedSuitesSchema,
  })
  .strict();
export type RegistryDefinition = z.infer<typeof RegistryDefinitionSchema>;

export const ManifestVersionSummarySchema = z
  .object({
    suiteCount: z.number().int().nonnegative(),
    caseCount: z.number().int().nonnegative(),
    caseIds: z.array(z.string().min(1)),
  })
  .strict();
export type ManifestVersionSummary = z.infer<typeof ManifestVersionSummarySchema>;

export const RegistryManifestSchema = z
  .object({
    versions: z.object({
      "2.0.0": ManifestVersionSummarySchema,
      "1.0.3": ManifestVersionSummarySchema,
    }),
  })
  .strict();
export type RegistryManifest = z.infer<typeof RegistryManifestSchema>;

export interface BatteriesNode {
  text: string;
  children: BatteriesNode[];
}

export const BatteriesNodeSchema: z.ZodType<BatteriesNode> = z.lazy(() =>
  z
    .object({
      text: z.string(),
      children: z.array(BatteriesNodeSchema),
    })
    .strict(),
);

export const BatteriesVersionArtifactSchema = z
  .object({
    conformanceTestCount: z.number().int().nonnegative(),
    tests: BatteriesNodeSchema,
  })
  .strict();
export type BatteriesVersionArtifact = z.infer<typeof BatteriesVersionArtifactSchema>;

export const BatteriesArtifactSchema = z
  .object({
    "2.0.0": BatteriesVersionArtifactSchema.optional(),
    "1.0.3": BatteriesVersionArtifactSchema.optional(),
  })
  .strict();
export type BatteriesArtifact = z.infer<typeof BatteriesArtifactSchema>;

export const ExecutionEventSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("run-start"), version: SpecVersionSchema }).strict(),
  z
    .object({
      kind: z.literal("suite-start"),
      version: SpecVersionSchema,
      suiteId: z.string().min(1),
      title: z.string().min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal("case-start"),
      version: SpecVersionSchema,
      caseId: z.string().min(1),
      title: z.string().min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal("case-finish"),
      version: SpecVersionSchema,
      caseId: z.string().min(1),
      status: z.enum(["passed", "failed", "skipped", "cancelled"]),
    })
    .strict(),
  z.object({ kind: z.literal("run-finish"), version: SpecVersionSchema }).strict(),
]);
export type ExecutionEvent = z.infer<typeof ExecutionEventSchema>;

export const CaseResultSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    status: z.enum(["passed", "failed", "skipped", "cancelled"]),
    log: z.array(z.string()).default([]),
  })
  .strict();
export type CaseResult = z.infer<typeof CaseResultSchema>;

export interface SuiteResult {
  id: string;
  title: string;
  status: "passed" | "failed" | "skipped" | "cancelled";
  children: Array<SuiteResult | CaseResult>;
  log: string[];
}

export const SuiteResultSchema: z.ZodType<SuiteResult> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      title: z.string().min(1),
      status: z.enum(["passed", "failed", "skipped", "cancelled"]),
      children: z.array(z.union([SuiteResultSchema, CaseResultSchema])),
      log: z.array(z.string()).default([]),
    })
    .strict(),
);

export type JsonObject = Record<string, unknown>;
