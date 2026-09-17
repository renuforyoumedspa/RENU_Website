import { client } from './client';
import { isSanityConfigured } from '../env';
import { MOCK_TREATMENTS, MOCK_BLOG_POSTS, MOCK_PRODUCTS, MOCK_TEAM_MEMBERS, MOCK_GALLERY_TILES, MOCK_HOMEPAGE_FEATURED_BEFORE_AFTERS } from './mock-data';

// Shared by treatment.beforeAfters and the homepage's featured picks — see
// beforeAfterEntry.ts in renu-studio for why `layout` exists: some of
// RENU's real photography is a single side-by-side composite, some is two
// separate photos, and editors pick which per entry rather than the site
// forcing one shape.
export interface BeforeAfterEntry {
  patient?: string;
  timeframe?: string;
  layout?: 'separate' | 'sideBySide';
  beforeImage?: unknown;
  afterImage?: unknown;
  pairedImage?: unknown;
}

export interface Treatment {
  _id: string;
  name: string;
  slug: string;
  legacyUrls?: string[];
  area: 'Face' | 'Body' | 'Skin';
  concern: string;
  tech: 'Injectable' | 'Laser' | 'Energy' | 'Thread' | 'Topical';
  cta: string;
  blurb: string;
  image?: unknown;
  contentImage?: unknown;
  facts?: { visitLength?: string; downtime?: string; resultsShow?: string; lasts?: string };
  beforeAfters?: BeforeAfterEntry[];
  visitSteps?: { text: string }[];
  faqs?: { q: string; a: string }[];
  body?: unknown;
}

export interface TeamMember {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: unknown;
  order: number;
}

export type GalleryTile =
  | { _id: string; kind: 'photo'; order: number; image: unknown; alt: string; shape: 'wide' | 'tall' | 'square' }
  | { _id: string; kind: 'review'; order: number; quote: string; reviewerName: string; source?: string };

export interface FeaturedBeforeAfter {
  label: string;
  treatmentSlug: string;
  entry: BeforeAfterEntry;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  pubDate: string;
  heroImage?: unknown;
  draft: boolean;
  body?: unknown;
}

export interface Product {
  _id: string;
  brand: string;
  name: string;
  slug?: string;
  note?: string;
  price?: string;
  image?: unknown;
  buyUrl?: string;
}

// Flattening `slug.current` -> `slug` in the projection keeps every
// consuming component from having to know Sanity's slug-is-an-object
// shape — same flat shape the old treatments-data.js array had.
const TREATMENT_PROJECTION = `{
  _id, name, "slug": slug.current, legacyUrls, area, concern, tech, cta, blurb, image, contentImage,
  facts, beforeAfters, visitSteps, faqs, body
}`;

// Every function below checks isSanityConfigured first and serves
// src/sanity/lib/mock-data.ts instead of calling out to a Sanity project
// that doesn't exist yet — lets `npm run dev` / `npm run build` work with
// real-looking content before Sanity is actually connected. Once a real
// NEXT_PUBLIC_SANITY_PROJECT_ID is set (.env.local), this branch is never
// taken again; nothing needs to be undone by hand.

export async function getAllTreatments(): Promise<Treatment[]> {
  if (!isSanityConfigured) return [...MOCK_TREATMENTS].sort((a, b) => a.name.localeCompare(b.name));
  return client.fetch(`*[_type == "treatment"] | order(name asc) ${TREATMENT_PROJECTION}`);
}

export async function getTreatmentBySlug(slug: string): Promise<Treatment | null> {
  if (!isSanityConfigured) return MOCK_TREATMENTS.find((t) => t.slug === slug) || null;
  return client.fetch(`*[_type == "treatment" && slug.current == $slug][0] ${TREATMENT_PROJECTION}`, { slug });
}

export async function getRelatedTreatments(treatment: Treatment, limit = 3): Promise<Treatment[]> {
  if (!isSanityConfigured) {
    return MOCK_TREATMENTS.filter((t) => t._id !== treatment._id && t.area === treatment.area)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, limit);
  }
  return client.fetch(
    `*[_type == "treatment" && area == $area && _id != $id] | order(name asc) [0...$limit] ${TREATMENT_PROJECTION}`,
    { area: treatment.area, id: treatment._id, limit }
  );
}

