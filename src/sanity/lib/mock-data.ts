// Local fallback content — used only when no real Sanity project is
// configured (see isSanityConfigured in ../env.ts), so `npm run dev` and
// `npm run build` work immediately without needing live CMS credentials.
// This is the same 29-treatment set established throughout this project's
// earlier prototypes — real content, not placeholder lorem ipsum. Once a
// real Sanity project is connected, none of this file is read anymore.
// Type-only import — erased at compile time, so this doesn't create a real
// circular runtime dependency with queries.ts (which imports the mock data
// arrays back from this file).
import type { Treatment, BlogPost, Product } from './queries';

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
      { patient: 'Patient A', timeframe: '6 weeks apart' },
      { patient: 'Patient E', timeframe: '9 years apart' },
      { patient: 'Patient B', timeframe: '3 months apart' },
      { patient: 'Patient D', timeframe: '1 year apart' }
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
