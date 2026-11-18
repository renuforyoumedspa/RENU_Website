// Mid-Nov 2026 treatment content pass: the client's wording changes, plus
// "What it treats" images and before & afters matched from Assets/.
// Safe to re-run: photos are keyed by file, removals by photo fingerprint.
//   node --env-file=.env.local scripts/update-treatment-content.mjs [--dry]
// Run with the code change that adds the whatItIs / howItWorks / signature
// fields (older code ignores them, so it's harmless either way).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const dry = process.argv.includes('--dry');
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = path.resolve(site, '..', 'Assets');
const NEW = 'New Images';
const LT = 'Lift and tights Ultherapy with endymed endymed and laser';

// Text from the client's email.
const TEXT = {
  ultherapy: {
    whatItIs: 'Ultherapy® is a noninvasive treatment using focused ultrasound and ultrasound visualization to deliver heat energy to specific layers of tissue.',
    howItWorks: 'Focused ultrasound energy (heat) reaches the deep support layers (SMAS/platysma) that surgeons tighten to perform a facelift.',
    signature: {
      _type: 'object',
      title: 'The RENU Signature Difference',
      text: "You may be a candidate for Dr. Barrett's proprietary Lift and Tight™, combining Ultherapy® with the RENU Cool Peel Laser for exceptional lift, tightening, and glow!"
    }
  },
  kybella: { blurb: 'Permanent fat loss — dissolves fat under the chin, bra area, love handles and abdomen with 2 sessions of injections.' },
  tightening: { name: 'Body Sculpting & Tightening' },
  sculptra: { blurb: 'A biostimulating filler with natural results, for both face and body.' }
};

// content: the "What it treats" image. add: side-by-side before & afters
// ([file, timeframe?, label?]). remove: fingerprints (sha1 prefixes) of
// entries to drop — e.g. a photo that's now the content image.
const PHOTOS = {
  ultherapy: {
    content: [`${NEW}/Ultherapy/First photo next to the words for ultherapy.JPG`, 'Ultherapy before and after'],
    remove: ['b5df7bdf'], // client: "Delete this one from ultherapy"
    add: [
      [`${NEW}/Ultherapy/Ultherapy lift and tight comb.JPG`, null, 'Lift and Tight™'],
      [`${NEW}/Ultherapy/Ultherapy.JPG`, '3 months', 'Lift and Tight™ chinstrap + neck laser'],
      [`${NEW}/Ultherapy/Ultherpay lift and tight.JPG`, '3 months', 'Lift and Tight™ chinstrap + neck laser'],
      [`${NEW}/Ultherapy/ultherapy b&A.JPG`, '2 weeks', 'Lift and Tight™ full face and neck'],
      [`${LT}/Ultherapy + Endymed.jpg`, '1 month', 'Ultherapy full face + Endymed'],
      ['only ultherapy photos/Ultherapy Abdomen 3 months post.jpg', '3 months', 'Abdomen']
    ]
  },
  coollaser: {
    content: [`${NEW}/RENU Cool Laser/THis should be next to the words for laser.JPG`, 'RENU Cool Peel Laser and Sculptra before and after'],
    remove: ['08797b55'], // same before & after as the new content image
    add: [
      [`${NEW}/RENU Cool Laser/Laser before after 2.JPG`],
      [`${NEW}/RENU Cool Laser/Laser before and after (1).JPG`, null, 'Laser with exosomes'],
      [`${NEW}/RENU Cool Laser/Laser eyes.JPG`, null, 'Eyes — package of 3'],
      ['Laser Only/laserexosome.JPG', '4 months', '1 laser with exosomes'],
      ['Laser Only/laser.jpg'],
      ['Laser Only/laseracne.jpg', null, 'Acne']
    ]
  },
  sculptra: {
    content: ['filler and tox/Sculptra.jpg', 'Sculptra before and after'],
    add: [
      ['sculptra and laser/Sculptraandlasers.png', null, 'With Cool Peel Laser'],
      ['sculptra and laser/sculptraandlaser.jpg', null, 'With Cool Peel Laser'],
      ['filler and tox/ultherapy + sculptra.jpg', null, 'With Ultherapy']
    ]
  },
  radiesse: { content: ['filler and tox/radiessehandwash.jpg', 'Radiesse hand rejuvenation before and after'] },
  kybella: { content: ['dca-pcdc/room marketing (3).jpg', 'Kybella / DCA submental fat reduction, before and after'] },
  botox: {
    content: ['filler and tox/lowfacetox.jpg', 'Botox lower face before and after'],
    add: [
      ['filler and tox/filler and tox.jpg', null, 'With filler'],
      ['filler and tox/Filler + Tox.jpg', null, 'With filler']
    ]
  },
  necklift: {
    content: [`${LT}/w.jpg`, 'Endymed lower face and neck plus laser, before and after'],
    add: [[`${NEW}/Ultherapy/Ultherapy.JPG`, '3 months', 'Lift and Tight™ chinstrap + neck laser']]
  },
  tightening: {
    content: ['only ultherapy photos/Ultherapy Abdomen 3 months post.jpg', 'Ultherapy on the abdomen, before and 3 months after'],
    add: [
      ['only ultherapy photos/k.jpg', '2 months', 'Arms'],
      ['only ultherapy photos/l.jpg', '2 months', 'Arms']
    ]
  },
  microneedling: { content: ['MIsc/microneedlings.jpg', 'Microneedling before and after'] }
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false
});

