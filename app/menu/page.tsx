import type { Metadata } from 'next';
import { CellarTableSpreadArt, LabelEyelet, SmallPlateMark } from '../../components/cellar-art.tsx';
import { PageHead } from '../../components/page-head.tsx';
import { SiteLink } from '../../components/site-link.tsx';
import { business } from '../../content/business.ts';
import {
  DIETS,
  formatNonWinePrice,
  formatWineServing,
  hasAvailableServing,
  isItemAvailable,
  ITEM_BADGES,
  menu,
  resolveWinePairings,
  startingGlassClaim,
  WINE_BODIES,
  WINE_STYLES,
  type FoodItem,
  type SoftDrinkItem,
  type WineItem,
  type WineStyle,
} from '../../content/menu.ts';
import { absoluteUrl } from '../../lib/paths.ts';

export const metadata: Metadata = {
  title: 'The cellar list & small plates',
  description:
    'Wines by the 125 ml or 150 ml glass and 750 ml bottle, small plates with ingredient notes, and house alcohol-free drinks.',
  alternates: { canonical: absoluteUrl('/menu/') },
};

const STYLE_SWATCH_CLASS: Record<WineStyle, string> = {
  sparkling: 'bg-white-wine',
  white: 'bg-white-wine',
  rose: 'bg-rose-wine',
  amber: 'bg-amber-wine',
  red: 'bg-red-wine',
};

