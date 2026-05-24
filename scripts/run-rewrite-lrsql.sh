#!/usr/bin/env bash
set -euo pipefail

XAPI_VERSION="${XAPI_VERSION:-2.0.0}"
LIVE_RUN_OUT="${LIVE_RUN_OUT:-tmp/agents/lrsql-live-run-${XAPI_VERSION}.json}"

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
LIVE_RUN_OUT="${LIVE_RUN_OUT}" XAPI_VERSION="${XAPI_VERSION}" bun run export:run:lrsql
export_exit_code=$?
set -e

LIVE_RUN_OUT="${LIVE_RUN_OUT}" bun -e 'import { readFileSync } from "node:fs";
const filePath = process.env.LIVE_RUN_OUT;
const parsed = JSON.parse(readFileSync(filePath, "utf8"));
const run = parsed?.run;
if (!run || typeof run !== "object") {
  throw new Error(`rewrite artifact missing run payload: ${filePath}`);
}
const events = Array.isArray(run.events) ? run.events.length : null;
console.log(JSON.stringify({
  mode: "rewrite-only",
  target: "lrsql",
  xapiVersion: run.version ?? process.env.XAPI_VERSION ?? null,
  artifact: filePath,
  status: run.status ?? null,
  events,
}, null, 2));'

exit "${export_exit_code}"
