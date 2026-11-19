import type { Metadata } from 'next';
import {
  CellarTableSpreadArt,
  GrapevineAromaBackdrop,
  LabelEyelet,
  SmallPlateMark,
  StoryCandleMark,
  TastingCardMark,
  TastingFlightArt,
} from '../components/cellar-art.tsx';
import { GoogleMap } from '../components/google-map.tsx';
import { OpenBadge } from '../components/open-badge.tsx';
import { OpenShelf } from '../components/open-shelf.tsx';
import { SiteLink } from '../components/site-link.tsx';
import { TimeZoneNote } from '../components/time-zone-note.tsx';
import { business } from '../content/business.ts';
import {
  DIETS,
  formatNonWinePrice,
  isItemAvailable,
  ITEM_BADGES,
  menu,
  selectHomePlates,
  startingGlassClaim,
} from '../content/menu.ts';
import {
  formatGroupSize,
  formatProgrammePrice,
  programmeEnquiryState,
  resolveProgrammeWines,
  selectFeaturedProgramme,
  tastings,
  type TastingProgramme,
} from '../content/tastings.ts';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps.ts';
import { absoluteUrl } from '../lib/paths.ts';
import { businessStructuredData, jsonLd } from '../lib/structured-data.ts';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

function ProgrammeWineLinks({ programme }: { programme: TastingProgramme }) {
  const wines = resolveProgrammeWines(programme, menu);
  if (wines.length === 0) return null;

  return (
    <p className="mt-3 text-sm text-muted">
      <span className="font-semibold text-ink">Illustrative pours (subject to reply, not reserved stock): </span>
      {wines.map((wine, idx) => (
        <span key={wine.id}>
          {idx > 0 ? ', ' : ''}
          <SiteLink href={`/menu/#${wine.id}`} className="text-link">
            {wine.name}
          </SiteLink>
        </span>
      ))}
    </p>
  );
}

