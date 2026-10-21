async (page) => {
  const data = await page.evaluate(() => {
    const links = [...document.querySelectorAll("a")].map((a) => ({
      href: a.href,
      text: (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 160),
    }));
    const images = [...document.querySelectorAll("img")].map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }));
    const videos = [...document.querySelectorAll("video, source")].map((v) => ({
      tag: v.tagName,
      src: v.src || "",
      poster: v.poster || null,
    }));
    const bg = [];
    for (const el of document.querySelectorAll("*")) {
      const b = getComputedStyle(el).backgroundImage;
      if (b && b !== "none") {
        bg.push({
          tag: el.tagName,
          cls: (el.className || "").toString().slice(0, 100),
          bg: b.slice(0, 400),
        });
        if (bg.length > 50) break;
      }
    }
    const bodyCs = getComputedStyle(document.body);
    const h1 = document.querySelector("h1");
    const h1Cs = h1 ? getComputedStyle(h1) : null;
    const nav = document.querySelector("nav");
    const navCs = nav ? getComputedStyle(nav) : null;
    return {
      url: location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || "",
      scrollHeight: document.documentElement.scrollHeight,
      innerWidth: window.innerWidth,
      text: document.body.innerText.slice(0, 20000),
      links,
      images,
      videos,
      canvasCount: document.querySelectorAll("canvas").length,
      svgCount: document.querySelectorAll("svg").length,
      bg,
      fontLinks: [...document.querySelectorAll("link")].map((l) => ({
        rel: l.rel,
        href: l.href,
      })),
      styleSheets: [...document.styleSheets].map((s) => s.href).filter(Boolean),
      body: {
        fontFamily: bodyCs.fontFamily,
        fontSize: bodyCs.fontSize,
        color: bodyCs.color,
        backgroundColor: bodyCs.backgroundColor,
        lineHeight: bodyCs.lineHeight,
      },
      h1: h1Cs
        ? {
            fontFamily: h1Cs.fontFamily,
            fontSize: h1Cs.fontSize,
            fontWeight: h1Cs.fontWeight,
            letterSpacing: h1Cs.letterSpacing,
            lineHeight: h1Cs.lineHeight,
            color: h1Cs.color,
            textTransform: h1Cs.textTransform,
            text: h1.innerText,
          }
        : null,
      nav: navCs
        ? {
            position: navCs.position,
            height: navCs.height,
            backgroundColor: navCs.backgroundColor,
            borderBottom: navCs.borderBottom,
            zIndex: navCs.zIndex,
            backdropFilter: navCs.backdropFilter,
            boxShadow: navCs.boxShadow,
          }
        : null,
      mainChildren: [...document.querySelectorAll("main > *")].map((el, i) => ({
        i,
        tag: el.tagName,
        id: el.id,
        cls: (el.className || "").toString().slice(0, 180),
        h: Math.round(el.getBoundingClientRect().height),
        text: (el.innerText || "").trim().slice(0, 500),
      })),
    };
  });

  const res = await page.request.post("http://127.0.0.1:9876/", {
    data: { path: "docs/research/skyfall.ai/home-extract.json", data },
    headers: { "content-type": "application/json" },
  });
  return { status: res.status(), body: await res.text() };
}
