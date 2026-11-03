// Adds before & after photos (uncropped "full" tiles, no captions) and more
// Google reviews to the Patient Gallery, alternating after the existing
// tiles. Safe to re-run: fixed ids, and a photo's file is only uploaded once.
//   node --env-file=.env.local scripts/add-gallery-tiles.mjs [--dry]
// Run AFTER the site deploy that adds the "full" tile shape is live.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const dry = process.argv.includes('--dry');
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.resolve(site, '..', 'Assets');

// Each a distinct photo (checked by file hash and by eye; none repeats the
// Age in Reverse carousel). MIsc/IMG_0828.jpg is the same file as the one
// in "age in reverse", so it's listed once.
const PHOTOS = [
  'age in reverse/2017-2026.jpg',
  'MIsc/Untitled Design - 7.png',
  'age in reverse/2016-2026.jpg',
  'MIsc/Ultherapy arms + Radiesse arm wash.jpg',
  'age in reverse/IMG_0828.jpg',
  'MIsc/age in reverse 2023-2024.jpg',
  'age in reverse/2019-2026.jpg',
  'MIsc/microneedlings.jpg',
  'age in reverse/Outlook-agl5v1xg.jpg',
  'age in reverse/2017-2026 reverse.jpg',
  'MIsc/microneedling.jpg'
];

// Google reviews, all 5 stars. Ones Google cut off ("… More") end at their
// last complete sentence.
const REVIEWS = [
  ['Lisa L.', 'I have been going to Dr Barrett, in the Stuart location, for over a year. She is an expert in her field and her staff are all so friendly and helpful. Would highly recommend Renu.'],
  ['Cheryl G.', 'Dr. Barrett and the entire staff are incredibly knowledgeable, kind, and honest. They explain everything thoroughly and always have time for questions. I am extremely happy with everything they have recommended. I highly recommend Renu Aesthetics, you won’t be disappointed.'],
  ['Design4U', 'Meeting with Dr. Valerie Barrett and her Team was the Best decision for me to finally Look and Feel my best as I give all my Clients \u{1F4AF}'],
  ['Amanda N.', 'Dr. Barrett and her staff are the best of the best always going above and beyond! I’ve been 100% happy with every treatment I’ve received there. They’re all so friendly and consistently checking in to make sure I’m satisfied with my results. Dr. Barrett truly listens to what’s important to each patient. I wouldn’t recommend anyone else in town! Love love love Dr. Barrett and the Renu family!'],
  ['Sheila C.', 'Amazing experience! From reception to treatment. The staff and Dr. Barrett are on point for everything. Very attentive and guide you to what you need, nothing you don’t.'],
  ['Monica C.', 'Wow, I love Dr. Barrett’s approach to aesthetic medicine, it’s hard to find a doctor that wants to spend the time to educate you on what they are injecting into your body and make sure you are comfortable all around!'],
  ['Julianne A.', 'I was recommended to Dr. Barrett by a friend. At first, I was hesitant, but after speaking with Dr. Barrett, I was excited. She asked what bothered me about my appearance and gave me options (no pressure). I chose the Cool Laser treatments (3). I am thrilled with the results and have received a lot of compliments. Very natural looking. Her assistants are very personable and knowledgeable.'],
  ['Carrie E.', 'I just moved to the Stuart area and was looking for an excellent esthetic MD for Xeomin. I came to see Dr. Barrett at renew. The office was friendly and welcoming and well appointed.'],
  ['Rachel C.', 'Dr. Barrett really is the best. She listens to what you want and helps you get those results. She explains everything in detail and makes you feel comfortable.'],
  ['Sharon D.', 'Dr Barrett is wonderful! I have been going to her for several years and have learned that she is well trained in all areas of aesthetics. She is kind and listens to her patients. Her staff makes me feel welcome and comfortable. Highly recommend!'],
  ['Jessica P.', 'Dr. Barrett is the best! She takes her time with each patient listening to their needs and makes sure that she finds the right treatment for them. I actually look forward going to her office because her staff are so nice and I always leave with a smile on my face.'],
  ['Ginger M.', 'Dr. Barrett is the best! Her knowledge, experience and warm professionalism provide me with excellent results. She is a master at Radiesse and Versa. Her office staff is friendly and efficient as well.']
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false
});

const last = await client.fetch('*[_type == "galleryTile" && !(_id in path("drafts.**")) && !(_id match "gallery-ba-*") && !(_id match "gallery-rv-*")] | order(order desc)[0].order');
let order = (last ?? 0) + 1;

// Review, photo, review, photo … then the last review.
const tiles = [];
for (let i = 0; i < Math.max(REVIEWS.length, PHOTOS.length); i++) {
  if (REVIEWS[i]) tiles.push({ kind: 'review', i });
  if (PHOTOS[i]) tiles.push({ kind: 'photo', i });
}

const tx = client.transaction();
for (const t of tiles) {
  if (t.kind === 'review') {
    const [reviewerName, quote] = REVIEWS[t.i];
    console.log(`${order}  review  ${reviewerName}`);
    tx.createOrReplace({ _id: `gallery-rv-${t.i + 1}`, _type: 'galleryTile', kind: 'review', order, reviewerName, quote, source: 'Google review' });
  } else {
    const file = path.join(assets, PHOTOS[t.i]);
    if (!fs.existsSync(file)) throw new Error(`missing photo: ${file}`);
    console.log(`${order}  photo   ${PHOTOS[t.i]}`);
    if (!dry) {
      // Uploads are de-duplicated by Sanity (same file → same asset).
      const asset = await client.assets.upload('image', fs.readFileSync(file), { filename: path.basename(file) });
      tx.createOrReplace({
        _id: `gallery-ba-${t.i + 1}`,
        _type: 'galleryTile',
        kind: 'photo',
        order,
        shape: 'full',
        alt: 'Before and after photos of a RENU Medical Aesthetics patient',
        image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      });
    }
  }
  order++;
}
if (dry) console.log(`dry run — ${tiles.length} tiles, nothing changed`);
else { await tx.commit(); console.log(`added ${tiles.length} gallery tiles`); }
