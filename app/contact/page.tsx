import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email.tsx';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form.tsx';
import { PageHead } from '../../components/page-head.tsx';
import { SiteLink } from '../../components/site-link.tsx';
import { business } from '../../content/business.ts';
import { absoluteUrl } from '../../lib/paths.ts';
import { site } from '../../lib/site.ts';

export const metadata: Metadata = {
  title: 'Tasting & private event enquiries',
  description: business.enquiries.introduction,
  alternates: { canonical: absoluteUrl('/contact/') },
};

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);

  return (
    <>
      <PageHead eyebrow={`${business.name} · Contact`} title={business.enquiries.title}>
        <p>{business.enquiries.introduction}</p>
      </PageHead>

      <div className="wrap grid gap-10 pb-16 lg:grid-cols-12">
        <section aria-label="Enquiry form" className="lg:col-span-7">
          {hosted ? (
            <div className="border border-rule bg-surface p-6 sm:p-8">
              <JamstacksSupportForm
                siteId={site.jamstacksSite}
                embedUrl={site.jamstacksEmbedUrl}
                email={business.email}
              />
            </div>
          ) : (
            <div className="cellar-label p-6 sm:p-8">
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-label-muted">
                Direct enquiry
              </p>
              <h2 className="mt-2 font-serif text-2xl text-label-ink">Write to us by email</h2>
              <p className="mt-3 text-label-ink leading-relaxed">
                Email{' '}
                <a className="label-link" href={`mailto:${business.email}`}>
                  {business.email}
                </a>{' '}
                with your enquiry; plans are confirmed only by reply.
              </p>
              <p className="mt-3 text-sm text-label-muted">
                When a public Jamstacks site ID is configured for this website, the hosted support form loads in this
                panel automatically.
              </p>
            </div>
          )}
        </section>

        <aside aria-label="Contact details" className="grid content-start gap-6 border-t border-rule pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <div>
            <h2 className="font-serif text-xl text-ink">Useful to include in your message</h2>
            <p className="mt-1.5 text-sm text-muted">
              The enquiry form has name, email and message fields only—including these notes in your message helps us
              reply with accurate options:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
              {business.enquiries.usefulToInclude.map(tip => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-rule pt-5 space-y-3 text-sm">
            <h2 className="font-serif text-xl text-ink">Email &amp; telephone</h2>
            <p>
              <a className="text-link wrap-anywhere" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <CopyEmail email={business.email} />
            </div>
            {business.phone ? (
              <p className="pt-1">
                <span className="font-semibold text-ink">Telephone: </span>
                <a className="text-link" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>
                  {business.phone}
                </a>
              </p>
            ) : null}
          </div>

          <div className="border-t border-rule pt-5 space-y-2 text-sm">
            <h2 className="font-serif text-xl text-ink">Location &amp; opening hours</h2>
            <p className="text-muted">
              {business.address.street}, {business.address.locality}, {business.address.region}{' '}
              {business.address.postalCode} (demo landmark)
            </p>
            <p className="flex flex-wrap items-center gap-3 pt-1">
              <SiteLink href="/#find-us" className="text-link">
                See opening hours &amp; map →
              </SiteLink>
              <span aria-hidden="true" className="text-muted">·</span>
              <SiteLink href="/#tastings" className="text-link">
                Review tasting formats →
              </SiteLink>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
