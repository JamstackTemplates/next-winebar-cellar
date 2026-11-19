// The cellar list, small plates and alcohol-free drinks.
// Edit wines, glass/bottle prices, availability, small plates or cellar picks here; every page reads from this file.
// Plain text only: values are rendered as text, never raw HTML.

/** Wine style token used for label grouping and bottle illustration colour mapping. */
export type WineStyle = 'sparkling' | 'white' | 'rose' | 'amber' | 'red';

/** Perceived weight on the palate, shown on wine labels. */
export type WineBody = 'light' | 'medium' | 'full';

/** Reusable bottle silhouette drawn on the open shelf. */
export type BottleShape = 'slender' | 'shouldered' | 'sparkling';

/** Serving vessel offered for a wine. */
export type WineServingKind = 'glass' | 'bottle';

/** Optional editorial highlight shown on a label or plate entry. */
export type ItemBadge = 'seasonal' | 'new' | 'house-pick';

/**
 * Ingredient and dietary notes for small plates.
 * Labels state "gluten-free ingredients" / "dairy-free ingredients" and menu notes explain shared-kitchen cross-contact.
 */
export type Diet =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free-ingredients'
  | 'dairy-free-ingredients'
  | 'contains-nuts';

export const WINE_STYLES: Record<WineStyle, { label: string; short: string; colorVar: string }> = {
  sparkling: { label: 'Sparkling', short: 'Sparkling', colorVar: 'var(--white-wine)' },
  white: { label: 'White', short: 'White', colorVar: 'var(--white-wine)' },
  rose: { label: 'Rosé', short: 'Rosé', colorVar: 'var(--rose-wine)' },
  amber: { label: 'Amber / skin-contact', short: 'Amber', colorVar: 'var(--amber-wine)' },
  red: { label: 'Red', short: 'Red', colorVar: 'var(--red-wine)' },
};

export const WINE_BODIES: Record<WineBody, string> = {
  light: 'Light-bodied',
  medium: 'Medium-bodied',
  full: 'Full-bodied',
};

export const BOTTLE_SHAPES: readonly BottleShape[] = ['slender', 'shouldered', 'sparkling'] as const;

export const ITEM_BADGES: Record<ItemBadge, string> = {
  seasonal: 'Seasonal',
  new: 'New on the rack',
  'house-pick': 'Cellar pick',
};

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free-ingredients': { label: 'Gluten-free ingredients', short: 'GFI' },
  'dairy-free-ingredients': { label: 'Dairy-free ingredients', short: 'DFI' },
  'contains-nuts': { label: 'Contains nuts', short: 'Contains nuts' },
};

/** Machine-readable wine serving size and price. */
export interface WineServing {
  /** Whether the pour is by the glass or by the bottle. */
  kind: WineServingKind;
  /** Serving volume in millilitres, e.g. 125, 150 or 750. */
  volumeMl: number;
  /** Price in `menu.currency`, e.g. 12 for $12. */
  amount: number;
  /** Set to false when a glass pour is paused while the bottle remains available (or vice versa). */
  available?: boolean;
}

/** Labelled size and price for food or alcohol-free drinks offered in multiple sizes. */
export interface SizePrice {
  /** Human-readable size label, e.g. "330 ml" or "750 ml". */
  label: string;
  /** Price in `menu.currency`. */
  amount: number;
}

interface BaseMenuItem {
  /** Unique, URL-safe identifier used for anchors such as /menu/#chenin-blanc. */
  id: string;
  /** Display name on the label or menu list. */
  name: string;
  /** Approachable plain-text description without ratings or invented producer lore. */
  description: string;
  /** Set to false to mark the entire entry unavailable while keeping it visible on the list. */
  available?: boolean;
  /** Optional highlight badge. */
  badge?: ItemBadge;
}

/** A wine entry on the cellar rack. */
export interface WineItem extends BaseMenuItem {
  /** Discriminator for wine entries. */
  kind: 'wine';
  /** Wine style used for grouping and bottle tint. */
  style: WineStyle;
  /** Grape variety or blend descriptors. */
  grapes: string[];
  /** Broad regional descriptor (illustrative, never a specific vineyard claim). */
  origin: string;
  /** Two or three concise, approachable tasting notes. */
  tastingNotes: string[];
  /** Palate weight. */
  body: WineBody;
  /** Bottle silhouette used when featured on the open shelf. */
  bottleShape: BottleShape;
  /** Glass and/or bottle servings with volume and price. */
  price: WineServing[];
  /** Optional IDs of `FoodItem` entries that pair well with this wine. */
  pairingIds?: string[];
}

