#!/usr/bin/env bash
set -euo pipefail

LRSQL_PORT="${LRSQL_PORT:-8080}"
LRSQL_API_KEY="${LRSQL_API_KEY_DEFAULT:-${LRSQL_USER:-janedoe}}"
LRSQL_API_SECRET="${LRSQL_API_SECRET_DEFAULT:-${LRSQL_PASSWORD:-supersecret}}"
XAPI_VERSION="${XAPI_VERSION:-2.0.0}"
LIVE_RUN_OUT="${LIVE_RUN_OUT:-tmp/agents/lrsql-live-run-${XAPI_VERSION}.json}"

bun ./scripts/export-run.ts \
  --base-url "http://localhost:${LRSQL_PORT}/xapi" \
  --version "${XAPI_VERSION}" \
  --username "${LRSQL_API_KEY}" \
  --password "${LRSQL_API_SECRET}" \
  --out "${LIVE_RUN_OUT}"
