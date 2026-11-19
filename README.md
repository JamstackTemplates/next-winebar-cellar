# Wick & Bramble — Cellar wine bar template (`next-winebar-cellar`)

An intimate burgundy-and-candlelight Next.js static website template for independent wine bars with a compact rotating glass and bottle list, small plates, alcohol-free pours and hosted tasting evenings.

> **Sample content notice:** **Wick & Bramble**, `hello@example.com`, `(212) 555-0163`, the wine/plate descriptions and prices, and the tasting programmes are fictitious sample content created for this template. The address **20 Times Square (northeast corner of 7th Avenue and 47th Street), New York, NY 10036** is a real public landmark used solely as a demo map location, not this wine bar's premises. Replace all sample business details, hours, map location and menu entries with your own before publishing.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: welcome & practical details, **From the open shelf** three-bottle rack (`menu.cellarPickIds`), **Find us** (`#find-us`) with hours and lazy map, **A plate beside your glass** (`menu.homePlateIds`), **Tasting evenings** (`#tastings`), **A cellar without ceremony** story & private-evening callout, six native `<details>` FAQs, and `BarOrPub` JSON-LD |
| `/menu/` | **The cellar list & small plates**: explicit serving-volume key (`125 ml`, `150 ml`, `750 ml`), sticky `Wine · Plates · Alcohol-free` anchor bar, cream cellar labels with glass/bottle availability, small plates with dietary notes and house alcohol-free drinks |
| `/contact/` | **Tasting & private event enquiries**: hosted `<jamstacks-support-form>` when a public `siteId` is configured, or a direct email fallback when unconfigured, alongside message suggestions, telephone, email and location links |
| `/404.html` | Friendly cellar-themed 404 page (“That bottle isn’t on this shelf.”) with links to Home, List and Contact |

## Quick start

Requires **Node.js 24+** and npm:

```sh
npm ci
npm run check
npm run dev
```

Open `http://localhost:3000`. To preview the static export (`out/`) exactly as GitHub Pages serves it:

```sh
npm run build
npm start
```

## Make it yours

Almost every day-to-day update is a plain-text data edit in `content/`—you never need to hand-edit SVGs or page layouts when changing wines, prices, availability or tasting formats.

| File | What to edit |
| --- | --- |
| `content/business.ts` | Business `name`, `tagline`, `introduction`, `email`, `phone`, `story`, `address` (`mapQuery` & landmark `note`), `directions`, seven-day `openingHours`, optional `notice`, `amenities`, `privateEvents`, `faqs`, `socialLinks` and `enquiries` copy |
| `site.config.json` | Public `name`, `description`, `domain` (`next-winebar-cellar.jamstacks.net` in the demo), IANA `timeZone` (`America/New_York`) and `jamstacks` configuration |
| `content/menu.ts` | Wine sections, `WineItem` glass/bottle servings and availability, `FoodItem` small plates and dietary tags, `SoftDrinkItem` alcohol-free pours, `cellarPickIds` (3 wines on the Home shelf) and `homePlateIds` (3 plates on Home) |
| `content/tastings.ts` | Recurring enquiry-led tasting formats (`TastingProgramme`), schedule notes, duration, group bounds, optional per-person price, illustrative `wineIds`, `available` and `featured` |
| `app/tailwind.input.css` | Light (**Label & linen**) and dark (**After the candles**) colour tokens, typography and shared component classes |

### Renaming your wine bar

Keep the business name in one place across content and public config so renaming is a two-line change:

1. Update `business.name` in `content/business.ts`.
2. Update `"name"` in `site.config.json`.

### Common wine & menu edits (`content/menu.ts` and `content/tastings.ts`)

#### 1. Repricing the Chenin blanc glass serving

In `content/menu.ts`, find `id: 'chenin-blanc'` and change the `glass` serving's `amount`. Both `/menu/` and the Home open shelf update automatically, as does the "Glasses from …" summary if it becomes the lowest available glass price:

```ts
{
  kind: 'wine',
  id: 'chenin-blanc',
  name: 'Chenin blanc',
  // ...
  price: [
    { kind: 'glass', volumeMl: 150, amount: 13 }, // updated from 12 to 13
    { kind: 'bottle', volumeMl: 750, amount: 46 },
  ],
}
```

