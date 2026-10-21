// Pretty-prints a summary written by scripts/dom-diff.sh.
import { readFileSync } from "node:fs";
const summary = JSON.parse(readFileSync(process.argv[2], "utf8"));
const { fields, ...rest } = summary;
console.log(JSON.stringify(rest));
for (const [field, value] of Object.entries(fields)) {
  console.log(`\n## ${field} (${value.count})\n${value.examples.join("\n")}`);
}
