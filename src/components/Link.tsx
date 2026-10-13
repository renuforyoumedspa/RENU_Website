import NextLink from 'next/link';
import type { ComponentProps } from 'react';

// Site-wide link: same as next/link, but prefetching is OFF by default.
// Next.js normally preloads every linked page that scrolls into view —
// on the homepage that was ~28 hidden server requests per visit, each
// billed by Netlify as a web request plus server compute. Pages are
// static and small, so navigation stays fast without it. Pass
// prefetch={true} on a specific link to opt back in.
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
