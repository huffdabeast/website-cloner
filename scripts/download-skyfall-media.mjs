#!/usr/bin/env node
// Mirrors the skyfall.ai media the clone uses into public/, keeping the CDN paths:
//   1. site media (logos, team photos, showcase, section videos)
//   2. blog media referenced by docs/research/skyfall.ai/posts-source.json
//   3. the introducing-sky-001 interactive embed, crawled through its HTML, CSS, JS and JSON.
//      Absolute CDN / skyfall.ai URLs are rewritten to root-relative /blog-embeds/... paths and
//      the embed HTML is written to src/content/embeds/introducing-sky-001.ts.
// Binary files already present with the remote size are skipped; --force re-downloads them.
//
// Usage: node scripts/download-skyfall-media.mjs [--force]

import { createWriteStream, existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC = join(ROOT, "public");
const RESEARCH = join(ROOT, "docs/research/skyfall.ai");
const EMBED_MODULE = join(ROOT, "src/content/embeds/introducing-sky-001.ts");

const CDN = "https://dkr5ukfddrfw9.cloudfront.net/web/";
const SITE = "https://skyfall.ai/";
const SLUG = "introducing-sky-001";
const EMBED = `${SITE}blog-embeds/${SLUG}/`;
const PAGE = `${SITE}blog/${SLUG}`;
const CHUNKS = {
  heroHtml: `${SITE}assets/hero-Bli4awmL.js`,
  articleHtml: `${SITE}assets/article-D6mnIEDb.js`,
};

const FORCE = process.argv.includes("--force");
const CONCURRENCY = 6;
const LARGE_FILE = 60 * 2 ** 20;
const USER_AGENT = "Mozilla/5.0 (compatible; skyfall-clone-mirror/1.0)";

// No embed script reads these keys; the detailed meshes they point at weigh ~38 MB.
const SKIP_JSON_KEYS = new Set(["detailMeta"]);

const SITE_MEDIA = [
  "assets/logos/{amii.png,microsoft.png,mila.svg,university-of-toronto.png,vector-institute.png,ycombinator.png}",
  "assets/logos/investors/{fidelity.png,inovia-capital.png,m13.png,touring-capital.png}",
  "assets/media/{bim-accuracy,bim-speed,cad-accuracy,cad-speed,launch-video}.mp4",
  "assets/media/s-{bim-accuracy,bim-speed,cad-accuracy,cad-speed,launch-video,stage-construct,stage-decompose,stage-explore,stage-sketch}.jpg",
  "assets/media/stage-{construct,decompose,explore,sketch}.mp4",
  "assets/showcase/img/in_{arcmate,jaguar,jet,tractor}.webp",
  "assets/showcase/reel/{arcmate,jaguar,jet,tractor}.mp4",
  "assets/showcase/seq/{arcmate,jaguar,jet,tractor}_{final,poster}.webp",
  "assets/team/{kaheer-suleman,sam-pasupalak,sumit-pasupalak}.jpg",
].flatMap(expand);

const TEXT = /\.(?:m?js|css|json|svg)$/i;
const ASSET =
  /\.(?:m?js|css|json|svg|png|jpe?g|webp|avif|gif|mp4|webm|glb|gltf|bin|gz|hdr|ktx2|wasm|woff2?|ttf|otf)$/i;
const EMBED_URL =
  /https:\/\/dkr5ukfddrfw9\.cloudfront\.net\/web\/blog-embeds\/[^\s"'`()<>\\$]+|https:\/\/skyfall\.ai\/blog-embeds\/[^\s"'`()<>\\$]+|(?<=["'`(=,\s])\/blog-embeds\/[^\s"'`()<>\\$]+/g;
const EMBED_PREFIX = /^(?:https:\/\/dkr5ukfddrfw9\.cloudfront\.net\/web\/|https:\/\/skyfall\.ai\/|\/)blog-embeds\//;
const IMPORT = /\b(?:from|import)\s*\(?\s*(["'])((?:\.{1,2})?\/[^"'\s]+?\.m?js)\1/g;
const BLOG_MEDIA = /(?<=["'(=,\s])blog-(?:media|embeds)\/[^\s"'()<>]+/g;

const jobs = new Map();
const queue = [];
const warnings = [];
const skippedRefs = [];
let embedHtmlSource = "";

class HttpError extends Error {
  constructor(url, status, type) {
    super(`HTTP ${status}${type ? ` (${type})` : ""} ${url}`);
    this.status = status;
  }
}

function expand(pattern) {
  const group = pattern.match(/\{([^{}]*)\}/);
  if (!group) return [pattern];
  return group[1].split(",").flatMap((part) => expand(pattern.replace(group[0], part)));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeEntities = (value) =>
  value.replace(/&(amp|quot|#39|lt|gt);/g, (_, name) => ({ amp: "&", quot: '"', "#39": "'", lt: "<", gt: ">" })[name]);

const localize = (text) =>
  [`${CDN}blog-embeds/`, `${SITE}blog-embeds/`].reduce((out, prefix) => out.replaceAll(prefix, "/blog-embeds/"), text);

const resolveRef = (ref, base) => new URL(ref, ref.startsWith("/") ? PAGE : base).href;

const isAsset = (url) => ASSET.test(new URL(url).pathname);

function mirrorPath(url) {
  const clean = url.replace(/[?#].*$/, "");
  const base = [CDN, SITE].find((prefix) => clean.startsWith(prefix));
  return base ? decodeURIComponent(clean.slice(base.length)) : null;
}

function add(url, { text = false, optional = false, from = "" } = {}) {
  const rel = mirrorPath(url);
  if (!rel) {
    warnings.push(`not mirrorable: ${url} (from ${from})`);
    return;
  }
  const existing = jobs.get(rel);
  if (existing) {
    if (existing.url !== url) warnings.push(`same path from two hosts, kept ${existing.url} over ${url}`);
    existing.optional &&= optional;
    return;
  }
  const job = { url, rel, text, optional, from };
  jobs.set(rel, job);
  queue.push(job);
}

const addEmbed = (url, from, optional = false) => add(url, { text: TEXT.test(new URL(url).pathname), optional, from });

async function retry(task, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      const permanent = error instanceof HttpError && error.status !== 429 && error.status < 500;
      if (permanent || attempt === attempts) throw error;
      await sleep(1000 * 2 ** (attempt - 1));
    }
  }
}

async function request(url, { method = "GET", binary = true } = {}) {
  const res = await fetch(url, {
    method,
    headers: { "user-agent": USER_AGENT, ...(binary ? { "accept-encoding": "identity" } : {}) },
    signal: AbortSignal.timeout(10 * 60_000),
  });
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200 || type.startsWith("text/html")) {
    await res.body?.cancel();
    throw new HttpError(url, res.status, type);
  }
  return res;
}

const fetchText = (url) => retry(async () => (await request(url, { binary: false })).text());

async function replaceFile(from, to) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await rename(from, to);
    } catch (error) {
      if (attempt === 5 || !["EPERM", "EBUSY", "EACCES"].includes(error.code)) throw error;
      await sleep(250 * attempt);
    }
  }
}

async function writeIfChanged(file, content) {
  const current = await readFile(file, "utf8").catch(() => null);
  if (current === content) return false;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
  return true;
}

async function downloadTo(url, dest) {
  const res = await request(url);
  const expected = Number(res.headers.get("content-length")) || 0;
  const part = `${dest}.part`;
  await mkdir(dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(res.body), createWriteStream(part));
  const { size } = await stat(part);
  if (expected && size !== expected) {
    await rm(part, { force: true });
    throw new Error(`truncated ${url}: ${size} of ${expected} bytes`);
  }
  await replaceFile(part, dest);
  return size;
}

async function mirrorBinary(job) {
  const dest = join(PUBLIC, job.rel);
  const local = await stat(dest).catch(() => null);
  if (local && !FORCE) {
    const head = await retry(() => request(job.url, { method: "HEAD" }));
    if (Number(head.headers.get("content-length")) === local.size) return { status: "skipped", bytes: local.size };
  }
  return { status: "downloaded", bytes: await retry(() => downloadTo(job.url, dest)) };
}

async function mirrorText(job) {
  const output = scanText(job, await fetchText(job.url));
  const changed = await writeIfChanged(join(PUBLIC, job.rel), output);
  return { status: changed ? "downloaded" : "unchanged", bytes: Buffer.byteLength(output) };
}

async function run(job) {
  try {
    Object.assign(job, job.text ? await mirrorText(job) : await mirrorBinary(job));
  } catch (error) {
    const missing = job.optional && error instanceof HttpError && [403, 404].includes(error.status);
    Object.assign(job, { status: missing ? "missing" : "failed", error: error.message });
  }
}

function drain() {
  let active = 0;
  return new Promise((resolve) => {
    const pump = () => {
      while (active < CONCURRENCY && queue.length) {
        active++;
        run(queue.shift()).finally(() => {
          active--;
          pump();
        });
      }
      if (!active && !queue.length) resolve();
    };
    pump();
  });
}

function embedUrls(text, base) {
  return [...text.matchAll(EMBED_URL)].map(([ref]) => resolveRef(ref, base)).filter(isAsset);
}

function scanText(job, text) {
  if (/\.json$/i.test(job.rel)) return scanJson(job, text);
  const refs = embedUrls(text, job.url);
  if (/\.m?js$/i.test(job.rel)) {
    for (const [, , spec] of text.matchAll(IMPORT)) refs.push(resolveRef(spec, job.url));
    for (const [call] of text.matchAll(/\bfetch\(\s*["'`](?!https?:|\/|\$)[^"'`]+/g))
      warnings.push(`relative fetch in ${job.rel}: ${call}`);
    if (job.rel.endsWith("/hero.js")) for (const url of heroTemplateUrls(text)) addEmbed(url, job.rel, true);
    if (job.rel.endsWith("/jaguar-stages.js"))
      for (const { url, optional } of jaguarStageUrls(text, embedHtmlSource)) addEmbed(url, job.rel, optional);
  }
  if (/\.css$/i.test(job.rel)) {
    for (const [, , ref] of text.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/g))
      if (!/^(?:data:|#)/.test(ref)) refs.push(resolveRef(ref, job.url));
    for (const [, ref] of text.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/g)) refs.push(resolveRef(ref, job.url));
  }
  for (const url of refs) addEmbed(url, job.rel);
  return localize(text);
}

function scanJson(job, text) {
  const mirrored = new Set();
  const walk = (value, key) => {
    if (SKIP_JSON_KEYS.has(key)) {
      skippedRefs.push(`${job.rel} → ${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === "string") {
      if (EMBED_PREFIX.test(value)) {
        const url = resolveRef(value, PAGE);
        if (isAsset(url)) {
          addEmbed(url, job.rel);
          mirrored.add(value);
        }
      } else if (/^[\w./-]+\.(?:json|glb|gz|bin|webp|png|jpe?g|mp4|svg|hdr)$/i.test(value)) {
        warnings.push(`relative asset path in ${job.rel}: ${value}`);
      }
    } else if (Array.isArray(value)) {
      for (const item of value) walk(item, key);
    } else if (value && typeof value === "object") {
      for (const [childKey, child] of Object.entries(value)) walk(child, childKey);
    }
  };
  walk(JSON.parse(text));
  let output = text;
  for (const value of mirrored) output = output.replaceAll(JSON.stringify(value), JSON.stringify(localize(value)));
  JSON.parse(output);
  return output;
}

// hero.js assembles its reel and intro URLs from templates like `${HERO}/explode/${id}.mp4`.
function heroTemplateUrls(source) {
  const hero = source.match(/const HERO="([^"]+)"/)?.[1];
  const ids = (name) =>
    [...(source.match(new RegExp(`const ${name}=\\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/\bid:"([^"]+)"/g)].map(
      ([, id]) => id,
    );
  const floor = source.match(/`([^`$]*\/floor-buildout\/)\$\{id\}\.mp4`/)?.[1];
  const cad = ids("CH");
  const bim = ids("BIM");
  if (!hero || !floor || !cad.length || !bim.length) throw new Error("hero.js changed shape; update heroTemplateUrls()");
  return [
    ...cad.map((id) => `${hero}/seq/${id}_f087.webp`),
    ...cad.flatMap((id) => [
      `${hero}/explode/${id}.mp4`,
      `${hero}/explode/${id}_poster.webp`,
      `${hero}/compact/explode/${id}.mp4`,
      `${hero}/grid/${id}.mp4`,
      `${hero}/grid/${id}_poster.webp`,
      `${hero}/grid/${id}_sketch_poster.webp`,
      `${hero}/compact/grid/${id}.mp4`,
    ]),
    ...bim.flatMap((id) => [`${floor}${id}.mp4`, `${floor}${id}_poster.webp`]),
  ];
}

// jaguar-stages.js reads file names from each figure's data-* attributes and joins them onto data-base.
function jaguarStageUrls(source, html) {
  const fallbackBase = source.match(/const BASE="([^"]+)"/)?.[1];
  const figures = [...html.matchAll(/<figure\b[^>]*\bdata-jaguar-stage="[^"]*"[^>]*>/g)];
  return figures.flatMap((figure, index) => {
    const attrs = Object.fromEntries(
      [...figure[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, decodeEntities(value)]),
    );
    const segment = html.slice(figure.index, figures[index + 1]?.index ?? html.length);
    const file = (name, optional = false, base = attrs["data-base"] || fallbackBase) => ({
      url: new URL(name, base).href,
      optional,
    });
    switch (attrs["data-jaguar-stage"]) {
      case "seg":
        return [
          file(attrs["data-tree"] || "gt_tree.json"),
          file(attrs["data-glb"] || "gt_tree.glb"),
          ...(attrs["data-raw"] ? [file(attrs["data-raw"])] : []),
          ...(attrs["data-voxels"]
            ? [file(attrs["data-voxels"]), file(attrs["data-voxels"].replace(/\.json$/, ".bin"))]
            : []),
          ...(attrs["data-whole-colors"] ? [file(attrs["data-whole-colors"])] : []),
        ];
      case "part":
        return [...segment.matchAll(/\bdata-example="([^"]+)"/g)].map(([, id]) => file(`ex_${id}.glb`));
      case "result":
        return [
          file("jaguar_stages.json", false, fallbackBase),
          file("leaves_refined.glb", false, fallbackBase),
          file("xpart.glb", true, fallbackBase),
        ];
      default:
        warnings.push(`unknown data-jaguar-stage="${attrs["data-jaguar-stage"]}"`);
        return [];
    }
  });
}

function isPlainTemplate(body) {
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "\\") i++;
    else if (body[i] === "`" || (body[i] === "$" && body[i + 1] === "{")) return false;
  }
  return true;
}

async function loadHtmlChunk(url) {
  const source = await fetchText(url);
  const literal = source.match(/^var (\w+)=`([\s\S]*)`;export\{\1 as default\};?\s*$/);
  if (!literal || !isPlainTemplate(literal[2])) throw new Error(`${url} is not a plain template-literal chunk`);
  const { default: html } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
  if (typeof html !== "string") throw new Error(`${url} has no string default export`);
  return html;
}

function glbExternalUris(file) {
  let buffer = Buffer.from(file);
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) buffer = gunzipSync(buffer);
  if (buffer.toString("latin1", 0, 4) !== "glTF") return [];
  const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));
  return [...(gltf.buffers ?? []), ...(gltf.images ?? [])]
    .map((entry) => entry.uri)
    .filter((uri) => uri && !uri.startsWith("data:"));
}

const mb = (bytes) => `${(bytes / 2 ** 20).toFixed(2)} MB`;

const posts = JSON.parse(await readFile(join(RESEARCH, "posts-source.json"), "utf8"));

for (const path of SITE_MEDIA) add(CDN + path, { from: "site media" });

for (const post of posts) {
  const paths = [post.hero, post.thumb, ...[...post.html.matchAll(BLOG_MEDIA)].map(([path]) => decodeEntities(path))];
  for (const path of paths) add(new URL(path, CDN).href, { from: post.slug });
}

const embedPost = posts.find((post) => post.slug === SLUG);
if (!embedPost?.embed) throw new Error(`posts-source.json has no embed for ${SLUG}`);

const embedHtml = {};
for (const [name, url] of Object.entries(CHUNKS)) embedHtml[name] = await loadHtmlChunk(url);
embedHtmlSource = `${embedHtml.heroHtml}\n${embedHtml.articleHtml}`;

for (const file of [...embedPost.embed.styles, ...embedPost.embed.modules, ...embedPost.embed.scripts])
  addEmbed(new URL(file, EMBED).href, "posts-source.json embed");
for (const url of embedUrls(embedHtmlSource, PAGE)) addEmbed(url, "embed html");
for (const [, attr, value] of embedHtmlSource.matchAll(/\s(src|srcset|poster|href|data-src|data-config)="([^"]*)"/g))
  if (value && !/^(?:https?:|\/|#|data:|mailto:)/.test(value)) warnings.push(`relative ${attr} in embed html: ${value}`);

await writeIfChanged(
  EMBED_MODULE,
  [
    "// Generated by scripts/download-skyfall-media.mjs — do not edit.",
    `export const heroHtml: string = ${JSON.stringify(localize(embedHtml.heroHtml))};`,
    "",
    `export const articleHtml: string = ${JSON.stringify(localize(embedHtml.articleHtml))};`,
    "",
  ].join("\n"),
);

await drain();

const all = [...jobs.values()].sort((a, b) => a.rel.localeCompare(b.rel));
const ok = all.filter((job) => ["downloaded", "unchanged", "skipped"].includes(job.status));

const leftovers = [];
const dangling = [];
for (const job of ok.filter((entry) => entry.text)) {
  const text = await readFile(join(PUBLIC, job.rel), "utf8");
  for (const [url] of text.matchAll(/https:\/\/(?:dkr5ukfddrfw9\.cloudfront\.net|skyfall\.ai)\/[^\s"'`)<>\\]*/g))
    leftovers.push(`${job.rel}: ${url}`);
  for (const [ref] of text.matchAll(EMBED_URL))
    if (ref.startsWith("/") && ASSET.test(ref) && !existsSync(join(PUBLIC, decodeURIComponent(ref))))
      dangling.push(`${job.rel}: ${ref}`);
}
const moduleSource = await readFile(EMBED_MODULE, "utf8");
for (const [url] of moduleSource.matchAll(/https:\/\/(?:dkr5ukfddrfw9\.cloudfront\.net|skyfall\.ai)\/[^\s"'`)<>\\]*/g))
  leftovers.push(`src/content/embeds/introducing-sky-001.ts: ${url}`);
for (const [ref] of moduleSource.matchAll(EMBED_URL))
  if (ASSET.test(ref) && !existsSync(join(PUBLIC, decodeURIComponent(ref))))
    dangling.push(`src/content/embeds/introducing-sky-001.ts: ${ref}`);

for (const job of ok.filter((entry) => /\.glb(?:\.gz)?$/i.test(entry.rel))) {
  const uris = glbExternalUris(await readFile(join(PUBLIC, job.rel)));
  if (uris.length) warnings.push(`${job.rel} references external files: ${uris.join(", ")}`);
}

const folders = new Map();
for (const job of ok) {
  const parts = job.rel.split("/");
  const folder = parts.slice(0, Math.min(parts.length - 1, 4)).join("/");
  const entry = folders.get(folder) ?? { files: 0, bytes: 0 };
  entry.files++;
  entry.bytes += job.bytes;
  folders.set(folder, entry);
}

console.log("\nFolder summary (public/):");
for (const [folder, { files, bytes }] of [...folders].sort(([a], [b]) => a.localeCompare(b)))
  console.log(`  ${folder.padEnd(60)} ${String(files).padStart(4)} files  ${mb(bytes).padStart(10)}`);
const counts = Object.groupBy(all, (job) => job.status);
console.log(
  `\nTotal: ${ok.length} files, ${mb(ok.reduce((sum, job) => sum + job.bytes, 0))} — ` +
    Object.entries(counts)
      .map(([status, list]) => `${status} ${list.length}`)
      .join(", "),
);
for (const job of counts.failed ?? []) console.log(`FAILED  ${job.rel}: ${job.error}`);
for (const job of counts.missing ?? []) console.log(`MISSING ON ORIGIN (optional)  ${job.rel}: ${job.error}`);
for (const job of ok.filter((entry) => entry.bytes > LARGE_FILE)) console.log(`LARGE  ${job.rel}: ${mb(job.bytes)}`);
for (const line of skippedRefs) console.log(`NOT MIRRORED (unused key)  ${line}`);
for (const line of leftovers) console.log(`ABSOLUTE URL LEFT  ${line}`);
for (const line of dangling) console.log(`DANGLING LOCAL REF  ${line}`);
for (const line of warnings) console.log(`WARN  ${line}`);

await writeFile(
  join(RESEARCH, "media-manifest.json"),
  `${JSON.stringify(
    all.map(({ rel, url, status, bytes, optional, error }) => ({
      path: `public/${rel}`,
      url,
      status,
      bytes,
      ...(optional && { optional }),
      ...(error && { error }),
    })),
    null,
    2,
  )}\n`,
);

if (counts.failed?.length) process.exitCode = 1;