const uploaded = new Map();
async function upload(rel) {
  const file = path.join(A, rel);
  if (!fs.existsSync(file)) throw new Error(`missing photo: ${file}`);
  if (dry) return `dry:${rel}`;
  if (!uploaded.has(file)) {
    const name = `treatment-${path.basename(rel).replace(/[^a-z0-9.]+/gi, '-').toLowerCase()}`;
    uploaded.set(file, (await client.assets.upload('image', fs.readFileSync(file), { filename: name }))._id);
  }
  return uploaded.get(file);
}
const keyFor = (rel) => 'ba-' + rel.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(-40);
const label = (s) => (dry ? '[dry] ' : '') + s;

for (const slug of new Set([...Object.keys(TEXT), ...Object.keys(PHOTOS)])) {
  for (const id of [`treatment-${slug}`, `drafts.treatment-${slug}`]) {
    const doc = await client.fetch('*[_id == $id][0]{_id, name, beforeAfters[]{_key, "sha": pairedImage.asset->sha1hash}}', { id });
    if (!doc) {
      if (!id.startsWith('drafts.')) throw new Error(`${id} not found`);
      continue;
    }
    const plan = PHOTOS[slug] || {};
    const patch = client.patch(id);
    const set = { ...(TEXT[slug] || {}) };
    if (Object.keys(set).length) console.log(label(`${doc.name}: text → ${Object.keys(set).join(', ')}`));

    if (plan.content) {
      const [rel, alt] = plan.content;
      set.contentImage = { _type: 'image', asset: { _type: 'reference', _ref: await upload(rel) }, alt };
      console.log(label(`${doc.name}: What it treats ← ${rel}`));
    }
    if (Object.keys(set).length) patch.set(set);

    const drop = (doc.beforeAfters || []).filter((e) => (plan.remove || []).some((p) => e.sha?.startsWith(p)));
    for (const e of drop) console.log(label(`${doc.name}: − before & after ${e.sha.slice(0, 8)}`));
    if (drop.length) patch.unset(drop.map((e) => `beforeAfters[_key=="${e._key}"]`));

    const have = new Set((doc.beforeAfters || []).map((e) => e._key));
    const entries = [];
    for (const [rel, timeframe, patient] of plan.add || []) {
      if (have.has(keyFor(rel))) continue;
      entries.push({
        _key: keyFor(rel),
        _type: 'beforeAfterEntry',
        layout: 'sideBySide',
        ...(patient ? { patient } : {}),
        ...(timeframe ? { timeframe } : {}),
        pairedImage: { _type: 'image', asset: { _type: 'reference', _ref: await upload(rel) } }
      });
      console.log(label(`${doc.name}: + before & after ← ${rel}`));
    }
    if (entries.length) patch.setIfMissing({ beforeAfters: [] }).append('beforeAfters', entries);
    if (!dry) await patch.commit();
  }
}
console.log(dry ? 'dry run — nothing changed' : 'done');
