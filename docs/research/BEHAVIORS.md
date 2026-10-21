# Skyfall AI behaviors

Source of truth: the production bundle, de-minified in `docs/research/skyfall.ai/app.pretty.js` (app code from line ~16850), `blogpage.pretty.js` (blog chunk) and `halftone.pretty.js` (WebGL field). The clone ports these components rather than re-deriving them from screenshots.

## Stack on the live site

- Vite React SPA. One page renders per document load (`wd()` reads `location.pathname` once); every internal link is a plain `<a>`, so navigation is a full page load. The clone keeps this (`SiteLink` renders `<a>`), which also lets the SKY-001 report's embed scripts bind to a fresh DOM.
- GSAP 3.15 with ScrollTrigger, SplitText and ScrambleText; `gsap.defaults({ ease: "expo.out", duration: 1 })`.
- Lenis 1.3 smooth scroll: `new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false })`, `lenis.on("scroll", ScrollTrigger.update)`, driven from `gsap.ticker` with `lagSmoothing(0)`.
- three.js / react-three-fiber for the halftone field. The clone renders the same fragment shader with raw WebGL2 and falls back to the CSS dot grid when WebGL2 is unavailable.
- `prefers-reduced-motion: reduce` disables Lenis, every GSAP reveal, the halftone render loop (one frame only) and autoplaying video.

## Global motion

- **SplitReveal** (`ol`): after `document.fonts.ready`, `SplitText` with `mask: "lines"` and `autoSplit`; lines/words/chars rise from `yPercent: 110` over 1.2s, stagger 0.09/0.04/0.015, triggered at `top 85%` once (or immediately for hero titles, with a 0.25s delay).
- **FadeUp** (`zc`): `autoAlpha 0, y 24` over 1.1s at `top 85%` once; staggered variants animate direct children that are not split headings.
- Server-rendered reveal targets are hidden with CSS until GSAP takes them over, so there is no flash before hydration. A `<noscript>` style shows them without JavaScript.
- **Scramble** (`Eu`/`Du`): nav tabs, buttons, footer links and "Read more" scramble their `[data-scramble]` label on pointer enter (hover-capable pointers only; chars `!<>-_\/[]{}=+*^?#`, 0.6s).
- **Counters** (`qu`): count up from 0 over 1.4s (`power3.out`) once the element's top crosses 90% of the viewport height.
- **Halftone field** (`Jd`/`Yd`): the WebGL scene is a lazy chunk behind `<Suspense>`, so each hero shows the CSS dot fallback first and the animated cells pop in later. Measured on skyfall.ai at 1440px, the first WebGL frame lands about 420–450ms after mount on Home and 160–290ms on SKY-001. The clone reproduces this with `revealDelay` (335ms default, 110ms on SKY-001) plus its own shader compile time.
- **Buttons**: the primary button slides a brand panel in from the left and rotates its square 180°; line buttons nudge the ↗ arrow.
- **Pixel icons** (`su`): pixels pop in randomly (0.18s each, 0.012s stagger) when a tile becomes active (hover on hover-capable devices, always on touch).
- **Video figures** (`Xd`): videos only get a `src` and play while within 200px of the viewport; they pause when they leave.
- ScrollTrigger refreshes 200ms after any body resize.

## Home

- Hero: `FadeUp` stagger 0.12 with 0.15s delay. The title is a `SplitReveal` (`immediate`, 0.25s delay) over the halftone hero field (mode 2 "cells", fade down).
- Mission: the statement's words scrub from opacity 0.16 to 1 (stagger 0.1, `scrub: 0.4`, `top 80%` → `bottom 45%`).
- Enterprise World Models: a linear `scrub: 0.3` tween drives the active step and progress rail. At ≥1024px the section is pinned (`bottom bottom-=32` for `+=110%`); at 768–1023px it scrubs between `top 70%` and `bottom 55%` without a pin; below 768px all steps are shown statically.
- The Pareto frontier (a static SVG chart in fade-ups), sector tiles ("No more AI co-pilots"), team counters and logo grids use the global reveals, counters and pixel icons.

## SKY-001

- Hero: the `[ ]` brackets slide in from ±28px (0.9s, `power3.out`, 0.45s delay) around the split title.
- Intro: words scrub to full opacity (`top 85%` → `bottom 50%`, `scrub: 0.4`). The film ring is CSS 3D: 20 cards at 18° steps, radius derived from card width, with a 36s `tilt-ring` keyframe loop.
- Contrarian points: three Canvas 2D figures run a rAF loop only while intersecting the viewport.
- Results: bar charts grow from `scaleX(0)` while their value labels count up (1.4s, `power3.out`, stagger 0.08) once the chart's top crosses 75% of the viewport, and replay when a metric tab changes. Accuracy/Speed films swap via tabs on mobile; desktop shows both side by side.
- How: the stages player advances with each stage video; the progress bar tracks `currentTime / duration` and the stage copy opens with a `grid-template-rows` transition (0.5s, expo out).
- FAQ: native `<details>`; the plus icon rotates 45° and its tile turns brand blue (0.3s).

## Navigation

- Desktop (≥1024px): fixed 56px white bar. Tabs scramble on hover; the current page tab is brand blue with the label wrapped in angle brackets (`<SKY-001>`, `<BLOG>`). Home has no current tab.
- Mobile: sticky 64px header; the hamburger morphs into an X and the full-screen menu wipes down with a `clip-path` transition (0.5s, expo out). Links are numbered `01`, `02`.
- Hash links scroll with Lenis (1.4s, 72px offset, re-checked up to three times as lazy content shifts layout).

## Dialogs

- `#partnership`, `#join-waitlist` and `#launch-video` open native `<dialog>` modals via link clicks or the URL hash; Lenis stops while a dialog is open. Clicking the backdrop or the X closes them.
- Lead dialogs have an animated dithered canvas header: two isometric cubes slide together with a pulse ring (partnership) or a conveyor of cubes with one lifted by a cursor (waitlist, `queue` scene).
- Forms validate on blur and submit (required fields, email, website, 250-word cap with a live counter) and include a honeypot. The clone simulates a successful submission locally instead of posting to Skyfall's Google Apps Script endpoint.

## Blog

- Index: split-line hero title, featured post (labelled "Featured · Latest" when it is the newest), card grid with a brand outline and image zoom on hover, newsletter section on a masked grid field.
- Article: bottom reading-progress bar, sticky table of contents with scroll spy (active heading = last one above 25% of the viewport), share buttons (copy link, LinkedIn, X), collapsible contents on mobile, newer/older links and "Keep reading". Videos inside posts play only while visible.
- `introducing-sky-001` is an embedded technical report: its HTML, stylesheet and module scripts come from `public/blog-embeds/introducing-sky-001/`.

## Verification tooling

Run against a production build (`npm run build && npm run start -- --port 3456`); `next dev` only serves its dev resources to `localhost`.

- `bash scripts/compare.sh "/,/sky-001" 1440 11` captures viewport frames of live and clone after scrolling the whole page; `python scripts/diff-frames.py home-1440` scores them and writes side-by-side heatmaps.
- `bash scripts/dom-diff.sh /sky-001 390` diffs DOM structure, copy, attributes, boxes and computed styles, including every transition and CSS animation spec.
- `bash scripts/motion.sh / 1440` freezes page time with Playwright's fake clock and films the intro plus each section's scroll-in at identical timestamps, aligned to the 16ms frame grid, so GSAP, Lenis and WebGL frames are directly comparable. CSS animations and videos still run on real time.
- `bash scripts/interact.sh` hovers and clicks the same controls on both sites and captures real-time frames after each action.
