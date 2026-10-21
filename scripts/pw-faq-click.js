async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("https://skyfall.ai/sky-001", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: "docs/design-references/skyfall.ai/sky-001.png", scale: "css" });

  const questions = [
    "What is SKY-001?",
    "Is SKY-001 just another Language-based model?",
    "Why are World Models better for physical object design?",
    "How do I get access to SKY-001?",
    "What is SKY-001 good at?",
    "What else can we design with SKY-001?",
    "I have further questions. How to contact the team?",
  ];
  const answers = [];
  for (const q of questions) {
    const btn = page.getByRole("button", { name: q, exact: true });
    if (await btn.count()) {
      await btn.first().click();
      await page.waitForTimeout(250);
    }
    const text = await page.evaluate((question) => {
      const buttons = [...document.querySelectorAll("button")];
      const button = buttons.find((b) => (b.innerText || "").trim() === question);
      const region = button?.closest("li, details, article, section") || button?.parentElement?.parentElement;
      return (region?.innerText || "").slice(0, 2000);
    }, q);
    answers.push(text);
  }

  await page.goto("https://skyfall.ai/blog", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: "docs/design-references/skyfall.ai/blog.png", scale: "css" });

  const h2 = await page.evaluate(() => {
    const el = document.querySelector("h1");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing, lineHeight: cs.lineHeight };
  });

  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/faq-answers.json", data: { answers, h2 } },
    headers: { "content-type": "application/json" },
  });
  return { status: res.status(), lens: answers.map((a) => a.length), h2 };
}
