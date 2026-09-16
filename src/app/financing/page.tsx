import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financing',
  description: 'Aesthetic treatment financing through CareCredit® at RENU Medical Aesthetics.',
  alternates: { canonical: '/financing/' }
};

export default function FinancingPage() {
  return (
    <>
      <section className="simple-hero">
        <div className="simple-hero__inner">
          <span className="simple-hero__eyebrow">Financing</span>
          <h1 className="simple-hero__title">Aesthetic Treatment Financing</h1>
          <p className="simple-hero__lead">Afford the treatments you want. RENU offers financing through CareCredit®, the leading medical funding company.</p>
        </div>
      </section>

      <div className="split-body">
        <div className="split-body__main">
          <Image src="/assets/care-credit-logo.webp" alt="CareCredit" width={300} height={39} style={{ display: 'block', marginBottom: 8 }} />

          <h2 className="detail-h2">About CareCredit®</h2>
          <p className="detail-treats__p">Accepted at more than 200,000 health providers, with competitive rates and short-term financing options of 6, 12, 18, or 24 months.</p>

          <h2 className="detail-h2" style={{ marginTop: 20 }}>Apply for Financing</h2>
          <p className="detail-treats__p">Applying has never been easier — instant approvals, no activation fee, no need to re-apply. Start below.</p>
          <div style={{ marginTop: 4 }}>
            <a href="https://www.carecredit.com/apply/" target="_blank" rel="noopener" className="btn btn--primary">Apply Now with CareCredit®</a>
          </div>

          <p className="detail-treats__p" style={{ marginTop: 28 }}>Dr. Valerie Barrett offers CareCredit® financing to patients in Jupiter, Port St. Lucie, Stuart, Tequesta, Palm Beach Gardens, and nearby Florida areas. <Link href="/contact/" style={{ color: 'var(--renu-purple)' }}>Contact us</Link> for a complimentary consultation and cost estimate.</p>

          <p className="financing-disclaimer">&quot;Apply Now&quot; currently links to CareCredit&apos;s general application — confirm and swap in RENU&apos;s own practice-specific CareCredit application link before this ships, so applications are credited to the correct provider.</p>
        </div>

        <div className="split-body__aside">
          <div className="financing-panel">
            <h3 className="financing-panel__title">Financing terms</h3>
            <div className="financing-plan-row"><span className="financing-plan-row__term">6 months</span></div>
            <div className="financing-plan-row"><span className="financing-plan-row__term">12 months</span></div>
            <div className="financing-plan-row"><span className="financing-plan-row__term">18 months</span></div>
            <div className="financing-plan-row" style={{ borderBottom: 'none' }}><span className="financing-plan-row__term">24 months</span></div>
            <a href="https://www.carecredit.com/apply/" target="_blank" rel="noopener" className="btn btn--primary btn--block" style={{ marginTop: 20 }}>Apply Now</a>
          </div>
        </div>
      </div>
    </>
  );
}
