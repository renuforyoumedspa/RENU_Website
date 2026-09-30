// One-time content migration: copies the site's built-in content
// (src/sanity/lib/mock-data.ts) into the Sanity dataset so the site shows
// the same thing once NEXT_PUBLIC_SANITY_PROJECT_ID is set.
//
// Run from renu-nextjs/:
//   npm run seed                 # only creates documents that don't exist yet
//   npm run seed -- --overwrite  # replaces existing documents (discards Studio edits!)
//   npm run seed -- --only=galleryTile,teamMember   # limit to these document types
//   npm run seed -- --skip-before-after             # leave treatments' before/after entries empty
//
// Needs SANITY_API_WRITE_TOKEN in .env.local (sanity.io/manage -> API ->
// Tokens -> Editor). Safe to re-run: without --overwrite, anything an
// editor already changed in the Studio is left alone.

import { createClient } from '@sanity/client';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import {
  MOCK_TREATMENTS, MOCK_BLOG_POSTS, MOCK_PRODUCTS, MOCK_TEAM_MEMBERS, MOCK_GALLERY_TILES, MOCK_HOMEPAGE_FEATURED_BEFORE_AFTERS
} from '../src/sanity/lib/mock-data.ts';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_SEED_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const overwrite = process.argv.includes('--overwrite');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',')) : null;
const wanted = (type: string) => !only || only.has(type);
const skipBeforeAfter = process.argv.includes('--skip-before-after');

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_SEED_PROJECT_ID) and/or SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-01-01', useCdn: false });

const key = (i: number) => `k${i}`;
const slug = (current: string) => ({ _type: 'slug', current });
const treatmentId = (s: string) => `treatment-${s}`;

// Local /assets/... paths -> uploaded Sanity image assets (cached so a
// file used twice is uploaded once).
const uploaded = new Map<string, string>();
async function imageFrom(publicPath: unknown) {
  if (typeof publicPath !== 'string') return undefined;
  let assetId = uploaded.get(publicPath);
  if (!assetId) {
    const file = path.join('public', publicPath);
    const asset = await client.assets.upload('image', createReadStream(file), { filename: path.basename(file) });
    assetId = asset._id;
    uploaded.set(publicPath, assetId);
    console.log(`  uploaded ${publicPath}`);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
}

const withKeys = <T extends object>(arr: T[] | undefined, type?: string) =>
  arr?.map((item, i) => ({ ...(type ? { _type: type } : {}), _key: key(i), ...item }));

async function buildDocs() {
  const docs: Record<string, unknown>[] = [];

  if (wanted("treatment")) for (const t of MOCK_TREATMENTS) {
    docs.push({
      _id: treatmentId(t.slug),
      _type: 'treatment',
      name: t.name,
      slug: slug(t.slug),
      legacyUrls: t.legacyUrls,
      areas: t.areas,
      concerns: t.concerns,
      techs: t.techs,
      cta: t.cta,
      blurb: t.blurb,
      image: await imageFrom(t.image),
      facts: t.facts,
      beforeAfters: skipBeforeAfter ? undefined : withKeys(t.beforeAfters, 'beforeAfterEntry'),
      visitSteps: withKeys(t.visitSteps, 'step'),
      faqs: withKeys(t.faqs, 'faq')
    });
  }

  if (wanted("blogPost")) for (const p of MOCK_BLOG_POSTS) {
    docs.push({
      _id: `blogPost-${p.slug}`,
      _type: 'blogPost',
      title: p.title,
      slug: slug(p.slug),
      description: p.description,
      pubDate: p.pubDate,
      draft: p.draft
    });
  }

  if (wanted("product")) for (const p of MOCK_PRODUCTS) {
    docs.push({
      _id: `product-${p.slug}`,
      _type: 'product',
      brand: p.brand,
      name: p.name,
      slug: p.slug ? slug(p.slug) : undefined,
      // mock-data has one HTML entity left over from JSX; plain text here.
      note: p.note?.replace(/&apos;/g, "'"),
      price: p.price,
      buyUrl: p.buyUrl
    });
  }

  if (wanted("teamMember")) for (const m of MOCK_TEAM_MEMBERS) {
    docs.push({ _id: m._id, _type: 'teamMember', name: m.name, role: m.role, bio: m.bio, order: m.order });
  }

  if (wanted("galleryTile")) for (const g of MOCK_GALLERY_TILES) {
    docs.push(
      g.kind === 'photo'
        ? { _id: g._id, _type: 'galleryTile', kind: 'photo', order: g.order, image: await imageFrom(g.image), alt: g.alt, shape: g.shape }
        : { _id: g._id, _type: 'galleryTile', kind: 'review', order: g.order, quote: g.quote, reviewerName: g.reviewerName, source: g.source }
    );
  }

  if (wanted("homepage")) docs.push({
    _id: 'homepage',
    _type: 'homepage',
    featuredBeforeAfters: MOCK_HOMEPAGE_FEATURED_BEFORE_AFTERS.map((f, i) => ({
      _key: key(i),
      _type: 'featuredBeforeAfter',
      treatment: { _type: 'reference', _ref: treatmentId(f.treatmentSlug) },
      label: f.label,
      entry: { _type: 'beforeAfterEntry', ...f.entry }
    }))
  });

  return docs;
}

console.log(`Seeding ${projectId}/${dataset} (${overwrite ? 'overwrite' : 'create missing only'}${only ? `, only: ${[...only].join(', ')}` : ''})`);
const docs = await buildDocs();
const tx = client.transaction();
for (const doc of docs) {
  // Drop undefined fields so Sanity doesn't store empty keys.
  const clean = JSON.parse(JSON.stringify(doc)) as { _id: string; _type: string };
  if (overwrite) tx.createOrReplace(clean);
  else tx.createIfNotExists(clean);
}
await tx.commit();

const counts = docs.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d._type as string]: (acc[d._type as string] || 0) + 1 }), {});
console.log('Done:', counts);
