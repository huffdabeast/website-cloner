async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const targets = [
    ["https://skyfall.ai/", "live-home"],
    ["https://skyfall.ai/sky-001", "live-sky"],
    ["https://skyfall.ai/blog", "live-blog"],
    ["https://skyfall.ai/blog/llms-are-not-continual-learners", "live-article"],
    ["http://127.0.0.1:3456/", "clone-home"],
    ["http://127.0.0.1:3456/sky-001", "clone-sky"],
    ["http://127.0.0.1:3456/blog", "clone-blog"],
    ["http://127.0.0.1:3456/blog/llms-are-not-continual-learners", "clone-article"],
  ];
  const out = {};
  for (const [url, name] of targets) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const shots = [];
    for (let y = 0, i = 0; y < height && i < 16; y += 900, i += 1) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(900);
      const file = `docs/design-references/skyfall.ai/qa/${name}-${String(i).padStart(2, "0")}.png`;
      await page.screenshot({ path: file, scale: "css" });
      shots.push(file);
    }
    out[name] = { height, shots: shots.length };
  }
  return out;
}
