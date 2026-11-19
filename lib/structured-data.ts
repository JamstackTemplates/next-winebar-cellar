import { business } from '../content/business.ts';
import { menu, menuPriceRange } from '../content/menu.ts';
import { absoluteUrl } from './paths.ts';

/**
 * schema.org BarOrPub structured data built from `content/business.ts` and `content/menu.ts`.
 * No ratings, fake coordinates, reservation actions or event schema for undated recurring tasting formats.
 * Replace the sample address and opening hours in `content/business.ts` before publishing.
 */
export function businessStructuredData() {
  const url = absoluteUrl('/');
  const menuUrl = absoluteUrl('/menu/');
  const sameAs = business.socialLinks.filter(link => link.url.trim()).map(link => link.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: business.name,
    description: business.introduction,
    ...(url ? { url } : {}),
    ...(menuUrl ? { hasMenu: menuUrl } : {}),
    email: business.email,
    ...(business.phone ? { telephone: business.phone } : {}),
    priceRange: menuPriceRange(menu),
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: business.openingHours
      .filter((entry): entry is typeof entry & { opens: string; closes: string } => Boolean(entry.opens && entry.closes))
      .map(entry => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${entry.day}`,
        opens: entry.opens,
        closes: entry.closes,
      })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Prevent content containing a closing script tag from escaping JSON-LD. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
