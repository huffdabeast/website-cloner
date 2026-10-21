#!/usr/bin/env bash
# Usage: bash scripts/motion.sh /sky-001 [width=1440] [clone=http://localhost:3456]
# Freezes page time with Playwright's fake clock and films the intro plus each section's
# scroll-in at identical timestamps on live and clone, so GSAP/Lenis/WebGL frames are comparable.
set -euo pipefail
path="${1:-/}"
width="${2:-1440}"
clone="${3:-http://localhost:3456}"
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
pwcli="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
mkdir -p docs/design-references/skyfall.ai/motion
code=$(sed -e "s#__WIDTH__#${width}#" -e "s#__PATH__#${path}#" -e "s#__CLONE__#${clone}#" scripts/pw-motion.js | tr '\n' ' ' | tr -s ' ')
"$pwcli" open about:blank >/dev/null
"$pwcli" run-code "$code" | sed -n '/^### Result/,/^### Ran/p' | sed '1d;$d'
"$pwcli" close >/dev/null || true
