# Agent guide: Cellar wine bar (`next-winebar-cellar`)

## 1. Working preferences

- Work on the current branch, preserve existing changes and leave edits uncommitted unless explicitly asked to commit or deploy.
- Do not push, change remote repository settings or deploy without instructions.
- Replace the fictitious **Wick & Bramble** sample content (`hello@example.com`, `(212) 555-0163`, the 20 Times Square public-landmark map pin, sample wines, plates and tasting formats) with the owner's real wine bar details.
- This website is self-contained and has no runtime dependency on the starter or portal repositories.

## 2. Structure and content

All business copy, wine/food menus and tasting formats live in typed files under `content/` so routine owner edits never require component or layout rewrites:

- `content/business.ts`: business `name`, `tagline`, `introduction`, `email`, `phone`, two-paragraph `story`, `address` (including `mapQuery` and `note`), `directions`, seven-day `openingHours`, optional `notice`, `amenities`, `privateEvents`, six `faqs`, `socialLinks` and `enquiries` copy. To rename the wine bar, update `business.name` in `content/business.ts` and `name` in `site.config.json`.
- `content/menu.ts`: owns `menu` (`currency`, `locale`, `sections`, `notes`, `cellarPickIds`, `homePlateIds`), discriminated `MenuItem` entries (`kind: 'wine' | 'food' | 'soft-drink'`), serving prices/volumes (`WineServing`: `kind: 'glass' | 'bottle'`, `volumeMl`, `amount`, optional `available`), dietary tags (`Diet`), bottle silhouettes (`slender | shouldered | sparkling`), price/availability helpers and `validateMenu()`.
- `content/tastings.ts`: owns `tastings` (`TastingProgramme[]` recurring enquiry-led formats with `scheduleNote`, `durationMinutes`, `groupSize`, optional `pricePerPerson`, `includes`, illustrative `wineIds`, `alcoholFreeNote`, `available`, `featured`), programme helpers and `validateTastings()`.
- Every section, menu item, tasting programme, amenity and FAQ uses a unique, lowercase URL-safe `id` (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) that doubles as an HTML anchor.
- Keep temporarily unavailable wines, glass/bottle servings, plates or tasting formats in place with `available: false` rather than deleting them. When a wine's glass pour is unavailable (`available: false` on the glass `WineServing`), its bottle can remain available; setting `available: false` on the wine itself overrides all servings.
- `menu.cellarPickIds` selects three distinct available wine IDs (covering at least two `WineStyle` values) for the Home open shelf (`components/open-shelf.tsx`). `menu.homePlateIds` selects three distinct available food IDs for the Home small-plates preview.
- Reuse the inline SVG bottle silhouettes (`slender`, `shouldered`, `sparkling`), taper candle and marks in `components/cellar-art.tsx` and the existing CSS tokens rather than adding raster image files.
- Never put business content in `site.config.json`. The Jamstacks provisioner rewrites `site.config.json` wholesale with `name`, `description`, `domain`, optional `timeZone`, `jamstacks.siteId`, `jamstacks.cdnUrl` and optional `provisioningId`. Keep the IANA `timeZone` in `site.config.json`.

## 3. Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in TSX. All theme tokens, font imports (`@fontsource-variable/literata` and `@fontsource-variable/karla`), `@theme` / `@theme inline` utility mappings, base rules and shared component classes (`.button`, `.button-quiet`, `.text-link`, `.label-link`, `.eyebrow`, `.cellar-label`, `.shelf-beam`, `.skip-link`) live in `app/tailwind.input.css`.
- Tailwind's default colour palette is disabled (`--color-*: initial`). Never use raw hex or RGB values in TSX components.
- To add or change a colour, define the CSS custom property in all three theme blocks in `app/tailwind.input.css` (`:root`, `@media (prefers-color-scheme: dark) { :root:not(.light) { … } }` and `:root.dark`) and expose it under `@theme inline`. Prefer semantic tokens (`bg-surface`, `text-ink`, `text-muted`, `bg-label`, `text-label-ink`) over `dark:` utilities.
- Cream bottle labels (`--label` / `--label-ink` / `--label-muted` / `--label-accent`) stay warm cream with dark ink in both light (**Label & linen**) and dark (**After the candles**) modes; always use `--label-*` text tokens on `.cellar-label` surfaces so dark-mode text remains high contrast.
- Map `--jamstacks-*` and `--jamstacks-toggle-*` variables to the template's tokens, keeping `--jamstacks-color-primary` dark enough in both modes for white button text.
- Preserve visible `:focus-visible` outlines (`--focus`), semantic heading hierarchy, the `.skip-link`, `prefers-reduced-motion: reduce` overrides and `@media print` rules.

