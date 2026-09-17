import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getTeamMembers } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';

export const metadata: Metadata = {
  title: 'About the Practice',
  description: 'Meet Dr. Valerie Barrett, MD and the RENU Medical Aesthetics team.',
  alternates: { canonical: '/about/' }
};

export default async function AboutPage() {
  const teamMembers = await getTeamMembers();
  return (
    <>
      <section className="split-hero">
        <div className="split-hero__content">
          <span className="split-hero__eyebrow">About the Practice</span>
          <h1 className="split-hero__title">Dr. Valerie Barrett, MD</h1>
          <p className="split-hero__lead">25 years of board-certified, non-surgical care — Botox®, Radiesse®, Ultherapy®, Sculptra®, and fractional CO2 laser resurfacing.</p>
        </div>
        <div className="split-hero__media">
          <span className="detail-placeholder-caption">portrait — Dr. Valerie Barrett</span>
        </div>
      </section>

      <section className="section section--bg-surface" id="dr-barrett" aria-labelledby="dr-barrett-heading">
        <div className="container provider">
          <div className="provider__media">
            <Image
              src="/assets/dr-valerie-barrett-lifestyle.jpg"
              alt="Dr. Valerie Barrett, MD, founder of RENU Medical Aesthetics"
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

      <div className="team-group-photo">
        <Image
          src="/assets/renu-team-group.jpg"
          alt="The RENU Medical Aesthetics team at the practice"
          width={1200}
          height={900}
          sizes="(min-width: 1180px) 1180px, 100vw"
        />
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => {
          const photoSrc = imageSrc(member.photo);
          return (
            <article className={`team-card${photoSrc ? '' : ' team-card--placeholder'}`} key={member._id}>
              <div className="team-card__media">
                {photoSrc ? (
                  <Image src={photoSrc} alt={member.name} fill sizes="(min-width: 640px) 33vw, 90vw" />
                ) : (
                  <span className="detail-placeholder-caption" style={{ display: 'block', padding: '16px', color: 'var(--renu-meta-gray)' }}>headshot — team member</span>
                )}
              </div>
              <div className="team-card__body">
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role">{member.role}</p>
                <p className="team-card__bio">{member.bio}</p>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
