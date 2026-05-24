#!/usr/bin/env bash
set -euo pipefail

XAPI_VERSION="2.0.0" bun run run:rewrite:lrsql
