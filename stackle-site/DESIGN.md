# Stackle site: design and build rules

The site is a static Next.js 16 export (`output: "export"`, App Router, React 19, Tailwind 4, TypeScript).
Read `node_modules/next/dist/docs/` before using a Next API you're unsure of; this version differs from older ones.

## The look
Modeled on the Sigil Labs Framer template, in **black and white only, with no accent colour**.
- **Framed page:** every band is a `<Row>` (components/row.tsx). It draws full-width hairlines between bands,
  a 1120px content column between two vertical hairlines, and a row number ("01", "02", …) in the left gutter
  (inline above the content on small screens). Number rows in order down the page.
- **Square corners everywhere.** No border-radius, no shadows, no gradients except the footer wordmark.
- **Hairlines** (`border-line`, 1px) separate everything: cells in a grid share borders like a table.
- **Type:** Geist (sans, weight 500 for headings, 400 body), Geist Mono for small uppercase labels and numbers,
  Geist Pixel (`.t-pixel`) for big stat numbers and one accent word in a headline. Never set body text in pixel.
- **Emphasis without colour:** a muted second line in headings (`.t-second`), the pixel face, inversion
  (`bg-ink text-paper` for a selected tab/chip/row), hatched or dotted fills (`.fill-hatch`, `.fill-dots`, `.fill-iso`).
- **Dark bands** (`<Row tone="night">`) for contrast: one or two per page, not more.

## Tokens (app/globals.css)
Colours: `paper` #f4f4f1 (page), `white` (cards), `fill`/`fill-2` (subtle fills), `ink` #111110, `ink-2` (body),
`muted` #66665f (secondary text, labels), `faint` (decoration only, never text), `line` #cfcfc7, `line-soft`,
`night`, `night-2`, `night-3`, `night-line`, `night-muted` (text on night).
Utility classes: `.pad` (side padding), `.sec` (vertical section padding), `.t-display .t-h2 .t-h3 .t-h4 .t-lede
.t-body .t-small .t-mono .t-mono-sm .t-pixel .t-second`, `.label` (■ CHIP), `.btn` + `.btn-ink|-paper|-line`
(+ `.btn-chrome` small mono variant, `.btn-block`), `.dlink` (dashed-underline text link), `.panel`, `.hairline`,
`.corners` (L-shaped corner brackets), `.seg/.seg-on` (dotted progress bar), `.field` (input), `.kbd`,
`.prose-s` (long-form text), `.scroll-x` (wrap wide tables so they scroll instead of widening the page).
Inside a night row, `.panel`, `.label`, `.field`, `.hairline`, `.t-second`, `.t-lede` switch automatically.

## Shared components (use these; don't re-create them)
- `components/row.tsx`: `<Row n tone id>` and `<SectionHead label title second lede>`.
- `components/resources/resource-shell.tsx`: `<ResourceHero category title second summary meta>` (rows 01–02)
  and `<ResourceCta n>` (closing dark band). Every /resources/* page starts and ends with these.
- `components/code-block.tsx`: `<CodeBlock code language filename lineNumbers>`, monochrome highlighting + copy.
- `components/accordion.tsx`: `<Accordion items={[{q,a}]}>`, numbered `<details>` list.
- `components/copy-button.tsx`, `components/icons.tsx` (`<Pixel name>` glyphs, `ArrowUpRight`, `ArrowRight`,
  `ArrowLeft`, `Copy`, `Search`, `Menu`), `components/iso.tsx` (isometric line drawings).
If you need a new shared primitive, put it in your own folder (`components/resources/<yours>/`) instead of editing shared files.

## Rules
- Phone first and desktop together: check 390px and 1440px. No horizontal page scroll at 390px
  (`document.documentElement.scrollWidth === innerWidth`). Wide tables and code go in `.scroll-x` / `<CodeBlock>`.
- Server components by default. Use `"use client"` only for real interactivity (filters, tabs, drawers, demos),
  and keep those components small; pass data in as props. Large JSON should be imported by server components
  and rendered to HTML, so the content is in the static HTML for search engines.
- Accessibility: real buttons and links, `aria-expanded`/`aria-controls` on toggles, visible focus (already global),
  headings in order, alt text on images, `prefers-reduced-motion` respected (global CSS already shortens animations).
- No emojis in the UI. No invented stats, testimonials, view counts or ratings. Copy content from the JSON
  faithfully; you may shorten UI labels and fix typos.
- Metadata: every page exports `metadata` with `title` (the layout adds " · Stackle") and `description`,
  plus `alternates: { canonical: "/resources/<slug>" }`.
- Links to other resources use `/resources/<slug>`; the masterclass links use `/courses/<slug>`;
  "Book a call" uses `site.bookCall` from `content/site.ts`.

## Running it
- `npm run typecheck` (fast, safe to run any time).
- Several people work in this folder at once. Run your own dev server with your own build folder and port:
  `NEXT_DIST_DIR=.next-<yourname> npx next dev -p <port>`; never run `next build` or delete `.next*` folders
  you didn't create. Screenshot with Playwright: `require('/opt/node22/lib/node_modules/playwright')`.
