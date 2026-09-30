'use client';
import StickyBookBar from './StickyBookBar';
// Used to hide the bar on the on-site /book page. Booking now happens on
// Decoda (external), so there's no page left to hide it on — kept as the
// single place to add a route exclusion if one is ever needed again.
export default function ConditionalStickyBar() {
  return <StickyBookBar />;
}
