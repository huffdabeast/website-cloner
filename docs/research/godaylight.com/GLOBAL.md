# Daylight (godaylight.com) — Global Spec

## Tech / libraries
- Next.js (App Router), Tailwind CSS v4, Lenis smooth scroll (`.lenis` present, `window.Lenis`).
- No GSAP. Scroll animations are custom + likely Framer Motion / Motion One. Frame-scrub via `<canvas>`.
- Mux-hosted video present (network section background).

## Fonts (from brand kit `docs/brand-kit/Fonts/`)
- **Aeonik Pro** (sans) — body, UI, labels. `font-sans`. CSS var family `aeonikPro`. Weights: regular(400), medium(500), bold(700) + italics.
- **Feature Deck** (serif display) — big headlines ("Your home's new energy system", "How Daylight works for you"). CSS var `featureDeck`. Regular only.
- **ABC Social Mono** (mono) — eyebrows/labels ("SOLAR + BATTERY", "01 — SCOPE"), footer links. CSS var `socialMono`. Regular + Bold. Uppercase, letter-spaced.

## Colors (resolved from computed styles)
- `beige` (page bg): #FFF7E9  (rgb 255,247,233)
- `beige-20`: #F7EED9
- `blue-dark`: #1D3E86
- `orange`: #F66F00  (CTA buttons, footer bg, accent text)
- `yellow` (loader + cards bg): #FCCC3C
- `brown`: #4C2806  (text-brown, dark section gradients)
- `black`: #111111 / pure #000
- `grey-txt`: #1C1C1C (used with /50 /70 /38 opacities for muted text)
- `white`: #FFFFFF

## Tailwind custom tokens to register (globals.css @theme)
bg-beige, bg-beige-20, bg-blue-dark, bg-white, text-beige, text-black, text-brown, text-grey-txt, text-orange, text-white, border-black/08.

## Load screen (REQUIRED animation)
- Full-screen overlay, bg = yellow #FCCC3C, z-index ~2147483646 (max), `position:fixed`.
- Centered: animated **sun symbol** (left) + **"Daylight" wordmark** that reveals letter-by-letter (mask/clip wipe left→right). Symbol color = white/beige (#FFF7E9 tint).
- After load (~1.5–2s) overlay fades/slides out revealing page; nav pill slides/fades in.
- Implementation: client component, fixed overlay, animate width-clip on wordmark + sun draw, then fade opacity + unmount. Use the brand `symbol-white.svg` + the full `logo-white.svg` OR render "Daylight" text in Feature Deck.

## Nav (sticky, all pages)
- Floating white **pill** centered near top, rounded-full, subtle shadow, slight margin from top.
- Left: Daylight logo (symbol + wordmark, black) `logo-black.svg` / `logo-main`.
- Center links (Aeonik): Product, Partners, About, Brand.
- Right: orange **"Get started"** button (rounded, white text, #F66F00).
- Stays fixed/sticky over all sections (visible on dark + light bg). Possibly gains shadow on scroll.

## Footer (all pages)
- bg = orange #F66F00 with subtle noise/texture + faint diagonal streaks.
- Left: large white **"Daylight" wordmark** (logo-white).
- Center: vertical link list in ABC Social Mono, bracketed + uppercase: `[ BRAND KIT ]`, `[ CAREERS ]`, `[ TERMS OF SERVICE ]`, `[ PRIVACY POLICY ]`, `[ STATE LICENSES ]`, `[ SUPPORT ]` (and likely `[ PRODUCT ]`, `[ PARTNERS ]` above, cut off).
- Right: white serif/large text "More Power".
- Bottom-left: social links (mono): `X`, `LINKEDIN`, `INSTAGRAM`.

## Global behaviors
- Lenis smooth scroll on whole page (install `lenis`, wrap in provider).
- Section scroll-reveal (fade-up) on most content blocks.
- Sticky/pinned horizontal scroll on "Daylight Explained" cards (Product).
- Canvas frame-scrub + Mux video on "Daylight Network" (Product).
- Parallax sunrise on "Getting Started" (Product).
