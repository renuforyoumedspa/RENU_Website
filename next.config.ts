import type { NextConfig } from 'next';
import { getAllLegacyRedirects } from './src/sanity/lib/queries';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }]
  },

  // Pulls every treatment's `legacyUrls` (set in Sanity Studio) into a real
  // redirect map at build time — this is the actual "match our URLs so we
  // don't lose the existing site's SEO" mechanism. Add old
  // renuforyou.com paths (e.g. /botox-jupiter-stuart) to a treatment's
  // "Legacy URLs" field in Studio; they redirect here on the next build.
  //
  // NOTE: this list is not yet populated with real data — it depends on
  // enumerating the actual live URLs (Google Search Console's indexed-pages
  // export is the authoritative source, more reliable than crawling the
  // nav) and entering them per treatment in Studio. Until that's done,
  // this returns an empty array and is a no-op.
  async redirects() {
    try {
      const legacyRedirects = await getAllLegacyRedirects();
      return legacyRedirects.map(({ source, destination }) => ({ source, destination, permanent: true }));
    } catch {
      // Sanity project isn't connected yet (no real projectId/dataset) —
      // don't fail the whole build over it.
      return [];
    }
  }
};

export default nextConfig;
