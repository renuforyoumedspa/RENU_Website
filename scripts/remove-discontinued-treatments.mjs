// One-time Sanity cleanup (Nov 2026): removes four discontinued treatments
// and hides the blog posts about them. Run it right before pushing the
// matching code change — the code adds the redirects for these pages, so
// running it earlier would leave them showing "not found" until the push.
//
//   node --env-file=.env.local scripts/remove-discontinued-treatments.mjs --dry   # preview
//   node --env-file=.env.local scripts/remove-discontinued-treatments.mjs         # do it
//
// Safe to re-run. Deleted documents can be restored from the document's
// history in the Studio (or sanity.io/manage → dataset history).
import { createClient } from '@sanity/client';

const dry = process.argv.includes('--dry');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false
});

// Cellulite Treatment, Dermaplaning, PDO Threads, Pigment & Sun Damage.
const TREATMENTS = ['treatment-cellulite', 'treatment-dermaplane', 'treatment-pdo', 'treatment-pigment'];
// Blog posts about them — hidden (draft: true), not deleted, so they can
// come back by switching "Hide from site" off in the Studio.
const POSTS = [
  'blogPost-how-to-get-rid-of-cellulite-with-ilipo-laser-in-stuart-fl',
  'blogPost-stuart-residents-ask-who-is-a-good-candidate-for-dermaplaning',
  'blogPost-pdo-threads-the-latest-trends',
  'blogPost-tequesta-residents-ask-who-is-a-good-candidate-for-an-ipl-photofacial'
];

const ids = [...TREATMENTS, ...TREATMENTS.map((id) => `drafts.${id}`)];
const existing = await client.fetch('*[_id in $ids]{_id, name}', { ids });
const referencing = await client.fetch('*[references($ids) && !(_id in $ids)]{_id, _type}', { ids: TREATMENTS });
const posts = await client.fetch('*[_id in $ids]{_id, title, draft}', { ids: POSTS });

console.log(`${dry ? '[dry run] ' : ''}treatments to delete: ${existing.map((d) => d._id).join(', ') || 'none (already gone)'}`);
console.log(`blog posts to hide: ${posts.filter((p) => !p.draft).map((p) => p._id).join(', ') || 'none (already hidden)'}`);
if (referencing.length) {
  console.error(`STOP: other documents still reference these treatments: ${referencing.map((d) => d._id).join(', ')}`);
  process.exit(1);
}
if (dry) process.exit(0);

const tx = client.transaction();
for (const d of existing) tx.delete(d._id);
for (const p of posts.filter((p) => !p.draft)) tx.patch(p._id, (patch) => patch.set({ draft: true }));
await tx.commit();
console.log('done');
