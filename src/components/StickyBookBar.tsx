import Link from 'next/link';

export default function StickyBookBar() {
  return (
    <div className="chrome-sticky-bar">
      <span className="chrome-sticky-bar__text">Consultations at both clinics this week.</span>
      <Link href="/book/?location=Stuart" className="btn btn--pill-white">Book Stuart</Link>
      <Link href="/book/?location=Tequesta" className="btn btn--pill-ghost-dark">Book Tequesta</Link>
    </div>
  );
}
