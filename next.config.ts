import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';

// SUPERSEDES the previous version, which imported getAllLegacyRedirects()
// directly from src/sanity/lib/queries. That works fine in the normal app
// bundle, but next.config.ts is loaded through a separate, more fragile
// pathway — and on this machine, a Windows Application Control policy
// blocks Next's native SWC binary, which broke that pathway's module
// resolution entirely (it couldn't resolve the relative import at all,
// unrelated to anything in our own code). Config files should generally
// stay free of importing app source for exactly this kind of reason.
//
// Redirects come from a plain static JSON file instead — no bundling, no
// TypeScript resolution, just a file read.
//
// legacy-redirects.json maps ~350 URLs from the old WordPress site at
// renuforyou.com to their closest page here, so the rankings and backlinks
// those URLs earned carry over (301/308 passes them on; a 404 drops them).
// Built Sept 2026 from: the Wayback Machine's full URL history for the
// domain, the links on the old homepage's last archived version (Oct 2025),
// and the URLs Google was showing in search results at launch. Services the
// practice no longer offers point at /treatments/. To add one later, add a
// { "source": "/old-path", "destination": "/new-path/" } entry — sources
// are written without a trailing slash; both forms match.
function readLegacyRedirects(): { source: string; destination: string }[] {
  try {
    const file = path.join(process.cwd(), 'legacy-redirects.json');
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // Overridable so a production build can be checked locally (e.g.
  // NEXT_DIST_DIR=.next-check) without clobbering a running dev server's .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // Every page is served at its trailing-slash URL (/treatments/botox/),
  // matching the site's internal links, canonical tags and sitemap, and the
  // old WordPress URL style. Without this, pages were served without the
  // slash while canonicals pointed at the slash form — i.e. every canonical
  // pointed at a redirect, which tells Google the canonical is wrong.
  trailingSlash: true,

  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }]
  },

  async redirects() {
    return [
      // Booking moved to Decoda Health — old /book links (bookmarks, ads,
      // printed QR codes) land on the scheduler instead of a 404. Same URL
      // as BOOKING_URL in src/data/site-data.ts; hardcoded because config
      // files shouldn't import app source (see note above). Temporary (307)
      // so it's easy to change if the booking provider ever changes.
      { source: '/book', destination: 'https://app.decodahealth.com/renu/self-schedule', permanent: false },
      // Shop removed from the public site (client request). Product data is
      // still in Sanity; old /shop links land on the homepage, not a 404.
      { source: '/shop', destination: '/', permanent: false },
      // `{/}?` matches the old URL with or without its trailing slash, so each
      // lands on its new page in a single hop. .html paths never had one.
      ...readLegacyRedirects().map(({ source, destination }) => ({
        source: /\.[a-z]+$/i.test(source) ? source : `${source}{/}?`,
        destination,
        permanent: true
      }))
    ];
  }
};

export default nextConfig;
