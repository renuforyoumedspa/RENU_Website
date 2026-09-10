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
          <p className="simple-hero__lead">Financing allows you to afford the procedures you desire to help improve your appearance and overall health. At RENU Medical Aesthetics we offer our clients financing through CareCredit®, the leading medical funding company.</p>
        </div>
      </section>

      <div className="split-body">
        <div className="split-body__main">
          <Image src="/assets/care-credit-logo.webp" alt="CareCredit" width={300} height={39} style={{ display: 'block', marginBottom: 8 }} />

          <h2 className="detail-h2">About CareCredit®</h2>
          <p className="detail-treats__p">CareCredit® is one of the most popular aesthetic treatment funding options and is accepted at more than 200,000 health providers. Our clients turn to CareCredit® for an advance of funds so they can afford aesthetic treatment. CareCredit® offers competitive rates with short-term financing options, of 6, 12, 18 or 24 months.</p>

          <h2 className="detail-h2" style={{ marginTop: 20 }}>Apply for Financing</h2>
          <p className="detail-treats__p">Applying for financing via CareCredit® has never been easier. CareCredit® offers instant approvals and there is no activation fee or a need to re-apply. Click below to start your application and take the next step toward fulfilling your aesthetic treatment goals.</p>
          <div style={{ marginTop: 4 }}>
            <a href="https://www.carecredit.com/apply/" target="_blank" rel="noopener" className="btn btn--primary">Apply Now with CareCredit®</a>
          </div>

          <p className="detail-treats__p" style={{ marginTop: 28 }}>Board-certified MD Valerie Barrett offers aesthetic financing via CareCredit® to men and women in Jupiter, Port St. Lucie, Stuart, Tequesta, Palm Beach Gardens and surrounding areas of Florida. <Link href="/contact/" style={{ color: 'var(--renu-purple)' }}>Contact us</Link> to schedule your complimentary personal consultation with Dr. Barrett and learn the cost of your aesthetic procedure(s).</p>

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