## 4. Static architecture

- Next.js static export only (`output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`). Do not add request-time rendering, Route Handlers, Server Actions, middleware, databases or a production Next.js server.
- Use client components (`'use client'`) only for browser-only interactions (`OpenBadge`, `CopyEmail`, `SiteLink`, `JamstacksSupportForm`).
- Only the opening-hours badge (`OpenBadge` via `lib/hours.ts`) depends on the current clock, computed in the browser in the business's `timeZone` and refreshed every minute. Static/no-JS output must stay neutral (`See opening hours`). Never label cellar picks, serving availability or tasting formats as "today", "tonight" or "next event" from build-time dates.
- Use `SiteLink` (`components/site-link.tsx`) and the helpers in `lib/paths.ts` (`route`, `documentHref`, `asset`, `absoluteUrl`) for base-path-safe links. Links to and from `/contact/` must use full-document navigation.
- Read installed Next.js documentation in `node_modules/next/dist/docs/` before changing framework configuration or routing conventions.

## 5. Optional Jamstacks form

- Keep `components/jamstacks-support-form.tsx` unchanged in behaviour. Only `/contact/` renders `<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="…">` and loads `{cdn}/sites/{siteId}/embed.js` when a public `siteId` is configured.
- When `siteId` is blank, `/contact/` shows the direct email fallback (`mailto:`) and makes no script request. The public email address remains visible alongside the form in both states.
- Never register `<jamstacks-support-form>`, render a substitute HTML form, intercept submissions or claim a message was delivered based on local script loading.
- The hosted form supports name, email and message only. Page copy must describe enquiries confirmed by reply, never instant table bookings, ticket checkout or online payment.
- Keep only public configuration in `site.config.json` and `.env*`; never add secrets or API keys. Preserve the `provisioning_id` `workflow_dispatch` input and correlated `run-name` in `.github/workflows/pages.yml`.

## 6. Commands and checks

- Run `npm run check` (`npm test && npm run typecheck && npm run build`) after every change. Test failures in `tests/content.test.ts` and `tests/hours.test.ts` name the exact section, item, serving, programme or weekday to fix.
- Verify exports across root and project base paths and both unconfigured and configured Contact states:
  ```sh
  npm run build && npm run verify:export
  PAGES_BASE_PATH=/winebar-preview PAGES_BASE_URL=https://owner.github.io/winebar-preview JAMSTACKS_SITE=site_test123 npm run build
  PAGES_BASE_PATH=/winebar-preview PAGES_BASE_URL=https://owner.github.io/winebar-preview JAMSTACKS_SITE=site_test123 npm run verify:export
  ```
- Inspect `/` (including `#find-us` and `#tastings`), `/menu/`, `/contact/` and `/404.html` in a real browser in light and dark modes at desktop (`1440px`) and mobile (`390px` / `360px`) widths.
- Report local checks separately from live GitHub Pages deployment or real Jamstacks form delivery.

## 7. Template publishing assets (`jamstacks/`)

- The `jamstacks/` directory (`config.json`, `screenshots.json`, `home-light.jpg`, `home-dark.jpg`, `config.test.mjs`) exists solely for the Jamstacks template gallery. Customer websites can delete `jamstacks/` at any time, and Jamstacks provisioning removes it automatically.
- Nothing in `app/`, `components/`, `content/`, `lib/`, `scripts/`, `tests/` or `.github/workflows/pages.yml` may import or read from `jamstacks/`. Keep `site.config.json`, the support form component and the Pages workflow outside `jamstacks/`.
- When regenerating gallery screenshots for the template repository, run a fresh normal `npm run build`, capture light/dark screenshots with the screenshot tool, and run `node --test jamstacks/config.test.mjs` separately.
