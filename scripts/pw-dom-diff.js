async (page) => {
  const width = __WIDTH__;
  const height = width < 600 ? 844 : 900;
  const path = "__PATH__";
  const origins = [["live", "https://skyfall.ai"], ["clone", "__CLONE__"]];
  const snapshot = () => {
    const skip = new Set(["SCRIPT", "STYLE", "LINK", "NOSCRIPT", "TEMPLATE", "NEXT-ROUTE-ANNOUNCER", "META", "TITLE"]);
    const props = ["color", "backgroundColor", "backgroundImage", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "textAlign", "opacity", "transform", "translate", "rotate", "scale", "borderRadius", "boxShadow", "borderTopColor", "borderTopWidth", "borderBottomWidth", "outlineColor", "transitionProperty", "transitionDuration", "transitionTimingFunction", "transitionDelay", "animationName", "animationDuration", "animationTimingFunction", "animationIterationCount", "animationDelay", "animationDirection", "clipPath", "maskImage", "filter", "backdropFilter", "mixBlendMode", "visibility", "zIndex", "position", "display", "objectFit", "cursor", "overflow", "perspective", "transformStyle", "willChange"];
    const attrNames = ["href", "src", "poster", "alt", "aria-label", "target", "type", "placeholder", "d", "viewBox", "fill", "stroke", "width", "height", "x", "y"];
    const norm = (v) => v.replace("https://dkr5ukfddrfw9.cloudfront.net/web/", "/").replace("https://skyfall.ai/", "/").replace(/^https?:\/\/localhost:\d+\//, "/");
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = 0; }
    const root = document.querySelector("main").parentElement;
    const out = {};
    const walk = (el, prefix) => {
      let i = 0;
      for (const child of el.children) {
        if (skip.has(child.tagName)) continue;
        if (el === root && child.hasAttribute("hidden")) continue;
        const key = prefix + "/" + child.tagName.toLowerCase() + i;
        i += 1;
        const cs = getComputedStyle(child);
        const r = child.getBoundingClientRect();
        const text = Array.from(child.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").replace(/\s+/g, " ").trim().slice(0, 80);
        const rec = { cls: child.getAttribute("class") || "", box: [r.x, r.y + scrollY, r.width, r.height].map((n) => Math.round(n)).join(","), text };
        for (const name of attrNames) { const v = child.getAttribute(name); if (v !== null) rec["@" + name] = norm(v); }
        for (const k of props) rec[k] = cs[k];
        out[key] = rec;
        walk(child, key);
      }
    };
    walk(root, "");
    return out;
  };
  await page.setViewportSize({ width, height });
  const snaps = {};
  for (const [name, origin] of origins) {
    await page.goto(origin + path, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 500) { await page.mouse.wheel(0, 500); await page.waitForTimeout(120); }
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    snaps[name] = await page.evaluate(snapshot);
  }
  const live = snaps.live;
  const clone = snaps.clone;
  const onlyLive = Object.keys(live).filter((k) => !(k in clone));
  const onlyClone = Object.keys(clone).filter((k) => !(k in live));
  const byField = {};
  for (const key of Object.keys(live)) {
    if (!(key in clone)) continue;
    const a = live[key];
    const b = clone[key];
    const fields = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const f of fields) {
      if (a[f] === b[f]) continue;
      if (f === "box") { const pa = String(a[f]).split(",").map(Number); const pb = String(b[f]).split(",").map(Number); if (pa.every((v, i) => Math.abs(v - pb[i]) <= 1)) continue; }
      (byField[f] = byField[f] || []).push(key + "  live=" + JSON.stringify(a[f] === undefined ? null : a[f]).slice(0, 160) + "  clone=" + JSON.stringify(b[f] === undefined ? null : b[f]).slice(0, 160));
    }
  }
  const summary = { path, width, liveCount: Object.keys(live).length, cloneCount: Object.keys(clone).length, onlyLive: onlyLive.length, onlyClone: onlyClone.length, firstOnlyLive: onlyLive.slice(0, 12), firstOnlyClone: onlyClone.slice(0, 12), fields: {} };
  for (const [f, rows] of Object.entries(byField)) summary.fields[f] = { count: rows.length, examples: rows.slice(0, 6) };
  return summary;
}
