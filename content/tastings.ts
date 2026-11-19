import {
  allMenuItems,
  allWines,
  formatPrice,
  hasAvailableServing,
  isItemAvailable,
  menu,
  type Menu,
  type WineItem,
} from './menu.ts';

// Recurring enquiry-led tasting formats (never a dated event calendar or instant checkout).
// Edit format descriptions, group bounds, prices or availability here; Home reads directly from this file.
// Plain text only: values are rendered as text, never raw HTML.

export interface GroupSizeBounds {
  /** Minimum number of guests for the format (positive integer). */
  min: number;
  /** Maximum number of guests for the format (positive integer >= min). */
  max: number;
}

export interface TastingProgramme {
  /** Unique, URL-safe identifier used as an anchor such as /#cellar-introductions. */
  id: string;
  /** Format title. */
  title: string;
  /** Approachable plain-text overview of the tasting format. */
  introduction: string;
  /** Recurring schedule note (never a specific calendar date or "next Thursday"). */
  scheduleNote: string;
  /** Typical duration in minutes (positive integer). */
  durationMinutes: number;
  /** Guest count range for the format. */
  groupSize: GroupSizeBounds;
  /** Optional price per person in `menu.currency`; omit when pricing is arranged on enquiry. */
  pricePerPerson?: number;
  /** Plain-text list of what the format includes (no unlimited-pour or fixed-stock promises). */
  includes: string[];
  /** Illustrative example `WineItem` IDs from `content/menu.ts`, subject to change when confirmed by reply. */
  wineIds: string[];
  /** Note explaining how alcohol-free guests are accommodated by reply. */
  alcoholFreeNote: string;
  /** Set to false to pause enquiries for this format while keeping its description visible. */
  available?: boolean;
  /** Highlight this format as the expanded tasting card on the Home page. */
  featured?: boolean;
}

export const tastings: TastingProgramme[] = [
  {
    id: 'cellar-introductions',
    title: 'Cellar introductions',
    introduction:
      'An unhurried evening around the tasting table exploring how climate, grape skin and cellar touch shape what is in your glass—guided in plain language without textbook jargon.',
    scheduleNote: 'Thursday evenings by arrangement',
    durationMinutes: 60,
    groupSize: { min: 4, max: 8 },
    pricePerPerson: 32,
    includes: [
      'Four 75 ml tasting pours across sparkling, white, amber or red styles',
      'Warm country sourdough, olive oil and marinated olives for the table',
      'Printed tasting notes to take home, with bottles proposed when we reply to your enquiry',
    ],
    wineIds: ['dry-sparkling-white', 'chenin-blanc', 'gamay'],
    alcoholFreeNote:
      'Alcohol-free guests are welcome; mention how many in your enquiry and we will outline house spritz and infusion pairings by reply.',
    available: true,
    featured: true,
  },
  {
    id: 'one-grape-different-places',
    title: 'One grape, different places',
    introduction:
      'A focused afternoon flight looking at a single grape or style across contrasting regions and cellar traditions, poured side by side with small plates.',
    scheduleNote: 'Selected Saturday afternoons by arrangement',
    durationMinutes: 75,
    groupSize: { min: 4, max: 8 },
    pricePerPerson: 38,
    includes: [
      'Four comparative 75 ml pours chosen around your group’s interests',
      'Shared plates of whipped white bean dip and cheese selection beside the flight',
      'Informal guided discussion with time to linger over a favourite pour',
    ],
    wineIds: ['chenin-blanc', 'skin-contact-white', 'tempranillo'],
    alcoholFreeNote:
      'We can prepare a parallel flight of botanical sodas and cordials if arranged ahead by reply.',
    available: true,
  },
  {
    id: 'your-own-table',
    title: 'Your own table',
    introduction:
      'Set aside our communal table for a private evening lasting 60–90 minutes, with a custom sequence of glasses or bottles and small plates tailored to your group.',
    scheduleNote: 'Private evenings by arrangement',
    durationMinutes: 90,
    groupSize: { min: 8, max: 14 },
    includes: [
      'Custom sequence of cellar pours or table bottles agreed with you by reply',
      'Generous spread of seasonal small plates, bread, olives and cheese for the table',
      'Dedicated host for your group throughout the 60–90 minute evening',
    ],
    wineIds: ['dry-sparkling-white', 'dry-rose', 'cabernet-blend'],
    alcoholFreeNote:
      'Full alcohol-free and mixed-group arrangements are discussed by reply when planning your menu.',
    available: true,
  },
];

