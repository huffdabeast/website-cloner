async (page) => {
  const out = "docs/design-references/skyfall.ai/compare";
  const width = __WIDTH__;
  const height = width < 600 ? 844 : 900;
  const pages = "__PAGES__".split(",");
  const frames = __FRAMES__;
  const origins = [
    ["live", "https://skyfall.ai"],
    ["clone", "__CLONE__"],
  ];
  await page.setViewportSize({ width, height });
  const report = [];
  for (const path of pages) {
    for (const [name, origin] of origins) {
      await page.goto(origin + path, { waitUntil: "load" });
      await page.waitForTimeout(2500);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += 500) {
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(1200);
      const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "_");
      for (let i = 0; i < frames; i++) {
        await page.evaluate((top) => window.scrollTo(0, top), i * height);
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${out}/${slug}-${width}-${i}-${name}.png`, scale: "css" });
      }
      report.push({ name, path, total });
    }
  }
  return report
}
