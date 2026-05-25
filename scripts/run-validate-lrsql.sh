#!/usr/bin/env bash
set -euo pipefail

XAPI_VERSION="${XAPI_VERSION:-2.0.0}"
VALIDATE_RUN_OUT="${VALIDATE_RUN_OUT:-tmp/agents/validate-run-${XAPI_VERSION}.json}"

if [[ "${XAPI_VERSION}" == "1.0.3" ]]; then
  export LRSQL_SUPPORTED_VERSIONS="1.0.3"
  export LRSQL_ENABLE_STRICT_VERSION="true"
else
  export LRSQL_SUPPORTED_VERSIONS="1.0.3,2.0.0"
  export LRSQL_ENABLE_STRICT_VERSION="false"
fi

bun run lrsql:reset:best-effort
XAPI_VERSION="${XAPI_VERSION}" bun run lrsql:wait
XAPI_VERSION="${XAPI_VERSION}" bun run lrsql:auth:check >/dev/null
XAPI_VERSION="${XAPI_VERSION}" bun run lrsql:wait
set +e
VALIDATE_RUN_OUT="${VALIDATE_RUN_OUT}" XAPI_VERSION="${XAPI_VERSION}" bash ./scripts/export-validate-lrsql.sh
export_exit_code=$?
set -e

VALIDATE_RUN_OUT="${VALIDATE_RUN_OUT}" bun -e 'import { readFileSync } from "node:fs";
const filePath = process.env.VALIDATE_RUN_OUT;
const parsed = JSON.parse(readFileSync(filePath, "utf8"));
const run = parsed?.run;
if (!run || typeof run !== "object") {
  throw new Error(`validation artifact missing run payload: ${filePath}`);
}
const events = Array.isArray(run.events) ? run.events.length : null;
console.log(JSON.stringify({
  mode: "validation",
  target: "lrsql",
  xapiVersion: run.version ?? process.env.XAPI_VERSION ?? null,
  artifact: filePath,
  status: run.status ?? null,
  events,
}, null, 2));'

exit "${export_exit_code}"