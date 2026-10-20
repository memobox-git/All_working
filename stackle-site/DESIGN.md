# Stackle site: design and build rules

The site is a static Next.js 16 export (`output: "export"`, App Router, React 19, Tailwind 4, TypeScript).
Read `node_modules/next/dist/docs/` before using a Next API you're unsure of; this version differs from older ones.

## The look (current)
Editorial and calm, modeled on the **Folistead** Framer template, in **ink only, with no accent colour**.
The reference homepage is `app/page.tsx`; match it.
- **Type:** Fraunces (`.t-serif`, `.t-display`, `.t-h2`–`.t-h4`) for headings and numbers, weight 400. DM Sans for
  everything else. The accent is **italic serif**: one phrase per heading in `.t-second`/`.t-accent`
  ("Learn the skills that *get you hired.*"). Numbers (stats, prices, step numbers "01") are serif, not mono.
- **Labels:** small uppercase DM Sans 600 with letter-spacing (`.t-mono`, `.t-mono-sm`, `.label` = "— EYEBROW").
  Use them sparingly: eyebrows, column headers, tiny meta. Tags and chips are **sentence case** pills, not uppercase boxes.
- **Surfaces:** warm cream page (`paper`), white cards (`.panel`: 1px `line` border, 16px radius, soft shadow),
  `card-float` for floating mock-ups, `chip-dark` for small dark stat chips. Section bands alternate paper and white
  (`<Row tone="white">`); one dark band at most per page (the footer is already dark).
- **Shape:** rounded. Cards 16px, buttons/inputs/selected items 10px, tags and pills fully round (`rounded-full`),
  radio dots round. Avoid square black bars and hairline cell grids; prefer cards with gaps (`gap-5`) or simple
  rows separated by `border-t hairline`.
- **Selected/active state:** ink fill with paper text, rounded (pill or 10px), or an ink underline for tabs/nav.
- **Icons:** `<Pixel name>` now renders thin line icons (24px grid). Put them in `.icon-tile` (rounded square) or a
  round 40px outline circle, like the homepage.
- **Hero backgrounds:** `.fill-ruled` (faint horizontal ruled-paper lines). `.fill-iso` maps to the same.
- **Motion:** gentle. `.reveal` fades content in; no blinking or stepped animations.

## Tokens (app/globals.css)
Colours: `paper` #f6f4ef, `white`, `fill`/`fill-2`, `ink` #151513, `ink-2` (body), `muted` (secondary, 5.1:1),
`faint` (decoration only), `line`, `line-strong`, `line-soft`, `night`, `night-2`, `night-3`, `night-line`,
`night-muted`. Radii: `--radius-card` 16px, `--radius-ctl` 10px. Shadows: `--shadow-card`, `--shadow-float`.
Utility classes: `.pad`, `.sec`, `.t-display .t-h2 .t-h3 .t-h4 .t-lede .t-body .t-small .t-mono .t-mono-sm .t-serif
.t-pixel(serif numbers) .t-accent .t-second`, `.label`, `.btn` + `.btn-ink|-paper|-line` (+ `.btn-chrome`, `.btn-block`),
`.dlink`, `.panel`, `.card-float`, `.chip-dark`, `.icon-tile`, `.dot-list`, `.hairline`, `.seg/.seg-on` (thin rounded
progress bar), `.field`, `.kbd`, `.prose-s`, `.scroll-x`, `.fill-ruled`, `.fill-dots`, `.fill-hatch`.

## Shared components (use these; don't re-create them)
- `components/row.tsx`: `<Row tone id>` (a full-width band with a centered 1200px column) and
  `<SectionHead label title second lede>` (second = italic line).
- `components/resources/resource-shell.tsx`: `<ResourceHero category title second summary meta>` and `<ResourceCta>`.
- `components/code-block.tsx`: `<CodeBlock code language filename lineNumbers>`.
- `components/accordion.tsx`: `<Accordion items numbered?>` (round +/- buttons).
- `components/copy-button.tsx`, `components/icons.tsx` (`<Pixel name>`, `ArrowRight`, `ArrowUpRight`, `ArrowLeft`,
  `Copy`, `Search`, `Menu`).

## Rules
- Phone first and desktop together: check 390px and 1440px. No horizontal page scroll at 390px.
- Server components by default; `"use client"` only for real interactivity, kept small, data passed as props.
  All content stays in the static HTML for search engines.
- Accessibility: real buttons and links, `aria-expanded`/`aria-controls`, visible focus, headings in order, alt text,
  `prefers-reduced-motion` respected.
- No emojis. No invented stats, testimonials, view counts or ratings.
- Every page exports `metadata` with `title`, `description` and `alternates.canonical`.

## Running it
- `npm run typecheck`.
- Several people may work here at once: run your own dev server with your own build folder and port,
  `NEXT_DIST_DIR=.next-<yourname> npx next dev -p <port>`, and stop it when done. Don't run `next build`.
  `next dev` adds lines to `tsconfig.json`; leave that file alone, it gets cleaned up at the end.
  Screenshot with Playwright: `require('/opt/node22/lib/node_modules/playwright')`.
