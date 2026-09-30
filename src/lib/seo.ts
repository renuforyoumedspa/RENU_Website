// One source of truth for the business details search engines read:
// canonical site URL, name, locations, phone, service area, and the
// structured data (schema.org JSON-LD) built from them. Keep the phone and
// addresses identical to the footer/contact page — Google cross-checks
// name/address/phone consistency against the Google Business Profiles.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://renuforyou.com').replace(/\/+$/, '');
export const SITE_NAME = 'RENU Medical Aesthetics';
// Main line (Tequesta) — the one in the header and set up for texting.
export const PHONE = '+1-561-406-6123';
export const EMAIL = 'info@renuforyou.com';
export const DEFAULT_OG_IMAGE = '/assets/renu-hero.jpg';

// Cities the old site ranked for and the practice serves. The clinics are
// in Stuart and Tequesta; Jupiter, Port St. Lucie, Palm Beach Gardens and
// Hobe Sound are served from them (never claimed as office locations).
export const SERVICE_AREA = ['Stuart', 'Tequesta', 'Jupiter', 'Port St. Lucie', 'Palm Beach Gardens', 'Hobe Sound'];
export const SERVICE_AREA_TEXT = 'Stuart, Tequesta, Jupiter, Port St. Lucie and Palm Beach Gardens, FL';

export const LOCATIONS = [
  {
    id: 'stuart',
    name: `${SITE_NAME} — Stuart`,
    street: '845 SE Osceola Street',
    city: 'Stuart',
    zip: '34994',
    phone: '+1-772-266-4450'
  },
  {
    id: 'tequesta',
    name: `${SITE_NAME} — Tequesta`,
    street: '304 Tequesta Drive, Suite 300',
    city: 'Tequesta',
    zip: '33469',
    phone: '+1-561-406-6123'
  }
] as const;

const OPENING_HOURS = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '09:00',
  closes: '17:00'
};

export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

const PHYSICIAN_ID = `${SITE_URL}/#dr-valerie-barrett`;
const ORG_ID = `${SITE_URL}/#organization`;

export function physicianJsonLd() {
  return {
    '@type': 'Physician',
    '@id': PHYSICIAN_ID,
    name: 'Dr. Valerie Barrett, MD',
    honorificSuffix: 'MD',
    description: 'Board-certified physician and founder of RENU Medical Aesthetics, performing non-surgical aesthetic treatments since 2002.',
    url: abs('/about/'),
    worksFor: { '@id': ORG_ID }
  };
}

// Site-wide graph: the practice, its two clinics, and its physician.
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalBusiness', 'MedicalClinic'],
        '@id': ORG_ID,
        name: SITE_NAME,
        alternateName: 'RENU',
        url: abs('/'),
        logo: abs('/assets/renu-logo.png'),
        image: abs(DEFAULT_OG_IMAGE),
        telephone: PHONE,
        email: EMAIL,
        slogan: 'RENU the beauty within you.',
        foundingDate: '2002',
        founder: { '@id': PHYSICIAN_ID },
        priceRange: '$$$',
        areaServed: SERVICE_AREA.map((city) => ({ '@type': 'City', name: `${city}, FL` })),
        department: LOCATIONS.map((l) => ({ '@id': `${SITE_URL}/#${l.id}` })),
        sameAs: ['https://www.yelp.com/biz/renu-medical-aesthetics-stuart', 'https://www.threads.com/@renutequesta']
      },
      ...LOCATIONS.map((l) => ({
        '@type': 'MedicalClinic',
        '@id': `${SITE_URL}/#${l.id}`,
        name: l.name,
        url: abs('/contact/'),
        telephone: l.phone,
        image: abs(DEFAULT_OG_IMAGE),
        parentOrganization: { '@id': ORG_ID },
        address: {
          '@type': 'PostalAddress',
          streetAddress: l.street,
          addressLocality: l.city,
          addressRegion: 'FL',
          postalCode: l.zip,
          addressCountry: 'US'
        },
        openingHoursSpecification: OPENING_HOURS,
        employee: { '@id': PHYSICIAN_ID }
      })),
      physicianJsonLd(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: abs('/'),
        name: SITE_NAME,
        publisher: { '@id': ORG_ID }
      }
    ]
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: abs(item.path) }))
  };
}

// Only questions actually visible on the page go in here (Google requires
// FAQ markup to match on-page content).
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  };
}

// Renders a JSON-LD block. `<` is escaped so content can never close the tag.
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
