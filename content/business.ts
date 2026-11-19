import type { OpeningHours } from '../lib/hours.ts';

// Sample wine bar business profile. Replace these fictitious details with your real wine bar information.
// Plain text only: values are rendered as text, never raw HTML.

export interface BusinessAddress {
  /** Street number and name. */
  street: string;
  /** City or locality. */
  locality: string;
  /** State, province or region code. */
  region: string;
  /** Postal or ZIP code. */
  postalCode: string;
  /** Two-letter ISO country code, e.g. "US". */
  country: string;
  /** Public-landmark disclaimer or premise note shown in Find us. */
  note: string;
  /** Single shared query passed to keyless Google Maps helpers. */
  mapQuery: string;
}

export interface DirectionNote {
  /** Short heading such as "Corner & landmark" or "Arriving on foot". */
  heading: string;
  /** Plain-text approach note without unverified access or travel-time guarantees. */
  text: string;
}

export interface Amenity {
  /** Stable URL-safe identifier. */
  id: string;
  /** Short label shown in the overview. */
  label: string;
  /** Plain-text explanation of what is offered. */
  description: string;
}

export interface PrivateEventsInfo {
  /** Section or callout heading for private evenings. */
  heading: string;
  /** Approachable description of how private evenings work. */
  description: string;
  /** Qualified group-size note; never implies instant booking or live capacity. */
  groupSizeNote: string;
}

export interface FaqItem {
  /** Stable URL-safe identifier for the FAQ item. */
  id: string;
  /** Visitor question shown in the native <summary> element. */
  question: string;
  /** Plain-text answer shown when expanded. */
  answer: string;
}

export interface SocialLink {
  /** Platform or link label, e.g. "Instagram". */
  label: string;
  /** Full https:// URL. Leave socialLinks empty until you have real accounts. */
  url: string;
}

export interface Business {
  /** Public display name; also update site.config.json's name when renaming. */
  name: string;
  /** Short headline for the home page hero. */
  tagline: string;
  /** Plain-text introduction used by the home hero and fallback metadata. */
  introduction: string;
  /** Public contact email address, never a private notification destination. */
  email: string;
  /** Public phone number; blank hides phone links. */
  phone: string;
  /** Short editorial story shown in the "A cellar without ceremony" section. */
  story: {
    /** Section heading. */
    heading: string;
    /** Two short paragraphs about the selection and table. */
    paragraphs: string[];
  };
  /** Premises address and shared map query. */
  address: BusinessAddress;
  /** Brief corner and approach notes. */
  directions: DirectionNote[];
  /** Seven-day same-day opening schedule in the business time zone (site.config.json). */
  openingHours: OpeningHours[];
  /** Optional manually edited service note; never automatically labelled "today". */
  notice?: string;
  /** Practical highlights of what is at the bar. */
  amenities: Amenity[];
  /** Private evening enquiry details. */
  privateEvents: PrivateEventsInfo;
  /** Six visitor FAQs rendered as native <details> disclosures. */
  faqs: FaqItem[];
  /** Optional public social links; empty by default so no fake profiles ship. */
  socialLinks: SocialLink[];
  /** Contact page copy; the hosted form supports name, email and message only. */
  enquiries: {
    /** Contact page heading. */
    title: string;
    /** Honest explanation that messages are enquiries confirmed by reply. */
    introduction: string;
    /** Suggestions for what to include in the message body, not extra fields. */
    usefulToInclude: string[];
  };
}

