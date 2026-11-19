import assert from 'node:assert/strict';
import { test } from 'node:test';
import { business } from '../content/business.ts';
import {
  allFoods,
  allMenuItems,
  allSoftDrinks,
  allWines,
  availableGlassList,
  formatNonWinePrice,
  formatPrice,
  formatWineServing,
  hasAvailableServing,
  isItemAvailable,
  isServingAvailable,
  menu,
  menuPriceRange,
  resolveWinePairings,
  selectCellarPicks,
  selectHomePlates,
  startingGlassClaim,
  startingGlassPrice,
  validateMenu,
  type FoodItem,
  type Menu,
  type SoftDrinkItem,
  type WineItem,
} from '../content/menu.ts';
import {
  formatGroupSize,
  formatProgrammePrice,
  isProgrammeAvailable,
  programmeEnquiryState,
  resolveProgrammeWines,
  selectFeaturedProgramme,
  tastings,
  validateTastings,
  type TastingProgramme,
} from '../content/tastings.ts';
import { validateHours } from '../lib/hours.ts';
import { isContactRoute, route } from '../lib/paths.ts';
import { businessStructuredData, jsonLd } from '../lib/structured-data.ts';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cloneMenu(source: Menu = menu): Menu {
  return structuredClone(source);
}

function cloneTastings(source: readonly TastingProgramme[] = tastings): TastingProgramme[] {
  return structuredClone(source) as TastingProgramme[];
}