#### 2. Setting only the Cabernet blend glass serving unavailable while retaining its bottle

Each serving in `price: WineServing[]` has its own optional `available` flag. Set `available: false` on the `glass` serving while leaving the `bottle` serving available:

```ts
{
  kind: 'wine',
  id: 'cabernet-blend',
  name: 'Cabernet blend',
  // ...
  price: [
    { kind: 'glass', volumeMl: 150, amount: 15, available: false }, // glass paused
    { kind: 'bottle', volumeMl: 750, amount: 58 },                  // bottle stays available
  ],
}
```

The glass serving is excluded from the starting glass price and shown as `Unavailable` on the label while the 750 ml bottle remains available.

#### 3. Marking the entire Syrah unavailable

To keep a bottle visible on `/menu/` while marking every serving unavailable, set `available: false` on the wine item itself:

```ts
{
  kind: 'wine',
  id: 'syrah',
  name: 'Syrah',
  // ...
  available: false, // overrides all servings on this item
  price: [{ kind: 'bottle', volumeMl: 750, amount: 56 }],
}
```

> **Note:** If a wine is listed in `menu.cellarPickIds` or an active tasting programme's `wineIds`, `npm test` will remind you to replace that ID with an available wine before marking the wine unavailable.

#### 4. Replacing a `cellarPickIds` reference on the Home open shelf

The Home hero's three-bottle rack is driven entirely by `menu.cellarPickIds` (three distinct available wine IDs covering at least two wine styles). To swap `skin-contact-white` for `dry-sparkling-white`, edit `cellarPickIds` at the top of `content/menu.ts`:

```ts
export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  cellarPickIds: ['chenin-blanc', 'gamay', 'dry-sparkling-white'],
  homePlateIds: ['whipped-white-bean-dip', 'marinated-olives', 'cheese-selection'],
  // ...
};
```

The bottle silhouette (`slender`, `shouldered` or `sparkling`), wine-colour fill token, hanging cream label text, prices and `/menu/#id` anchor update automatically.

#### 5. Changing tasting format copy or pausing a format in `content/tastings.ts`

Edit any `TastingProgramme` in `content/tastings.ts` to update its schedule note, guest bounds, price or included items, or set `available: false` to pause enquiries for that format:

```ts
{
  id: 'one-grape-different-places',
  title: 'One grape, different places',
  introduction: 'A focused afternoon flight looking at a single grape across contrasting regions.',
  scheduleNote: 'First and third Saturday afternoons by arrangement',
  durationMinutes: 75,
  groupSize: { min: 4, max: 8 },
  pricePerPerson: 40,
  // Set available: false to show "Not currently taking enquiries for this format" and hide its CTA
  available: true,
  // ...
}
```

#### Adding a seasonal small plate or a new menu section

- **Seasonal plate:** Add a `FoodItem` (`kind: 'food'`) to the `small-plates` section in `content/menu.ts` with `badge: 'seasonal'` and optional `diet` tags (`'vegetarian' | 'vegan' | 'gluten-free-ingredients' | 'dairy-free-ingredients' | 'contains-nuts'`).
- **New section:** Add a `MenuSection` (`{ id, title, description, items }`) to `menu.sections` in `content/menu.ts`. Wine sections automatically appear in the `/menu/` wine catalogue and sticky style bar.

## Opening hours, time zone and location

- **Opening hours:** Defined in `business.openingHours` (`content/business.ts`) using 24-hour same-day local intervals (`HH:MM`), or `{ day: 'Monday' }` for closed days.
- **Time zone:** Set `"timeZone": "America/New_York"` in `site.config.json`. `OpenBadge` computes `"Open now · until …"` or `"Closed · opens …"` in the visitor's browser using the wine bar's IANA time zone and refreshes every minute. When JavaScript is disabled or `timeZone` is blank, it shows the neutral label `See opening hours`.
- **Map & address:** Update `business.address` (`street`, `locality`, `region`, `postalCode`, `country`, `note`, `mapQuery`) and `business.directions` in `content/business.ts`. `lib/maps.ts` builds keyless Google Maps directions, search and lazy-loaded iframe embed URLs from `business.address.mapQuery`—never add a secret API key.

## Appearance, fonts and styling

### Self-hosted fonts & licences

Fonts are self-hosted via `@fontsource-variable/*` npm packages in `app/tailwind.input.css` so builds never fetch fonts from the network:

