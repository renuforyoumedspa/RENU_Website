// Local fallback content — used only when no real Sanity project is
// configured (see isSanityConfigured in ../env.ts), so `npm run dev` and
// `npm run build` work immediately without needing live CMS credentials.
// This is the same 29-treatment set established throughout this project's
// earlier prototypes — real content, not placeholder lorem ipsum. Once a
// real Sanity project is connected, none of this file is read anymore.
// Type-only import — erased at compile time, so this doesn't create a real
// circular runtime dependency with queries.ts (which imports the mock data
// arrays back from this file).
import type { Treatment, BlogPost, Product, TeamMember, GalleryTile, FeaturedBeforeAfter } from './queries';

const FACTS = {
  Injectable: { visitLength: '20–40 min', downtime: 'Minimal', resultsShow: '3–14 days', lasts: '3–12 months' },
  Thread: { visitLength: '45–75 min', downtime: '2–3 days', resultsShow: '4–12 weeks', lasts: '1–2 years' },
  Laser: { visitLength: '45–75 min', downtime: '3–5 days', resultsShow: '4–12 weeks', lasts: '1–2 years' },
  Energy: { visitLength: '45–75 min', downtime: 'Minimal', resultsShow: '4–12 weeks', lasts: '1–2 years' },
  Topical: { visitLength: '45–75 min', downtime: 'Minimal', resultsShow: '4–12 weeks', lasts: '1–2 years' }
} as const;

function t(
  id: string, name: string, area: Treatment['area'], concern: string, tech: keyof typeof FACTS, cta: string, blurb: string,
  extra?: Partial<Treatment>
): Treatment {
  return { _id: id, slug: id, name, area, concern, tech, cta, blurb, facts: FACTS[tech], ...extra };
}