export async function getQuizRecommendations(concern: string, noDowntime: boolean, limit = 3): Promise<Treatment[]> {
  const all = isSanityConfigured
    ? await client.fetch<Treatment[]>(`*[_type == "treatment" && concern == $concern] ${TREATMENT_PROJECTION}`, { concern })
    : MOCK_TREATMENTS.filter((t) => t.concern === concern);
  const ordered = noDowntime ? [...all.filter((t) => t.tech !== 'Laser'), ...all.filter((t) => t.tech === 'Laser')] : all;
  return ordered.slice(0, limit);
}

const BLOG_PROJECTION = `{ _id, title, "slug": slug.current, description, pubDate, heroImage, draft, body }`;

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured) {
    return MOCK_BLOG_POSTS.filter((p) => !p.draft).sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  }
  return client.fetch(`*[_type == "blogPost" && draft != true] | order(pubDate desc) ${BLOG_PROJECTION}`);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured) return MOCK_BLOG_POSTS.find((p) => p.slug === slug && !p.draft) || null;
  return client.fetch(`*[_type == "blogPost" && slug.current == $slug && draft != true][0] ${BLOG_PROJECTION}`, { slug });
}

const PRODUCT_PROJECTION = `{ _id, brand, name, "slug": slug.current, note, price, image, buyUrl }`;

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) {
    return [...MOCK_PRODUCTS].sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
  }
  return client.fetch(`*[_type == "product"] | order(brand asc, name asc) ${PRODUCT_PROJECTION}`);
}

// Every legacy URL, across every treatment, flattened for next.config's
// redirects() — see that file for how this gets consumed at build time.
export async function getAllLegacyRedirects(): Promise<{ source: string; destination: string }[]> {
  if (!isSanityConfigured) {
    return MOCK_TREATMENTS.flatMap((t) => (t.legacyUrls || []).map((source) => ({ source, destination: `/treatments/${t.slug}` })));
  }
  const treatments = await client.fetch<{ slug: string; legacyUrls?: string[] }[]>(
    `*[_type == "treatment" && count(legacyUrls) > 0]{ "slug": slug.current, legacyUrls }`
  );
  return treatments.flatMap((t) => (t.legacyUrls || []).map((source) => ({ source, destination: `/treatments/${t.slug}` })));
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSanityConfigured) return [...MOCK_TEAM_MEMBERS].sort((a, b) => a.order - b.order);
  return client.fetch(`*[_type == "teamMember"] | order(order asc) { _id, name, role, bio, photo, order }`);
}

export async function getGalleryTiles(): Promise<GalleryTile[]> {
  if (!isSanityConfigured) return [...MOCK_GALLERY_TILES].sort((a, b) => a.order - b.order);
  return client.fetch(
    `*[_type == "galleryTile"] | order(order asc) { _id, kind, order, image, alt, shape, quote, reviewerName, source }`
  );
}

// Homepage's curated Before & After picks — a singleton document
// (_id == "homepage") referencing whichever treatments the practice wants
// featured, each paired with its own beforeAfterEntry (independent of that
// treatment's own default beforeAfters array).
export async function getHomepageFeaturedBeforeAfters(): Promise<FeaturedBeforeAfter[]> {
  if (!isSanityConfigured) return MOCK_HOMEPAGE_FEATURED_BEFORE_AFTERS;
  const doc = await client.fetch<{ featuredBeforeAfters?: { label?: string; treatment?: { name: string; slug: string }; entry: BeforeAfterEntry }[] }>(
    `*[_type == "homepage"][0]{
      featuredBeforeAfters[]{ label, "treatment": treatment->{ name, "slug": slug.current }, entry }
    }`
  );
  return (doc?.featuredBeforeAfters || []).map((f) => ({
    label: f.label || f.treatment?.name || '',
    treatmentSlug: f.treatment?.slug || '',
    entry: f.entry
  }));
}
