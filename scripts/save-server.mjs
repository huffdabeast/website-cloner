import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";

const root = process.cwd();
const port = 9876;
const allowedDirs = ["docs", "public"].map((dir) => resolve(root, dir) + sep);

createServer((req, res) => {
  // Requiring a JSON content type makes browsers preflight cross-origin requests, which this
  // server never approves, so only non-browser clients (Playwright's `page.request`) can write.
  if (req.method !== "POST" || !String(req.headers["content-type"]).startsWith("application/json")) {
    res.writeHead(404);
    res.end();
    return;
  }
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const dest = resolve(root, String(body.path || ""));
      if (!allowedDirs.some((dir) => dest.startsWith(dir))) {
        throw new Error("bad path " + body.path);
      }
      mkdirSync(dirname(dest), { recursive: true });
      const payload = typeof body.data === "string" ? body.data : JSON.stringify(body.data, null, 2);
      writeFileSync(dest, payload);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, bytes: payload.length }));
    } catch (err) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(err) }));
    }
  });
}).listen(port, "127.0.0.1");