export default function HomePage() {
  const glassClaim = startingGlassClaim(menu);
  const plates = selectHomePlates(menu);
  const featuredProgramme = selectFeaturedProgramme(tastings);
  const secondaryProgrammes = featuredProgramme
    ? tastings.filter(p => p.id !== featuredProgramme.id)
    : tastings;

  return (
    <>
      {/* 1. Welcome and open shelf */}
      <section className="relative overflow-hidden pt-5 pb-12 sm:pt-7 sm:pb-16">
        {/* Subtle hero background grapevine & red-wine aroma filigree */}
        <GrapevineAromaBackdrop
          flip
          className="hidden lg:block absolute top-0 right-[max(1rem,calc(50%-37rem))] h-44 w-auto opacity-35"
        />
        <div className="wrap relative z-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2">
              <span aria-hidden="true" className="text-candle">
                ♦
              </span>
              <span>{business.name} · Neighbourhood wine bar &amp; cellar</span>
            </p>
            <h1 className="mt-2 font-serif text-[clamp(2.25rem,4.7vw,3.9rem)] font-medium leading-[1.05] tracking-tight text-ink">
              A small cellar.{' '}
              <em className="font-normal italic text-accent-text">A generous welcome.</em>
            </h1>
            <p className="mt-3 max-w-2xl text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-muted">
              {business.introduction}
            </p>
          </div>

          {/* Framed Cellar Notes & Hours plaque before the rack */}
          <div className="cellar-frame p-4 sm:p-5 lg:col-span-5">
            <dl className="space-y-2 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule/60 pb-2">
                <dt className="font-bold uppercase tracking-wider text-muted">By the glass</dt>
                <dd className="tabular-nums font-bold text-ink">
                  {glassClaim ? (
                    <SiteLink href="/menu/#wine" className="text-link">
                      {glassClaim}
                    </SiteLink>
                  ) : (
                    <SiteLink href="/menu/#wine" className="text-link">
                      See full bottle &amp; drink list
                    </SiteLink>
                  )}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule/60 pb-2">
                <dt className="font-bold uppercase tracking-wider text-muted">Hours</dt>
                <dd className="inline-flex items-center gap-2 font-semibold text-ink">
                  <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-candle" />
                  <OpenBadge hours={business.openingHours} />
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <dt className="font-bold uppercase tracking-wider text-muted">Location</dt>
                <dd className="text-ink">
                  {business.address.street}, {business.address.locality} ·{' '}
                  <SiteLink href="/#find-us" className="text-link">
                    Find us &amp; hours
                  </SiteLink>
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <SiteLink href="/menu/" className="button">
                Explore the list →
              </SiteLink>
              <SiteLink href="/#tastings" className="button button-quiet">
                Ask about a tasting
              </SiteLink>
            </div>
          </div>
        </div>

        {/* Signature element: The open shelf */}
        <OpenShelf sourceMenu={menu} />
        </div>
      </section>

      {/* 2. Find us (#find-us) directly under the hero: shallow location spread with map beneath practical text */}
      <section
        id="find-us"
        aria-labelledby="find-us-heading"
        className="border-y border-rule bg-surface py-14 sm:py-16"
      >
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-5">
            <div>
              <p className="eyebrow">Find us · Address &amp; visiting hours</p>
              <h2 id="find-us-heading" className="mt-1.5 font-serif text-3xl sm:text-4xl">
                {business.address.street}, {business.address.locality}, {business.address.region}{' '}
                {business.address.postalCode}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <a
                href={mapDirectionsUrl(business.address.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-quiet"
              >
                Get directions
              </a>
              <a
                href={mapSearchUrl(business.address.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link px-2 py-1"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          {/* Practical text columns above the map */}
          <div className="mt-7 grid gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-4">
              <div className="border-l-2 border-accent bg-surface-soft/55 p-4">
                <p className="text-sm font-bold uppercase tracking-wider text-ink">Demo landmark notice</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{business.address.note}</p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-ink">Direct cellar contact</p>
                <p>
                  {business.phone ? (
                    <>
                      <a className="text-link" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>
                        {business.phone}
                      </a>
                      {' · '}
                    </>
                  ) : null}
                  <a className="text-link" href={`mailto:${business.email}`}>
                    {business.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              {business.directions.map(note => (
                <div key={note.heading} className="border-b border-rule/60 pb-3.5 last:border-b-0 last:pb-0">
                  <h3 className="font-serif text-lg font-medium text-ink">{note.heading}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="cellar-frame p-5 lg:col-span-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-lg font-medium text-ink">Opening hours</h3>
                <span className="text-sm font-semibold text-accent-text">
                  <OpenBadge hours={business.openingHours} />
                </span>
              </div>
              <dl className="mt-2.5 divide-y divide-rule/50 border-t border-b border-rule/60 text-sm">
                {business.openingHours.map(entry => (
                  <div key={entry.day} className="flex justify-between py-1.5 tabular-nums">
                    <dt className="font-medium text-ink">{entry.day}</dt>
                    <dd className="text-muted">
                      {entry.opens && entry.closes ? `${entry.opens}–${entry.closes}` : 'Closed'}
                    </dd>
                  </div>
                ))}
              </dl>
              <TimeZoneNote />
            </div>
          </div>

          {/* Shallow map spread beneath the practical text */}
          <div className="cellar-frame mt-8 p-1.5">
            <GoogleMap
              address={business.address.mapQuery}
              title={`Map showing ${business.address.street}, ${business.address.locality} (sample landmark)`}
            />
          </div>
        </div>
      </section>

      {/* 3. A plate beside your glass */}
      <section aria-labelledby="home-plates-heading" className="wrap py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <SmallPlateMark />
              <p className="eyebrow">From the kitchen</p>
            </div>
            <h2 id="home-plates-heading" className="mt-3 font-serif text-3xl sm:text-4xl">
              A plate beside your glass
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Our small plates are built for grazing while a bottle opens up: warm sourdough, marinated olives,
              whipped white bean dip, seasonal toast and cheese with toasted walnuts.
            </p>
            <p className="mt-3 text-sm text-muted">
              Alcohol-free spritzes, citrus-rosemary soda and mineral water are listed alongside every food section.
            </p>

            <CellarTableSpreadArt className="mt-5" />

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <SiteLink href="/menu/#small-plates" className="button button-quiet">
                See all small plates
              </SiteLink>
              <SiteLink href="/menu/#alcohol-free" className="text-link text-sm">
                Alcohol-free drinks →
              </SiteLink>
            </div>
          </div>

          <div className="cellar-frame p-6 sm:p-8 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between border-b border-rule pb-3">
              <span className="eyebrow text-ink">Selected kitchen plates</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Served till close</span>
            </div>

            {plates.length > 0 ? (
              <ul className="divide-y divide-rule/70" role="list">
                {plates.map(plate => {
                  const available = isItemAvailable(plate);
                  return (
                    <li key={plate.id} className="py-4 first:pt-1 last:pb-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h3 className="font-serif text-xl font-medium text-ink">
                            <SiteLink
                              href={`/menu/#${plate.id}`}
                              className="text-ink no-underline hover:text-accent-text hover:underline"
                            >
                              {plate.name}
                            </SiteLink>
                          </h3>
                          {plate.badge ? (
                            <span className="border border-rule px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
                              {ITEM_BADGES[plate.badge]}
                            </span>
                          ) : null}
                          {!available ? (
                            <span className="border border-rule bg-surface-soft px-2 py-0.5 text-xs font-semibold text-ink">
                              Currently unavailable
                            </span>
                          ) : null}
                        </div>
                        <span aria-hidden="true" className="leader-dots" />
                        <span
                          className={`tabular-nums text-base font-bold ${
                            available ? 'text-ink' : 'text-muted line-through'
                          }`}
                        >
                          {formatNonWinePrice(plate, menu)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{plate.description}</p>
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                        {plate.diet && plate.diet.length > 0 ? (
                          <p className="text-muted">
                            <span className="font-semibold text-ink">Dietary note: </span>
                            {plate.diet.map(tag => DIETS[tag].label).join(' · ')}
                          </p>
                        ) : (
                          <span />
                        )}
                        <SiteLink href={`/menu/#${plate.id}`} className="text-link">
                          On the menu →
                        </SiteLink>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="border-y border-rule py-6 text-muted">
                Browse our full kitchen selection on{' '}
                <SiteLink href="/menu/#small-plates" className="text-link">
                  the small plates list
                </SiteLink>
                .
              </p>
            )}
            <p className="mt-4 border-t border-rule pt-3 text-sm text-muted">
              Prepared in a small shared kitchen where allergens are handled; see full dietary notes on{' '}
              <SiteLink href="/menu/#small-plates" className="text-link">
                the menu
              </SiteLink>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 4. Tasting evenings (#tastings) */}
      <section
        id="tastings"
        aria-labelledby="tastings-heading"
        className="border-y border-rule bg-surface-soft py-14 sm:py-18"
      >
        <div className="wrap">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <TastingCardMark />
                <p className="eyebrow">Tasting evenings · Recurring formats by arrangement</p>
              </div>
              <h2 id="tastings-heading" className="mt-2.5 font-serif text-3xl sm:text-4xl">
                Tasting evenings around the cellar table
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                Our tastings are recurring small-group formats arranged by enquiry rather than dated ticketed events.
                Tell us which format appeals to your group and we will confirm available evenings, bottles and
                alcohol-free options by reply.
              </p>
            </div>
            <div className="shrink-0">
              <SiteLink href="/contact/" className="button">
                Send a tasting enquiry
              </SiteLink>
            </div>
          </div>

          {/* Featured active programme expanded as an open tasting card */}
          {featuredProgramme ? (
            <article id={featuredProgramme.id} className="cellar-frame mt-8 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-4">
                <div>
                  <p className="eyebrow text-accent-text">Featured tasting format · Format 01</p>
                  <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-ink">{featuredProgramme.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3 border border-rule bg-surface-soft/70 px-3.5 py-1.5 tabular-nums text-sm font-semibold text-ink">
                  <span>{featuredProgramme.scheduleNote}</span>
                  <span aria-hidden="true" className="text-candle">
                    ♦
                  </span>
                  <span>{featuredProgramme.durationMinutes} minutes</span>
                  <span aria-hidden="true" className="text-candle">
                    ♦
                  </span>
                  <span>{formatGroupSize(featuredProgramme)}</span>
                  <span aria-hidden="true" className="text-candle">
                    ♦
                  </span>
                  <span className="text-accent-text">{formatProgrammePrice(featuredProgramme, menu)}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="text-ink leading-relaxed">{featuredProgramme.introduction}</p>
                  <h4 className="mt-4 font-sans text-sm font-bold uppercase tracking-wider text-muted">
                    What the evening includes
                  </h4>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink">
                    {featuredProgramme.includes.map(line => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <ProgrammeWineLinks programme={featuredProgramme} />
                </div>

                <div className="flex flex-col justify-between border-t border-rule pt-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                  <div>
                    <TastingFlightArt className="mb-3" />
                    <div className="space-y-2.5 text-sm">
                      <p className="font-semibold text-ink">
                        {programmeEnquiryState(featuredProgramme).statusLabel}
                      </p>
                      <p className="text-muted leading-relaxed">{featuredProgramme.alcoholFreeNote}</p>
                      <p className="text-muted">
                        Submitting an enquiry starts a conversation; no seats, bottles or payments are taken or
                        confirmed until we reply.
                      </p>
                    </div>
                  </div>
                  {programmeEnquiryState(featuredProgramme).ctaHref ? (
                    <div className="mt-5">
                      <SiteLink
                        href={programmeEnquiryState(featuredProgramme).ctaHref!}
                        className="button w-full sm:w-auto"
                      >
                        {programmeEnquiryState(featuredProgramme).ctaLabel}
                      </SiteLink>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}

          {/* Remaining compact format descriptions */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {secondaryProgrammes.map((programme, idx) => {
              const state = programmeEnquiryState(programme);
              return (
                <article
                  key={programme.id}
                  id={programme.id}
                  className="cellar-frame flex flex-col justify-between p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule/70 pb-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">
                          Format 0{idx + 2}
                        </p>
                        <h3 className="mt-0.5 font-serif text-2xl text-ink">{programme.title}</h3>
                      </div>
                      <span className="tabular-nums text-sm font-bold text-accent-text">
                        {formatProgrammePrice(programme, menu)}
                      </span>
                    </div>

                    <p className="mt-2.5 tabular-nums text-sm font-semibold text-muted">
                      {programme.scheduleNote} · {programme.durationMinutes} minutes · {formatGroupSize(programme)}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-ink">{programme.introduction}</p>

                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                      {programme.includes.map(line => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>

                    <ProgrammeWineLinks programme={programme} />
                    <p className="mt-2 text-sm text-muted">{programme.alcoholFreeNote}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule/70 pt-3.5 text-sm">
                    <span className={state.available ? 'font-medium text-muted' : 'font-semibold text-ink'}>
                      {state.statusLabel}
                    </span>
                    {state.ctaHref && state.ctaLabel ? (
                      <SiteLink href={state.ctaHref} className="text-link">
                        {state.ctaLabel} →
                      </SiteLink>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. A cellar without ceremony */}
      <section aria-labelledby="story-heading" className="wrap py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="eyebrow">Our approach</p>
            <h2 id="story-heading" className="mt-2 font-serif text-3xl sm:text-4xl">
              {business.story.heading}
            </h2>
            <div className="mt-4 space-y-4 text-ink leading-relaxed">
              {business.story.paragraphs.map((paragraph, idx) => (
                <p
                  key={paragraph}
                  className={
                    idx === 0
                      ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:leading-none first-letter:text-accent-text'
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <StoryCandleMark className="mt-6" />

            <dl className="mt-6 grid gap-4 border-t border-rule pt-6 sm:grid-cols-3">
              {business.amenities.map(item => (
                <div key={item.id} className="border-l-2 border-rule pl-3.5">
                  <dt className="font-serif text-base font-medium text-ink">{item.label}</dt>
                  <dd className="mt-1 text-sm text-muted">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside
            aria-labelledby="private-events-heading"
            className="cellar-label p-6 sm:p-8 lg:col-span-5"
          >
            <div className="mb-2 flex justify-center">
              <LabelEyelet />
            </div>
            <p className="text-center font-sans text-xs font-bold uppercase tracking-widest text-label-muted">
              Private evenings · Cellar table
            </p>
            <h3 id="private-events-heading" className="mt-2 text-center font-serif text-2xl text-label-ink">
              {business.privateEvents.heading}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-label-ink">{business.privateEvents.description}</p>
            <p className="mt-3 border-l-2 border-label-accent pl-3.5 text-sm font-semibold text-label-muted">
              {business.privateEvents.groupSizeNote}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-label-rule pt-4">
              <SiteLink href="/contact/" className="button">
                Ask about a private evening
              </SiteLink>
              <SiteLink href="/menu/" className="label-link text-sm">
                Review the list →
              </SiteLink>
            </div>
          </aside>
        </div>
      </section>

      {/* 6. Before you settle in: six native details FAQs */}
      <section aria-labelledby="faq-heading" className="border-t border-rule bg-surface py-14 sm:py-18">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow">Practical questions</p>
            <h2 id="faq-heading" className="mt-2 font-serif text-3xl sm:text-4xl">
              Before you settle in
            </h2>
            <p className="mt-2.5 text-muted">
              Answers to common questions about glasses, bottles, tastings and dietary notes. Have another question?{' '}
              <SiteLink href="/contact/" className="text-link">
                Send us an enquiry
              </SiteLink>
              .
            </p>
          </div>

          <div className="mt-8 divide-y divide-rule border-y border-rule">
            {business.faqs.map(faq => (
              <details key={faq.id} id={faq.id} className="faq-item py-4 sm:py-5">
                <summary className="flex items-baseline gap-3 font-serif text-lg font-medium text-ink sm:text-xl">
                  <span
                    aria-hidden="true"
                    className="faq-chevron inline-block shrink-0 font-sans text-lg font-bold text-accent-text transition-transform duration-150"
                  >
                    +
                  </span>
                  <span>{faq.question}</span>
                </summary>
                <div className="mt-3 max-w-3xl pl-6 text-sm leading-relaxed text-muted sm:text-base">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(businessStructuredData()) }}
      />
    </>
  );
}
