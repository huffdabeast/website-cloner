import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const files = [
  ["https://skyfall.ai/favicon.svg", "public/seo/favicon.svg"],
  ["https://skyfall.ai/assets/Geist-Variable-Bj2R_7yk.woff2", "public/fonts/Geist-Variable.woff2"],
  ["https://skyfall.ai/assets/GeistMono-Variable-Dispecij.woff2", "public/fonts/GeistMono-Variable.woff2"],
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

const queue = [...files];
const results = [];
async function worker() {
  while (queue.length) {
    const [url, dest] = queue.shift();
    try {
      const bytes = await download(url, dest);
      results.push({ dest, bytes });
    } catch (err) {
      results.push({ dest, error: String(err) });
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
console.log(results.map((r) => (r.error ? `FAIL ${r.dest} ${r.error}` : `OK ${r.bytes} ${r.dest}`)).join("\n"));
