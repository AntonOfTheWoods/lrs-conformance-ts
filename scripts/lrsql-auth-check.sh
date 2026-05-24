#!/usr/bin/env bash
set -euo pipefail

LRSQL_PORT="${LRSQL_PORT:-8080}"
LRSQL_API_KEY="${LRSQL_API_KEY_DEFAULT:-${LRSQL_USER:-janedoe}}"
LRSQL_API_SECRET="${LRSQL_API_SECRET_DEFAULT:-${LRSQL_PASSWORD:-supersecret}}"
XAPI_VERSION="${XAPI_VERSION:-2.0.0}"

curl -sS -u "${LRSQL_API_KEY}:${LRSQL_API_SECRET}" \
  -H "X-Experience-API-Version: ${XAPI_VERSION}" \
  "http://localhost:${LRSQL_PORT}/xapi/about"
