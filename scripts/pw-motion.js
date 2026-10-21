async (page) => {
  const width = __WIDTH__;
  const height = width < 600 ? 844 : 900;
  const path = "__PATH__";
  const origins = [["live", "https://skyfall.ai"], ["clone", "__CLONE__"]];
  const out = "docs/design-references/skyfall.ai/motion";
  const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "_");
  const introTimes = [0, 150, 300, 325, 350, 375, 400, 450, 600, 900, 1400, 2600];
  const stepTimes = [0, 120, 300, 600, 1000, 2000];
  await page.setViewportSize({ width, height });
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  const report = [];
  for (const [name, origin] of origins) {
    await page.goto(origin + path, { waitUntil: "load" });
    await page.waitForTimeout(3500);
    const before = await page.evaluate(() => performance.now());
    await page.waitForTimeout(400);
    const drift = (await page.evaluate(() => performance.now())) - before;
    let now = 0;
    const align = async () => { const phase = await page.evaluate(() => Date.now() % 16); if (phase) await page.clock.runFor(16 - phase); };
    const shoot = async (label, times) => {
      for (const t of times) {
        if (t > now) { await page.clock.runFor(t - now); now = t; }
        await page.waitForTimeout(160);
        await page.screenshot({ path: `${out}/${slug}-${width}-${label}-${String(t).padStart(4, "0")}-${name}.png`, scale: "css" });
      }
    };
    await align();
    await shoot("00intro", introTimes);
    const stops = await page.evaluate((h) => Array.from(document.querySelectorAll("main > section, main > div > section, footer")).map((el) => Math.max(0, Math.round(el.getBoundingClientRect().top + scrollY - h * 0.55))), height);
    let index = 1;
    for (const y of stops) {
      await align();
      await page.evaluate((top) => window.scrollTo(0, top), y);
      now = 0;
      await shoot(String(index).padStart(2, "0") + "at" + y, stepTimes);
      index += 1;
    }
    report.push({ name, drift, stops });
  }
  await page.clock.resume();
  return report
}
