import type { MetadataRoute } from 'next';
import { getAllTreatments, getAllBlogPosts } from '@/sanity/lib/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://renumedspa.netlify.app';

const STATIC_ROUTES = ['', 'treatments', 'book', 'find-my-treatment', 'shop', 'about', 'financing', 'contact'];
// privacy/ deliberately omitted — still draft/unreviewed legal text (see
// that page's `robots: { index: false }`), no reason to submit it to
// search engines while it's not real yet.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treatments, posts] = await Promise.all([getAllTreatments(), getAllBlogPosts()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}${route ? '/' : ''}`,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7
  }));

  const treatmentEntries: MetadataRoute.Sitemap = treatments.map((t) => ({
    url: `${SITE_URL}/treatments/${t.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: new Date(p.pubDate),
    changeFrequency: 'yearly',
    priority: 0.5
  }));

  const blogIndexEntry: MetadataRoute.Sitemap = posts.length ? [{ url: `${SITE_URL}/blog/`, changeFrequency: 'weekly', priority: 0.6 }] : [];

  return [...staticEntries, ...blogIndexEntry, ...treatmentEntries, ...blogEntries];
}
