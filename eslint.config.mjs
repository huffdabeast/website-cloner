import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party bundles: the original site's scripts and the mirrored blog embeds.
    "docs/research/**",
    "public/**",
  ]),
  {
    // Playwright `run-code` snippets are a bare `async (page) => {}` expression by design.
    files: ["scripts/pw-*.js"],
    rules: { "@typescript-eslint/no-unused-expressions": "off" },
  },
]);

export default eslintConfig;