/** Whether a tasting programme is currently open for enquiries (omitted `available` means available). */
export function isProgrammeAvailable(programme: TastingProgramme): boolean {
  return programme.available !== false;
}

/**
 * Select the single active featured programme for the expanded Home tasting card,
 * or `null` when no available programme is marked `featured` (or all formats are paused).
 */
export function selectFeaturedProgramme(
  programmes: readonly TastingProgramme[] = tastings,
): TastingProgramme | null {
  return programmes.find(p => p.featured === true && isProgrammeAvailable(p)) ?? null;
}

/** Format the price term for a tasting programme (e.g. "$32 per person" or "Price on enquiry"). */
export function formatProgrammePrice(
  programme: TastingProgramme,
  sourceMenu: Menu = menu,
): string {
  if (programme.pricePerPerson === undefined) {
    return 'Price on enquiry';
  }
  return `${formatPrice(programme.pricePerPerson, sourceMenu)} per person`;
}

/** Format the guest count range (e.g. "4–8 guests"). */
export function formatGroupSize(programme: TastingProgramme): string {
  const { min, max } = programme.groupSize;
  return min === max ? `${min} guests` : `${min}–${max} guests`;
}

/** Resolve illustrative `wineIds` on a tasting programme to `WineItem` entries from the menu. */
export function resolveProgrammeWines(
  programme: TastingProgramme,
  sourceMenu: Menu = menu,
): WineItem[] {
  const winesById = new Map(allWines(sourceMenu).map(w => [w.id, w]));
  const seen = new Set<string>();
  const resolved: WineItem[] = [];
  for (const id of programme.wineIds) {
    if (seen.has(id)) continue;
    const wine = winesById.get(id);
    if (wine) {
      seen.add(id);
      resolved.push(wine);
    }
  }
  return resolved;
}

/**
 * Compute the honest enquiry state for a programme.
 * Paused formats (`available: false`) never produce an active booking/enquiry CTA for that format.
 */
