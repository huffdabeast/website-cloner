async (page) => {
  const origins = [["live", "https://skyfall.ai"], ["clone", "__CLONE__"]];
  const out = "docs/design-references/skyfall.ai/interact";
  const scenarios = [
    { name: "nav-tab-hover", width: 1440, path: "/", action: "hover", target: (p) => p.locator('nav[aria-label="Main"] a[href="/sky-001"]'), clip: "viewport-top", times: [60, 250, 800] },
    { name: "hero-primary-hover", width: 1440, path: "/", action: "hover", target: (p) => p.locator("section#top a").nth(0), times: [60, 160, 320, 900] },
    { name: "hero-line-hover", width: 1440, path: "/", action: "hover", target: (p) => p.locator("section#top a").nth(1), times: [60, 160, 320, 900] },
    { name: "tile-hover", width: 1440, path: "/", action: "hover", target: (p) => p.getByText("Simulate cause and effect", { exact: true }), pad: 120, times: [1400] },
    { name: "footer-link-hover", width: 1440, path: "/", action: "hover", target: (p) => p.locator('footer a[href="/blog"]').first(), pad: 40, times: [120, 900] },
    { name: "faq-click", width: 1440, path: "/sky-001", action: "click", target: (p) => p.locator("details > summary").first(), pad: 160, times: [60, 200, 600] },
    { name: "tab-click", width: 390, path: "/sky-001", action: "click", target: (p) => p.locator('[role="tab"][aria-selected="false"]:visible').first(), clip: "viewport", times: [60, 300, 900, 1800] },
    { name: "blog-card-hover", width: 1440, path: "/blog", action: "hover", target: (p) => p.locator('main a[href^="/blog/"]:visible').nth(2), pad: 24, times: [100, 300, 900] },
    { name: "mobile-menu-open", width: 390, path: "/", action: "click", target: (p) => p.locator('button[aria-label="Open menu"]'), clip: "viewport", times: [40, 150, 300, 700] },
  ];
  const report = [];
  for (const s of scenarios) {
    const height = s.width < 600 ? 844 : 900;
    await page.setViewportSize({ width: s.width, height });
    for (const [name, origin] of origins) {
      await page.mouse.move(2, height - 2);
      await page.goto(origin + s.path, { waitUntil: "load" });
      await page.waitForTimeout(2200);
      const target = s.target(page);
      await target.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, 1));
      await page.waitForTimeout(1800);
      const box = await target.boundingBox();
      let clip = { x: 0, y: 0, width: s.width, height };
      if (s.clip === "viewport-top") clip = { x: 0, y: 0, width: s.width, height: 120 };
      else if (s.clip !== "viewport" && box) {
        const pad = s.pad ?? 16;
        const x = Math.max(0, Math.floor(box.x - pad));
        const y = Math.max(0, Math.floor(box.y - pad));
        clip = { x, y, width: Math.min(s.width - x, Math.ceil(box.width + pad * 2)), height: Math.min(height - y, Math.ceil(box.height + pad * 2)) };
      }
      if (s.action === "hover") await target.hover(); else await target.click();
      const start = Date.now();
      for (const t of s.times) {
        const wait = t - (Date.now() - start);
        if (wait > 0) await page.waitForTimeout(wait);
        await page.screenshot({ path: `${out}/${s.name}-${String(t).padStart(4, "0")}-${name}.png`, clip, scale: "css" });
      }
      report.push(s.name + " " + name + " box " + (box ? [box.x, box.y, box.width, box.height].map(Math.round).join(",") : "none"));
    }
  }
  return report
}
