# Design Tokens — HappyRobot Operations

## Colors (exact, from getComputedStyle)
| Role | RGB | Hex |
|---|---|---|
| Background (page, nav, footer) | rgb(252,252,252) | `#FCFCFC` |
| Foreground / text / buttons | rgb(14,13,12) | `#0E0D0C` |
| Muted gray (subheads, labels, body-on-light) | rgb(133,132,132) | `#858484` |
| Cream / beige (cards, How-We-Work bg) | rgb(243,241,230) | `#F3F1E6` |
| White (text on photos) | rgb(255,255,255)/#FCFCFC | `#FFFFFF` |
| Button text | rgb(252,252,252) | `#FCFCFC` |

No CSS custom properties on `:root` (Webflow utility classes). Light theme only — no dark mode.

## Typography
- **Display / headings:** `Tobias` (commercial serif) → substitute **Newsreader** (Google serif). fallback Georgia, serif.
  - H1: 72px / lh 72px / weight 400 / letter-spacing -1.44px / color white (on hero)
  - H2: 40px / lh 40px / weight 400 / ls -0.8px. Two-tone: first line `#0E0D0C`, second line `#858484`.
  - Stats (Proven Results): ~60px serif, weight 400, `#0E0D0C`.
  - Step numbers (01/02/03): large serif, faded gray.
- **Body / UI:** `Suisse Intl` (commercial grotesque) → substitute **Inter**. fallback Arial, sans-serif.
  - Body p: 16px (hero subcopy ~18px), lh ~1.5, `#858484` on light / white on photos.
  - Small body / card desc: 14–16px `#858484`.
  - Eyebrow labels: 14px, weight 400, uppercase content, slight tracking, `#858484` (white on hero).

## Buttons
- Primary "Book a demo": bg `#0E0D0C`, text `#FCFCFC`, radius 4px, font Inter 14px/400. Padding ranges 4px 16px (nav) up to ~12px 24px (hero/section) — match per screenshot.
- "Learn more": same dark style.

## Shape & spacing
- Card radius: 8px. Button radius: 4px. Image/mockup radius: ~12–16px.
- Card padding: 24px. Section vertical padding: large (~96–112px).
- Max content width: ~1280px centered. 3-col grids gap ~24–32px.
- Hairline dividers inside cards: 1px `#858484`/light.

## Assets (Webflow CDN: cdn.prod.website-files.com/686ce151be97e21fe2785a7e/)
- `hero-bg@2x.webp` — bridge photo (hero + CTA bg)
- `Frame 1597881333.webp` — section 3 workflow mockup
- `Shared insight optimizes opportunity capture.webp` — section 5 contact card
- `logo.svg` — HappyRobot logo; `logo-1.svg`..`logo-9.svg` — carrier logos
- `Vanta_Compliance_*.png` ×6 — SOC2, GDPR, HIPAA, EU AI Act, NIST CSF, DORA