/** A small plate from the kitchen. */
export interface FoodItem extends BaseMenuItem {
  /** Discriminator for food entries. */
  kind: 'food';
  /** Single plate price or labelled portion prices. */
  price: number | SizePrice[];
  /** Ingredient and dietary notes. */
  diet?: Diet[];
}

/** An alcohol-free drink given equal footing beside the wine list. */
export interface SoftDrinkItem extends BaseMenuItem {
  /** Discriminator for alcohol-free drink entries. */
  kind: 'soft-drink';
  /** Single glass price or labelled bottle sizes. */
  price: number | SizePrice[];
  /** How the drink is served, e.g. "250 ml tall glass over ice". */
  servingNote: string;
}

/** Discriminated union of all menu entries. */
export type MenuItem = WineItem | FoodItem | SoftDrinkItem;

/** A titled section of the cellar list or kitchen menu. */
export interface MenuSection {
  /** Unique, URL-safe identifier used for section anchors such as /menu/#white-and-rose. */
  id: string;
  /** Section heading. */
  title: string;
  /** Short editorial introduction for the section. */
  description: string;
  /** Items belonging to this section. */
  items: MenuItem[];
}

/** Complete menu model for the wine bar. */
export interface Menu {
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** BCP 47 locale tag for number formatting, e.g. "en-US". */
  locale: string;
  /** Ordered menu sections. */
  sections: MenuSection[];
  /** Footnotes covering sample pricing, serving volumes and shared-kitchen dietary advice. */
  notes: string[];
  /**
   * Exactly three distinct available wine IDs shown on the Home "From the open shelf" rack.
   * Must cover at least two wine styles and each must have at least one available serving.
   */
  cellarPickIds: string[];
  /**
   * Exactly three distinct available food IDs shown in the Home "A plate beside your glass" section.
   */
  homePlateIds: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  cellarPickIds: ['chenin-blanc', 'gamay', 'skin-contact-white'],
  homePlateIds: ['whipped-white-bean-dip', 'marinated-olives', 'cheese-selection'],
  sections: [
    {
      id: 'sparkling',
      title: 'Sparkling',
      description: 'Crisp, dry bubbles to open the evening—one poured by the glass and one kept for the table.',
      items: [
        {
          kind: 'wine',
          id: 'dry-sparkling-white',
          name: 'Dry sparkling white',
          description:
            'A brisk, traditional-method fizz with fine bubbles, orchard fruit and a clean, mineral finish.',
          style: 'sparkling',
          grapes: ['Chenin blanc', 'Chardonnay'],
          origin: 'Loire Valley style, France',
          tastingNotes: ['Green apple', 'Lemon pith', 'Toasted brioche'],
          body: 'light',
          bottleShape: 'sparkling',
          price: [
            { kind: 'glass', volumeMl: 125, amount: 13 },
            { kind: 'bottle', volumeMl: 750, amount: 50 },
          ],
          pairingIds: ['marinated-olives'],
        },
        {
          kind: 'wine',
          id: 'sparkling-rose',
          name: 'Sparkling rosé',
          description:
            'Pale copper bubbles pressed from dark-skinned grapes, dry and lively with wild berry notes.',
          style: 'sparkling',
          grapes: ['Pinot noir', 'Gamay'],
          origin: 'Cool-climate French style',
          tastingNotes: ['Wild strawberry', 'Pink grapefruit', 'Crisp dry finish'],
          body: 'light',
          bottleShape: 'sparkling',
          price: [{ kind: 'bottle', volumeMl: 750, amount: 54 }],
        },
      ],
    },
    {
      id: 'white-and-rose',
      title: 'White & rosé',
      description: 'Textured whites and a bone-dry rosé, served cool rather than ice-numbed so the fruit speaks clearly.',
      items: [
        {
          kind: 'wine',
          id: 'chenin-blanc',
          name: 'Chenin blanc',
          description:
            'Round and mouth-watering, balancing ripe pear and baked quince with a bright, chalky snap.',
          style: 'white',
          grapes: ['Chenin blanc'],
          origin: 'Western Loire style, France',
          tastingNotes: ['Poached pear', 'Chamomile', 'Waxy lemon'],
          body: 'medium',
          bottleShape: 'slender',
          badge: 'house-pick',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 12 },
            { kind: 'bottle', volumeMl: 750, amount: 46 },
          ],
          pairingIds: ['whipped-white-bean-dip', 'cheese-selection'],
        },
        {
          kind: 'wine',
          id: 'sauvignon-blanc',
          name: 'Sauvignon blanc',
          description:
            'Fermented without oak for pure citrus, garden herb and wet-stone freshness.',
          style: 'white',
          grapes: ['Sauvignon blanc'],
          origin: 'Atlantic coastal style',
          tastingNotes: ['Lime leaf', 'White peach', 'Crushed slate'],
          body: 'light',
          bottleShape: 'slender',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 11 },
            { kind: 'bottle', volumeMl: 750, amount: 42 },
          ],
        },
        {
          kind: 'wine',
          id: 'dry-rose',
          name: 'Dry rosé',
          description:
            'Pressed early for a pale salmon colour and a savoury, sun-warmed herb character.',
          style: 'rose',
          grapes: ['Grenache', 'Cinsault'],
          origin: 'Mediterranean coastal style',
          tastingNotes: ['Redcurrant', 'Watermelon rind', 'Wild thyme'],
          body: 'light',
          bottleShape: 'slender',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 12 },
            { kind: 'bottle', volumeMl: 750, amount: 45 },
          ],
          pairingIds: ['marinated-olives'],
        },
      ],
    },
    {
      id: 'amber',
      title: 'Amber & skin-contact',
      description: 'White grapes fermented briefly on their skins for tea-like grip, warm spice and food-friendly depth.',
      items: [
        {
          kind: 'wine',
          id: 'skin-contact-white',
          name: 'Skin-contact white',
          description:
            'Ten days on the skins give this amber pour a gentle tannin structure and fragrant orchard-peel aromatics.',
          style: 'amber',
          grapes: ['Pinot gris', 'Muscat'],
          origin: 'Alpine hillside style, Italy',
          tastingNotes: ['Dried apricot', 'Orange peel', 'Black tea'],
          body: 'medium',
          bottleShape: 'shouldered',
          badge: 'house-pick',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 14 },
            { kind: 'bottle', volumeMl: 750, amount: 54 },
          ],
          pairingIds: ['mushroom-toast'],
        },
      ],
    },
    {
      id: 'red',
      title: 'Red',
      description: 'From cellar-cool, supple reds to deeper, structured bottles for the middle of the table.',
      items: [
        {
          kind: 'wine',
          id: 'gamay',
          name: 'Gamay',
          description:
            'Poured just below room temperature: bright red berry fruit, cracked pepper and supple, unheavy tannin.',
          style: 'red',
          grapes: ['Gamay'],
          origin: 'Granite hillside style, France',
          tastingNotes: ['Red cherry', 'Raspberry', 'White pepper'],
          body: 'light',
          bottleShape: 'slender',
          badge: 'house-pick',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 13 },
            { kind: 'bottle', volumeMl: 750, amount: 49 },
          ],
          pairingIds: ['cheese-selection'],
        },
        {
          kind: 'wine',
          id: 'tempranillo',
          name: 'Tempranillo',
          description:
            'Medium-bodied and savoury with dark plum fruit, cedar warmth and a supple leather finish.',
          style: 'red',
          grapes: ['Tempranillo'],
          origin: 'High-plateau Iberian style, Spain',
          tastingNotes: ['Ripe plum', 'Roasted fig', 'Cedar spice'],
          body: 'medium',
          bottleShape: 'shouldered',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 12 },
            { kind: 'bottle', volumeMl: 750, amount: 46 },
          ],
        },
        {
          kind: 'wine',
          id: 'cabernet-blend',
          name: 'Cabernet blend',
          description:
            'Structured and unhurried, pairing dark cassis fruit with graphite and savoury herb.',
          style: 'red',
          grapes: ['Cabernet franc', 'Merlot'],
          origin: 'Left-bank maritime style, France',
          tastingNotes: ['Blackcurrant', 'Bay leaf', 'Dark cocoa'],
          body: 'full',
          bottleShape: 'shouldered',
          price: [
            { kind: 'glass', volumeMl: 150, amount: 15, available: false },
            { kind: 'bottle', volumeMl: 750, amount: 58 },
          ],
        },
        {
          kind: 'wine',
          id: 'syrah',
          name: 'Syrah',
          description:
            'Deep purple fruit with savoury olive tapenade, violet aroma and a peppery finish.',
          style: 'red',
          grapes: ['Syrah'],
          origin: 'Northern Rhône valley style',
          tastingNotes: ['Blackberry', 'Cracked black pepper', 'Dark olive'],
          body: 'full',
          bottleShape: 'shouldered',
          available: false,
          price: [{ kind: 'bottle', volumeMl: 750, amount: 56 }],
        },
      ],
    },
    {
      id: 'small-plates',
      title: 'Small plates',
      description: 'Prepared to order in our small kitchen—assembled to share beside a glass rather than rush a three-course meal.',
      items: [
        {
          kind: 'food',
          id: 'marinated-olives',
          name: 'Marinated olives',
          description: 'Green and black olives warmed gently with orange peel, fennel seed and cold-pressed olive oil.',
          price: 7,
          diet: ['vegan', 'gluten-free-ingredients', 'dairy-free-ingredients'],
        },
        {
          kind: 'food',
          id: 'warm-bread-olive-oil',
          name: 'Warm bread & olive oil',
          description: 'Thick slices of crusty country sourdough with peppery olive oil and flaky sea salt.',
          price: 8,
          diet: ['vegan', 'dairy-free-ingredients'],
        },
        {
          kind: 'food',
          id: 'whipped-white-bean-dip',
          name: 'Whipped white bean dip',
          description: 'Cannellini beans blended with roasted garlic, lemon and rosemary oil, served with crisp flatbread.',
          price: 11,
          diet: ['vegan', 'dairy-free-ingredients'],
        },
        {
          kind: 'food',
          id: 'mushroom-toast',
          name: 'Mushroom toast',
          description: 'Pan-roasted woodland mushrooms, thyme butter and aged sheep’s cheese on grilled sourdough.',
          price: 13,
          badge: 'seasonal',
          diet: ['vegetarian'],
        },
        {
          kind: 'food',
          id: 'cheese-selection',
          name: 'Cheese selection',
          description: 'Three cheeses—bloomy rind, aged mountain tomme and mild blue—served with quince paste, toasted walnuts and crackers.',
          price: 19,
          diet: ['vegetarian', 'contains-nuts'],
        },
        {
          kind: 'food',
          id: 'chocolate-pot',
          name: 'Dark chocolate pot',
          description: 'Chilled bittersweet chocolate pot set with olive oil and a pinch of flaky salt.',
          price: 9,
          diet: ['vegetarian', 'gluten-free-ingredients'],
        },
      ],
    },
    {
      id: 'alcohol-free',
      title: 'Alcohol-free',
      description: 'House infusions, bitter-sweet spritzes and mineral water poured in proper stemware.',
      items: [
        {
          kind: 'soft-drink',
          id: 'blackcurrant-spritz',
          name: 'Blackcurrant spritz',
          description: 'Tart blackcurrant cordial, gentian root infusion and dry soda with a twist of lemon peel.',
          price: 8,
          servingNote: '250 ml stemmed glass over ice',
        },
        {
          kind: 'soft-drink',
          id: 'citrus-rosemary-soda',
          name: 'Citrus-rosemary soda',
          description: 'Grapefruit and blood-orange reduction steeped with fresh rosemary and topped with sparkling water.',
          price: 7,
          servingNote: '250 ml tall glass over ice',
        },
        {
          kind: 'soft-drink',
          id: 'sparkling-water',
          name: 'Sparkling mineral water',
          description: 'Crisp, finely carbonated mineral water served chilled for the table.',
          price: [
            { label: '330 ml', amount: 4 },
            { label: '750 ml', amount: 7 },
          ],
          servingNote: 'Chilled glass bottle',
        },
      ],
    },
  ],
  notes: [
    'All wines, regions and prices on this template are illustrative sample entries. Sparkling glasses are 125 ml; still wine glasses are 150 ml; bottles are 750 ml.',
    'Dietary tags indicate vegetarian (V), vegan (VG), made with gluten-free ingredients (GFI), made with dairy-free ingredients (DFI) or contains nuts. All food and drinks are prepared in a single small kitchen and bar where gluten, dairy, nuts, sulphites and other allergens are handled, so we cannot guarantee the absence of cross-contact.',
    'Dietary labels and alcohol-free descriptions are guide notes only, not medical or allergy advice. Please talk to the team before ordering if you have an allergy or specific dietary preference.',
  ],
};

