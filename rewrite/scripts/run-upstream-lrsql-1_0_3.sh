#!/usr/bin/env bash
set -euo pipefail

XAPI_VERSION="1.0.3" bun run rewrite:run:upstream:lrsql
