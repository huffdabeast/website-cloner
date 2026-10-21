async (page) => {
  await page.goto("https://skyfall.ai/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const data = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sections = [...document.querySelectorAll("main > section, main > div")];
    const colors = sections.map((el) => {
      const cs = getComputedStyle(el);
      return {
        id: el.id,
        cls: (el.className || "").toString().slice(0, 80),
        bg: cs.backgroundColor,
        color: cs.color,
      };
    });
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 700) {
      window.scrollTo(0, y);
      await sleep(80);
    }
    window.scrollTo(0, 0);
    const problem = document.querySelector("#problem");
    const team = document.querySelector("#team");
    const matters = document.querySelector("#matters");
    const pick = (root) =>
      root
        ? {
            html: root.innerText.slice(0, 8000),
            imgs: [...root.querySelectorAll("img")].map((img) => ({
              src: img.currentSrc || img.src,
              alt: img.alt,
            })),
          }
        : null;
    const buttons = [...document.querySelectorAll("button")].map((b) => ({
      text: b.innerText.trim().slice(0, 80),
      aria: b.getAttribute("aria-label"),
    }));
    const h2 = document.querySelector("h1");
    const sub = document.querySelector("#top p");
    const cta = document.querySelector("#top a");
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
        lineHeight: cs.lineHeight,
        color: cs.color,
        background: cs.backgroundColor,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        textTransform: cs.textTransform,
        fontFamily: cs.fontFamily,
      };
    };
    return {
      colors,
      problem: pick(problem),
      team: pick(team),
      matters: pick(matters),
      buttons,
      h1: styleOf(h2),
      sub: styleOf(sub),
      cta: styleOf(cta),
    };
  });
  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/home-details.json", data },
    headers: { "content-type": "application/json" },
  });
  return { status: res.status(), problem: data.problem && data.problem.html.slice(0, 200) };
}
