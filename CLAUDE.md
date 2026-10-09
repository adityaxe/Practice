# SPBC Group website — project context

## Working agreement (read first)

**Commit directly to `main` and push. Do not open a pull request.**

The owner often works from a phone and cannot review or merge PRs. This repo is
published by GitHub Pages straight from `main`, so a push *is* the deploy — the
live site updates about a minute later. There is no staging environment and no
reviewer; `main` is production.

Because of that:

- Make the change, verify it as well as you can, then commit and push to `main`.
- Keep commits small and self-describing, so a single `git revert` undoes one
  logical change.
- If something looks risky or ambiguous, say so in your reply rather than
  parking the work on a branch the owner will never see.
- To undo a bad deploy: `git revert <sha>` and push. Never force-push `main`.

## The site

Static marketing site (no build step, no framework). Open `index.html` directly, or
serve the folder. Five pages share one stylesheet and one script.

```
index.html  services.html  founder.html  contact.html  legal.html
style.css   script.js      Assets/       Adya/ (source documents)
```

## Who this is for

Synergy Plus Business Consulting Group ("SPBC Group") — a real firm, founded
1 April 2014, with two Haryana offices. Content must stay factual; the source of
truth is `Adya/What We Do.docx` and `Adya/Register office & Corporate.docx`.

Key facts used across the site (do not invent alternatives):

- Registered office: 724/814, Galleria Tower, Phase-IV, DLF City, Gurgaon, Haryana 122002
- Corporate office: Plot 5/7, Dharuhera Industrial Area, Rewari, Haryana 123106
  (entity: SPBCG Product & Services (OPC) Pvt. Ltd., site udyoghrsolutions.in)
- GST 06ABHCS4149M1ZW · both offices open 9 hours daily
- Email mdvanjani@udyogservice.in · phones +91-124 475 559, +91 98100 57943,
  +91-1274 294 979, +91 96505 60013
- Founder: Mr. Vanjani — SRCC alumnus, Chartered Accountant (ICAI) and Company
  Secretary (ICSI) since 1977–78; former Secretary cum Financial Controller, CEO
  and Director across India, the UK and Singapore
- 21 service lines: 12 HR & business, 6 management consulting, 9 corporate
  services (the docx files list these verbatim)
- Clients named on site: ZETWERK, Amul, GATI, Tech Mahindra, TATA BlueScope Steel, Coforge

## Design direction

Deliberately **not** the generic AI-glassmorphism look that an earlier revision had.
Avoid reintroducing: floating blurred orbs, purple gradients, gradient-filled
headings, heavy `backdrop-filter` card stacks, 24–32px rounded "glass" panels.

The current system is **warm editorial corporate**:

- Paper-cream ground (`--paper: #faf6f1`), ink navy text (`--ink: #121c2e`)
- **Fraunces** (variable serif) for display type, **Inter** for body and UI
- Hairline rules (`--line`), uppercase micro-labels (`.eyebrow`), numbered
  sections, SVG film grain (`--grain`) over gradients
- Modest radii (8–16px), restrained shadows, asymmetric layouts
- Palette comes from `Assets/color platte.jpeg`: #3076D8 blue, #F26900 orange,
  #C8DBF4 sky, #F1DACB blush. The art-direction reference is the PDF in `Adya/`
  ("Orange and Brown Photographic Style").

## The dual-mode system (the site's signature feature)

The whole site re-tints between two audiences: **hire** (blue) and **candidate**
(orange). This is the main thing to preserve when editing.

How it works:

1. Colors are registered with `@property` (`--brand`, `--brand-dark`,
   `--brand-soft`, `--aurora-1/2`) so they *interpolate* instead of snapping.
   `body` carries the transition; `body[data-mode="hire"|"candidate"]` overrides.
2. `script.js` sets `data-mode` on `<body>`:
   - `[data-mode-hover]` → previews a mode on hover/focus, reverts on leave
   - `[data-mode-set]` → **locks** a mode on click, saved to `localStorage`
     under `spbc-mode`, so it follows the visitor between pages
   - `?type=employer` / `?type=candidate` in the URL wins over the stored value
3. `.swap` blocks crossfade copy per mode (grid-stacked children:
   `.swap-default` / `.swap-hire` / `.swap-candidate`) with no layout shift.
4. `#modeSweep` fires a diagonal light sweep on every mode change.

Adding a new mode-aware element: give it `.swap` with the three children, or use
`var(--brand)` and it re-tints automatically.

## Conventions

- Plain CSS, BEM-ish class names, no preprocessor and no utility framework
- `.reveal` + `.d1`–`.d4` for scroll-in animation (IntersectionObserver adds
  `.is-visible`); `.fade-up` for above-the-fold entrances
- `[data-count]` on a number animates it when scrolled into view
- Icons are inline SVG (feather-style, `stroke-width="2"`), never an icon font
- All motion is gated by a `prefers-reduced-motion` block at the end of style.css

## Known gaps / good next tasks

- **Forms do nothing.** `contact.html` has no backend — submissions are discarded.
  Needs a form service (Formspree/Netlify) or a mail handler.
- **No photography.** `.portrait` on `index.html` and `founder.html` are photo
  slots showing initials; drop `Assets/founder.jpg` in and swap the placeholder
  comment for an `<img>`. The design was built to accept real photos.
- Testimonials are illustrative, not verified client quotes — confirm before
  treating them as real attributions.
- Client logos are set as text in the marquee; real logo files would be better.
- No automated browser testing was possible on the original dev machine (no
  node/python/headless Chrome), so changes were verified structurally only.
