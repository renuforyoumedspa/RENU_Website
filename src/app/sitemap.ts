import type { MetadataRoute } from 'next';
import { getAllTreatments, getAllBlogPosts } from '@/sanity/lib/queries';
import { SITE_URL } from '@/lib/seo';

// Every URL here ends in "/" — the form the site serves (trailingSlash in
// next.config.ts) and the form each page's canonical tag names. A sitemap
// URL that redirects is treated by Google as a mistake.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/treatments/', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about/', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact/', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/gallery/', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/find-my-treatment/', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/financing/', priority: 0.5, changeFrequency: 'monthly' }
];
// /privacy/ deliberately omitted — still draft legal text, marked noindex.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treatments, posts] = await Promise.all([getAllTreatments(), getAllBlogPosts()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority
  }));

  const treatmentEntries: MetadataRoute.Sitemap = treatments.map((t) => ({
    url: `${SITE_URL}/treatments/${t.slug}/`,
    lastModified: t._updatedAt ? new Date(t._updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: new Date(p.pubDate),
    changeFrequency: 'yearly',
    priority: 0.5
  }));

  // The blog index only goes in once there's something on it.
  const blogIndexEntry: MetadataRoute.Sitemap = posts.length ? [{ url: `${SITE_URL}/blog/`, changeFrequency: 'weekly', priority: 0.6 }] : [];

  return [...staticEntries, ...treatmentEntries, ...blogIndexEntry, ...blogEntries];
}
