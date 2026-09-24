#!/usr/bin/env bash
# Root wrapper for scripts/deploy.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "${SCRIPT_DIR}/scripts/deploy.sh" "$@"
