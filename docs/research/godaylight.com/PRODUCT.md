# Product page (/product) — Topology, Content, Behaviors

Page bg = beige #FFF7E9. Order of sections (inside `<main>`):

## 0. Hero  (`relative`, min-h-screen, h~1268)
- Full-bleed background photo `/product-hero.jpg` (home with solar panels, autumn trees). Dark gradient overlay bottom for text legibility.
- Eyebrow (mono, white, tracked): `SOLAR + BATTERY`
- Headline (Feature Deck serif, white, huge ~120px): `Your home's` / `new energy system` (2 lines)
- Sub (Aeonik, white): `Matte black panels turn sunlight into energy. A home battery protects against peak rates and power outages.`
- Buttons: `See if you qualify` (white bg, black text, rounded) + `Get estimate` (yellow #FCCC3C bg, black text, rounded).
- Right overlay: a **yellow translucent panel** + stat cards floating: `kWh generated 8.2kWh – 9.5kWh`, `Backup stored`, `Thermostat 68°F`. Small carousel/progress indicator (2 segments) bottom-right of panel. There's a finish/color label `Matte black`.
- Behavior: stat cards fade/animate in; possible subtle parallax on bg. The yellow panel is a product/finish visual swatch.

## 1. Daylight Explained — HORIZONTAL PINNED SCROLL  (desktop `hidden lg:block`, h~2353; mobile variant `lg:hidden` stacks)
- bg = yellow #FCCC3C. Text brown #4C2806.
- Eyebrow (mono): `DAYLIGHT EXPLAINED`. Title (Feature Deck, brown, huge): `How Daylight works for you` — title PINS at top while cards scroll horizontally.
- 4 cards scroll left as user scrolls down (pinned section, translateX driven by scroll progress):
  1. `01. Solar makes energy` — img `/solar-panels-home.png` — "Your solar panels generate power every day, automatically put to work for your home."
  2. `02. Battery stores surplus` — img (battery on house shingle wall) — "Excess energy goes to your Daylight battery. It's ready to power your home when you need it most."
  3. `03. Your home stays powered` — img `/hiw-3-dusk.png` (dusk home, lit windows) — "When your panels are generating, your home runs on solar. Your battery kicks in during outages to keep your critical loads running."
  4. `04. Track it all in the app` — img `/hiw-4-app.png` (app dashboard mockup over home photo) — "See your solar production, battery level, and savings in real time."
- Each card: number+title (mono number, serif/sans title) with thin dotted underline + dot, large rounded image below, caption text under.
- INTERACTION MODEL: scroll-driven horizontal translate (sticky/pinned). Mobile = vertical stack.

## 2. Your Daylight System  (`py-48 lg:py-80`, h~964)
- bg = brown→orange gradient (dark). 
- Eyebrow (mono): `YOUR DAYLIGHT SYSTEM`. Title (Feature Deck): `The hardware behind your lower electric bill` ("bill" maybe orange/accent).
- 3 cream cards (#FFF7E9/beige), each: title + paragraph + checklist with `›` bullets:
  1. **High-efficiency panels** — "Tier-1 panels perform for decades. Daylight owns and maintains them, so you never pay for upkeep." • Hurricane-tested racking and snow-shedding design • Sized and designed for your home and energy usage • Full maintenance for the duration of your agreement • 25-year warranty
  2. **Backup power, included** — "Stored energy activates in milliseconds during an outage. Daylight monitors weather conditions so your battery is ready when you need it most." • Powers your essentials for hours during outages • Your battery takes priority over grid programs • 10-year warranty
  3. **Monitor everything** — "Real-time monitoring of your solar, battery, and home energy usage. Plus outage alerts, weather tracking, and monthly cost visibility." • Real-time production, storage, and usage monitoring • Outage alerts and weather tracking • Track your monthly savings

## 3. The Daylight Network  (`relative flex min-h-screen items-center justify-center`, h~1268)
- Full-bleed background = aerial neighborhood (suburb roads/homes at golden hour). Likely **Mux video** (`image.mux.com/c7EDq02DDsejq5vVLXRXiM00aJd6fm1qfh7HZYcw02dwGA`) and/or `<canvas>` frame-scrub (1426x716 canvas, `/frames/frame-0001.jpg` sequence). Dark overlay + backdrop-blur.
- Centered text (white): eyebrow `THE DAYLIGHT NETWORK`, title (Feature Deck) `Your home supports a more reliable grid`, sub `Your solar + battery joins a network of homes that trade energy with the grid. Daylight coordinates it automatically.`
- Has inline `<style>` `.network-title-line { padding-bottom:0.18em; margin-bottom... }` — line-by-line title reveal animation.
- Build approach: use video background (loop/muted/autoplay) OR animated frame sequence; overlay blur + centered copy with scroll reveal.

## 4. Comparison — Daylight or cash purchase  (`bg-beige py-36 lg:py-72`, h~1135)
- bg beige. Eyebrow (mono center): `LET'S BREAK IT DOWN`. Title (Feature Deck center): `Daylight or cash purchase`. Sub (orange, bold): `Which is right for you?`
- 2-column comparison table, columns `CASH` (grey) vs `DAYLIGHT` (orange). Rows (row label in mono left):
  - UPFRONT COST: "Payment required upfront" | "$0 — No upfront system cost"
  - BATTERY BACKUP: "Optional add-on" | "Included on every install"
  - MAINTENANCE: "You're responsible" | "Daylight covers & coordinates"
  - SYSTEM OWNERSHIP: "You own it" | "Buy-out option after 5 years"
  - MONITORING: "Fragmented by equipment config" | "Fully integrated — Daylight app"
  - TRANSFERABILITY: "Resale depends on buyer" | "Transfers easily with the home"
- Two info cards (beige-20 bg) below:
  - `WHEN A CASH PURCHASE MAKES SENSE` • You want full ownership and control • You're prepared to manage and maintain your system • You prefer to pay for the system, the installation, and the service
  - `WHY DAYLIGHT WORKS FOR MANY HOMEOWNERS` • Get started with no upfront costs for equipment or installation • Professional installation, monitoring, and support included • Daylight covers all repairs outlined in your agreement • Battery back-up included
- Footer line (Feature Deck center): `Save on energy. Stay powered.` + sun symbol below.

## 5. Getting Started — PARALLAX SUNRISE  (desktop `hidden lg:block`, h~3268; mobile `lg:hidden`)
- Full-bleed sunrise/dune background (orange gradient sky + large rising **sun** disc + dark dune silhouettes). Sun likely rises / parallaxes on scroll (tall section).
- Eyebrow (mono, dark): `GETTING STARTED`. Title (Feature Deck): `A simple path to Daylight`.
- 3 yellow (#FCCC3C) cards pinned near bottom, connected by `›`:
  - `01 — SCOPE`: sub-steps **Qualify** ("Quick assessment to see if your house is right for Daylight"), **Customize** ("Daylight designs your system"), **Logistics** ("Daylight manages all city, utility, and state paperwork")
  - `02 — INSTALL`: • Full-service setup by best-in-class installers • All upfront costs covered by Daylight • Full electrical and utility inspections included • System activation + Daylight app walkthrough • Typical timeline: 12–14 weeks from contract to activation
  - `03 — POWER ON`: • Track production, savings, and backup in the Daylight app • A predictable monthly bill, lower than your utility rate
- INTERACTION MODEL: scroll-driven parallax (sun rises, cards reveal).

## 6. FAQ  (`py-48 lg:py-80`, h~905)
- bg beige. Eyebrow (mono): `FREQUENTLY ASKED QUESTIONS`. Title (Feature Deck): `Questions?` (black) + `We have answers.` (orange).
- Accordion, full-width rows w/ thin dividers, `+` toggle (× when open). First open by default.
  - How long does installation take? → "Most installs take 1–2 days, with full activation in 12–14 weeks depending on permitting and utility timelines."
  - What happens during an outage? → "Your battery takes over instantly. Essentials like lights, WiFi, fridge, and heat stay on."
  - What if I sell my home? → "Your agreement transfers to the new homeowner, just like a standard utility payment."
  - Can I pay off the system early? → "Yes. Early payment options become available after year 5."
  - How long does the battery last? → "The battery is built for long-term reliability with a 10-year warranty."
  - Who handles maintenance? → "Daylight covers all monitoring, repairs, and maintenance for the life of your agreement."
  - What if my roof needs replacing? → "We coordinate panel removal and reinstallation. Contact us for next steps."

## 7. Testimonials  (`relative bg-blue-dark py-48 lg:py-80`, h~807)
- bg blue-dark #1D3E86. Eyebrow (mono, white): `WHAT HOMEOWNERS SAY`. Title (Feature Deck, white): `Real homes. Real savings.`
- 3 cards, each: blurred home photo background (rounded), quote (Feature Deck serif, white) overlaid bottom, name (mono, small) below, a small refresh/rotate icon bottom-right:
  - "Daylight was the single-best thing we could have done for our home." — Dan H. Norwood, MA.
  - "Our energy bill dropped by 30%. I wish we'd made this switch sooner." — Sarah M. Chen, IL.
  - "The whole process was painless. Now we barely think about our energy bill." — Michael R. Torres, NJ.

## 8. CTA + Qualify Form  (`py-60 lg:pt-[100px] lg:pb-[60px]`, h~755)
- bg yellow #FCCC3C. Left: title (Feature Deck, brown) `Step into Daylight` + sub `Join homeowners saving on energy and staying powered through outages.`
- Right: cream card form `See if you qualify for Daylight` / `Let's check if Daylight is available at your area.` Fields (mono labels, underline inputs): FIRST NAME*, LAST NAME*, EMAIL*, PHONE*, STREET ADDRESS*, CITY*, STATE* (select w/ all US states), ZIP*. Progress `1 / 2` w/ orange bar. Black `Next` button full-width. (Demo/mock — no real submit.)

## 9. Footer — see GLOBAL.md
