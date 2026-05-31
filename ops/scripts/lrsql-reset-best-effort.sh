#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="ops/compose/lrsql/podman-compose.yml"

set +e
podman compose -f "${COMPOSE_FILE}" down -v
set -e

podman compose -f "${COMPOSE_FILE}" up -d
