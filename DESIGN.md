---
name: Skyfall AI
description: Engineering World Models for the autonomous enterprise. A flat, hairline-ruled, single-accent technical system set in Geist and Geist Mono.
colors:
  skyfall-blue: "#3e57da"
  skyfall-blue-lift: "#6f83f0"
  blue-tint: "#eef1fd"
  blue-ghost: "#b9c3f2"
  blue-grid: "#3e57da1a"
  paper: "#ffffff"
  studio: "#f6f6f6"
  ink: "#1a1a1a"
  body: "#474747"
  muted: "#7a7a7a"
  faint: "#adadad"
  slash: "#cccccc"
  line: "#e0e0e0"
  dot: "#d4d4d4"
  bar: "#c4c4c4"
  night: "#1a1a1a"
  night-mid: "#474747"
  night-text: "#a3a3a3"
  grid-on-dark: "#ffffff1a"
  error: "#c2362f"
  pixel-moss: "#4a5b46"
  pixel-sky: "#97abc5"
  pixel-clay: "#ca8f73"
  pixel-plum: "#84565c"
  pixel-teal: "#6d8c8e"
  pixel-sand: "#cdad91"
  pixel-sage: "#a7b89f"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(46px, 9.4vw, 136px)"
    fontWeight: 500
    lineHeight: 0.86
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 6.6vw, 96px)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline-md:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.4vw, 64px)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(22px, 1.8vw, 26px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.05em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.3vw, 19px)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body-sm:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(15px, 1.1vw, 16px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  prose:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.25vw, 18px)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(12px, 0.9vw, 13px)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.02em"
  label-sm:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.05em"
  button:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
rounded:
  none: "0px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "14": "56px"
  "16": "64px"
  "20": "80px"
  "24": "96px"
  "28": "112px"
  gutter: "24px"
  gutter-md: "40px"
  container: "1208px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "52px"
    width: "min 220px"
  button-primary-hover:
    backgroundColor: "{colors.skyfall-blue}"
    textColor: "{colors.paper}"
  button-primary-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "52px"
  button-primary-light-hover:
    backgroundColor: "{colors.skyfall-blue}"
    textColor: "{colors.paper}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 4px"
    height: "52px"
  button-line-hover:
    textColor: "{colors.skyfall-blue}"
  button-line-dark:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    height: "52px"
  button-line-dark-hover:
    textColor: "{colors.skyfall-blue-lift}"
  nav-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "56px"
  nav-tab-hover:
    backgroundColor: "{colors.studio}"
  nav-tab-current:
    backgroundColor: "{colors.skyfall-blue}"
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "26px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px"
  card-md:
    backgroundColor: "{colors.paper}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "48px"
  panel-title-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "0 6px"
    height: "24px"
  panel-title-bar-accent:
    backgroundColor: "{colors.skyfall-blue}"
    textColor: "{colors.paper}"
  tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "44px"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  faq-icon:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    size: "32px"
  faq-icon-open:
    backgroundColor: "{colors.skyfall-blue}"
    textColor: "{colors.paper}"
---

# Design System: Skyfall AI

## Overview

**Creative North Star: "The Blueprint Datasheet"**

Skyfall's interface reads like an engineering drawing that has been typeset for the screen. Every surface is flat white or near-white paper, divided by 1px hairlines into cells, panels and figures. Labels are set in a monospace face, in caps, often prefixed with a slash, a square or angle brackets, the way a datasheet annotates a part. Headlines are enormous, tightly tracked and set in capitalised title case with line-heights below 1, so the words stack like a stencil on a drawing sheet. One blue carries every signal: the current nav tab, the focus ring, the selection highlight, the active bar in a chart, the hover state of a link. Nothing else is coloured except the seven muted "pixel tones" reserved for the 10×10 pixel icons.

The system is dense but calm. Space comes from generous section padding (64–112px) and from leaving cells of the grid empty, not from soft shadows or rounded containers. Depth is drawn, never cast: corner brackets, corner dots, dotted fields and grid fields mark where a figure sits. Motion follows the same logic as the layout, with lines of type rising out of masks, labels scrambling into place, bars growing from zero, counters counting up, and a blue panel sliding across a button on hover. Everything eases out on an expo curve and nothing bounces.

