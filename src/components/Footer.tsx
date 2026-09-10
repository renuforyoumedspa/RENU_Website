import Link from 'next/link';
import Image from 'next/image';
import { getAllTreatments } from '@/sanity/lib/queries';

const FOOTER_COLS = [
  {
    title: 'Treatments',
    links: [
      { label: 'All Treatments', href: '/treatments/' },
      { label: 'Find My Treatment', href: '/find-my-treatment/' },
      { label: 'Face', href: '/treatments/?area=Face' },
      { label: 'Body', href: '/treatments/?area=Body' },
      { label: 'Skin', href: '/treatments/?area=Skin' }
    ]
  },
  {
    title: 'Practice',
    links: [
      { label: 'About the Practice', href: '/about/' },
      { label: 'Meet the Team', href: '/about/#team' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Financing', href: '/financing/' },
      { label: 'Contact Us', href: '/contact/' },
      { label: 'Privacy Policy', href: '/privacy/' }
    ]
  }
];

export default async function Footer() {
  const treatmentCount = (await getAllTreatments()).length;

  return (
    <footer className="chrome-footer">
      <div className="chrome-footer__grid">
        <div className="chrome-footer__brand">
          <Image src="/assets/renu-logo.png" alt="RENU Medical Aesthetics" width={184} height={46} className="chrome-footer__logo" />
          <p className="chrome-footer__tagline">Non-surgical medical aesthetics in Stuart &amp; Tequesta, led by Dr. Valerie Barrett, MD.</p>
          <a href="tel:5614066123" className="chrome-footer__phone">561-406-6123</a>
          <a href="mailto:info@RENUforyou.com" className="chrome-footer__email">info@RENUforyou.com</a>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <div className="chrome-footer__heading">{col.title}</div>
            <div className="chrome-footer__links">
              {col.links.map((l) => <Link key={l.label} href={l.href}>{l.label}</Link>)}
            </div>
          </div>
        ))}

        <div>
          <div className="chrome-footer__heading">Clinics</div>
          <div className="chrome-footer__clinics">
            <div>Stuart<br />845 SE Osceola Street<br />Stuart, FL 34994</div>
            <div>Tequesta<br />304 Tequesta Drive, Suite 300<br />Tequesta, FL 33469</div>
          </div>
        </div>
      </div>

      <div className="chrome-footer__bottom">
        <span>© 2026 RENU Medical Aesthetics</span>
        <span>{treatmentCount} treatments, one template — powered by Next.js + Sanity</span>
      </div>
    </footer>
  );
}
