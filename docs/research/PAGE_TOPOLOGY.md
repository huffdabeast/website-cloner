# Skyfall AI page topology

Source: https://skyfall.ai (plus every URL in the sitemap). Components are ported from the production bundle; see `BEHAVIORS.md` for motion details.

## Routes

1. `/`: marketing home (`src/components/skyfall/home/`)
2. `/sky-001`: product page (`src/components/skyfall/sky001/`)
3. `/blog`: article index (`src/components/skyfall/blog/`)
4. `/blog/[slug]`: eight posts, statically generated. `introducing-sky-001` is the embedded technical report; the rest are prose articles.

Every page is a full document load, as on the live SPA. Shared chrome lives in `src/components/skyfall/chrome/`:

- Desktop (≥1024px): fixed 56px nav. Mobile: sticky 64px header with a full-screen menu.
- Footer with page links, social links and an optional note.
- `#partnership`, `#join-waitlist` and `#launch-video` dialogs, mounted once in the root layout.

## Home

| Section | Id | Interaction model |
| --- | --- | --- |
| Hero | `#top` | Load-time reveal over the WebGL halftone field (cells) |
| Mission | `#research` | Scroll-scrubbed word opacity on a blue ground |
| The problem with next-token prediction | `#problem` | Scroll-triggered reveals |
| Enterprise World Models | none | Scroll-driven steps, pinned at ≥1024px |
| A new Pareto frontier | none | Fade-up reveals around a static SVG chart |
| No more AI co-pilots | `#matters` | Sector tiles with pixel icons (hover on desktop) |
| Founding team | `#team` | Counters and logo grid |
| Investors and advisors | none | Logo grids |

## SKY-001

| Section | Id | Interaction model |
| --- | --- | --- |
| Hero | `#top` | Load-time reveal, bracket slide-in, masked halftone field |
| Intro and film ring | `#intro` | Scroll-scrubbed words, CSS 3D ring on a 36s loop |
| Contrarian approach | none | Canvas 2D figures animating while visible |
| Results | `#results` | Bar charts and benchmark films; metric tabs (click) on mobile |
| How SKY-001 works | `#how` | Stages player synced to video progress (click to switch stage) |
| Reinventing the physical economy | none | Scroll-triggered reveals |
| FAQ | `#faq` | `<details>` accordion (click) |
| Waitlist | `#waitlist` | Opens `#join-waitlist` |

## Blog

Index: split-line hero, featured post, card grid, newsletter. Articles: reading progress bar, sticky table of contents with scroll spy, share links, newer/older navigation and "Keep reading".