function WineCatalogueLabel({ wine }: { wine: WineItem }) {
  const styleMeta = WINE_STYLES[wine.style];
  const itemAvailable = isItemAvailable(wine) && hasAvailableServing(wine);
  const pairings = resolveWinePairings(wine, menu);

  return (
    <article id={wine.id} className="cellar-label flex flex-col justify-between px-5 pt-3 pb-5 sm:px-6 sm:pt-3.5 sm:pb-6">
      <div>
        <div className="mb-1.5 flex justify-center">
          <LabelEyelet />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-y border-label-rule py-1.5 text-sm">
          <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-label-ink">
            <span
              aria-hidden="true"
              className={`inline-block h-2.5 w-2.5 rounded-full border border-label-ink/50 ${STYLE_SWATCH_CLASS[wine.style]}`}
            />
            {styleMeta.label} · {WINE_BODIES[wine.body]}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {wine.badge ? (
              <span className="border border-label-rule bg-label px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-label-muted">
                {ITEM_BADGES[wine.badge]}
              </span>
            ) : null}
            {!itemAvailable ? (
              <span className="border border-label-ink/40 bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent">
                Unavailable
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-3">
          <h4 className="font-serif text-2xl font-medium leading-snug text-label-ink">{wine.name}</h4>
          <p className="mt-1 text-sm font-semibold text-label-muted">
            {wine.grapes.join(', ')} <span aria-hidden="true">·</span>{' '}
            <span className="font-normal italic">{wine.origin}</span>
          </p>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-label-ink">{wine.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-label-muted">Notes:</span>
          {wine.tastingNotes.map(note => (
            <span
              key={note}
              className="border border-label-rule bg-label/90 px-2 py-0.5 text-sm font-medium text-label-ink"
            >
              {note}
            </span>
          ))}
        </div>

        {pairings.length > 0 ? (
          <p className="mt-2.5 text-sm text-label-muted">
            <span className="font-semibold text-label-ink">Good beside: </span>
            {pairings.map((plate, index) => (
              <span key={plate.id}>
                {index > 0 ? ', ' : ''}
                <a href={`#${plate.id}`} className="label-link">
                  {plate.name}
                </a>
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="mt-4 border-t border-label-rule pt-3">
        <dl className="space-y-1.5 text-sm">
          {wine.price.map(serving => {
            const formatted = formatWineServing(wine, serving, menu);
            return (
              <div key={serving.kind} className="flex items-baseline justify-between gap-1 tabular-nums">
                <dt className="font-semibold text-label-muted">
                  {formatted.kindLabel} <span className="font-normal">({formatted.volumeLabel})</span>
                </dt>
                <span aria-hidden="true" className="label-leader-dots" />
                <dd
                  className={
                    formatted.available
                      ? 'font-bold text-label-ink'
                      : 'text-label-muted line-through'
                  }
                >
                  {formatted.available ? formatted.priceLabel : `${formatted.priceLabel} (Unavailable)`}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </article>
  );
}

function FoodEntry({ item }: { item: FoodItem }) {
  const available = isItemAvailable(item);
  return (
    <li id={item.id} className="py-5 sm:py-6">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h3 className="font-serif text-xl font-medium text-ink">{item.name}</h3>
          {item.badge ? (
            <span className="border border-rule px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
              {ITEM_BADGES[item.badge]}
            </span>
          ) : null}
          {!available ? (
            <span className="border border-rule bg-surface-soft px-2 py-0.5 text-xs font-semibold text-ink">
              Unavailable
            </span>
          ) : null}
        </div>
        <span aria-hidden="true" className="leader-dots" />
        <span
          className={`tabular-nums text-base font-bold ${
            available ? 'text-ink' : 'text-muted line-through'
          }`}
        >
          {formatNonWinePrice(item, menu)}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
      {item.diet && item.diet.length > 0 ? (
        <p className="mt-2 text-sm text-muted">
          <span className="font-semibold text-ink">Dietary note: </span>
          {item.diet.map(tag => DIETS[tag].label).join(' · ')}
        </p>
      ) : null}
    </li>
  );
}

function SoftDrinkEntry({ item }: { item: SoftDrinkItem }) {
  const available = isItemAvailable(item);
  return (
    <li id={item.id} className="py-5 sm:py-6">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h3 className="font-serif text-xl font-medium text-ink">{item.name}</h3>
          {item.badge ? (
            <span className="border border-rule px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
              {ITEM_BADGES[item.badge]}
            </span>
          ) : null}
          {!available ? (
            <span className="border border-rule bg-surface-soft px-2 py-0.5 text-xs font-semibold text-ink">
              Unavailable
            </span>
          ) : null}
        </div>
        <span aria-hidden="true" className="leader-dots" />
        <span
          className={`tabular-nums text-base font-bold ${
            available ? 'text-ink' : 'text-muted line-through'
          }`}
        >
          {formatNonWinePrice(item, menu)}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
      <p className="mt-2 text-sm text-muted">
        <span className="font-semibold text-ink">Served: </span>
        {item.servingNote}
      </p>
    </li>
  );
}

export default function MenuPage() {
  const wineSections = menu.sections.filter(s => s.items.some(i => i.kind === 'wine'));
  const plateSection = menu.sections.find(s => s.id === 'small-plates');
  const alcoholFreeSection = menu.sections.find(s => s.id === 'alcohol-free');
  const glassClaim = startingGlassClaim(menu);

  return (
    <>
      <PageHead eyebrow={`${business.name} · Cellar catalogue`} title="The cellar list & small plates">
        <p>
          Poured by the glass and bottle alongside cold and warm small plates and house alcohol-free drinks.
          {glassClaim ? ` ${glassClaim}.` : ''}
        </p>
        {/* Explicit serving-volume key */}
        <dl className="cellar-frame mt-5 flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 text-sm tabular-nums text-ink">
          <div>
            <dt className="inline font-bold">Sparkling glass: </dt>
            <dd className="inline text-muted">125 ml</dd>
          </div>
          <div>
            <dt className="inline font-bold">Still wine glass: </dt>
            <dd className="inline text-muted">150 ml</dd>
          </div>
          <div>
            <dt className="inline font-bold">Table bottle: </dt>
            <dd className="inline text-muted">750 ml</dd>
          </div>
          <div>
            <dt className="inline font-bold">Alcohol-free pours: </dt>
            <dd className="inline text-muted">250 ml glass / 330 ml &amp; 750 ml bottles</dd>
          </div>
        </dl>
        {business.notice ? <p className="mt-3 text-sm text-muted">{business.notice}</p> : null}
      </PageHead>

      {/* Sticky anchor index: Wine · Plates · Alcohol-free + style shortcuts */}
      <nav
        aria-label="Menu sections"
        className="no-print sticky top-16 z-30 border-y border-rule bg-surface/95 py-2.5 shadow-xs backdrop-blur-xs sm:top-18"
      >
        <div className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-sm">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-bold">
            <a href="#wine" className="text-ink hover:text-accent-text">
              Wine
            </a>
            <span aria-hidden="true" className="text-candle">
              ♦
            </span>
            <a href="#small-plates" className="text-ink hover:text-accent-text">
              Plates
            </a>
            <span aria-hidden="true" className="text-candle">
              ♦
            </span>
            <a href="#alcohol-free" className="text-ink hover:text-accent-text">
              Alcohol-free
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            {wineSections.map((section, idx) => (
              <span key={section.id} className="inline-flex items-center gap-3">
                {idx > 0 ? <span aria-hidden="true">·</span> : null}
                <a href={`#${section.id}`} className="hover:text-ink">
                  {section.title}
                </a>
              </span>
            ))}
          </div>
        </div>
      </nav>

      <div className="wrap space-y-16 py-10 sm:py-14">
        {/* Wine catalogue (#wine) */}
        <section id="wine" aria-labelledby="wine-catalogue-heading" className="space-y-12">
          <div className="border-b border-rule pb-4">
            <p className="eyebrow">Cellar rack</p>
            <h2 id="wine-catalogue-heading" className="mt-1.5 font-serif text-3xl sm:text-4xl">
              Wines by the glass &amp; bottle
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Every bottle on the rack is described with its grapes, broad style origin, tasting notes and available
              serving sizes. When a glass pour or bottle is paused, it remains listed with an explicit unavailable
              note.
            </p>
          </div>

          {wineSections.map(section => {
            const wines = section.items.filter((i): i is WineItem => i.kind === 'wine');
            return (
              <div key={section.id} id={section.id} className="space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule/70 pb-3">
                  <h3 className="font-serif text-2xl text-ink">{section.title}</h3>
                  <p className="max-w-xl text-sm text-muted">{section.description}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {wines.map(wine => (
                    <WineCatalogueLabel key={wine.id} wine={wine} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Small plates (#small-plates) */}
        {plateSection ? (
          <section id={plateSection.id} aria-labelledby="plates-section-heading" className="border-t border-rule pt-12">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3">
                  <SmallPlateMark />
                  <p className="eyebrow">Kitchen</p>
                </div>
                <h2 id="plates-section-heading" className="mt-2.5 font-serif text-3xl text-ink">
                  {plateSection.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{plateSection.description}</p>
                <CellarTableSpreadArt className="mt-5" />
              </div>
              <div className="cellar-frame p-6 sm:p-8 lg:col-span-8">
                <ul className="divide-y divide-rule/70" role="list">
                  {plateSection.items
                    .filter((item): item is FoodItem => item.kind === 'food')
                    .map(plate => (
                      <FoodEntry key={plate.id} item={plate} />
                    ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {/* Alcohol-free drinks (#alcohol-free) */}
        {alcoholFreeSection ? (
          <section
            id={alcoholFreeSection.id}
            aria-labelledby="alcohol-free-section-heading"
            className="border-t border-rule pt-12"
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow">Zero-proof &amp; soft pours</p>
                <h2 id="alcohol-free-section-heading" className="mt-2 font-serif text-3xl text-ink">
                  {alcoholFreeSection.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{alcoholFreeSection.description}</p>
              </div>
              <div className="cellar-frame p-6 sm:p-8 lg:col-span-8">
                <ul className="divide-y divide-rule/70" role="list">
                  {alcoholFreeSection.items
                    .filter((item): item is SoftDrinkItem => item.kind === 'soft-drink')
                    .map(drink => (
                      <SoftDrinkEntry key={drink.id} item={drink} />
                    ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {/* Dietary, volume & shared-preparation notes + Tasting/private-evening enquiry CTA */}
        <section aria-labelledby="menu-notes-heading" className="grid gap-8 border-t border-rule pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="menu-notes-heading" className="font-serif text-xl text-ink">
              Serving volumes, dietary tags &amp; kitchen notes
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
              {menu.notes.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <aside
            aria-labelledby="menu-enquiry-heading"
            className="cellar-frame p-6 lg:col-span-5"
          >
            <p className="eyebrow">Tastings &amp; private evenings</p>
            <h3 id="menu-enquiry-heading" className="mt-1.5 font-serif text-2xl text-ink">
              Planning a tasting or group table?
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              We host small-group tasting flights for 4–8 guests and private communal-table evenings for 8–14 guests,
              arranged by enquiry and confirmed by reply.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SiteLink href="/contact/" className="button">
                Ask about a tasting
              </SiteLink>
              <SiteLink href="/#tastings" className="text-link text-sm">
                See tasting formats →
              </SiteLink>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
