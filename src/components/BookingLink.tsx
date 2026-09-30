import type { ReactNode } from 'react';
import { BOOKING_URL } from '@/data/site-data';

// Every booking call-to-action goes to Decoda's self-scheduling page in a
// new tab, so the patient keeps RENU's site open behind it.
export default function BookingLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a href={BOOKING_URL} className={className} target="_blank" rel="noopener">
      {children}
    </a>
  );
}
