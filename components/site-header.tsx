import { DarkModeToggle } from 'jamstacks';
import { business } from '../content/business.ts';
import { WineryCrest } from './cellar-art.tsx';
import { SiteLink } from './site-link.tsx';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/95 shadow-[0_2px_0_0_var(--surface),0_3px_0_0_var(--rule)] backdrop-blur-xs">
      <div className="wrap flex min-h-16 items-center justify-between gap-2 py-2 sm:min-h-18 sm:gap-4">
        <SiteLink
          href="/"
          className="flex items-center gap-2 font-serif text-base font-semibold leading-[1.1] tracking-tight text-ink no-underline sm:gap-2.5 sm:text-xl"
        >
          <WineryCrest className="hidden h-7 w-7 sm:block sm:h-8 sm:w-8" />
          <span className="max-w-34 sm:max-w-none">{business.name}</span>
        </SiteLink>
        <nav
          aria-label="Primary"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold sm:gap-5 sm:text-base"
        >
          <SiteLink href="/menu/" markCurrent="page" className="inline-flex min-h-9 items-center px-0.5 text-ink">
            List
          </SiteLink>
          <span aria-hidden="true" className="text-candle">
            ♦
          </span>
          <SiteLink href="/#tastings" className="inline-flex min-h-9 items-center px-0.5 text-ink">
            Tastings
          </SiteLink>
          <span aria-hidden="true" className="text-candle">
            ♦
          </span>
          <SiteLink href="/contact/" markCurrent="page" className="inline-flex min-h-9 items-center px-0.5 text-ink">
            Contact
          </SiteLink>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
