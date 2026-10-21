async (page) => {
  await page.goto("https://skyfall.ai/blog/introducing-sky-001", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const text = await page.evaluate(() => document.querySelector("main")?.innerText || "");
  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/intro.txt", data: text },
    headers: { "content-type": "application/json" },
  });
  return { status: res.status(), len: text.length, end: text.slice(-180) };
}
