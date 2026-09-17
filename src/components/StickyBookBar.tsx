'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
      <Link href="/book/?location=Stuart" className="btn btn--pill-white">Book Stuart</Link>
      <Link href="/book/?location=Tequesta" className="btn btn--pill-ghost-dark">Book Tequesta</Link>
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
