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
// Redirects now come from a plain static JSON file instead — no bundling,
// no TypeScript resolution, just a file read. legacy-redirects.json is
// empty for now (no real Sanity project/legacy URL data exists yet); once
// that data exists, regenerate this file with a script that fetches from
// Sanity and writes plain JSON, then re-import here unchanged.
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
      ...readLegacyRedirects().map(({ source, destination }) => ({ source, destination, permanent: true }))
    ];
  }
};

export default nextConfig;
