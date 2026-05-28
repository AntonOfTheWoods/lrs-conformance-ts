import { expect, test } from "bun:test";

import { buildFingerprintRowJsonExpression } from "../scripts/export-db-fingerprint.ts";

test("buildFingerprintRowJsonExpression normalizes decoded document contents for profile and state tables", () => {
  const expression = buildFingerprintRowJsonExpression("activity_profile_document");

  expect(expression).toContain("jsonb_set(");
  expect(expression).toContain("encode(t.contents, 'escape')");
  expect(expression).toContain("<uuid>");
  expect(expression).toContain("<isoTimestamp>");
});

test("buildFingerprintRowJsonExpression leaves non-document tables on the generic row JSON path", () => {
  expect(buildFingerprintRowJsonExpression("xapi_statement")).toBe("to_jsonb(t)");
});
