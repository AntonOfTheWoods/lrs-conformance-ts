import { expect, test } from "bun:test";

import {
  buildCombinedFingerprintSql,
  buildFingerprintRowJsonExpression,
  isRetryablePsqlExecFailure,
  resolvePsqlCommandOutput,
} from "../scripts/export-db-fingerprint.ts";

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

test("buildCombinedFingerprintSql batches multiple tables into one fingerprint query", () => {
  const sql = buildCombinedFingerprintSql("public", ["activity", "state_document"]);

  expect(sql).toContain("select coalesce(json_object_agg(table_name, fingerprint), '{}'::json)");
  expect(sql).toContain('from "public"."activity" t');
  expect(sql).toContain('from "public"."state_document" t');
  expect(sql).toContain("union all");
});

test("resolvePsqlCommandOutput retries transient podman exec races", async () => {
  let attempts = 0;

  const output = await resolvePsqlCommandOutput(
    async () => {
      attempts += 1;

      if (attempts < 3) {
        return {
          exitCode: 255,
          stderr: "Error: can only create exec sessions on running containers: container state improper",
          stdout: "",
        };
      }

      return {
        exitCode: 0,
        stderr: "",
        stdout: "ok\n",
      };
    },
    { maxAttempts: 3, retryDelayMs: 0 },
  );

  expect(output).toBe("ok");
  expect(attempts).toBe(3);
});

test("isRetryablePsqlExecFailure rejects non-transient failures", () => {
  expect(
    isRetryablePsqlExecFailure({
      exitCode: 1,
      stderr: "permission denied",
      stdout: "",
    }),
  ).toBe(false);
});
