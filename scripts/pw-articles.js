async (page) => {
  const posts = [
    "https://skyfall.ai/blog/introducing-sky-001",
    "https://skyfall.ai/blog/how-enterprise-world-models-lead-to-eudaimonia-and-global-prosperity",
    "https://skyfall.ai/blog/llms-are-not-continual-learners",
    "https://skyfall.ai/blog/claude-gpt-arc-agi-vs-business-failure",
    "https://skyfall.ai/blog/wow-bridging-ai-safety-gap-in-enterprises-via-world-models",
    "https://skyfall.ai/blog/scope-hierarchical-planner-55x-faster-than-llms",
    "https://skyfall.ai/blog/pioneering-steps-towards-building-world-models-for-planning-in-enterprise",
    "https://skyfall.ai/blog/building-the-foundations-of-an-ai-ceo",
  ];
  const articles = [];
  for (const url of posts) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    const article = await page.evaluate(() => {
      const main = document.querySelector("main");
      const blocks = [];
      const root = main || document.body;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      let node = walker.currentNode;
      const interesting = new Set(["H1", "H2", "H3", "H4", "P", "LI", "IMG", "BLOCKQUOTE", "FIGCAPTION", "PRE"]);
      while (node) {
        if (interesting.has(node.tagName)) {
          const nested = node.querySelector && node.querySelector("h1,h2,h3,h4,p,li,img");
          const isLeafText = node.tagName !== "IMG" && !nested;
          if (node.tagName === "IMG") {
            blocks.push({ t: "img", src: node.currentSrc || node.src, alt: node.alt || "" });
          } else if (isLeafText) {
            const text = node.innerText.replace(/\s+/g, " ").trim();
            if (text) blocks.push({ t: node.tagName.toLowerCase(), text });
          } else if (node.tagName === "P" || node.tagName.startsWith("H")) {
            const text = node.innerText.replace(/\s+/g, " ").trim();
            if (text && text.length < 4000) blocks.push({ t: node.tagName.toLowerCase(), text });
          }
        }
        node = walker.nextNode();
      }
      const dedup = [];
      const seen = new Set();
      for (const b of blocks) {
        const key = (b.t + (b.text || b.src || "")).slice(0, 180);
        if (seen.has(key)) continue;
        seen.add(key);
        dedup.push(b);
      }
      return {
        url: location.href,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || "",
        blocks: dedup.slice(0, 400),
      };
    });
    articles.push(article);
  }

  await page.goto("https://skyfall.ai/sky-001", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);
  const faq = await page.evaluate(() => {
    const items = [...document.querySelectorAll("button, summary, [role=button]")];
    return {
      text: (document.querySelector("main")?.innerText || "").slice(0, 12000),
      details: [...document.querySelectorAll("details")].map((d) => d.innerText.slice(0, 800)),
      buttons: items.map((b) => b.innerText.trim().slice(0, 120)).filter(Boolean).slice(0, 40),
    };
  });

  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/articles.json", data: { articles, faq } },
    headers: { "content-type": "application/json" },
  });
  return {
    status: res.status(),
    counts: articles.map((a) => ({ url: a.url, blocks: a.blocks.length })),
  };
}
