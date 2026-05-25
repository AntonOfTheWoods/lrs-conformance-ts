#!/usr/bin/env bash
set -euo pipefail

LRSQL_PORT="${LRSQL_PORT:-8080}"
LRSQL_API_KEY="${LRSQL_API_KEY_DEFAULT:-${LRSQL_USER:-janedoe}}"
LRSQL_API_SECRET="${LRSQL_API_SECRET_DEFAULT:-${LRSQL_PASSWORD:-supersecret}}"
XAPI_VERSION="${XAPI_VERSION:-2.0.0}"
UPSTREAM_RUN_OUT="${UPSTREAM_RUN_OUT:-tmp/agents/upstream-run-${XAPI_VERSION}.json}"
UPSTREAM_REPO_URL="${UPSTREAM_REPO_URL:-https://github.com/adlnet/lrs-conformance-test-suite.git}"
UPSTREAM_REF="${UPSTREAM_REF:-5bc232d349c60faded8240da698f195106091638}"
UPSTREAM_CLONE_DEPTH="${UPSTREAM_CLONE_DEPTH:-1}"
UPSTREAM_CLONE_BASE_DIR="${UPSTREAM_CLONE_BASE_DIR:-tmp/agents/upstream-clones}"

bun ./rewrite/scripts/export-upstream-run.ts \
  --base-url "http://localhost:${LRSQL_PORT}/xapi" \
  --username "${LRSQL_API_KEY}" \
  --password "${LRSQL_API_SECRET}" \
  --version "${XAPI_VERSION}" \
  --out "${UPSTREAM_RUN_OUT}" \
  --upstream-repo-url "${UPSTREAM_REPO_URL}" \
  --upstream-ref "${UPSTREAM_REF}" \
  --clone-depth "${UPSTREAM_CLONE_DEPTH}" \
  --clone-base-dir "${UPSTREAM_CLONE_BASE_DIR}"
