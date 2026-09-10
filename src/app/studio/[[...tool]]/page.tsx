/**
 * Embedded Sanity Studio, served at /studio (and every path beneath it,
 * via the catch-all route). Unlike the earlier Decap CMS setup, no custom
 * OAuth backend is needed here — Sanity handles authentication itself
 * (Google/GitHub/email login against your Sanity account), so this route
 * is genuinely just "mount the Studio UI."
 */
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