/** Every menu item across all sections, in display order. */
export function allMenuItems(sourceMenu: Menu = menu): MenuItem[] {
  return sourceMenu.sections.flatMap(section => section.items);
}

/** Every menu item in the default menu. */
export const allItems: MenuItem[] = allMenuItems(menu);

/** Every wine entry across all sections. */
export function allWines(sourceMenu: Menu = menu): WineItem[] {
  return allMenuItems(sourceMenu).filter((item): item is WineItem => item.kind === 'wine');
}

/** Every food entry across all sections. */
export function allFoods(sourceMenu: Menu = menu): FoodItem[] {
  return allMenuItems(sourceMenu).filter((item): item is FoodItem => item.kind === 'food');
}

/** Every alcohol-free drink entry across all sections. */
export function allSoftDrinks(sourceMenu: Menu = menu): SoftDrinkItem[] {
  return allMenuItems(sourceMenu).filter((item): item is SoftDrinkItem => item.kind === 'soft-drink');
}

/** Format a numeric amount using the menu's locale and currency (e.g. "$12" or "$12.50"). */
export function formatPrice(amount: number, sourceMenu: Menu = menu): string {
  const formatter = new Intl.NumberFormat(sourceMenu.locale, {
    style: 'currency',
    currency: sourceMenu.currency,
  });
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Whether an item itself is marked available (omitted `available` means available). */
export function isItemAvailable(item: MenuItem): boolean {
  return item.available !== false;
}

/**
 * Whether a specific wine serving is available.
 * Overall `item.available === false` overrides every serving on that wine.
 */
export function isServingAvailable(item: WineItem, serving: WineServing): boolean {
  if (!isItemAvailable(item)) return false;
  return serving.available !== false;
}

/** Whether a wine has at least one available serving (glass or bottle). */
export function hasAvailableServing(item: WineItem): boolean {
  if (!isItemAvailable(item)) return false;
  return item.price.some(serving => isServingAvailable(item, serving));
}

/** Format a single wine serving with explicit kind, volume in ml, price and honest availability state. */
export function formatWineServing(
  item: WineItem,
  serving: WineServing,
  sourceMenu: Menu = menu,
): {
  kindLabel: string;
  volumeLabel: string;
  priceLabel: string;
  available: boolean;
  summary: string;
} {
  const kindLabel = serving.kind === 'glass' ? 'Glass' : 'Bottle';
  const volumeLabel = `${serving.volumeMl} ml`;
  const priceLabel = formatPrice(serving.amount, sourceMenu);
  const available = isServingAvailable(item, serving);
  const summary = available
    ? `${kindLabel} · ${volumeLabel} · ${priceLabel}`
    : `${kindLabel} · ${volumeLabel} · ${priceLabel} (Unavailable)`;
  return { kindLabel, volumeLabel, priceLabel, available, summary };
}

/** Format a food or soft-drink price (single amount or all labelled sizes). */
export function formatNonWinePrice(item: FoodItem | SoftDrinkItem, sourceMenu: Menu = menu): string {
  if (typeof item.price === 'number') {
    return formatPrice(item.price, sourceMenu);
  }
  return item.price.map(entry => `${entry.label} · ${formatPrice(entry.amount, sourceMenu)}`).join(' / ');
}

/** Return all wines that currently have an available glass serving, paired with that glass serving. */
export function availableGlassList(sourceMenu: Menu = menu): { wine: WineItem; glass: WineServing }[] {
  const results: { wine: WineItem; glass: WineServing }[] = [];
  for (const wine of allWines(sourceMenu)) {
    if (!isItemAvailable(wine)) continue;
    const glass = wine.price.find(serving => serving.kind === 'glass' && isServingAvailable(wine, serving));
    if (glass) results.push({ wine, glass });
  }
  return results;
}

/**
 * Lowest available glass price across all available wines, or `null` when no glass servings are available.
 * Never falls back to bottle prices.
 */
export function startingGlassPrice(sourceMenu: Menu = menu): number | null {
  const glasses = availableGlassList(sourceMenu);
  if (glasses.length === 0) return null;
  return Math.min(...glasses.map(entry => entry.glass.amount));
}

/**
 * Formatted "Glasses from $11" claim derived strictly from available glass servings,
 * or `null` when no glass servings are available.
 */
export function startingGlassClaim(sourceMenu: Menu = menu): string | null {
  const lowest = startingGlassPrice(sourceMenu);
  if (lowest === null) return null;
  return `Glasses from ${formatPrice(lowest, sourceMenu)}`;
}

/**
 * Resolve `menu.cellarPickIds` into wine entries for the Home open shelf.
 * Defensive: if validation was bypassed and an ID is missing, non-wine, or duplicated, it is skipped safely
 * without crashing; if a selected wine is marked unavailable, it is still returned so the UI can label it honestly.
 */
export function selectCellarPicks(sourceMenu: Menu = menu): WineItem[] {
  const byId = new Map(allWines(sourceMenu).map(wine => [wine.id, wine]));
  const seen = new Set<string>();
  const picks: WineItem[] = [];
  for (const id of sourceMenu.cellarPickIds) {
    if (seen.has(id)) continue;
    const wine = byId.get(id);
    if (wine) {
      seen.add(id);
      picks.push(wine);
    }
  }
  return picks;
}

/** Selected cellar wines for the default menu. */
export const cellarPicks: WineItem[] = selectCellarPicks(menu);

/**
 * Resolve `menu.homePlateIds` into food entries for the Home small-plates preview.
 * Defensive: skips unknown or non-food IDs safely and preserves unavailable items so they can be labelled honestly.
 */
export function selectHomePlates(sourceMenu: Menu = menu): FoodItem[] {
  const byId = new Map(allFoods(sourceMenu).map(plate => [plate.id, plate]));
  const seen = new Set<string>();
  const plates: FoodItem[] = [];
  for (const id of sourceMenu.homePlateIds) {
    if (seen.has(id)) continue;
    const plate = byId.get(id);
    if (plate) {
      seen.add(id);
      plates.push(plate);
    }
  }
  return plates;
}

/** Selected small plates for the default menu. */
export const homePlates: FoodItem[] = selectHomePlates(menu);

/** Resolve a wine's `pairingIds` to `FoodItem` entries in the given menu. */
export function resolveWinePairings(wine: WineItem, sourceMenu: Menu = menu): FoodItem[] {
  if (!wine.pairingIds || wine.pairingIds.length === 0) return [];
  const foodsById = new Map(allFoods(sourceMenu).map(food => [food.id, food]));
  return wine.pairingIds.flatMap(id => {
    const match = foodsById.get(id);
    return match ? [match] : [];
  });
}

/** Derive a compact price range (e.g. "$4–$58") from all menu items for schema.org metadata. */
export function menuPriceRange(sourceMenu: Menu = menu): string {
  const amounts: number[] = [];
  for (const item of allMenuItems(sourceMenu)) {
    if (item.kind === 'wine') {
      for (const serving of item.price) amounts.push(serving.amount);
    } else if (typeof item.price === 'number') {
      amounts.push(item.price);
    } else {
      for (const size of item.price) amounts.push(size.amount);
    }
  }
  if (amounts.length === 0) return '$$';
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  return min === max
    ? formatPrice(min, sourceMenu)
    : `${formatPrice(min, sourceMenu)}–${formatPrice(max, sourceMenu)}`;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertPositiveFinite(value: unknown, context: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${context}: must be a positive finite number (got ${String(value)})`);
  }
}

function validateSizePriceList(prices: unknown, context: string): void {
  if (typeof prices === 'number') {
    assertPositiveFinite(prices, `${context}.price`);
    return;
  }
  if (!Array.isArray(prices) || prices.length === 0) {
    throw new Error(`${context}.price: must be a positive number or a non-empty array of { label, amount }`);
  }
  const labels = new Set<string>();
  for (const entry of prices as SizePrice[]) {
    if (!entry || typeof entry.label !== 'string' || !entry.label.trim()) {
      throw new Error(`${context}.price: each size needs a non-blank label`);
    }
    const normalized = entry.label.trim().toLowerCase();
    if (labels.has(normalized)) {
      throw new Error(`${context}.price: duplicate size label "${entry.label}"`);
    }
    labels.add(normalized);
    assertPositiveFinite(entry.amount, `${context}.price[${entry.label}].amount`);
  }
}

/**
 * Validate the menu structure, item fields, discriminated union invariants and cross-references.
 * Throws an actionable Error naming the specific section, item or serving to fix.
 */
export function validateMenu(sourceMenu: Menu = menu): void {
  if (!sourceMenu.currency || typeof sourceMenu.currency !== 'string' || !/^[A-Z]{3}$/.test(sourceMenu.currency)) {
    throw new Error(`menu.currency: must be a 3-letter ISO currency code such as "USD"`);
  }
  if (!sourceMenu.locale || typeof sourceMenu.locale !== 'string' || !sourceMenu.locale.trim()) {
    throw new Error(`menu.locale: must be a non-empty BCP 47 locale string such as "en-US"`);
  }
  try {
    new Intl.NumberFormat(sourceMenu.locale, { style: 'currency', currency: sourceMenu.currency }).format(10);
  } catch {
    throw new Error(`menu: invalid locale "${sourceMenu.locale}" or currency "${sourceMenu.currency}"`);
  }

  if (!Array.isArray(sourceMenu.sections) || sourceMenu.sections.length === 0) {
    throw new Error('menu.sections: must contain at least one section');
  }
  if (!Array.isArray(sourceMenu.notes) || sourceMenu.notes.length === 0 || sourceMenu.notes.some(n => !n?.trim())) {
    throw new Error('menu.notes: must contain non-blank menu notes');
  }

  const seenIds = new Set<string>();
  const wineById = new Map<string, WineItem>();
  const foodById = new Map<string, FoodItem>();

  for (const section of sourceMenu.sections) {
    const secCtx = `menu section "${section?.id || '(unnamed)'}"`;
    if (!section.id || !SLUG_RE.test(section.id)) {
      throw new Error(`${secCtx}: id must be lowercase URL-safe words separated by hyphens`);
    }
    if (seenIds.has(section.id)) {
      throw new Error(`${secCtx}: duplicate id "${section.id}" across sections/items`);
    }
    seenIds.add(section.id);
    if (!section.title?.trim()) throw new Error(`${secCtx}: title is required`);
    if (!section.description?.trim()) throw new Error(`${secCtx}: description is required`);
    if (!Array.isArray(section.items) || section.items.length === 0) {
      throw new Error(`${secCtx}: must contain at least one item`);
    }

    for (const item of section.items) {
      const itemCtx = `menu item "${item?.id || '(unnamed)'}" in section "${section.id}"`;
      if (!item.id || !SLUG_RE.test(item.id)) {
        throw new Error(`${itemCtx}: id must be lowercase URL-safe words separated by hyphens`);
      }
      if (seenIds.has(item.id)) {
        throw new Error(`${itemCtx}: duplicate id "${item.id}" across sections/items`);
      }
      seenIds.add(item.id);
      if (!item.name?.trim()) throw new Error(`${itemCtx}: name is required`);
      if (!item.description?.trim()) throw new Error(`${itemCtx}: description is required`);
      if (item.available !== undefined && typeof item.available !== 'boolean') {
        throw new Error(`${itemCtx}.available: must be a boolean when provided`);
      }
      if (item.badge !== undefined && !(item.badge in ITEM_BADGES)) {
        throw new Error(`${itemCtx}.badge: unsupported badge "${String(item.badge)}"`);
      }

      const raw = item as unknown as Record<string, unknown>;

      if (item.kind === 'wine') {
        if ('diet' in raw && raw.diet !== undefined) {
          throw new Error(`${itemCtx}: wine items cannot carry food "diet" tags`);
        }
        if ('servingNote' in raw && raw.servingNote !== undefined) {
          throw new Error(`${itemCtx}: wine items use structured servings, not "servingNote"`);
        }
        if (!(item.style in WINE_STYLES)) {
          throw new Error(`${itemCtx}.style: unsupported wine style "${String(item.style)}"`);
        }
        if (!(item.body in WINE_BODIES)) {
          throw new Error(`${itemCtx}.body: unsupported wine body "${String(item.body)}"`);
        }
        if (!BOTTLE_SHAPES.includes(item.bottleShape)) {
          throw new Error(`${itemCtx}.bottleShape: unsupported bottle shape "${String(item.bottleShape)}"`);
        }
        if (!item.origin?.trim()) {
          throw new Error(`${itemCtx}.origin: broad origin description is required`);
        }
        if (!Array.isArray(item.grapes) || item.grapes.length === 0 || item.grapes.some(g => !g?.trim())) {
          throw new Error(`${itemCtx}.grapes: must list at least one non-blank grape variety`);
        }
        if (
          !Array.isArray(item.tastingNotes) ||
          item.tastingNotes.length < 2 ||
          item.tastingNotes.length > 3 ||
          item.tastingNotes.some(n => !n?.trim())
        ) {
          throw new Error(`${itemCtx}.tastingNotes: must have 2 or 3 non-blank tasting notes`);
        }
        if (!Array.isArray(item.price) || item.price.length === 0) {
          throw new Error(`${itemCtx}.price: wine must have at least one serving`);
        }
        const servingKinds = new Set<string>();
        for (const serving of item.price) {
          const srvCtx = `${itemCtx} serving "${serving?.kind || '(unknown)'}"`;
          if (serving.kind !== 'glass' && serving.kind !== 'bottle') {
            throw new Error(`${srvCtx}: kind must be "glass" or "bottle"`);
          }
          if (servingKinds.has(serving.kind)) {
            throw new Error(`${srvCtx}: duplicate serving kind "${serving.kind}" on wine "${item.id}"`);
          }
          servingKinds.add(serving.kind);
          assertPositiveFinite(serving.volumeMl, `${srvCtx}.volumeMl`);
          assertPositiveFinite(serving.amount, `${srvCtx}.amount`);
          if (serving.available !== undefined && typeof serving.available !== 'boolean') {
            throw new Error(`${srvCtx}.available: must be a boolean when provided`);
          }
        }
        if (isItemAvailable(item) && !hasAvailableServing(item)) {
          throw new Error(
            `${itemCtx}: wine is marked available but all of its servings are unavailable; mark the wine available: false or enable a serving`,
          );
        }
        wineById.set(item.id, item);
      } else if (item.kind === 'food') {
        for (const wineField of ['style', 'grapes', 'origin', 'tastingNotes', 'body', 'bottleShape', 'pairingIds']) {
          if (wineField in raw && raw[wineField] !== undefined) {
            throw new Error(`${itemCtx}: food item cannot include wine field "${wineField}"`);
          }
        }
        validateSizePriceList(item.price, itemCtx);
        if (item.diet !== undefined) {
          if (!Array.isArray(item.diet)) throw new Error(`${itemCtx}.diet: must be an array of Diet tags`);
          const seenDiet = new Set<Diet>();
          for (const tag of item.diet) {
            if (!(tag in DIETS)) throw new Error(`${itemCtx}.diet: unsupported diet tag "${String(tag)}"`);
            if (seenDiet.has(tag)) throw new Error(`${itemCtx}.diet: duplicate diet tag "${tag}"`);
            seenDiet.add(tag);
          }
        }
        foodById.set(item.id, item);
      } else if (item.kind === 'soft-drink') {
        for (const wineField of ['style', 'grapes', 'origin', 'tastingNotes', 'body', 'bottleShape', 'pairingIds', 'diet']) {
          if (wineField in raw && raw[wineField] !== undefined) {
            throw new Error(`${itemCtx}: soft-drink item cannot include "${wineField}"`);
          }
        }
        validateSizePriceList(item.price, itemCtx);
        if (!item.servingNote?.trim()) {
          throw new Error(`${itemCtx}.servingNote: non-blank servingNote is required`);
        }
      } else {
        throw new Error(`${itemCtx}: unsupported item kind "${String((item as { kind?: unknown }).kind)}"`);
      }
    }
  }

  // Validate wine-to-food pairing references
  for (const wine of wineById.values()) {
    if (!wine.pairingIds) continue;
    const seenPairing = new Set<string>();
    for (const pairingId of wine.pairingIds) {
      if (seenPairing.has(pairingId)) {
        throw new Error(`wine "${wine.id}".pairingIds: duplicate pairing reference "${pairingId}"`);
      }
      seenPairing.add(pairingId);
      if (!foodById.has(pairingId)) {
        const validFoodIds = [...foodById.keys()].join(', ');
        throw new Error(
          `wine "${wine.id}".pairingIds: unknown or non-food id "${pairingId}". Choose a food item ID from: ${validFoodIds}`,
        );
      }
    }
  }

  // Validate cellarPickIds: exactly 3 distinct available wine IDs with >= 1 available serving and >= 2 wine styles
  const availableWineIds = [...wineById.values()]
    .filter(w => isItemAvailable(w) && hasAvailableServing(w))
    .map(w => w.id);
  if (!Array.isArray(sourceMenu.cellarPickIds) || sourceMenu.cellarPickIds.length !== 3) {
    throw new Error(
      `menu.cellarPickIds: must contain exactly 3 distinct available wine IDs (got ${sourceMenu.cellarPickIds?.length ?? 0}). Available wine IDs: ${availableWineIds.join(', ')}`,
    );
  }
  const pickSet = new Set<string>();
  const pickStyles = new Set<WineStyle>();
  for (const id of sourceMenu.cellarPickIds) {
    if (pickSet.has(id)) {
      throw new Error(
        `menu.cellarPickIds: duplicate wine ID "${id}". Choose 3 distinct available wine IDs from: ${availableWineIds.join(', ')}`,
      );
    }
    pickSet.add(id);
    const wine = wineById.get(id);
    if (!wine) {
      throw new Error(
        `menu.cellarPickIds: "${id}" is not a valid wine ID. Choose from available wine IDs: ${availableWineIds.join(', ')}`,
      );
    }
    if (!isItemAvailable(wine) || !hasAvailableServing(wine)) {
      throw new Error(
        `menu.cellarPickIds: wine "${id}" is currently unavailable. Replace it with an available wine ID from: ${availableWineIds.join(', ')}`,
      );
    }
    pickStyles.add(wine.style);
  }
  if (pickStyles.size < 2) {
    throw new Error(
      `menu.cellarPickIds: must cover at least 2 different wine styles so the open shelf shows variety (currently only "${[...pickStyles].join(', ')}"). Choose replacements from: ${availableWineIds.join(', ')}`,
    );
  }

  // Validate homePlateIds: exactly 3 distinct available food IDs
  const availableFoodIds = [...foodById.values()].filter(f => isItemAvailable(f)).map(f => f.id);
  if (!Array.isArray(sourceMenu.homePlateIds) || sourceMenu.homePlateIds.length !== 3) {
    throw new Error(
      `menu.homePlateIds: must contain exactly 3 distinct available food IDs (got ${sourceMenu.homePlateIds?.length ?? 0}). Available food IDs: ${availableFoodIds.join(', ')}`,
    );
  }
  const plateSet = new Set<string>();
  for (const id of sourceMenu.homePlateIds) {
    if (plateSet.has(id)) {
      throw new Error(
        `menu.homePlateIds: duplicate food ID "${id}". Choose 3 distinct available food IDs from: ${availableFoodIds.join(', ')}`,
      );
    }
    plateSet.add(id);
    const plate = foodById.get(id);
    if (!plate) {
      throw new Error(
        `menu.homePlateIds: "${id}" is not a valid food item ID. Choose from available food IDs: ${availableFoodIds.join(', ')}`,
      );
    }
    if (!isItemAvailable(plate)) {
      throw new Error(
        `menu.homePlateIds: food item "${id}" is marked unavailable. Replace it in homePlateIds with one of: ${availableFoodIds.join(', ')}`,
      );
    }
  }
}