test('business content has actionable required fields, valid hours and six FAQs', () => {
  for (const key of ['name', 'tagline', 'introduction', 'email', 'phone'] as const) {
    assert.ok(business[key].trim(), `business.${key}: required`);
  }
  assert.match(business.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'business.email: valid public email required');
  assert.ok(business.story.heading.trim(), 'business.story.heading: required');
  assert.equal(business.story.paragraphs.length, 2, 'business.story.paragraphs: expected two short paragraphs');
  for (const [i, p] of business.story.paragraphs.entries()) {
    assert.ok(p.trim(), `business.story.paragraphs[${i}]: empty paragraph`);
  }

  for (const key of ['street', 'locality', 'region', 'postalCode', 'country', 'note', 'mapQuery'] as const) {
    assert.ok(business.address[key].trim(), `business.address.${key}: required`);
  }
  assert.equal(business.address.country, 'US', 'business.address.country: expected US ISO code');

  assert.ok(business.directions.length >= 1, 'business.directions: include at least one direction note');
  for (const [i, dir] of business.directions.entries()) {
    assert.ok(dir.heading.trim(), `business.directions[${i}].heading: required`);
    assert.ok(dir.text.trim(), `business.directions[${i}].text: required`);
  }

  validateHours(business.openingHours);

  assert.ok(business.amenities.length >= 1, 'business.amenities: required');
  const amenityIds = new Set<string>();
  for (const amenity of business.amenities) {
    assert.match(amenity.id, SLUG_RE, `business.amenities "${amenity.id}": invalid URL-safe id`);
    assert.ok(!amenityIds.has(amenity.id), `business.amenities "${amenity.id}": duplicate id`);
    amenityIds.add(amenity.id);
    assert.ok(amenity.label.trim(), `business.amenities "${amenity.id}".label: required`);
    assert.ok(amenity.description.trim(), `business.amenities "${amenity.id}".description: required`);
  }

  for (const key of ['heading', 'description', 'groupSizeNote'] as const) {
    assert.ok(business.privateEvents[key].trim(), `business.privateEvents.${key}: required`);
  }

  assert.ok(business.faqs.length >= 6, 'business.faqs: include the six visitor FAQs');
  const faqIds = new Set<string>();
  for (const faq of business.faqs) {
    assert.match(faq.id, SLUG_RE, `business.faqs "${faq.id}": invalid URL-safe id`);
    assert.ok(!faqIds.has(faq.id), `business.faqs "${faq.id}": duplicate id`);
    faqIds.add(faq.id);
    assert.ok(faq.question.trim(), `business.faqs "${faq.id}".question: required`);
    assert.ok(faq.answer.trim(), `business.faqs "${faq.id}".answer: required`);
  }

  for (const link of business.socialLinks) {
    assert.ok(link.label.trim(), 'business.socialLinks: label required');
    assert.match(link.url, /^https:\/\//, `business.socialLinks "${link.label}": must be https://`);
  }

  assert.ok(business.enquiries.title.trim(), 'business.enquiries.title: required');
  assert.ok(business.enquiries.introduction.trim(), 'business.enquiries.introduction: required');
  assert.ok(business.enquiries.usefulToInclude.length >= 1, 'business.enquiries.usefulToInclude: include message guidance');
  for (const tip of business.enquiries.usefulToInclude) {
    assert.ok(tip.trim(), 'business.enquiries.usefulToInclude: empty tip');
  }
});

test('menu and tasting programmes pass full validation without freezing sample counts or prices', () => {
  assert.doesNotThrow(() => validateMenu(menu));
  assert.doesNotThrow(() => validateTastings(tastings, menu, { requireInitialFeatured: true }));

  assert.ok(allWines(menu).length >= 3, 'menu must include at least 3 wines');
  assert.ok(allFoods(menu).length >= 3, 'menu must include at least 3 food plates');
  assert.ok(allSoftDrinks(menu).length >= 1, 'menu must include alcohol-free drinks');
});

test('menu validation catches duplicate IDs, invalid servings, discriminated field leaks and broken picks', () => {
  // Duplicate item ID
  const dupMenu = cloneMenu();
  dupMenu.sections[1].items[0].id = dupMenu.sections[0].items[0].id;
  assert.throws(() => validateMenu(dupMenu), /duplicate id/);

  // Wine with duplicate serving kinds
  const dupServingMenu = cloneMenu();
  const firstWine = dupServingMenu.sections[0].items[0] as WineItem;
  firstWine.price = [
    { kind: 'glass', volumeMl: 150, amount: 12 },
    { kind: 'glass', volumeMl: 125, amount: 10 },
  ];
  assert.throws(() => validateMenu(dupServingMenu), /duplicate serving kind "glass"/);

  // Available wine with all servings unavailable
  const noAvailableServingMenu = cloneMenu();
  const secondWine = noAvailableServingMenu.sections[0].items[1] as WineItem;
  secondWine.available = true;
  secondWine.price = [{ kind: 'bottle', volumeMl: 750, amount: 54, available: false }];
  assert.throws(() => validateMenu(noAvailableServingMenu), /marked available but all of its servings are unavailable/);

  // Discriminated union leak: wine field on food item
  const leakedFoodMenu = cloneMenu();
  const foodSection = leakedFoodMenu.sections.find(s => s.id === 'small-plates')!;
  (foodSection.items[0] as unknown as Record<string, unknown>).grapes = ['Chardonnay'];
  assert.throws(() => validateMenu(leakedFoodMenu), /food item cannot include wine field "grapes"/);

  // Discriminated union leak: food diet field on wine item
  const leakedWineMenu = cloneMenu();
  (leakedWineMenu.sections[0].items[0] as unknown as Record<string, unknown>).diet = ['vegan'];
  assert.throws(() => validateMenu(leakedWineMenu), /wine items cannot carry food "diet" tags/);

  // Cellar picks referencing an unavailable wine explains how to choose a replacement
  const badPickMenu = cloneMenu();
  const unavailableWine = allWines(badPickMenu).find(w => !isItemAvailable(w));
  if (unavailableWine) {
    badPickMenu.cellarPickIds[0] = unavailableWine.id;
    assert.throws(() => validateMenu(badPickMenu), /Replace it with an available wine ID from:/);
  }

  // Cellar picks with only one style
  const singleStylePickMenu = cloneMenu();
  const reds = allWines(singleStylePickMenu).filter(w => w.style === 'red' && isItemAvailable(w));
  if (reds.length >= 3) {
    singleStylePickMenu.cellarPickIds = [reds[0].id, reds[1].id, reds[2].id];
    assert.throws(() => validateMenu(singleStylePickMenu), /at least 2 different wine styles/);
  }

  // Invalid pairing reference names valid food IDs
  const badPairingMenu = cloneMenu();
  (badPairingMenu.sections[0].items[0] as WineItem).pairingIds = ['not-a-plate'];
  assert.throws(() => validateMenu(badPairingMenu), /Choose a food item ID from:/);
});

test('glass price and availability helpers handle bottle-only, paused glass, unavailable wine and zero glasses', () => {
  // 1. Bottle-only wine is available by bottle, excluded from glass list
  const bottleOnly: WineItem = {
    kind: 'wine',
    id: 'test-bottle-only',
    name: 'Bottle Only Cuvée',
    description: 'Cellar bottle.',
    style: 'sparkling',
    grapes: ['Chardonnay'],
    origin: 'Champagne style',
    tastingNotes: ['Brioche', 'Lemon'],
    body: 'light',
    bottleShape: 'sparkling',
    price: [{ kind: 'bottle', volumeMl: 750, amount: 64 }],
  };
  assert.equal(isItemAvailable(bottleOnly), true);
  assert.equal(hasAvailableServing(bottleOnly), true);

  // 2. Sold-out glass / available bottle
  const soldOutGlass: WineItem = {
    ...bottleOnly,
    id: 'test-sold-out-glass',
    price: [
      { kind: 'glass', volumeMl: 150, amount: 9, available: false },
      { kind: 'bottle', volumeMl: 750, amount: 40, available: true },
    ],
  };
  assert.equal(isServingAvailable(soldOutGlass, soldOutGlass.price[0]), false);
  assert.equal(isServingAvailable(soldOutGlass, soldOutGlass.price[1]), true);
  assert.equal(hasAvailableServing(soldOutGlass), true);
  assert.match(formatWineServing(soldOutGlass, soldOutGlass.price[0]).summary, /Unavailable/);
  assert.equal(formatWineServing(soldOutGlass, soldOutGlass.price[1]).summary, 'Bottle · 750 ml · $40');

  // 3. Wholly unavailable wine overrides serving availability
  const whollyUnavailable: WineItem = {
    ...bottleOnly,
    id: 'test-wholly-unavailable',
    available: false,
    price: [
      { kind: 'glass', volumeMl: 150, amount: 8, available: true },
      { kind: 'bottle', volumeMl: 750, amount: 35, available: true },
    ],
  };
  assert.equal(isItemAvailable(whollyUnavailable), false);
  assert.equal(isServingAvailable(whollyUnavailable, whollyUnavailable.price[0]), false);
  assert.equal(hasAvailableServing(whollyUnavailable), false);

  // 4. Menu where only bottle servings are available -> startingGlassPrice is null, never uses bottle price
  const noGlassMenu = cloneMenu();
  noGlassMenu.sections = [
    {
      id: 'cellar-bottles',
      title: 'Cellar bottles',
      description: 'Bottles only',
      items: [bottleOnly, soldOutGlass, whollyUnavailable],
    },
  ];
  assert.equal(availableGlassList(noGlassMenu).length, 0);
  assert.equal(startingGlassPrice(noGlassMenu), null);
  assert.equal(startingGlassClaim(noGlassMenu), null);

  // 5. Defensive rendering helpers with zero valid picks or unavailable picks do not crash
  noGlassMenu.cellarPickIds = ['missing-1', 'missing-2', 'missing-3'];
  noGlassMenu.homePlateIds = ['missing-plate-1', 'missing-plate-2', 'missing-plate-3'];
  assert.deepEqual(selectCellarPicks(noGlassMenu), []);
  assert.deepEqual(selectHomePlates(noGlassMenu), []);

  // When an owner marks a cellar pick unavailable without updating cellarPickIds, selectCellarPicks still returns it so the shelf can label it honestly
  noGlassMenu.cellarPickIds = ['test-wholly-unavailable'];
  const defensivePicks = selectCellarPicks(noGlassMenu);
  assert.equal(defensivePicks.length, 1);
  assert.equal(isItemAvailable(defensivePicks[0]), false);
});

test('price and pairing helpers format single and multi-size items cleanly', () => {
  assert.equal(formatPrice(12, menu), '$12');
  assert.equal(formatPrice(12.5, menu), '$12.50');

  const multiSizeDrink: SoftDrinkItem = {
    kind: 'soft-drink',
    id: 'test-water',
    name: 'Mineral water',
    description: 'Sparkling water',
    servingNote: 'Chilled bottle',
    price: [
      { label: '330 ml', amount: 4 },
      { label: '750 ml', amount: 7 },
    ],
  };
  assert.equal(formatNonWinePrice(multiSizeDrink, menu), '330 ml · $4 / 750 ml · $7');

  const wineWithPairing = allWines(menu).find(w => w.pairingIds && w.pairingIds.length > 0);
  if (wineWithPairing) {
    const resolved = resolveWinePairings(wineWithPairing, menu);
    assert.equal(resolved.length, wineWithPairing.pairingIds!.length);
  }

  const range = menuPriceRange(menu);
  assert.match(range, /^\$\d+/);
});

test('tasting programmes validate references, allow all-paused state and suppress active CTA when paused', () => {
  // Active featured programme exists initially
  const featured = selectFeaturedProgramme(tastings);
  assert.ok(featured, 'expected an initial featured tasting programme');
  assert.equal(isProgrammeAvailable(featured), true);
  assert.ok(resolveProgrammeWines(featured, menu).length >= 1);

  // Paused programme never produces a booking/enquiry CTA suggesting the format is available
  const paused: TastingProgramme = {
    ...tastings[0],
    id: 'paused-format',
    available: false,
    featured: true,
  };
  const state = programmeEnquiryState(paused);
  assert.equal(state.available, false);
  assert.equal(state.statusLabel, 'Not currently taking enquiries for this format');
  assert.equal(state.ctaLabel, null);
  assert.equal(state.ctaHref, null);

  // When all programmes are paused, validation still passes and selectFeaturedProgramme returns null
  const allPaused = cloneTastings().map(p => ({ ...p, available: false }));
  assert.doesNotThrow(() => validateTastings(allPaused, menu));
  assert.equal(selectFeaturedProgramme(allPaused), null);

  // Referencing an unavailable wine in an active programme throws an actionable replacement message
  const unavailableWine = allWines(menu).find(w => !isItemAvailable(w));
  if (unavailableWine) {
    const badProgrammes = cloneTastings();
    badProgrammes[0].wineIds = [unavailableWine.id];
    assert.throws(() => validateTastings(badProgrammes, menu), /Replace it with an available wine ID from:/);
  }

  // Group size and price formatting
  assert.equal(formatGroupSize({ ...tastings[0], groupSize: { min: 4, max: 8 } }), '4–8 guests');
  assert.equal(formatProgrammePrice({ ...tastings[0], pricePerPerson: 32 }, menu), '$32 per person');
  assert.equal(formatProgrammePrice({ ...tastings[0], pricePerPerson: undefined }, menu), 'Price on enquiry');
});

test('structured data builds BarOrPub schema from content and escapes closing script tags', () => {
  const data = businessStructuredData();
  assert.equal(data['@type'], 'BarOrPub');
  assert.equal(data.name, business.name);
  assert.equal(data.address.streetAddress, business.address.street);
  assert.ok(Array.isArray(data.openingHoursSpecification) && data.openingHoursSpecification.length > 0);

  const value = { name: '</script><script>alert(1)</script>', text: '< & >' };
  const encoded = jsonLd(value);
  assert.ok(!encoded.includes('<'), 'JSON-LD must escape <');
  assert.deepEqual(JSON.parse(encoded), value);
});

test('path helpers preserve trailing slashes, hashes and full-document Contact detection', () => {
  assert.equal(route('/menu'), '/menu/');
  assert.equal(route('/menu#chenin-blanc'), '/menu/#chenin-blanc');
  assert.equal(route('/#tastings'), '/#tastings');
  assert.equal(isContactRoute('/contact'), true);
  assert.equal(isContactRoute('/contact/'), true);
  assert.equal(isContactRoute('/menu/'), false);
});
