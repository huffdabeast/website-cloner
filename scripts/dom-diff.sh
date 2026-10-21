#!/usr/bin/env bash
# Usage: bash scripts/dom-diff.sh /sky-001 [width=1440] [clone=http://localhost:3456]
# Diffs DOM structure, classes, copy, attributes, boxes and computed styles (incl. transitions/animations).
set -euo pipefail
path="${1:-/}"
width="${2:-1440}"
clone="${3:-http://localhost:3456}"
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
pwcli="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
code=$(sed -e "s#__WIDTH__#${width}#" -e "s#__PATH__#${path}#" -e "s#__CLONE__#${clone}#" scripts/pw-dom-diff.js | tr '\n' ' ' | tr -s ' ')
"$pwcli" open about:blank >/dev/null
"$pwcli" run-code "$code" | sed -n '/^### Result/,/^### Ran/p' | sed '1d;$d'
"$pwcli" close >/dev/null || true
