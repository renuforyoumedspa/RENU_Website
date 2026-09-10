'use client';

import { usePathname } from 'next/navigation';
import StickyBookBar from './StickyBookBar';

// Hidden only on the booking page itself — you're already booking, the
// CTA would be redundant (matches the original design spec).
export default function ConditionalStickyBar() {
  const pathname = usePathname();
  if (pathname.startsWith('/book')) return null;
  return <StickyBookBar />;
}