**Key Characteristics:**
- One accent (Skyfall Blue `#3e57da`) on an otherwise achromatic palette; a lighter lift (`#6f83f0`) replaces it on dark grounds.
- Zero border radius anywhere. Squares, brackets and hairlines are the only decoration.
- Geist for reading, Geist Mono for every label, button, meta line and tag. Mono is always small and usually uppercase.
- Hairline grids (`#e0e0e0` on paper, `#474747` on night) built from shared borders, so cells never double up.
- Five grounds: paper, studio, night (grid), ink and blue. Sections switch ground rather than adding cards.
- Motion is scroll-driven, masked and expo-eased; reduced-motion users get the same content with no animation.

## Colors

An achromatic grey ramp from paper to ink with a single electric blue; the blue is loud precisely because it is rare.

### Primary
- **Skyfall Blue** (`#3e57da`): the only hue. Current nav tab, primary-button hover panel, focus-visible outline, text selection, active chart bar, blog dates and read times, the `/` prefix on labels, link hover colour, FAQ open state, and the blue ground used for KPI blocks and the Results banner.
- **Skyfall Blue Lift** (`#6f83f0`): the hover and open colour for text on ink/night grounds (footer line buttons, FAQ summaries, dark-tone links). Never used on paper.
- **Blue Tint** (`#eef1fd`): the row highlight behind "our" result in bar charts.
- **Blue Ghost** (`#b9c3f2`): underline colour for prose links at rest, and the dashed rule's hover colour in the footer.
- **Blue Grid** (`#3e57da1a`): 1px grid lines of the `GridField` on light grounds (32px cells).

### Neutral
- **Paper** (`#ffffff`): page background, cards, nav bar, inputs.
- **Studio** (`#f6f6f6`): secondary ground, hover fill for nav tabs and sector tiles, image placeholders, the `dots` field background.
- **Ink** (`#1a1a1a`): body headings, primary button fill, panel title bars, strong rules (`border-ink`), and the ink ground.
- **Body** (`#474747`): running copy, ledes, footer links. On night grounds the same value is **Night Mid**, the hairline colour.
- **Muted** (`#7a7a7a`): captions, chart axes, footer legal line, post counts.
- **Faint** (`#adadad`): meta dots, mobile-menu index numbers.
- **Slash** (`#cccccc`): dashed rules in the footer.
- **Line** (`#e0e0e0`): the default hairline on paper and studio.
- **Dot** (`#d4d4d4`): the 1px dots of the `dots` (12px) and `dots-grey` (6px) fields.
- **Bar** (`#c4c4c4`): competitor bars in charts.
- **Night** (`#1a1a1a`) / **Night Text** (`#a3a3a3`) / **Grid on Dark** (`#ffffff1a`): the dark ground, its secondary text and its 44px grid lines.
- **Error** (`#c2362f`): invalid input border and message text. Used only in forms.

### Tertiary
- **Pixel tones** — Moss `#4a5b46`, Sky `#97abc5`, Clay `#ca8f73`, Plum `#84565c`, Teal `#6d8c8e`, Sand `#cdad91`, Sage `#a7b89f`: reserved for the pixel icons on domain and sector tiles. Each has a "ghost" at 65% toward white for inactive pixels. They never appear in type, buttons or backgrounds.

### Named Rules
**The One Blue Rule.** Skyfall Blue is the only saturated colour in the UI. If a second accent seems necessary, the answer is a hairline, a mono label or more white space.

**The Lift Rule.** On ink or night grounds, blue text and hover states use Blue Lift (`#6f83f0`), never the base blue, which fails contrast on `#1a1a1a`.

**The Tone Quarantine Rule.** Pixel tones live only inside pixel icons.

## Typography

