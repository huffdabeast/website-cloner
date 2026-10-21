#!/usr/bin/env bash
# Usage: bash scripts/interact.sh [clone=http://localhost:3456]
# Hovers/clicks the same elements on live and clone and captures real-time frames after each action.
set -euo pipefail
clone="${1:-http://localhost:3456}"
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
pwcli="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
mkdir -p docs/design-references/skyfall.ai/interact
code=$(sed -e "s#__CLONE__#${clone}#" scripts/pw-interact.js | tr '\n' ' ' | tr -s ' ')
"$pwcli" open about:blank >/dev/null
"$pwcli" run-code "$code" | sed -n '/^### Result/,/^### Ran/p' | sed '1d;$d'
"$pwcli" close >/dev/null || true
