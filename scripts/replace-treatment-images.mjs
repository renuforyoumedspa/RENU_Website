// Swaps the hero image (tile + top of page) on a few treatments for the
// client's own clinic photos from "Treatment Images/". Run at push time:
//   node --env-file=.env.local scripts/replace-treatment-images.mjs [--dry]
// Also refreshes the matching local fallback in public/assets/treatments/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import sharp from 'sharp';

const dry = process.argv.includes('--dry');
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photos = path.resolve(site, '..', 'Treatment Images');

// slug → photo. Acne Scarring shares the Cool Laser photo.
const SWAPS = [
  ['microneedling', 'Microneedling/microneedling.jpg'],
  ['coollaser', 'RENU Cool Laser/cool laser.jpg'],
  ['acnescar', 'RENU Cool Laser/cool laser.jpg'],
  ['lips', 'Lip Injections/Injectiions.jpg']
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false
});

const uploaded = new Map(); // one upload per file, even when shared
for (const [slug, rel] of SWAPS) {
  const file = path.join(photos, rel);
  if (!fs.existsSync(file)) throw new Error(`missing photo: ${file}`);
  const id = `treatment-${slug}`;
  const doc = await client.getDocument(id);
  if (!doc) throw new Error(`treatment not found: ${id}`);
  console.log(`${dry ? '[dry] ' : ''}${doc.name}: ${rel}`);
  if (dry) continue;

  if (!uploaded.has(file)) {
    const asset = await client.assets.upload('image', fs.readFileSync(file), { filename: `treatment-${path.basename(rel).replace(/\s+/g, '-').toLowerCase()}` });
    uploaded.set(file, asset._id);
  }
  const image = { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(file) } };
  await client.patch(id).set({ image }).commit();
  // Patch any unpublished Studio draft too, so publishing it later doesn't
  // bring the old photo back.
  if (await client.getDocument(`drafts.${id}`)) await client.patch(`drafts.${id}`).set({ image }).commit();

  await sharp(file).rotate().resize(1536, 1024, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(path.join(site, 'public/assets/treatments', `${slug}.jpg`));
}
console.log(dry ? 'dry run — nothing changed' : 'done');
