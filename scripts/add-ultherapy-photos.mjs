// Ultherapy: sets the "What it treats" image and adds the before & afters
// from Assets/only ultherapy photos that the page doesn't already show.
// Safe to re-run — entries are keyed by file, and existing ones are kept.
//   node --env-file=.env.local scripts/add-ultherapy-photos.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const dry = process.argv.includes('--dry');
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.resolve(site, '..', 'Assets', 'only ultherapy photos');
const ID = 'treatment-ultherapy';

const CONTENT_IMAGE = { file: 'Ultherapy Abdomen 3 months post.jpg', alt: 'Ultherapy on the abdomen, before and 3 months after' };

// Skipped: "2023 to 2025.jpg" and "ulthx arms.jpg" (already on the page),
// the abdomen photo (used as the "What it treats" image above), and, per the
// client, repeat views of the same patients: "chinstrap only ulthx (1)/(2)"
// (keeping the front view, (3)) and "ultherapy.jpg" (side view of the
// 2023–2025 patient).
const BEFORE_AFTERS = [
  ['ulthxchinstrap.jpg'],
  ['chinstrap only ulthx (3).jpg'],
  ['k.jpg', '2 months'],
  ['l.jpg', '2 months'],
  ['ulthxarms.jpg'],
  ['ulthxarmss.jpg']
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false
});

const upload = async (file) => {
  const p = path.join(folder, file);
  if (!fs.existsSync(p)) throw new Error(`missing photo: ${p}`);
  if (dry) return 'dry-run';
  return (await client.assets.upload('image', fs.readFileSync(p), { filename: `ultherapy-${file.replace(/\s+/g, '-').toLowerCase()}` }))._id;
};

const doc = await client.getDocument(ID);
if (!doc) throw new Error(`${ID} not found`);
const shownAssets = new Set((doc.beforeAfters || []).map((e) => e.pairedImage?.asset?._ref).filter(Boolean));

const contentAsset = await upload(CONTENT_IMAGE.file);
console.log(`${dry ? '[dry] ' : ''}What it treats image: ${CONTENT_IMAGE.file}`);

const entries = [];
for (const [file, timeframe] of BEFORE_AFTERS) {
  const assetId = await upload(file);
  // Sanity de-duplicates uploads, so an identical photo returns the same
  // asset id as the one already on the page.
  if (shownAssets.has(assetId)) { console.log(`  skip (already shown): ${file}`); continue; }
  console.log(`${dry ? '[dry] ' : ''}  + before & after: ${file}${timeframe ? ` (${timeframe})` : ''}`);
  entries.push({
    _key: `ulth-${file.replace(/[^a-z0-9]/gi, '').toLowerCase()}`,
    _type: 'beforeAfterEntry',
    layout: 'sideBySide',
    ...(timeframe ? { timeframe } : {}),
    pairedImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
  });
}

if (dry) { console.log(`dry run — would add ${entries.length} before & afters`); process.exit(0); }

const contentImage = { _type: 'image', asset: { _type: 'reference', _ref: contentAsset }, alt: CONTENT_IMAGE.alt };
for (const id of [ID, `drafts.${ID}`]) {
  if (id !== ID && !(await client.getDocument(id))) continue;
  const existingKeys = new Set(((await client.getDocument(id)).beforeAfters || []).map((e) => e._key));
  await client
    .patch(id)
    .set({ contentImage })
    .setIfMissing({ beforeAfters: [] })
    .append('beforeAfters', entries.filter((e) => !existingKeys.has(e._key)))
    .commit();
}
console.log(`done — ${entries.length} before & afters added`);