export function programmeEnquiryState(programme: TastingProgramme): {
  available: boolean;
  statusLabel: string;
  ctaLabel: string | null;
  ctaHref: string | null;
} {
  if (!isProgrammeAvailable(programme)) {
    return {
      available: false,
      statusLabel: 'Not currently taking enquiries for this format',
      ctaLabel: null,
      ctaHref: null,
    };
  }
  return {
    available: true,
    statusLabel: 'Enquiries open · confirmed by reply',
    ctaLabel: `Enquire about ${programme.title}`,
    ctaHref: '/contact/',
  };
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validate tasting programmes, their numeric bounds, unique IDs (including against menu section/item anchors),
 * featured count and illustrative wine references.
 */
export function validateTastings(
  programmes: readonly TastingProgramme[] = tastings,
  sourceMenu: Menu = menu,
  options: { requireInitialFeatured?: boolean } = {},
): void {
  if (!Array.isArray(programmes) || programmes.length === 0) {
    throw new Error('tastings: must contain at least one tasting programme');
  }

  const menuAnchorIds = new Set<string>([
    ...sourceMenu.sections.map(s => s.id),
    ...allMenuItems(sourceMenu).map(i => i.id),
  ]);
  const winesById = new Map(allWines(sourceMenu).map(w => [w.id, w]));
  const availableWineIds = [...winesById.values()]
    .filter(w => isItemAvailable(w) && hasAvailableServing(w))
    .map(w => w.id);

  const seenProgrammeIds = new Set<string>();
  const activeFeatured: string[] = [];

  for (const programme of programmes) {
    const ctx = `tasting programme "${programme?.id || '(unnamed)'}"`;
    if (!programme.id || !SLUG_RE.test(programme.id)) {
      throw new Error(`${ctx}: id must be lowercase URL-safe words separated by hyphens`);
    }
    if (seenProgrammeIds.has(programme.id)) {
      throw new Error(`${ctx}: duplicate programme id "${programme.id}"`);
    }
    if (menuAnchorIds.has(programme.id)) {
      throw new Error(`${ctx}: id "${programme.id}" collides with a menu section or item anchor`);
    }
    seenProgrammeIds.add(programme.id);

    if (!programme.title?.trim()) throw new Error(`${ctx}.title: required`);
    if (!programme.introduction?.trim()) throw new Error(`${ctx}.introduction: required`);
    if (!programme.scheduleNote?.trim()) throw new Error(`${ctx}.scheduleNote: required`);
    if (!programme.alcoholFreeNote?.trim()) throw new Error(`${ctx}.alcoholFreeNote: required`);

    if (!Number.isInteger(programme.durationMinutes) || programme.durationMinutes <= 0) {
      throw new Error(`${ctx}.durationMinutes: must be a positive integer`);
    }

    if (
      !programme.groupSize ||
      !Number.isInteger(programme.groupSize.min) ||
      !Number.isInteger(programme.groupSize.max) ||
      programme.groupSize.min <= 0 ||
      programme.groupSize.max < programme.groupSize.min
    ) {
      throw new Error(`${ctx}.groupSize: min and max must be positive integers with min <= max`);
    }

    if (programme.pricePerPerson !== undefined) {
      if (
        typeof programme.pricePerPerson !== 'number' ||
        !Number.isFinite(programme.pricePerPerson) ||
        programme.pricePerPerson <= 0
      ) {
        throw new Error(`${ctx}.pricePerPerson: must be a positive finite number when provided`);
      }
    }

    if (programme.available !== undefined && typeof programme.available !== 'boolean') {
      throw new Error(`${ctx}.available: must be a boolean when provided`);
    }
    if (programme.featured !== undefined && typeof programme.featured !== 'boolean') {
      throw new Error(`${ctx}.featured: must be a boolean when provided`);
    }

    if (
      !Array.isArray(programme.includes) ||
      programme.includes.length === 0 ||
      programme.includes.some((line: string) => !line?.trim())
    ) {
      throw new Error(`${ctx}.includes: must contain at least one non-blank bullet`);
    }

    if (!Array.isArray(programme.wineIds) || programme.wineIds.length === 0) {
      throw new Error(
        `${ctx}.wineIds: must reference at least one illustrative wine ID from: ${availableWineIds.join(', ')}`,
      );
    }

    const seenWine = new Set<string>();
    for (const wineId of programme.wineIds) {
      if (seenWine.has(wineId)) {
        throw new Error(`${ctx}.wineIds: duplicate wine reference "${wineId}"`);
      }
      seenWine.add(wineId);
      const wine = winesById.get(wineId);
      if (!wine) {
        throw new Error(
          `${ctx}.wineIds: "${wineId}" is not a valid wine ID. Choose from available wine IDs: ${availableWineIds.join(', ')}`,
        );
      }
      if (isProgrammeAvailable(programme) && (!isItemAvailable(wine) || !hasAvailableServing(wine))) {
        throw new Error(
          `${ctx}.wineIds: active programme references unavailable wine "${wineId}". Replace it with an available wine ID from: ${availableWineIds.join(', ')}`,
        );
      }
    }

    if (programme.featured && isProgrammeAvailable(programme)) {
      activeFeatured.push(programme.id);
    }
  }

  if (activeFeatured.length > 1) {
    throw new Error(
      `tastings: at most one available programme may have featured: true (found: ${activeFeatured.join(', ')})`,
    );
  }
  if (options.requireInitialFeatured && activeFeatured.length !== 1) {
    throw new Error(
      `tastings: expected exactly one available featured programme (found ${activeFeatured.length})`,
    );
  }
}
