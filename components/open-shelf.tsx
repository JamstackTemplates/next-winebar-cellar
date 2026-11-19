import {
  formatWineServing,
  hasAvailableServing,
  isItemAvailable,
  menu,
  resolveWinePairings,
  selectCellarPicks,
  WINE_BODIES,
  WINE_STYLES,
  type Menu,
  type WineStyle,
} from '../content/menu.ts';
import { BottleSilhouette, GrapevineAromaBackdrop, LabelEyelet, ShelfCandle } from './cellar-art.tsx';
import { SiteLink } from './site-link.tsx';

const STYLE_SWATCH_CLASS: Record<WineStyle, string> = {
  sparkling: 'bg-white-wine',
  white: 'bg-white-wine',
  rose: 'bg-rose-wine',
  amber: 'bg-amber-wine',
  red: 'bg-red-wine',
};

/**
 * The open shelf: signature cellar-rack composition derived from `menu.cellarPickIds`.
 * Renders three bottle silhouettes (`slender`, `shouldered`, `sparkling`) with companion poured glasses
 * and the middle bottle slightly taller, accompanied by a taper candle on the sculpted horizontal shelf beam
 * and attached HTML cream bottle labels below.
 */
export function OpenShelf({ sourceMenu = menu }: { sourceMenu?: Menu }) {
  const picks = selectCellarPicks(sourceMenu);

  if (picks.length === 0) {
    return (
      <div className="mt-8 border-t border-rule pt-6">
        <p className="text-muted">
          Explore our full glass and bottle selection on{' '}
          <SiteLink href="/menu/" className="text-link">
            the cellar list
          </SiteLink>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="cellar-alcove mt-5 p-4 sm:mt-6 sm:p-5">
      {/* Top cellar rack header plaque */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2.5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-block h-2 w-2 rotate-45 bg-candle" />
          <p className="eyebrow text-ink">From the open shelf · Cellar selection</p>
        </div>
        <p className="text-sm text-muted">
          Poured by the 125 ml / 150 ml glass &amp; 750 ml bottle ·{' '}
          <SiteLink href="/menu/#wine" className="text-link">
            Full cellar catalogue →
          </SiteLink>
        </p>
      </div>

      {/* Mobile compact decorative 3-bottle shelf above the readable HTML labels */}
      <div aria-hidden="true" className="decorative-art overflow-hidden md:hidden">
        <div className="flex items-end justify-between gap-1 px-1 pt-2">
          {picks.map((wine, index) => (
            <div key={wine.id} className="flex min-w-0 flex-1 flex-col items-center">
              <BottleSilhouette
                shape={wine.bottleShape}
                style={wine.style}
                tall={index === 1}
                className={`${index === 1 ? 'h-26' : 'h-22'} max-w-full`}
              />
            </div>
          ))}
          <ShelfCandle className="h-18 w-auto shrink-0" />
        </div>
        <div className="shelf-beam w-full" />
      </div>

      {/* Desktop 3-bay architectural cellar rack aligned with the three hanging labels */}
      <div aria-hidden="true" className="decorative-art relative hidden overflow-hidden md:block">
        {/* Hanging grapevine clusters & red-wine aroma ribbons in the upper rack corners */}
        <GrapevineAromaBackdrop className="absolute -top-2 left-0 h-32 w-auto opacity-85" />
        <GrapevineAromaBackdrop flip className="absolute -top-2 right-0 h-32 w-auto opacity-85" />

        <div className="relative z-10 grid grid-cols-3 divide-x divide-rule/45 pt-2">
          {picks.map((wine, index) => (
            <div key={wine.id} className="relative flex flex-col items-center justify-end px-4 pt-1">
              <BottleSilhouette
                shape={wine.bottleShape}
                style={wine.style}
                tall={index === 1}
              />
              {index === 2 ? (
                <div className="absolute right-2 bottom-0 lg:right-4">
                  <ShelfCandle className="h-24 w-auto" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="shelf-beam w-full" />
      </div>

      {/* Hanging cream cellar labels carrying all real HTML text and tabular serving prices */}
      <div className="mt-4 grid gap-4 md:mt-2 md:grid-cols-3 md:items-stretch md:gap-5">
        {picks.map((wine, index) => {
          const styleMeta = WINE_STYLES[wine.style];
          const itemAvailable = isItemAvailable(wine) && hasAvailableServing(wine);
          const pairings = resolveWinePairings(wine, sourceMenu);

          return (
            <article
              key={wine.id}
              className="cellar-label flex h-full flex-col justify-between px-4 pt-2 pb-3.5 sm:px-5 sm:pt-2.5 sm:pb-4"
            >
              <div>
                {/* Brass hanging eyelet at top center of label */}
                <div className="mb-1 flex justify-center">
                  <LabelEyelet />
                </div>

                {/* Top label metadata & rack bay number */}
                <div className="flex items-center justify-between gap-2 border-y border-label-rule py-1 text-xs sm:text-sm text-label-muted">
                  <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-label-ink">
                    <span
                      aria-hidden="true"
                      className={`inline-block h-2.5 w-2.5 rounded-full border border-label-ink/50 ${STYLE_SWATCH_CLASS[wine.style]}`}
                    />
                    {styleMeta.short} · {WINE_BODIES[wine.body]}
                  </span>
                  <span className="tabular-nums font-semibold tracking-wider uppercase text-label-muted">
                    Bay 0{index + 1}
                  </span>
                </div>

                {/* Wine name, grapes & broad origin */}
                <div className="mt-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-medium leading-tight text-label-ink">
                    <SiteLink
                      href={`/menu/#${wine.id}`}
                      className="text-label-ink no-underline hover:text-label-accent hover:underline"
                    >
                      {wine.name}
                    </SiteLink>
                  </h2>
                  <p className="mt-0.5 text-sm font-semibold text-label-muted">
                    {wine.grapes.join(', ')} <span aria-hidden="true">·</span>{' '}
                    <span className="font-normal italic">{wine.origin}</span>
                  </p>
                </div>

                {/* Tasting notes rendered as tactile cellar tags */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <span className="sr-only">Tasting notes: </span>
                  {wine.tastingNotes.map(note => (
                    <span
                      key={note}
                      className="border border-label-rule bg-label/90 px-2 py-0.5 text-sm leading-tight font-medium text-label-ink"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {!itemAvailable ? (
                  <p className="mt-2 inline-block border border-label-ink/40 bg-accent px-2.5 py-1 text-sm font-semibold text-on-accent">
                    Currently unavailable
                  </p>
                ) : null}
              </div>

              {/* Serving prices with dotted leaders & menu anchor link */}
              <div className="mt-2.5 border-t border-label-rule pt-2">
                <dl className="space-y-1 text-sm">
                  {wine.price.map(serving => {
                    const formatted = formatWineServing(wine, serving, sourceMenu);
                    return (
                      <div
                        key={serving.kind}
                        className="flex items-baseline justify-between gap-1 tabular-nums"
                      >
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
                          {formatted.available
                            ? formatted.priceLabel
                            : `${formatted.priceLabel} (Unavailable)`}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-label-rule/70 pt-2 text-sm">
                  {pairings.length > 0 ? (
                    <span className="text-label-muted">
                      Beside:{' '}
                      <SiteLink href={`/menu/#${pairings[0].id}`} className="label-link">
                        {pairings[0].name}
                      </SiteLink>
                    </span>
                  ) : (
                    <span className="text-label-muted">{wine.origin}</span>
                  )}
                  <SiteLink href={`/menu/#${wine.id}`} className="label-link">
                    Label details →
                  </SiteLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