**Display and Body Font:** Geist (variable, 100–900; fallback ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (variable, 100–900; fallback ui-monospace, SFMono-Regular, Menlo)

**Character:** Geist does the reading at medium weight with tight negative tracking, and Geist Mono does the annotating. The pairing feels like a technical document set by a type-conscious studio: large, calm sans headlines against small, precise, uppercase mono labels. Weight stays in the 400–600 band; nothing is bold-700 and nothing is light.

### Hierarchy
- **Display** (500, 46px → 84px → 128/136px at sm/lg, line-height 0.92 → 0.86, tracking -0.045em, capitalised, `text-balance`): the page hero on Home, SKY-001 and Blog. Max width 13ch.
- **Headline** (500, 40 → 64 → 96px, line-height 0.95 → 0.9, tracking -0.045em, capitalised): section titles inside a bracket `Frame`, centred by default, max 15–16ch.
- **Headline md** (500, 34 → 48 → 64px, line-height 0.98 → 0.94): secondary section titles (FAQ, Results, Contrarian).
- **KPI** (500, 34 → 64 → 104px, line-height 0.9 → 0.85): the counted numbers in blue KPI blocks; same voice as Display.
- **Title** (500, 22 → 26px, line-height 1.15, tracking -0.05em): card and tile titles, post titles, KPI captions.
- **Body** (400, 17 → 19px, line-height 1.25, tracking -0.02em): ledes, tile copy, FAQ answers. Max 38–60ch.
- **Body sm** (400, 15 → 16px, line-height 1.3): card excerpts, figure titles, footer headings.
- **Prose** (400, 17 → 18px, line-height 1.65, tracking -0.01em, colour Body): blog articles. H2 30 → 34px, H3 24 → 28px with a top hairline, H4 20px; all 500 weight and -0.05em.
- **Label** (Mono 500, 12 → 13px, tracking -0.02em, UPPERCASE): eyebrows, nav tabs, panel title bars, meta rows, chart values. Often prefixed `/ `.
- **Label sm** (Mono 500, 11px, tracking +0.05em, Capitalised): `LabelBlock` captions, section notes, chips (chips are uppercase).
- **Button** (Mono 600, 15px, tracking -0.02em, UPPERCASE): primary and line buttons, "Read more".

### Named Rules
**The Mono Annotation Rule.** Anything that labels, counts, dates or tags is set in Geist Mono at 15px or smaller. Mono never carries a sentence of body copy.

**The Sub-One Rule.** Display and headline line-heights sit below 1.0 (0.85–0.95). Titles and body return to 1.15–1.65.

**The Medium Rule.** Headlines are weight 500. Emphasis in prose is 600. 700 is not used.

## Layout

The page is a single centred column, max width **1208px**, with a **24px** gutter that grows to **40px** at `md` (768px). Sections pad vertically **64px / 96px / 112px** at base / md / lg and switch ground colour (paper, studio, night, ink, blue) instead of stacking cards. Breakpoints follow Tailwind: `sm` 640, `md` 768, `lg` 1024.

Inside a section, content is laid out on **hairline grids**: the `<ul>` carries `border-top` and `border-left`, each cell carries `border-right` and `border-bottom`, so adjacent cells share one 1px line. Grids collapse from 3 → 2 → 1 columns (blog cards, logo grids) or 5 → 2 (sector tiles). Figures and label blocks hang from a **left ink rule** with 10px of padding; two-column reading layouts (footer, featured post) use a 7:5 or 1:1 split with an internal hairline.

Chrome: a **fixed 56px** white nav bar on desktop (logo left, mono tabs right, each tab 22px side padding, separated by hairlines) and a **sticky 64px** header on mobile with a two-bar hamburger. Hash scrolling offsets by 72px. The footer is a hairline-boxed 2 × 2 grid with 24/40px cell padding.

Spacing uses the 4px Tailwind scale; the values that recur are 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96 and 112px. Touch targets are at least 44px (`min-h-11`).

## Elevation & Depth

The system is **flat**. There are no box shadows on any component at rest, on hover or in focus. The only soft effect in the whole site is the dialog backdrop (`rgb(26 26 26 / 0.4)` with a 2px backdrop blur), and even the dialog itself is a hairline-bordered rectangle.

Depth is drawn with line work and fields instead:

- **Hairlines** (`#e0e0e0` on paper; `#474747` on night; `#1a1a1a` for emphasis) separate and group.
- **Corner brackets** (8px L-shapes at 50% ink or 60% white) frame section titles.
- **Corner dots** (6px squares) pin figures and video frames.
- **Dot fields** (`dots`: 1px `#d4d4d4` dots on 12px; `dots-grey`: on 6px over `#fafafa`) sit behind figures.
- **Grid fields** (1px lines on 32px cells, masked with a radial or linear gradient) sit behind KPI blocks and the newsletter block; **grid-dark** uses 44px cells on night.
- **Halftone field**: a WebGL cell shader behind heroes, fading downward, with the dot grid as its fallback.

### Named Rules
**The No-Shadow Rule.** Never add `box-shadow`. If something needs lifting, give it a 1px ink border, a title bar or a field behind it.

**The Draw-It Rule.** Depth is implied by brackets, dots and rules, the way a drawing annotates a part.

## Shapes

Every corner is square: `border-radius: 0` on buttons, inputs, cards, chips, panels, dialogs, images and video. The recurring primitives are small filled squares and L-brackets:

- **8px square** inside primary buttons (rotates 180° on hover) and before eyebrow labels.
- **6px squares** as corner dots and prose bullets; **4px squares** as meta-row separators.
- **8px corner brackets** on `Frame`; **1px left rules** on `LabelBlock` and `Figure`.
- **Angle brackets** `<SKY-001>` wrap the current nav label; **slashes** `/ ` prefix eyebrows and the footer tagline; **arrows** `↗` and `→` end links.
- **Pixel icons** are 10 × 10 grids of 7px squares on an 8px pitch, outlined in a pixel tone with ghost pixels for the inactive state.
- Images and video are clipped to their hairline frame; the only transform is a 1.03 zoom on card hover.

## Components

Components look like parts on a datasheet: hairline-boxed, square, labelled in mono, with a single blue state.

### Buttons
- **Shape:** square (0 radius), 52px tall, 20px side padding, mono 15px/600 uppercase, label scrambles on pointer enter.
- **Primary (dark):** Ink fill (`#1a1a1a`), white text, min width 220px, label left and an 8px white square right. **Hover:** a Skyfall Blue panel slides in from the left (300ms, expo-out) and the square rotates -180°. **Active:** scale 0.98.
- **Primary (light):** white fill, ink text and square; on hover the blue panel enters and text/square turn white.
- **Line:** transparent with a 1px bottom rule in ink, label left and `↗` right; hover turns rule and text blue and nudges the arrow up-right by 2px. The dark variant uses white → Blue Lift.
- **Submit (forms):** the primary button at full width on mobile, `cursor-wait` while sending.
- **Focus:** 2px Skyfall Blue outline, 2px offset (white outline on blue/ink grounds).

### Navigation
- **Desktop:** fixed 56px bar, white, bottom hairline. Tabs are mono 14px/500 uppercase with 22px padding and hairlines between; hover fills Studio; the current tab fills Skyfall Blue with white 600 text and the label wrapped in `< >`. A scroll spy marks the section under 40% viewport height.
- **Mobile:** sticky 64px header; hamburger is two 24 × 2px ink bars that rotate into an X. The menu is a full-height white sheet that wipes down with `clip-path` (500ms expo-out); links are mono 24px uppercase, 64px rows with hairlines, indexed `01`, `02` in Faint.

### Chips
- **Style:** 26px tall, 10px side padding, 1px Line border, paper fill, mono 11px uppercase in Body. Static; no selected state.

### Cards / Containers
- **Post card:** a cell in a hairline grid; 16:10 image on Studio, 20–24px padding, meta row (mono 12px, blue read time), 22px title, two-line excerpt, chips, and a dashed top rule above the date/"Read →" row. **Hover:** a 1px Skyfall Blue outline fades in over the cell, the title and arrow turn blue, the image zooms to 1.03 over 700ms.
- **Featured post:** 7:5 split, 1px Line border that turns blue on hover, 24–40px padding, 30–42px title.
- **Sector tile:** hairline cell, 20–24px padding, pixel icon (50–64px) above copy; hover fills Studio and pops the pixels in.
- **Panel:** 1px Ink border, 24px title bar in Ink (or Skyfall Blue for accent) with mono 12–13px white text, then the body.
- **Figure:** left Ink rule, `dots-grey` field, Ink tag badge top-left (mono 12px white), caption below with 15px title and 14px Muted note.
- **KPI block:** blue ground with a masked white grid field; a bordered mono title, three `LabelBlock`s with counted numbers at 34–104px and a 15–22px caption.
- **Internal padding:** 20px at base, 24px at md; 40px for footer and featured cells.

### Inputs / Fields
- **Style:** 48px tall, 14px side padding, paper fill, 1px border at 25% Ink, 16px text with -0.02em tracking, placeholder at 35% Ink, label above in 15px/500 with a blue asterisk.
- **Hover:** border 50% Ink. **Focus:** border Skyfall Blue plus a 1px blue ring, no outline.
- **Error:** border and 13px message in Error red (`#c2362f`). Textareas resize vertically and show a live word count against a 250-word cap.

### Tabs
- **Style:** equal columns inside an Ink border with hairlines between, 44px tall, 15px text. **Selected:** Ink fill with white text. **Hover:** Studio fill. Used for mobile chart and film switching.

### FAQ (details/summary)
- On the ink ground with Night Mid hairlines; summary is mono 13–14px with a 32px white square holding a 12px plus. **Open:** text turns Blue Lift, the square turns Skyfall Blue with a white icon rotated 45°, and the 17–19px answer at 85% white expands beneath.

### Bar chart
- Rows of 32px with Line hairlines: model name, a 10px bar, mono value. Competitor bars are Bar grey; Skyfall's row is highlighted in Blue Tint with a blue bar and blue 500 text. Bars grow from `scaleX(0)` and values count up over 1.4s (power3.out, 0.08s stagger) when the chart enters at 75% viewport.

### Signature: Pixel icons
- 10 × 10 glyphs drawn as 7px squares on an 8px pitch. Inactive pixels show the tone's ghost; on activation pixels pop in at random (0.18s each, 0.012s stagger). Each tile is assigned one of the seven pixel tones.

### Motion grammar
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for CSS; GSAP defaults `expo.out`, 1s.
- **Reveal:** `FadeUp` from opacity 0 / y 24px over 1.1s at 85% viewport; `SplitReveal` masks lines and raises them from 110% over 1.2s with 0.09s stagger after fonts load.
- **Counters:** 1.4s `power3.out` from 0 when the element crosses 90% viewport.
- **Scramble:** 0.6s character scramble on labels at pointer enter (hover-capable pointers only).
- **State transitions:** 300ms for colour, transform and borders; 500ms for the mobile menu wipe and stage copy; 700ms for image zoom.
- **Dialogs:** sheet-up 420ms on mobile, pop-in 320ms from y 16px / scale 0.98 on desktop, `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Smooth scroll:** Lenis at lerp 0.1; hash scrolls take 1.4s with a 72px offset.
- `prefers-reduced-motion: reduce` disables Lenis, every reveal, the halftone loop and autoplaying video.

## Do's and Don'ts

### Do:
- **Do** keep Skyfall Blue (`#3e57da`) to state and signal: current tab, hover, focus, selection, the active bar, dates, the `/` prefix.
- **Do** build groups as shared-border hairline grids (`border-t border-l` on the list, `border-r border-b` on cells).
- **Do** set every label, tag, meta line and button in Geist Mono, 11–15px, uppercase, with -0.02em tracking (or +0.05em at 11px).
- **Do** set headlines at weight 500 with -0.045em tracking and line-height under 1, and capitalise them.
- **Do** switch section grounds (paper → studio → night → blue) to create rhythm.
- **Do** frame figures with a left ink rule, corner brackets, corner dots or a dotted field.
- **Do** ease everything out on the expo curve and gate reveals on scroll position.
- **Do** keep touch targets at 44px and focus rings at 2px blue with 2px offset.

### Don't:
- **Don't** add border radius to anything.
- **Don't** add box shadows, gradients on surfaces or glassmorphism; the dialog backdrop blur is the single exception.
- **Don't** introduce a second accent colour or use pixel tones outside pixel icons.
- **Don't** use the base blue for text on ink or night grounds; use Blue Lift.
- **Don't** set body copy in mono or labels in Geist.
- **Don't** use weights above 600, or light weights below 400.
- **Don't** replace hairlines with spacing-only separation inside grids; the lines are the structure.
- **Don't** bounce, overshoot or spring; motion decelerates and stops.
