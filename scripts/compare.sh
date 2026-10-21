#!/usr/bin/env bash
# Usage: bash scripts/compare.sh "/blog,/sky-001" [width=1440] [frames=4] [clone=http://localhost:3457]
# Use localhost, not 127.0.0.1: `next dev` blocks its dev resources for other origins.
set -euo pipefail
pages="${1:-/}"
width="${2:-1440}"
frames="${3:-4}"
clone="${4:-http://localhost:3457}"
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
pwcli="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
mkdir -p docs/design-references/skyfall.ai/compare
code=$(sed -e "s#__WIDTH__#${width}#" -e "s#__PAGES__#${pages}#" -e "s#__FRAMES__#${frames}#" -e "s#__CLONE__#${clone}#" scripts/pw-compare.js | tr '\n' ' ' | tr -s ' ')
"$pwcli" open about:blank >/dev/null
"$pwcli" run-code "$code"
"$pwcli" close >/dev/null || true
