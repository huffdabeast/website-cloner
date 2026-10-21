async (page) => {
  const out = "docs/design-references/skyfall.ai/compare";
  const width = __WIDTH__;
  await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
  const origins = [["live", "https://skyfall.ai"], ["clone", "__CLONE__"]];
  const result = [];
  for (const [name, origin] of origins) {
    for (const hash of ["#partnership", "#join-waitlist", "#launch-video"]) {
      await page.goto(origin + "/blog" + hash, { waitUntil: "load" });
      await page.waitForTimeout(2600);
      const open = await page.evaluate(() => [...document.querySelectorAll("dialog")].filter((d) => d.open).length);
      await page.screenshot({ path: `${out}/dialog${hash.replace("#", "-")}-${width}-${name}.png`, scale: "css" });
      if (hash === "#partnership") {
        await page.locator("dialog[open] button[type=submit]").click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${out}/dialog-errors-${width}-${name}.png`, scale: "css" });
      }
      result.push({ name, hash, open });
    }
  }
  return result
}
