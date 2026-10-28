import Link from '@/components/Link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAboutPageMedia } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';
import BookingLink from '@/components/BookingLink';

export const metadata: Metadata = {
  title: 'Dr. Valerie Barrett, MD | About the Practice',
  description: 'Board-certified physician Dr. Valerie Barrett founded RENU Medical Aesthetics in 2002 and personally performs every injectable and laser treatment at the Stuart and Tequesta, FL clinics.',
  alternates: { canonical: '/about/' }
};

export default async function AboutPage() {
  // Portrait and team photos are managed in Sanity: "Dr. Barrett & Team".
  // The Dr. Barrett photos on this page are fixed files; the Sanity
  // portrait is used on the homepage.
  const { teamPhotos } = await getAboutPageMedia();
  return (
    <>
      <section className="split-hero">
        <div className="split-hero__content">
          <span className="split-hero__eyebrow">About the Practice</span>
          <h1 className="split-hero__title">Dr. Valerie Barrett, MD</h1>
          <p className="split-hero__lead">25 years of board-certified, non-surgical care — Botox®, Radiesse®, Ultherapy®, Sculptra®, and fractional CO2 laser resurfacing.</p>
        </div>
        <div className="split-hero__media">
          <Image
            src="/assets/dr-barrett-about-header.jpg"
            alt="Dr. Valerie Barrett holding a skincare product at RENU Medical Aesthetics"
            fill
            priority
            sizes="(min-width: 760px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className="section section--bg-surface" id="dr-barrett" aria-labelledby="dr-barrett-heading">
        <div className="container provider">
          <div className="provider__media">
            {/* Fixed photo for this page (the homepage uses the Sanity portrait). */}
            <Image
              src="/assets/dr-barrett-about-portrait.jpg"
              alt="Dr. Valerie Barrett, MD, beside an Ultherapy® display at RENU Medical Aesthetics"
              fill
              sizes="(min-width: 960px) 40vw, 90vw"
            />
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
              For 25 years, Dr. Barrett has built RENU around one idea: results should
              look like you, not like &quot;work.&quot; Board-certified, she performs every
              injectable, laser, and energy-based treatment herself — at both Stuart
              and Tequesta.
            </p>
            <p className="section-sub" style={{ marginBottom: 'var(--space-lg)' }}>
              That&apos;s why patients return for years, not months — and why RENU&apos;s
              before-and-after results hold up over time. Some patients still look
              younger than their starting point, years later.
            </p>
            <div className="btn-group">
              <BookingLink className="btn btn--primary">Book a Consultation</BookingLink>
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

      {/* General team photos — no per-person name cards (client request). */}
      {teamPhotos.length > 0 && (
        <div className="team-photos">
          {teamPhotos.map((photo, i) => {
            const src = imageSrc(photo.image);
            return src ? (
              <div className="team-photos__item" key={i}>
                <Image src={src} alt={photo.alt || 'The RENU Medical Aesthetics team'} fill sizes="(min-width: 980px) 25vw, 50vw" />
              </div>
            ) : null;
          })}
        </div>
      )}
    </>
  );
}
