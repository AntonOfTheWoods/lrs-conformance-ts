#!/usr/bin/env bash
set -euo pipefail

XAPI_VERSION="${XAPI_VERSION:-2.0.0}"
UPSTREAM_RUN_OUT="${UPSTREAM_RUN_OUT:-tmp/agents/upstream-run-${XAPI_VERSION}.json}"

if [[ "${XAPI_VERSION}" == "1.0.3" ]]; then
  export LRSQL_SUPPORTED_VERSIONS="1.0.3"
  export LRSQL_ENABLE_STRICT_VERSION="true"
else
  export LRSQL_SUPPORTED_VERSIONS="1.0.3,2.0.0"
  export LRSQL_ENABLE_STRICT_VERSION="false"
fi

bun run lrsql:reset:best-effort
bun run lrsql:wait
bun run lrsql:auth:check >/dev/null
bun run lrsql:wait
UPSTREAM_RUN_OUT="${UPSTREAM_RUN_OUT}" XAPI_VERSION="${XAPI_VERSION}" bun run export:upstream:lrsql

UPSTREAM_RUN_OUT="${UPSTREAM_RUN_OUT}" bun -e 'import { readFileSync } from "node:fs";
const filePath = process.env.UPSTREAM_RUN_OUT;
const parsed = JSON.parse(readFileSync(filePath, "utf8"));
const summary = parsed?.summary;
if (!summary || typeof summary.total !== "number" || summary.total <= 0) {
  throw new Error(`upstream artifact has invalid summary.total: ${filePath}`);
}
console.log(JSON.stringify({
  mode: "upstream-only",
  target: "lrsql",
  xapiVersion: process.env.XAPI_VERSION ?? null,
  artifact: filePath,
  total: summary.total,
  passed: summary.passed ?? null,
  failed: summary.failed ?? null,
  version: summary.version ?? null,
}, null, 2));'
