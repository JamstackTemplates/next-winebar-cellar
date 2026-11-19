import { SiteLink } from '../components/site-link.tsx';
import { business } from '../content/business.ts';

export default function NotFound() {
  return (
    <section className="wrap py-20 sm:py-28">
      <div className="max-w-xl">
        <p className="eyebrow">{business.name} · 404</p>
        <h1 className="mt-2.5 font-serif text-4xl sm:text-5xl text-ink">
          That bottle isn’t on this shelf.
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          The page you were looking for has moved or does not exist. Return to the open shelf, browse the full glass
          and bottle list, or send us an enquiry.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <SiteLink href="/" className="button">
            Home
          </SiteLink>
          <SiteLink href="/menu/" className="button button-quiet">
            List
          </SiteLink>
          <SiteLink href="/contact/" className="button button-quiet">
            Contact
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
