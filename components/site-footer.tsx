import { business } from '../content/business.ts';
import { WineryCrest } from './cellar-art.tsx';
import { SiteLink } from './site-link.tsx';

export function SiteFooter() {
  const { street, locality, region, postalCode } = business.address;

  return (
    <footer className="mt-20 border-t border-rule bg-surface/60 py-10 text-sm text-muted shadow-[0_-2px_0_0_var(--bg),0_-3px_0_0_var(--rule)]">
      <div className="wrap flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-start gap-3.5">
          <WineryCrest className="mt-0.5 h-9 w-9" />
          <div className="space-y-1.5">
            <p className="font-serif text-base font-medium text-ink">
              {business.name}{' '}
              <span className="font-sans text-sm font-normal text-muted">
                — {street}, {locality}, {region} {postalCode} (sample landmark)
              </span>
            </p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <SiteLink href="/menu/" className="text-link">
                The cellar list
              </SiteLink>
              <span aria-hidden="true" className="text-candle">
                ♦
              </span>
              <SiteLink href="/#tastings" className="text-link">
                Tasting evenings
              </SiteLink>
              <span aria-hidden="true" className="text-candle">
                ♦
              </span>
              <SiteLink href="/#find-us" className="text-link">
                Address &amp; opening hours
              </SiteLink>
              <span aria-hidden="true" className="text-candle">
                ♦
              </span>
              <SiteLink href="/contact/" className="text-link">
                Enquiries
              </SiteLink>
            </p>
          </div>
        </div>
        <p className="shrink-0">
          <span title="Made with love by jamstacks.net">
            with <span role="img" aria-label="love">❤️</span>{' '}
            <a className="no-underline hover:text-accent-text hover:underline" href="https://jamstacks.net">
              jamstacks.net
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