export const MOCK_TREATMENTS: Treatment[] = [
  t('botox', 'Botox®', 'Face', 'Lines & wrinkles', 'Injectable', 'Erase fine lines', "Smooth forehead lines, elevens and crow's feet while your expression stays yours."),
  t('dysport', 'Dysport®', 'Face', 'Lines & wrinkles', 'Injectable', 'Soften my lines', 'A fast-onset neurotoxin that spreads a little wider — good for broad forehead lines.'),
  t('xeomin', 'Xeomin®', 'Face', 'Lines & wrinkles', 'Injectable', 'Try a purer toxin', "A protein-free formulation, often chosen by patients who've plateaued on other toxins."),
  t('belotero', 'Belotero®', 'Face', 'Lines & wrinkles', 'Injectable', 'Blur etched lines', 'A thin gel that integrates into skin to soften fine, etched-in lines around the mouth.'),
  t('juvederm', 'Juvéderm®', 'Face', 'Volume loss', 'Injectable', 'Restore my volume', 'Hyaluronic acid filler for cheeks, temples and midface hollowing.'),
  t('restylane', 'Restylane®', 'Face', 'Volume loss', 'Injectable', 'Rebuild structure', 'A flexible HA family with options for tear troughs, cheeks and jawline.'),
  t('lyft', 'Restylane® Lyft', 'Face', 'Volume loss', 'Injectable', 'Lift my cheeks', 'A firmer gel used higher on the cheekbone where projection is needed.'),
  t('sculptra', 'Sculptra®', 'Face', 'Volume loss', 'Injectable', 'Build collagen', 'Stimulates your own collagen over months — gradual, and it keeps working.'),
  t('radiesse', 'Radiesse®', 'Face', 'Sagging & laxity', 'Injectable', 'Firm and lift', 'Calcium-based biostimulator that tightens as it fills — jawline and lower face.'),
  t('kybella', 'Kybella® / DCA', 'Face', 'Contour', 'Injectable', 'Define my chin', 'Dissolves submental fat under the chin, permanently, without surgery.'),
  t('lips', 'Lip Injections', 'Face', 'Lips', 'Injectable', 'Perfect my lips', 'Shape, hydration and definition — sized to your face, not a trend.'),
  t('renulift', 'RENUlift™', 'Face', 'Sagging & laxity', 'Thread', 'Lift without surgery', "RENU's signature non-surgical lift — repositions the midface with no incisions.", {
    beforeAfters: [
      { patient: 'Patient A', timeframe: '6 weeks apart', layout: 'separate' },
      { patient: 'Patient E', timeframe: '9 years apart', layout: 'separate' },
      { patient: 'Patient B', timeframe: '3 months apart', layout: 'separate' },
      { patient: 'Patient D', timeframe: '1 year apart', layout: 'separate' }
    ]
  }),
  t('templelift', 'RENU Temple Lift', 'Face', 'Sagging & laxity', 'Thread', 'Open my eyes', 'Restores temple hollowing and lifts the brow tail for a rested upper face.'),
  t('pdo', 'PDO Threads', 'Face', 'Sagging & laxity', 'Thread', 'Thread lift my jaw', 'Dissolvable threads that lift tissue and lay down collagen along the way.'),
  t('browlift', 'Brow Lift', 'Face', 'Sagging & laxity', 'Thread', 'Raise my brow', 'A few millimetres of brow lift changes how awake your whole face reads.'),
  t('ultherapy', 'Ultherapy®', 'Face', 'Sagging & laxity', 'Energy', 'Tighten with ultrasound', 'Focused ultrasound reaches the deep support layer surgeons tighten — no downtime.'),
  t('plasmapen', 'Plasma Pen', 'Face', 'Sagging & laxity', 'Energy', 'Tighten crepey skin', 'Plasma energy contracts thin, crepey skin — eyelids, upper lip, neck.'),
  t('necklift', 'Neck Lift', 'Face', 'Sagging & laxity', 'Energy', 'Redefine my neck', 'A combined protocol for banding, laxity and the beginnings of a jowl.'),
  t('eyelid', 'Laser Eyelid Lift', 'Face', 'Sagging & laxity', 'Laser', 'Lift my lids', 'Laser tightening of the upper and lower lid without a blepharoplasty.'),
  t('coollaser', 'RENU Cool Laser', 'Skin', 'Texture & tone', 'Laser', 'Get flawless skin', "Resurfacing results with minimal downtime — RENU's most-requested laser."),
  t('resurfacing', 'Laser Skin Resurfacing', 'Skin', 'Texture & tone', 'Laser', 'Resurface my skin', 'Fractional CO2 for deeper lines, sun damage and years of accumulated texture.'),
  t('pigment', 'Pigment & Sun Damage', 'Skin', 'Pigment', 'Laser', 'Even my tone', 'Targets brown patches, melasma and sun spots from South Florida living.'),
  t('microneedling', 'Microneedling', 'Skin', 'Acne scars', 'Energy', 'Smooth my texture', 'Controlled micro-injury that rebuilds collagen — pores, scars, fine crepe.'),
  t('acnescar', 'Acne Scarring', 'Skin', 'Acne scars', 'Laser', 'Treat my scars', 'A staged plan combining laser and microneedling for indented scarring.'),
  t('dermaplane', 'Dermaplaning', 'Skin', 'Texture & tone', 'Topical', 'Refresh my glow', 'Removes dead skin and vellus hair so product and makeup sit smooth.'),
  t('hair', 'Hair Restoration', 'Body', 'Hair loss', 'Injectable', 'Regrow my hair', 'For thinning at the part and temples — especially female pattern loss.'),
  t('buttlift', 'Non-Surgical Butt Lift', 'Body', 'Contour', 'Injectable', 'Lift with no downtime', 'Biostimulator-based shaping and projection without implants or fat transfer.'),
  t('tightening', 'Body Skin Tightening', 'Body', 'Sagging & laxity', 'Energy', 'Tighten my skin', 'Arms, abdomen and knees — energy-based tightening after weight change.'),
  t('cellulite', 'Cellulite Treatment', 'Body', 'Cellulite', 'Energy', 'Smooth my thighs', 'Targets the fibrous bands that cause dimpling rather than the fat alone.')
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    _id: 'welcome-to-the-new-renu-blog',
    slug: 'welcome-to-the-new-renu-blog',
    title: 'Welcome to the New RENU Blog',
    description: 'A first post to prove out the blog — replace or delete once real posts are ready.',
    pubDate: '2026-08-27T00:00:00.000Z',
    draft: false
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { _id: 'zo-daily-power-defense', slug: 'zo-daily-power-defense', brand: 'ZO Skin Health', name: 'Daily Power Defense', note: "A lightweight daily antioxidant serum that strengthens skin's barrier and softens the look of fine lines over time.", price: '$165' },
  { _id: 'neocutis-bio-serum', slug: 'neocutis-bio-serum', brand: 'Neocutis', name: 'Bio-Serum', note: 'Growth-factor serum popular as a post-injectable and post-laser recovery step — calming, hydrating, fragrance-free.', price: '$150' },
  { _id: 'alastin-restorative-skin-complex', slug: 'alastin-restorative-skin-complex', brand: 'Alastin', name: 'Restorative Skin Complex', note: 'Supports skin&apos;s natural renewal process — a common pairing with microneedling and laser resurfacing plans.', price: '$185' },
  { _id: 'eltamd-uv-clear-spf46', slug: 'eltamd-uv-clear-spf46', brand: 'EltaMD', name: 'UV Clear Broad-Spectrum SPF 46', note: 'The daily sunscreen Dr. Barrett recommends for every patient, every day.', price: '$43' },
  { _id: 'renu-post-care-balm', slug: 'renu-post-care-balm', brand: 'RENU Post-Care', name: 'Post-Treatment Recovery Balm', note: "RENU's own after-care balm, sent home with every laser, microneedling and thread-lift patient.", price: '$38' },
  { _id: 'zo-exfoliating-polish', slug: 'zo-exfoliating-polish', brand: 'ZO Skin Health', name: 'Exfoliating Polish', note: 'A gentle at-home resurfacing scrub that keeps results from in-office treatments going between visits.', price: '$72' }
];

