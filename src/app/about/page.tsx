import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Practice',
  description: 'Meet Dr. Valerie Barrett, MD and the RENU Medical Aesthetics team.',
  alternates: { canonical: '/about/' }
};

export default function AboutPage() {
  return (
    <>
      <section className="split-hero">
        <div className="split-hero__content">
          <span className="split-hero__eyebrow">About the Practice</span>
          <h1 className="split-hero__title">Dr. Valerie Barrett, MD</h1>
          <p className="split-hero__lead">Board-certified, non-surgical care spanning Botox®, Radiesse®, Ultherapy®, Sculptra® and fractional CO2 laser resurfacing — with 25 years of experience behind every plan.</p>
        </div>
        <div className="split-hero__media">
          <span className="detail-placeholder-caption">portrait — Dr. Valerie Barrett</span>
        </div>
      </section>

      <section className="section section--bg-surface" id="dr-barrett" aria-labelledby="dr-barrett-heading">
        <div className="container provider">
          <div className="provider__media" role="img" aria-label="Placeholder portrait of Dr. Valerie Barrett">
            <span className="provider__media-label">Photography placeholder</span>
          </div>
          <div className="provider__content">
            <span className="eyebrow">25 Years of Experience</span>
            <h2 className="section-title" id="dr-barrett-heading">Meet Dr. Barrett</h2>
            <div className="provider__credentials">
              <span className="provider__credential"><span className="icon-dot" aria-hidden="true"></span>Board-Certified MD</span>
              <span className="provider__credential"><span className="icon-dot" aria-hidden="true"></span>25+ Years of Expertise</span>
              <span className="provider__credential"><span className="icon-dot" aria-hidden="true"></span>Tens of Thousands of Procedures</span>
              <span className="provider__credential"><span className="icon-dot" aria-hidden="true"></span>Founder, RENU Medical Aesthetics</span>
            </div>
            <p className="provider__quote">
              &quot;My goal is never to change how you look — it&apos;s to help you look like the most
              rested, confident version of yourself.&quot;
            </p>
            <p className="section-sub" style={{ marginBottom: 'var(--space-md)' }}>
              For 25 years, Dr. Valerie Barrett has built RENU Medical Aesthetics around a simple
              idea: results should look like you, not like &quot;work.&quot; She&apos;s board-certified, and in
              a field where treatments are increasingly handed off to techs and injectors, she
              performs every injectable, laser, and energy-based treatment herself — at both the
              Stuart and Tequesta locations.
            </p>
            <p className="section-sub" style={{ marginBottom: 'var(--space-md)' }}>
              That hands-on approach is why so many of RENU&apos;s patients have been coming back for
              years, not months — some for six years and longer. Tens of thousands of procedures
              in, Dr. Barrett still starts every relationship the same way: a real conversation
              about what you want, followed by a conservative plan that can always add more later,
              rather than a dramatic one you can&apos;t take back.
            </p>
            <p className="section-sub" style={{ marginBottom: 'var(--space-lg)' }}>
              It&apos;s also why RENU&apos;s before-and-after results hold up over time — patients who
              started with Dr. Barrett years ago still look years younger than their own
              starting point, not just weeks out from a single visit.
            </p>
            <div className="btn-group">
              <Link href="/book/" className="btn btn--primary">Book a Consultation</Link>
              <Link href="/treatments/" className="btn btn--secondary">See Her Treatments</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="split-body">
        <div className="split-body__main">
          <h2 className="detail-h2">Our mission</h2>
          <p className="detail-treats__p">Our mission at RENU Medical Aesthetics is to provide quality, honest and meaningful care to our clients.</p>
          <p className="detail-treats__p" style={{ fontSize: '13.5px', color: 'var(--renu-meta-faint)' }}>— quoted verbatim from renuforyou.com</p>
        </div>
        <div className="split-body__aside">
          <div className="credential-grid">
            <div className="credential-grid__cell"><div className="credential-grid__key">Credential</div><div className="credential-grid__value">Board-certified MD</div></div>
            <div className="credential-grid__cell"><div className="credential-grid__key">Experience</div><div className="credential-grid__value">25 years</div></div>
            <div className="credential-grid__cell"><div className="credential-grid__key">Focus</div><div className="credential-grid__value">Non-surgical only</div></div>
            <div className="credential-grid__cell"><div className="credential-grid__key">Injects</div><div className="credential-grid__value">Every plan herself</div></div>
          </div>
        </div>
      </div>

      <section className="page-header" id="team">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">Our Team</span>
          <h2 className="page-header__title" style={{ fontSize: 'var(--text-xl)' }}>The team behind every visit.</h2>
          <p className="page-header__lead">Small by design. You&apos;ll see the same faces at every visit — supporting Dr. Barrett at both the Stuart and Tequesta clinics.</p>
        </div>
      </section>

      <div className="team-grid">
        {[1, 2, 3].map((i) => (
          <article className="team-card team-card--placeholder" key={i}>
            <div className="team-card__media"><span className="detail-placeholder-caption" style={{ display: 'block', padding: '16px', color: 'var(--renu-meta-gray)' }}>headshot — team member</span></div>
            <div className="team-card__body">
              <h3 className="team-card__name">[Team Member — Name Pending]</h3>
              <p className="team-card__role">[Role / Credential Pending]</p>
              <p className="team-card__bio">Bio pending — name, credentials and headshot to be supplied by the practice before this ships.</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
