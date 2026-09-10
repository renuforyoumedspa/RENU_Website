import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://renumedspa.netlify.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio/', '/privacy/'] }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
