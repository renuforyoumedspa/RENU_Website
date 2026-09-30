'use client';

import { useEffect, useState } from 'react';
import BookingLink from '@/components/BookingLink';

const DISMISS_KEY = 'renu-sticky-bar-dismissed';

export default function StickyBookBar() {
  const [dismissed, setDismissed] = useState(false);

  // Read from sessionStorage after mount (not during the initial render)
  // so server and client agree on the first paint — dismissing then just
  // means it won't reappear on other pages for the rest of this browser
  // tab's session, not forever.
  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === 'true') setDismissed(true);
  }, []);

  if (dismissed) return null;

  return (
    <div className="chrome-sticky-bar">
      <span className="chrome-sticky-bar__text">Consultations at both clinics this week.</span>
      <BookingLink className="btn btn--pill-white">Book Online</BookingLink>
      <a href="tel:5614066123" className="btn btn--pill-ghost-dark">Call 561-406-6123</a>
      <button
        type="button"
        className="chrome-sticky-bar__dismiss"
        aria-label="Dismiss consultation banner"
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, 'true');
          setDismissed(true);
        }}
      >
        ×
      </button>
    </div>
  );
}