export const business: Business = {
  name: 'Wick & Bramble',
  tagline: 'A small cellar. A generous welcome.',
  introduction:
    'An intimate neighbourhood wine bar pouring a compact rotating list by the glass and bottle, alongside small plates, alcohol-free pours and unhurried tasting evenings.',
  email: 'hello@example.com',
  phone: '(212) 555-0163',
  story: {
    heading: 'A cellar without ceremony',
    paragraphs: [
      'We keep our rack deliberately compact: a handful of bottles open by the glass, a few more resting on the shelf for the table, and clear tasting notes written in plain language rather than cellar shorthand. Whether you know the grape you love or simply want something crisp, bright or comforting, we are happy to talk through what is open.',
      'Beside the glasses, the kitchen puts together unhurried small plates—warm bread, marinated olives, whipped white bean dip, mushroom toast and a considered cheese board—alongside house-made alcohol-free spritzes and sodas given the same care as the wine list.',
    ],
  },
  address: {
    street: '20 Times Square',
    locality: 'New York',
    region: 'NY',
    postalCode: '10036',
    country: 'US',
    note: '20 Times Square (northeast corner of 7th Avenue and 47th Street) is a real public landmark used solely as a demo map location for this template, not this fictitious wine bar’s premises.',
    mapQuery: '20 Times Square, New York, NY 10036',
  },
  directions: [
    {
      heading: 'Corner & landmark',
      text: 'Demo map pin at the northeast corner of 7th Avenue and West 47th Street in Midtown Manhattan. Replace this landmark note and address with your own street frontage before publishing.',
    },
    {
      heading: 'Planning your visit',
      text: 'Walk-ins are welcome for glasses and small plates whenever tables are free. If you have questions about step-free entry, seating layout or arriving with a group, please email or call ahead so we can give accurate details for your visit.',
    },
  ],
  openingHours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '17:00', closes: '22:00' },
    { day: 'Wednesday', opens: '17:00', closes: '22:00' },
    { day: 'Thursday', opens: '17:00', closes: '22:00' },
    { day: 'Friday', opens: '16:00', closes: '23:00' },
    { day: 'Saturday', opens: '16:00', closes: '23:00' },
    { day: 'Sunday', opens: '16:00', closes: '21:00' },
  ],
  notice:
    'Menu prices, cellar picks and serving availability are updated manually in our list; ask at the bar or send an enquiry if you are planning around a specific bottle.',
  amenities: [
    {
      id: 'small-plates',
      label: 'Small plates till close',
      description: 'Cold and warm plates designed to share beside a glass or bottle, with clear ingredient notes.',
    },
    {
      id: 'alcohol-free-list',
      label: 'Considered alcohol-free pours',
      description: 'House spritzes, botanical sodas and sparkling mineral water listed alongside the cellar rack.',
    },
    {
      id: 'tasting-enquiries',
      label: 'Tastings & private evenings',
      description: 'Hosted small-group tastings and private table evenings arranged by enquiry and confirmed by reply.',
    },
  ],
  privateEvents: {
    heading: 'Private evenings at the long table',
    description:
      'We host unhurried private gatherings with a tailored glass or bottle selection, alcohol-free pairings and shared platters from the kitchen.',
    groupSizeNote:
      'For groups of 8–14, ask us about a private evening; space, format and availability are confirmed by reply.',
  },
  faqs: [
    {
      id: 'glass-vs-bottle',
      question: 'Are all wines available both by the glass and by the bottle?',
      answer:
        'Most of our list is poured in 125 ml or 150 ml glasses as well as 750 ml bottles, while a few cellar bottles are offered by the bottle only. Sometimes a wine’s glass pour is paused while a bottle remains on the rack—each serving size and its availability are listed clearly on our menu.',
    },
    {
      id: 'walk-ins-and-tables',
      question: 'Do I need to book a table, or can we just walk in?',
      answer:
        'We keep space for walk-in guests every evening for glasses and small plates. If you are hoping to bring several friends or have a particular evening in mind, send us an enquiry through the Contact page and we will let you know what we can arrange by reply.',
    },
    {
      id: 'tasting-arrangements',
      question: 'How do your hosted tasting evenings work?',
      answer:
        'Our tasting evenings are recurring formats arranged by enquiry rather than ticketed calendar events. Choose a format that suits your group, tell us your preferred evening and guest count, and we will reply with available dates, proposed bottles and pricing details.',
    },
    {
      id: 'private-groups',
      question: 'Can we enquire about a private evening for a larger group?',
      answer:
        'Yes. For groups of 8 to 14 guests, our “Your own table” format sets aside the communal table with a custom sequence of pours and shared plates. Nothing is booked automatically online; we confirm the space, menu format and total cost directly with you by email.',
    },
    {
      id: 'alcohol-free-and-dietary',
      question: 'How do you handle alcohol-free guests and dietary requirements?',
      answer:
        'Alcohol-free spritzes, botanical sodas and sparkling water are always on the main list, and we can include alcohol-free pours in any tasting enquiry by arrangement. Small plates carry ingredient notes (such as vegetarian, vegan, gluten-free ingredients, dairy-free ingredients or contains nuts), though all dishes are prepared in a compact shared kitchen where cross-contact can occur—please mention any allergies when you enquire or order.',
    },
    {
      id: 'hours-and-demo-location',
      question: 'Are the listed opening hours and Times Square map pin real?',
      answer:
        'The opening hours (Tuesday–Sunday afternoons and evenings, Eastern Time) and the 20 Times Square address in this template are sample demo data. Before publishing a live wine bar website, replace the address, map query, hours, phone number and email in content/business.ts and site.config.json with your real premises.',
    },
  ],
  socialLinks: [],
  enquiries: {
    title: 'Tasting & private event enquiries',
    introduction:
      'Tell us what you have in mind. Your message is an enquiry; a tasting, table or private event is confirmed only when we reply. No payment is taken here.',
    usefulToInclude: [
      'Preferred date and time, with an alternative if your schedule is flexible',
      'Number of guests in your group',
      'The tasting format or private-event idea you are interested in',
      'Any dietary, alcohol-free or access needs, or other questions for the bar',
    ],
  },
};
