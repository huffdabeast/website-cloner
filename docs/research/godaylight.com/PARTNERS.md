# Partners page (/partners) — Topology, Content, Behaviors

Page bg = beige #FFF7E9. Sections in `<main>`:

## 0. Hero  (min-h-screen, h~1263)
- Full-bleed photo `/partners-hero-v2.jpg` (white colonial home + pool at golden hour). Subtle dark overlay.
- Eyebrow (mono, dark): `FOR SOLAR INSTALLERS`
- Headline (Feature Deck, dark/black, huge): `The only PPA with` / `a battery included`
- Sub (Aeonik): `The most closeable offer in solar. Battery included, $0 down, faster commission payouts.`
- Button: `Partner with us` (dark/black bg, white text, rounded).
- Right overlay: a **blue (#1D3E86) gradient swatch panel** + floating stat cards (`kWh generated 8.2kWh – 9.5kWh`, `Backup stored`, `Thermostat 68°F`). Same hero pattern as Product but blue swatch instead of yellow. Stat cards animate in.

## 1. The Daylight Difference  (`py-48 lg:flex lg:min-h-svh lg:items-center`, h~1263)
- bg beige. Two-column: LEFT = sticky orange (#F66F00) gradient card with subtle diagonal texture; pill eyebrow `THE DAYLIGHT DIFFERENCE` (lighter orange pill), title (Feature Deck, white) `Why partners choose Daylight` (stacked words), sub (white) `Close faster with a battery included, get paid on time, and let us handle equipment costs.`
- RIGHT = 3 stacked rows (beige-20 cards, rounded), each: huge serif number (`01`/`02`/`03`, Feature Deck, orange-tinted), mono eyebrow, bold title, desc:
  1. `CLOSE FASTER` — **A deal designed to sell** — "Unlike competitors who make storage a complicated negotiation, Daylight keeps it simple: every install includes a battery, full stop."
  2. `GET PAID SOONER` — **Stop waiting 4 months for your commission** — "We pay the majority of your commission within 10 days of installation and approval."
  3. `EASIER OPERATIONS` — **Back office, handled** — "Daylight acts as your operations team. We handle procurement, compliance, and filings — and our partner portal gives you real-time tracking for every project."
- Rows likely scroll-reveal (fade/slide up, staggered).

## 2. How we compare  (`py-48 lg:py-80`, h~1550)
- bg beige. Eyebrow (mono): `HOW WE COMPARE`. Title (Feature Deck): `Not all PPAs are built the same`. Sub: `Same roof, different deal.`
- Two large side-by-side panels (rounded):
  - LEFT (beige-20): eyebrow `THE OLD WAY`, title (Feature Deck) `Typical PPAs`, list items each = value (bold) + mono label below: "$50–$100/mo add-on" `BATTERY COST`, "Price jumps stall deals" `SALES FRICTION`, "60–120 day wait for M2" `PARTNER PAYOUT`, "Usually your problem" `PROCUREMENT`.
  - RIGHT (orange #F66F00 gradient + texture): eyebrow pill `THE DAYLIGHT WAY`, title (Feature Deck, white) `Built different`, list (white): "$0 — Standard on every install" `BATTERY COST`, "Storage is the hook — converts as-is" `SALES FRICTION`, "Faster commission payouts" `PARTNER PAYOUT`, "Handled by Daylight" `PROCUREMENT`.
- Below: a row-by-row comparison strip on beige; each row spans full width, left = old (grey/strikethrough feel), right = Daylight (orange text). Rows by label:
  - BATTERY COST: "Add-on" | "$0"
  - SALES FRICTION: "Price objections stall the deal" | "BATTERY CLOSES THE DEAL"
  - PARTNER PAYOUT: "M2 held 60–120 days" | "FASTER COMMISSION PAYOUTS"
  - PROCUREMENT: "Figure it out yourself" | "WE HANDLE PROCUREMENT"
  - TOTAL ADVANTAGE: (blank) | **Daylight wins.** (Feature Deck, orange, large)
- The left "old way" values appear struck-through; right values likely animate/highlight on scroll-reveal.

## 3. The Offer  (div, h~1263)
- LEFT half = yellow (#FCCC3C). Headline (Feature Deck, brown/dark): `20% instant savings.` / `$0 down. Battery backup standard.` Sub: `That's the Daylight pitch. That's why it closes.` Checklist (› bullets, 2 cols): • $0 battery included • No down payment • Up to 40% savings • Backup power day one.
- RIGHT half = solar-panel close-up photo (`/partners` solar roof image) with a **yellow swatch block overlay** (layered composition — photo + yellow rectangle, possibly scroll-parallax reveal). 

## 4. Partner with us — CTA + Partner Form  (`pt-48 pb-48 lg:pt-100 lg:pb-60`, h~1030)
- bg blue-dark #1D3E86. LEFT: eyebrow (mono, light) `PARTNER WITH US`, title (Feature Deck, white) `Step into Daylight`, sub (white) `Join the network of partners closing faster, earning more, and building better businesses.`
- RIGHT: cream form card. Sections w/ mono headings:
  - `CONTACT INFORMATION`: FIRST NAME*, LAST NAME*, EMAIL*, YOUR PHONE #*, JOB TITLE*
  - `COMPANY INFORMATION`: COMPANY NAME*, COMPANY TYPE* (select: "Select…", "EPC + Sales Org", "Sales Org"), COMPANY WEBSITE*, COMPANY ADDRESS*, COMPANY PHONE #*
  - STATES SERVICED (checkboxes): Massachusetts (MA), Illinois (IL), New Jersey (NJ); + text field `OTHER STATES SERVICED?`
  - Button: `Become a Partner` (dark/black, full-width).
- Mock form (no real submit).

## 5. Footer — see GLOBAL.md (identical to Product)

## Shared hero component
Product & Partners heroes share structure: full-bleed photo + eyebrow + serif headline + sub + button + right floating stat-card cluster over a colored swatch (yellow on Product, blue on Partners). Build one `Hero` component w/ props.