| Package | Role | Licence |
| --- | --- | --- |
| `@fontsource-variable/literata` (`^5.3.0`) | Headings, wine names and editorial pull-quotes (including restrained italic) | [SIL Open Font License 1.1](node_modules/@fontsource-variable/literata/LICENSE) |
| `@fontsource-variable/karla` (`^5.3.0`) | Body copy, bottle labels, tabular serving prices and navigation | [SIL Open Font License 1.1](node_modules/@fontsource-variable/karla/LICENSE) |

### Palette & Tailwind CSS v4 tokens

Default theme follows the visitor's device with a header toggle (`jamstacks` `ThemeProvider`, `ThemeScript` and `DarkModeToggle`):

- **Light mode (Label & linen):** `--bg: #F3EBDE`, `--surface: #FCF6EB`, `--surface-soft: #E8DBCD`, `--text: #34222B`, `--muted: #715B64`, `--accent: #78334D`, `--accent-text: #78334D`, `--rule: #B8A092`, `--label: #F9EED8`, `--label-ink: #3E2830`, `--bottle: #33443B`, `--red-wine: #713244`, `--white-wine: #CEB66D`, `--rose-wine: #D6978F`, `--amber-wine: #B67336`, `--candle: #A86628`, `--focus: #216268`.
- **Dark mode (After the candles):** `--bg: #21141B`, `--surface: #302029`, `--surface-soft: #3C2932`, `--text: #F7EBDD`, `--muted: #CEB5BD`, `--accent: #963C59`, `--accent-text: #EEB0C2`, `--rule: #90717B`, `--label: #EAD8B9`, `--label-ink: #3E2830`, `--bottle: #253E34`, `--red-wine: #B86B7F`, `--white-wine: #D5BD7A`, `--rose-wine: #E4ABA1`, `--amber-wine: #DA9D5D`, `--candle: #F0BE78`, `--focus: #94D5D3`.

To adjust or add a colour, update all three theme blocks in `app/tailwind.input.css` (`:root`, `@media (prefers-color-scheme: dark) { :root:not(.light) { … } }` and `:root.dark`) and map the variable in `@theme inline`.

### Footer credit

The footer in `components/site-footer.tsx` includes a visible credit to `jamstacks.net`. It is your website—you are welcome to keep, reword or remove it.

## Public configuration (`site.config.json`)

```json
{
  "name": "Wick & Bramble",
  "description": "An intimate burgundy-and-candlelight wine bar with an editable glass and bottle list, small plates, tasting evenings, opening hours and location, and a Jamstacks contact component for tasting and private event enquiries.",
  "domain": "next-winebar-cellar.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": {
    "siteId": "",
    "cdnUrl": "https://cdn.jamstacks.net"
  }
}
```

Replace `"domain": "next-winebar-cellar.jamstacks.net"` with your own custom domain (or leave it blank until your domain is known). Do not put menu or business content in `site.config.json`: the Jamstacks provisioner rewrites this file wholesale (adding an optional `provisioningId`).

| Environment variable | Public build-time meaning |
| --- | --- |
| `JAMSTACKS_SITE` | Public Jamstacks website ID; blank retains the file default, and an empty ID renders the email fallback on `/contact/` |
| `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | CDN base URL for the hosted form bootstrap (defaults to `https://cdn.jamstacks.net`) |
| `NEXT_PUBLIC_SITE_DOMAIN` | Hostname overriding `site.config.json`'s `domain` |
| `SITE_TIME_ZONE` | IANA time zone overriding `site.config.json`'s `timeZone` |
| `PAGES_BASE_PATH` | Optional GitHub Pages project subpath such as `/winebar-preview` |
| `PAGES_BASE_URL` | Full origin + path emitted by GitHub Pages; takes precedence for canonical URLs and `sitemap.xml` |
| `JAMSTACKS_ALLOW_LOCAL_CDN` | Set to `1` only for local Jamstacks widget testing outside CI |

Copy `.env.example` to `.env.local` for local overrides. Never store private keys, tokens or SMTP credentials in `site.config.json` or `.env*`.

## Contact & Jamstacks support form behaviour

