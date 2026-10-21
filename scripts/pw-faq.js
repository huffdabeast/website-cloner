async (page) => {
  await page.goto("https://skyfall.ai/sky-001", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const faqs = await page.evaluate(async () => {
    const buttons = [...document.querySelectorAll("details, button")].filter((el) =>
      /SKY-001|Language-based|physical object|get access|good at|else can we|further questions/i.test(el.innerText || "")
    );
    const out = [];
    for (const el of buttons) {
      el.click();
      await new Promise((r) => setTimeout(r, 200));
      const parent = el.closest("details, li, div") || el.parentElement;
      out.push((parent?.innerText || el.innerText).slice(0, 1500));
    }
    return out;
  });

  await page.goto("https://skyfall.ai/blog/introducing-sky-001", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const intro = await page.evaluate(() => ({
    text: (document.querySelector("main")?.innerText || "").slice(0, 20000),
    imgs: [...document.querySelectorAll("main img, main video")].map((el) => ({
      tag: el.tagName,
      src: el.currentSrc || el.src || el.querySelector?.("source")?.src || "",
      poster: el.poster || "",
    })),
  }));

  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/faq-intro.json", data: { faqs, intro } },
    headers: { "content-type": "application/json" },
  });
  return { status: res.status(), faqCount: faqs.length, introLen: intro.text.length };
}