// Same 3-placeholder set the About page rendered inline before team
// members moved to Sanity — kept identical so nothing visually changes
// until the practice supplies real names/photos in the Studio.
export const MOCK_TEAM_MEMBERS: TeamMember[] = [1, 2, 3].map((i) => ({
  _id: `team-placeholder-${i}`,
  name: '[Team Member — Name Pending]',
  role: '[Role / Credential Pending]',
  bio: 'Bio pending — name, credentials and headshot to be supplied by the practice before this ships.',
  order: i
}));

// Same 7 tiles that were hardcoded directly in page.tsx — real reviews
// sourced from RENU's public Google review history, plus the team/Val
// photos and two stock treatment-room shots. Moved here so the homepage
// reads through getGalleryTiles() like every other piece of content.
export const MOCK_GALLERY_TILES: GalleryTile[] = [
  { _id: 'gallery-1', kind: 'photo', order: 1, image: '/assets/renu-team-group.jpg', alt: 'The RENU Medical Aesthetics team', shape: 'wide' },
  { _id: 'gallery-2', kind: 'review', order: 2, quote: 'I have been going to Renu Medical for a few years now. Dr. Barrett is an expert in her field. The staff is always so professional. I definitely recommend Renu.', reviewerName: 'Jamie S.', source: 'Verified Google review' },
  { _id: 'gallery-3', kind: 'photo', order: 3, image: '/assets/gallery-treatment-room-1.webp', alt: 'A RENU patient during a consultation', shape: 'square' },
  { _id: 'gallery-4', kind: 'review', order: 4, quote: 'Dr. Barrett and her staff are exceptional. Loved the results! Anxious to try other services they offer — very natural and soft results!', reviewerName: 'Lynn C.', source: 'Verified Google review' },
  { _id: 'gallery-5', kind: 'photo', order: 5, image: '/assets/dr-valerie-barrett-lifestyle.jpg', alt: 'Dr. Valerie Barrett', shape: 'tall' },
  { _id: 'gallery-6', kind: 'review', order: 6, quote: 'Dr. Barrett is wonderful. Took time to answer all my questions. The team is great. Extremely happy.', reviewerName: 'Verified Patient', source: 'Google review' },
  { _id: 'gallery-7', kind: 'photo', order: 7, image: '/assets/gallery-treatment-room-2.webp', alt: 'A treatment in progress at RENU Medical Aesthetics', shape: 'wide' }
];

// Mirrors the 4 tiles that were hardcoded in the homepage's Before & After
// section — same treatments, same captions, same order. `entry` has no
// real photos yet (mock mode never does), so the frontend's placeholder
// split-tile rendering kicks in exactly like it did before this moved to
// Sanity.
export const MOCK_HOMEPAGE_FEATURED_BEFORE_AFTERS: FeaturedBeforeAfter[] = [
  { label: 'Botox®', treatmentSlug: 'botox', entry: { patient: 'Patient A', timeframe: '6 weeks apart', layout: 'separate' } },
  { label: 'RENUlift™', treatmentSlug: 'renulift', entry: { patient: 'Patient E', timeframe: '9 years apart', layout: 'separate' } },
  { label: 'Dermal Fillers', treatmentSlug: 'sculptra', entry: { patient: 'Patient B', timeframe: '3 months apart', layout: 'separate' } },
  { label: 'Laser Resurfacing', treatmentSlug: 'resurfacing', entry: { patient: 'Patient C', timeframe: '8 months apart', layout: 'separate' } }
];