- When `jamstacks.siteId` (or `JAMSTACKS_SITE`) is set, `/contact/` renders `<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="…">` and loads `{cdn}/sites/{siteId}/embed.js`.
- When no `siteId` is configured, `/contact/` renders no custom-element host and makes no script request, displaying a direct `mailto:` prompt (`Email hello@example.com with your enquiry; plans are confirmed only by reply.`).
- The hosted runtime owns the name, email and message fields, validation, submission and confirmation states. Links to and from `/contact/` use full-document navigation (`SiteLink`) so the bootstrap always initializes cleanly.

### Local Jamstacks development

To test against a local Jamstacks CDN server during development, set `NEXT_PUBLIC_JAMSTACKS_CDN_URL=http://localhost:8787` and `JAMSTACKS_ALLOW_LOCAL_CDN=1` (rejected automatically in GitHub Actions). Loading the script locally verifies mounting only—test real message delivery against a live configured site.

## Content Security Policy (CSP)

Because Next.js runs in static export mode (`output: 'export'`), configure HTTP response headers at your hosting provider or CDN:

- Allow same-origin scripts and styles, plus an appropriate hash or nonce policy for the inline theme bootstrap (`<ThemeScript />`).
- When using the hosted Jamstacks support form, allow `script-src` and `style-src` from your configured `jamstacks.cdnUrl` (`https://cdn.jamstacks.net`) and `connect-src` to the Jamstacks API origin.
- Allow `frame-src https://www.google.com` for the keyless Google Maps iframe in `#find-us`.

## GitHub Pages deployment

1. `.github/workflows/pages.yml` runs `npm ci`, `npm test`, `npm run typecheck` and `npm run build`, then deploys `out/` to GitHub Pages on pushes to `main` or manual `workflow_dispatch` runs (preserving `provisioning_id`).
2. In your repository's **Settings → Pages**, set **Source** to **GitHub Actions** and configure your custom domain (matching `"domain"` in `site.config.json`). Do not add a `public/CNAME` file.
3. Point your DNS `CNAME` record to `<owner>.github.io`, wait for the TLS certificate to provision, and enable **Enforce HTTPS**.

## Project structure

```text
app/                  Next.js App Router pages (/, /menu/, /contact/, 404, icon.svg, sitemap, robots, tailwind.input.css)
components/           Header, footer, OpenShelf, SVG cellar art, OpenBadge, GoogleMap, TimeZoneNote, SiteLink, JamstacksSupportForm
content/              Typed editable data and helpers: business.ts, menu.ts, tastings.ts
lib/                  Config loader, opening-hours logic, keyless map URLs, base-path helpers, BarOrPub JSON-LD
public/               Static assets including 1200×630 og.png
scripts/              Static preview server (serve.mjs), export verifier (verify-export.mjs) and starter generator (create.mjs)
tests/                Node test suite for config, content, menu/tasting helpers, hours and embed states
jamstacks/            Removable gallery manifest, light/dark screenshots and publishing test
```

## Removable `jamstacks/` folder

The `jamstacks/` directory (`config.json`, `screenshots.json`, `home-light.jpg`, `home-dark.jpg`, `config.test.mjs`) exists only for listing this template in the Jamstacks gallery. Customer websites can delete `jamstacks/` completely, and Jamstacks provisioning removes it automatically. Nothing in the website, `npm run check`, `npm run verify:export` or `.github/workflows/pages.yml` reads `jamstacks/`.

## Before publishing checklist

- [ ] Rename the wine bar in `content/business.ts` (`business.name`) and `site.config.json` (`name`).
- [ ] Replace `hello@example.com`, `(212) 555-0163`, the **20 Times Square** demo address/map query and sample opening hours in `content/business.ts`, and set your IANA `timeZone` and `domain` in `site.config.json`.
- [ ] Replace the sample wines, serving prices, small plates, alcohol-free drinks and `cellarPickIds` / `homePlateIds` in `content/menu.ts`.
- [ ] Update or pause the recurring tasting formats in `content/tastings.ts`.
- [ ] Replace `public/og.png` (1200×630) and `app/icon.svg` if you have custom brand artwork.
- [ ] Delete any planning documents (`PLAN.md`, `PROMPT_TEMPLATE.md`, `VALIDATION.md`) and, optionally, the `jamstacks/` gallery folder.
- [ ] Run `npm run check` and `npm run verify:export` to confirm all tests, types and canonical URLs pass.
