async (page) => {
  const pages = ["https://skyfall.ai/sky-001", "https://skyfall.ai/blog", "https://skyfall.ai/sitemap.xml", "https://skyfall.ai/robots.txt"];
  const out = [];
  for (const url of pages) {
    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      text: (document.body?.innerText || "").slice(0, 15000),
      links: [...document.querySelectorAll("a")].map((a) => ({
        href: a.href,
        text: (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 140),
      })),
      images: [...document.querySelectorAll("img")].map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
      })),
      videos: [...document.querySelectorAll("video")].map((v) => ({ src: v.currentSrc || v.src, poster: v.poster })),
      h: [...document.querySelectorAll("h1,h2,h3")].map((el) => ({ tag: el.tagName, text: el.innerText.trim().slice(0, 200) })),
    }));
    out.push({ status: response ? response.status() : null, ...info });
  }
  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/subpages.json", data: out },
    headers: { "content-type": "application/json" },
  });
  return { status: res.status(), pages: out.map((p) => ({ url: p.url, title: p.title, status: p.status, headings: p.h.length })) };
}
