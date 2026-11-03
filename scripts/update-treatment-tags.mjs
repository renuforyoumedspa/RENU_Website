// Adds the area / concern tags the client asked for. Only adds — existing
// tags stay, and new ones go on the end so each treatment's primary (first)
// tag is unchanged. Run at push time:
//   node --env-file=.env.local scripts/update-treatment-tags.mjs [--dry]
//
// Client's list:
//   Face: Ultherapy, Microneedling, Cool Laser ("Cool Peel"), Botox,
//         RENU Temple Lift, RENUlift, DCA/Kybella
//   Body: Non-Surgical Butt Lift, DCA/Kybella, Ultherapy
//   Skin: Acne Scarring, Cool Laser, Ultherapy, Microneedling
//   Lines & wrinkles: Botox, Ultherapy, Cool Laser
//   Jawline / fat removal: DCA/Kybella (already tagged Contour + Jowls)
import { createClient } from '@sanity/client';

const dry = process.argv.includes('--dry');

const ADD = {
  areas: {
    Face: ['ultherapy', 'microneedling', 'coollaser', 'botox', 'templelift', 'renulift', 'kybella'],
    Body: ['buttlift', 'kybella', 'ultherapy'],
    Skin: ['acnescar', 'coollaser', 'ultherapy', 'microneedling']
  },
  concerns: {
    'Lines & wrinkles': ['botox', 'ultherapy', 'coollaser']
  }
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false
});

let changes = 0;
for (const [field, byTag] of Object.entries(ADD)) {
  for (const [tag, slugs] of Object.entries(byTag)) {
    for (const slug of slugs) {
      const ids = [`treatment-${slug}`, `drafts.treatment-${slug}`];
      for (const id of ids) {
        const doc = await client.getDocument(id);
        if (!doc) {
          if (!id.startsWith('drafts.')) throw new Error(`treatment not found: ${id}`);
          continue;
        }
        if ((doc[field] || []).includes(tag)) continue;
        console.log(`${dry ? '[dry] ' : ''}${doc.name}: + ${field} "${tag}"${id.startsWith('drafts.') ? ' (draft)' : ''}`);
        changes++;
        if (!dry) await client.patch(id).setIfMissing({ [field]: [] }).append(field, [tag]).commit();
      }
    }
  }
}
console.log(changes ? `${dry ? 'would make' : 'made'} ${changes} change(s)` : 'already up to date');
