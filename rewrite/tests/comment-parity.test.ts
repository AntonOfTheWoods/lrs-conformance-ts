import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import type { RegistryNode } from "../../src/domain/contracts";
import { LEGACY_XAPI_COMMENT_MAP } from "../legacyCommentMap";
import { LEGACY_XAPI_DESCRIBE_MAP } from "../legacyDescribeMap";
import { resolveUpstreamPath } from "../../src/specs/migration/upstream-root";
import { createProofSliceRegistry as createV20Registry } from "../../src/specs/v2_0/proof-slice";
import { createV103ProofSliceRegistry as createV103Registry } from "../../src/specs/v1_0_3/proof-slice";

function collectCases(node: RegistryNode): Array<Extract<RegistryNode, { type: "case" }>> {
  if (node.type === "case") {
    return [node];
  }

  return node.children.flatMap((child) => collectCases(child));
}

function collectAllCases(registry: ReturnType<typeof createV20Registry | typeof createV103Registry>) {
  return [...registry.versions["2.0.0"], ...registry.versions["1.0.3"]].flatMap((suite) => collectCases(suite));
}

function extractUpstreamTexts(filePath: string) {
  const text = readFileSync(resolveUpstreamPath(filePath), "utf8");
  const comments = [...text.matchAll(/\/\*\*([\s\S]*?)\*\//g)].map((match) =>
    (match[1] ?? "")
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter(Boolean)
      .join(" "),
  );
  const describes = [...text.matchAll(/describe\('([^']+)'/g)].map((match) => match[1] ?? "").filter(Boolean);
  const its = [...text.matchAll(/it\('([^']+)'/g)].map((match) => match[1] ?? "").filter(Boolean);

  return { comments, describes, its };
}

function findBySubstring(values: string[], substring: string): string {
  const matched = values.find((value) => value.includes(substring));
  if (!matched) {
    throw new Error(`Expected upstream text containing: ${substring}`);
  }

  return matched;
}

function stripXapiLead(text: string, xapiId: string): string {
  return text.replace(new RegExp(`^${xapiId},\\s*Data\\s+[^ ]+\\s+Voiding\\s+`), "").trim();
}

function stripTrailingMetadata(text: string): string {
  return text.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function stripStatementResourceLead(text: string): string {
  return text.replace(/^XAPI-\d{5},\s*Communication\s+[^ ]+\s+GET Statements\s+/, "").trim();
}

describe("Comment Parity", () => {
  test("all cases include generated spec reference notes", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    for (const testCase of cases) {
      const specNotes = testCase.assertion.notes.filter((note) => note.startsWith("spec-ref "));
      expect(specNotes.length).toBeGreaterThanOrEqual(1);
      expect(specNotes.length).toBeGreaterThanOrEqual(testCase.requirementRefs.length);
    }
  });

  test("state acceptance and stateId rationale notes are preserved", () => {
    const v20 = createV20Registry();
    const v20Cases = collectAllCases(v20);

    const postAccepted = v20Cases.find((testCase) => testCase.id === "v2.activities-state.accepts.post");
    expect(postAccepted).toBeDefined();
    expect(postAccepted?.assertion.notes).toContain("legacy note: successful State POST returns 204 No Content");
    expect(postAccepted?.assertion.notes).toContain("legacy note: State API accepts POST requests");

    const getWithStateId = v20Cases.find((testCase) => testCase.id === "v2.activities-state.accepts.get-with-state-id");
    expect(getWithStateId).toBeDefined();
    expect(getWithStateId?.assertion.notes).toContain(
      "legacy note: no conformance requirement mandates additional since filtering behavior when GET includes a valid stateId",
    );
  });

  test("cases preserve upstream explanatory comments for mapped XAPI requirements", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    for (const testCase of cases) {
      const mappedRefs = testCase.requirementRefs.filter(
        (ref) => /^XAPI-\d{5}$/.test(ref.id) && Boolean(LEGACY_XAPI_COMMENT_MAP[ref.id]),
      );

      for (const ref of mappedRefs) {
        const expected = `legacy note: ${ref.id} upstream comment - ${LEGACY_XAPI_COMMENT_MAP[ref.id]}`;
        expect(testCase.assertion.notes).toContain(expected);
      }
    }
  });

  test("all referenced XAPI IDs are mapped to upstream explanatory text", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    const missing = new Map<string, string[]>();

    for (const testCase of cases) {
      for (const ref of testCase.requirementRefs) {
        if (!/^XAPI-\d{5}$/.test(ref.id)) {
          continue;
        }

        const hasComment = Boolean(LEGACY_XAPI_COMMENT_MAP[ref.id]);
        const describeTexts = LEGACY_XAPI_DESCRIBE_MAP[ref.id] ?? [];
        const hasDescribe = describeTexts.length > 0;

        if (hasComment || hasDescribe) {
          continue;
        }

        const ids = missing.get(ref.id) ?? [];
        ids.push(testCase.id);
        missing.set(ref.id, ids);
      }
    }

    if (missing.size > 0) {
      const message = [...missing.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([xapiId, caseIds]) => `${xapiId}: ${[...new Set(caseIds)].sort().join(", ")}`)
        .join("\n");

      throw new Error(`Missing upstream explanatory mapping (comment/describe) for XAPI IDs:\n${message}`);
    }

    expect(missing.size).toBe(0);
  });

  test("cases preserve upstream describe-level explanatory text for mapped XAPI requirements", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    for (const testCase of cases) {
      const mappedRefs = testCase.requirementRefs.filter(
        (ref) => /^XAPI-\d{5}$/.test(ref.id) && Array.isArray(LEGACY_XAPI_DESCRIBE_MAP[ref.id]),
      );

      for (const ref of mappedRefs) {
        const describeTexts = LEGACY_XAPI_DESCRIBE_MAP[ref.id] ?? [];
        for (const describeText of describeTexts) {
          const expected = `legacy note: ${ref.id} upstream describe - ${describeText}`;
          expect(testCase.assertion.notes).toContain(expected);
        }
      }
    }
  });

  test("statement-voiding upstream comments, describes, and it texts are automatically associable to rewrite cases", () => {
    const upstreamPath = "test/v2_0/4.2.5-Statement-Voiding.js";
    const upstream = extractUpstreamTexts(upstreamPath);

    const v20 = createV20Registry();
    const cases = collectAllCases(v20).filter((testCase) => testCase.legacyTrace?.suiteFile === upstreamPath);
    expect(cases.length).toBeGreaterThan(0);

    const byId = new Map(cases.map((testCase) => [testCase.id, testCase] as const));
    const notesFor = (id: string) => byId.get(id)?.assertion.notes ?? [];
    const titleFor = (id: string) => byId.get(id)?.title ?? "";

    const xapi18Comment = findBySubstring(upstream.comments, "XAPI-00018, Data 2.3.2 Voiding");
    const xapi16Comment = findBySubstring(upstream.comments, "XAPI-00016, Data 2.3.2 Voiding");
    const rejectionCasesComment = findBySubstring(upstream.comments, "4.2.4.1 LRS Rejection Cases");
    const matchupComment = findBySubstring(upstream.comments, "Matchup with Conformance Requirements Document");
    const lifecycleDescribe = findBySubstring(upstream.describes, "Statement Lifecycle Requirements (Data 2.3)");

    const referencedXapiIds = [...matchupComment.matchAll(/XAPI-\d{5}/g)].map((match) => match[0]);
    const caseRefIds = new Set(cases.flatMap((testCase) => testCase.requirementRefs.map((ref) => ref.id)));
    expect(referencedXapiIds.length).toBeGreaterThan(0);
    for (const xapiId of referencedXapiIds) {
      expect(caseRefIds.has(xapiId)).toBe(true);
    }

    expect(lifecycleDescribe).toBe("Statement Lifecycle Requirements (Data 2.3)");
    expect(cases.every((testCase) => testCase.legacyTrace?.suiteFile === upstreamPath)).toBe(true);

    const xapi18Expected = `legacy note: XAPI-00018 upstream comment - ${stripXapiLead(xapi18Comment, "XAPI-00018")}`;
    expect(notesFor("v2.statements.voiding.voided-statement-id-roundtrip")).toContain(xapi18Expected);
    expect(notesFor("v2.statements.voiding.statement-id-hides-voided")).toContain(xapi18Expected);

    const xapi16Expected = `legacy note: XAPI-00016 upstream comment - ${stripXapiLead(xapi16Comment, "XAPI-00016")}`;
    expect(notesFor("v2.statements.voiding.repeated-target-ignored")).toContain(xapi16Expected);
    expect(notesFor("v2.statements.voiding.cannot-target-voiding-statement")).toContain(xapi16Expected);

    const rejectionExpected = `legacy note: ${rejectionCasesComment}`;
    expect(notesFor("v2.statements.voiding.repeated-target-ignored")).toContain(rejectionExpected);
    expect(notesFor("v2.statements.voiding.cannot-target-voiding-statement")).toContain(rejectionExpected);

    const describeMappings: Array<{ source: string; xapiId: string; targetCaseIds: string[] }> = [
      {
        source: findBySubstring(
          upstream.describes,
          "A Voided Statement is defined as a Statement that is not a Voiding Statement",
        ),
        xapiId: "XAPI-00018",
        targetCaseIds: [
          "v2.statements.voiding.voided-statement-id-roundtrip",
          "v2.statements.voiding.statement-id-hides-voided",
        ],
      },
      {
        source: findBySubstring(upstream.describes, "A Voiding Statement cannot Target another Voiding Statement"),
        xapiId: "XAPI-00016",
        targetCaseIds: [
          "v2.statements.voiding.repeated-target-ignored",
          "v2.statements.voiding.cannot-target-voiding-statement",
        ],
      },
      {
        source: findBySubstring(
          upstream.describes,
          "An LRS SHALL NOT reject a voided statement because it cannot find the ID of the Object of that statement",
        ),
        xapiId: "XAPI-00016",
        targetCaseIds: [
          "v2.statements.voiding.repeated-target-ignored",
          "v2.statements.voiding.cannot-target-voiding-statement",
        ],
      },
    ];

    for (const mapping of describeMappings) {
      for (const caseId of mapping.targetCaseIds) {
        expect(notesFor(caseId)).toContain(
          `legacy note: ${mapping.xapiId} upstream describe - ${stripTrailingMetadata(mapping.source)}`,
        );
      }
    }

    const itToCaseTitleChecks: Array<{ source: string; caseId: string; titleNeedle: string }> = [
      {
        source: findBySubstring(upstream.its, 'Should return a voided statement when using GET "voidedStatementId"'),
        caseId: "v2.statements.voiding.voided-statement-id-roundtrip",
        titleNeedle: "queried by voidedStatementId",
      },
      {
        source: findBySubstring(upstream.its, 'Should return 404 when using GET with "statementId"'),
        caseId: "v2.statements.voiding.statement-id-hides-voided",
        titleNeedle: "does not return a voided statement when queried by statementId",
      },
      {
        source: findBySubstring(upstream.its, "Should not void an already voided statement"),
        caseId: "v2.statements.voiding.repeated-target-ignored",
        titleNeedle: "ignores a second voiding statement",
      },
      {
        source: findBySubstring(upstream.its, "Should not void a voiding statement"),
        caseId: "v2.statements.voiding.cannot-target-voiding-statement",
        titleNeedle: "does not void a voiding statement",
      },
      {
        source: findBySubstring(upstream.its, "Shall not reject a voided statement."),
        caseId: "v2.statements.voiding.missing-target-accepted",
        titleNeedle: "accepts a voiding statement whose StatementRef target is not present",
      },
    ];

    for (const check of itToCaseTitleChecks) {
      expect(check.source.length).toBeGreaterThan(0);
      expect(titleFor(check.caseId)).toContain(check.titleNeedle);
    }
  });

  test("statement-resource upstream comments, describes, and it texts are automatically associable to rewrite cases", () => {
    const upstreamPath = "test/v2_0/4.1.6.1-Statement-Resource.js";
    const upstream = extractUpstreamTexts(upstreamPath);

    const v20 = createV20Registry();
    const allV20Cases = collectAllCases(v20);
    const cases = collectAllCases(v20).filter((testCase) => testCase.legacyTrace?.suiteFile === upstreamPath);
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.every((testCase) => testCase.legacyTrace?.suiteFile === upstreamPath)).toBe(true);

    const byId = new Map(cases.map((testCase) => [testCase.id, testCase] as const));
    const byGlobalId = new Map(allV20Cases.map((testCase) => [testCase.id, testCase] as const));
    const notesFor = (id: string) => byId.get(id)?.assertion.notes ?? [];
    const titleFor = (id: string) => byId.get(id)?.title ?? "";

    const requiredXapiIds = upstream.comments
      .filter((comment) => /^XAPI-\d{5},\s*Communication/i.test(comment))
      .map((comment) => comment.match(/^(XAPI-\d{5})/)?.[1] ?? "")
      .filter(Boolean);

    const caseRefIds = new Set(cases.flatMap((testCase) => testCase.requirementRefs.map((ref) => ref.id)));
    expect(requiredXapiIds.length).toBeGreaterThan(0);
    const migratedCaseTargets: Record<string, string[]> = {
      "XAPI-00155": ["v2.statements.voiding.voided-statement-id-roundtrip"],
      "XAPI-00163": ["v2.statements.voiding.statement-id-hides-voided"],
    };

    for (const xapiId of requiredXapiIds) {
      if (caseRefIds.has(xapiId)) {
        continue;
      }

      const targetCaseIds = migratedCaseTargets[xapiId];
      if (!targetCaseIds) {
        expect(caseRefIds.has(xapiId)).toBe(true);
        continue;
      }

      for (const caseId of targetCaseIds) {
        const targetCase = byGlobalId.get(caseId);
        expect(targetCase).toBeDefined();
        expect(targetCase?.requirementRefs.some((ref) => ref.id === xapiId)).toBe(true);
        expect(targetCase?.assertion.notes).toContain(
          `legacy note: ${xapiId} upstream comment - ${LEGACY_XAPI_COMMENT_MAP[xapiId]}`,
        );
      }
    }

    const xapi00169Comment = findBySubstring(upstream.comments, "XAPI-00169, Communication 2.1.3 GET Statements");
    const xapi00172Comment = findBySubstring(upstream.comments, "XAPI-00172, Communication 2.1.3 GET Statements");

    const xapi00169Expected = `legacy note: XAPI-00169 upstream comment - ${stripStatementResourceLead(xapi00169Comment)}`;
    expect(notesFor("v2.statements.representation.format-canonical-accept-language")).toContain(xapi00169Expected);
    expect(notesFor("v2.statements.representation.collection-format-canonical")).toContain(xapi00169Expected);

    const xapi00172Expected = `legacy note: XAPI-00172 upstream comment - ${stripStatementResourceLead(xapi00172Comment)}`;
    expect(notesFor("v2.statements.representation.accept-language-ignored-without-canonical")).toContain(
      xapi00172Expected,
    );
    expect(notesFor("v2.statements.representation.format-canonical-accept-language")).toContain(xapi00172Expected);
    expect(notesFor("v2.statements.representation.collection-canonical-accept-language")).toContain(xapi00172Expected);
    expect(notesFor("v2.statements.representation.collection-accept-language-without-format")).toContain(
      xapi00172Expected,
    );

    const xapi00172Describe = findBySubstring(
      upstream.describes,
      'If the "Accept-Language" header is present as part of the GET request to the Statement API and the "format" parameter is set to "canonical"',
    );
    const xapi00172DescribeExpected = `legacy note: XAPI-00172 upstream describe - ${stripTrailingMetadata(xapi00172Describe)}`;
    expect(notesFor("v2.statements.representation.accept-language-ignored-without-canonical")).toContain(
      xapi00172DescribeExpected,
    );
    expect(notesFor("v2.statements.representation.format-canonical-accept-language")).toContain(
      xapi00172DescribeExpected,
    );
    expect(notesFor("v2.statements.representation.collection-canonical-accept-language")).toContain(
      xapi00172DescribeExpected,
    );
    expect(notesFor("v2.statements.representation.collection-accept-language-without-format")).toContain(
      xapi00172DescribeExpected,
    );

    const itToCaseTitleChecks: Array<{ source: string; caseId: string; titleNeedle: string }> = [
      {
        source: findBySubstring(upstream.its, 'should process using GET with "format" canonical (XAPI-00169)'),
        caseId: "v2.statements.representation.format-canonical-accept-language",
        titleNeedle: "applies Accept-Language when format is canonical",
      },
      {
        source: findBySubstring(upstream.its, 'should process using GET with "format" absent (XAPI-00168)'),
        caseId: "v2.statements.representation.format-absent-defaults-exact",
        titleNeedle: "returns exact statement data when format is absent",
      },
      {
        source: findBySubstring(
          upstream.its,
          "should NOT apply this data to choose the matching language in the response when format is not set",
        ),
        caseId: "v2.statements.representation.accept-language-ignored-without-canonical",
        titleNeedle: "does not apply Accept-Language when format is absent",
      },
      {
        source: findBySubstring(upstream.its, 'should return StatementResult using GET with "format"'),
        caseId: "v2.statements.query.accepts.format",
        titleNeedle: 'process GET requests with "format"',
      },
    ];

    for (const check of itToCaseTitleChecks) {
      expect(check.source.length).toBeGreaterThan(0);
      expect(titleFor(check.caseId)).toContain(check.titleNeedle);
    }
  });

  test("global requirement-to-case mapping cardinality is explicit", () => {
    const v20 = createV20Registry();
    const v103 = createV103Registry();
    const cases = collectAllCases(v20).concat(collectAllCases(v103));

    const xapiToCases = new Map<string, Set<string>>();
    const caseToXapi = new Map<string, string[]>();

    for (const testCase of cases) {
      const xapiRefs = testCase.requirementRefs.filter((ref) => /^XAPI-\d{5}$/.test(ref.id)).map((ref) => ref.id);
      caseToXapi.set(testCase.id, xapiRefs);

      for (const xapiId of xapiRefs) {
        const ids = xapiToCases.get(xapiId) ?? new Set<string>();
        ids.add(testCase.id);
        xapiToCases.set(xapiId, ids);
      }
    }

    const xapiOneToOne: string[] = [];
    const xapiOneToMany: string[] = [];

    for (const [xapiId, linkedCases] of xapiToCases.entries()) {
      if (linkedCases.size === 1) {
        xapiOneToOne.push(xapiId);
        continue;
      }

      if (linkedCases.size > 1) {
        xapiOneToMany.push(xapiId);
      }
    }

    const caseZeroToOne: string[] = [];
    const caseOneToOne: string[] = [];
    const caseManyToOne: string[] = [];

    for (const [caseId, refs] of caseToXapi.entries()) {
      if (refs.length === 0) {
        caseZeroToOne.push(caseId);
        continue;
      }

      if (refs.length === 1) {
        caseOneToOne.push(caseId);
        continue;
      }

      if (refs.length > 1) {
        caseManyToOne.push(caseId);
      }
    }

    // Cardinality transparency checks: both split and merged mappings must be representable.
    expect(xapiToCases.size).toBeGreaterThan(0);
    expect(xapiOneToMany.length).toBeGreaterThan(0);
    expect(caseManyToOne.length).toBeGreaterThan(0);

    // Stable spot checks proving non-1:1 mappings in this registry.
    expect(xapiToCases.get("XAPI-00169")?.size ?? 0).toBeGreaterThanOrEqual(2);
    expect(caseToXapi.get("v2.statements.representation.format-canonical-accept-language") ?? []).toEqual(
      expect.arrayContaining(["XAPI-00169", "XAPI-00172"]),
    );

    const profile = {
      xapiTotal: xapiToCases.size,
      xapiOneToOne: xapiOneToOne.length,
      xapiOneToMany: xapiOneToMany.length,
      caseTotal: caseToXapi.size,
      caseZeroToOne: caseZeroToOne.length,
      caseOneToOne: caseOneToOne.length,
      caseManyToOne: caseManyToOne.length,
    };

    expect(profile.xapiOneToOne + profile.xapiOneToMany).toBe(profile.xapiTotal);
    expect(profile.caseZeroToOne + profile.caseOneToOne + profile.caseManyToOne).toBe(profile.caseTotal);
  });
});
