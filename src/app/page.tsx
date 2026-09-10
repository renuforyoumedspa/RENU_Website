import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllTreatments, getTreatmentBySlug } from '@/sanity/lib/queries';
import { getCombinedReviews } from '@/data/site-data';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

const FAVORITE_IDS = ['botox', 'renulift', 'ultherapy', 'sculptra', 'resurfacing', 'lips'];
const FAVORITE_CTA_LABELS: Record<string, string> = {
  botox: 'Erase Fine Lines',
  renulift: 'Get Your RENUlift',
  ultherapy: 'Lift & Tighten Naturally',
  sculptra: 'Restore Facial Volume',
  resurfacing: 'Renew Your Glow',
  lips: 'Get Luscious Lips'
};

export default async function HomePage() {
  const allTreatments = await getAllTreatments();
  const reviews = getCombinedReviews();
  const favorites = (await Promise.all(FAVORITE_IDS.map((slug) => getTreatmentBySlug(slug)))).filter((t) => t !== null);

  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero__video-bg">
          <video autoPlay muted loop playsInline aria-hidden="true">
            <source src="/assets/renu-hero.mp4" type="video/mp4" />
          </video>
          <div className="hero__scrim"></div>
        </div>

        <div className="hero__content">
          <span className="hero__eyebrow"><span className="dot" aria-hidden="true"></span>Stuart &amp; Tequesta, Florida</span>
          <h1 className="hero__title">Look like you,<br /><em>only rested.</em></h1>
          <p className="hero__subhead">
            Board-certified, non-surgical aesthetics from Dr. Valerie Barrett — 25 years
            and tens of thousands of procedures behind every treatment plan, tailored to
            your face, your goals, your timeline.
          </p>
          <div className="hero__ctas btn-group">
            <Link href="/book/" className="btn btn--on-band">Book a Consultation</Link>
            <Link href="/treatments/" className="btn btn--ghost-on-band">Explore All {allTreatments.length} Treatments</Link>
          </div>
          <p className="hero__trustline"><strong>{reviews.rating}</strong>★&nbsp;average from {reviews.count} verified patients</p>
        </div>
      </section>

      <section className="stat-bar" aria-label="RENU by the numbers">
        <div className="container">
          <div className="stat"><span className="stat__number">25+</span><span className="stat__label">Years of Expertise</span></div>
          <div className="stat"><span className="stat__number">10,000+</span><span className="stat__label">Procedures Performed</span></div>
          <div className="stat"><span className="stat__number">2</span><span className="stat__label">South Florida Locations</span></div>
          <div className="stat"><span className="stat__number">{reviews.rating}★</span><span className="stat__label">{reviews.count}+ Five-Star Reviews</span></div>
        </div>
      </section>

      <section className="section section--bg-surface" id="provider" aria-labelledby="provider-heading">
        <div className="container provider">
          <div className="provider__media" role="img" aria-label="Placeholder portrait of Dr. Valerie Barrett">
            <span className="provider__media-label">Photography placeholder</span>
          </div>
          <div className="provider__content">
            <span className="eyebrow">Meet Your Provider</span>
            <h2 className="section-title" id="provider-heading">Dr. Valerie Barrett, MD</h2>
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
            <p className="section-sub" style={{ marginBottom: 'var(--space-lg)' }}>
              25 years of hands-on experience and tens of thousands of procedures
              performed across her Stuart and Tequesta practices — Dr. Barrett
              builds every treatment plan around natural-looking, personalized results,
              not a one-size-fits-all menu.
            </p>
            <div className="btn-group">
              <Link href="/book/" className="btn btn--primary">Book a Consultation</Link>
              <Link href="/about/#dr-barrett" className="btn btn--secondary">Meet Dr. Barrett</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--bg-alt" id="favorites" aria-labelledby="favorites-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Patient Favorites</span>
            <h2 className="section-title" id="favorites-heading">The treatments our patients ask for most</h2>
            <p className="section-sub">Six of RENU&apos;s most-requested treatments — each with its own goal, not a one-size-fits-all &quot;book now.&quot;</p>
            <Link href="/treatments/" className="favorites-view-all">View all treatments →</Link>
          </div>

          <div className="favorites-grid">
            {favorites.map((t) => (
              <article className="favorite-card" key={t._id}>
                <div className="favorite-card__media" role="img" aria-label={`Placeholder image for ${t.name} treatment`}><span>{t.name}</span></div>
                <div className="favorite-card__body">
                  <span className="favorite-card__area">{t.area}</span>
                  <h3 className="favorite-card__name">{t.name}</h3>
                  <p className="favorite-card__benefit">{t.blurb}</p>
                  <div className="favorite-card__actions">
                    <Link href={`/book/?treatment=${t.slug}`} className="btn btn--primary btn--sm">{FAVORITE_CTA_LABELS[t.slug]}</Link>
                    <Link href={`/treatments/${t.slug}/`} className="btn btn--secondary btn--sm">See Treatment</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--bg-alt" aria-labelledby="ba-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Real Results</span>
            <h2 className="section-title" id="ba-heading">Before &amp; After</h2>
            <p className="section-sub">Results that hold up — some of these photos are years apart, not weeks, and patients still look younger than their own starting point.</p>
          </div>

          <div className="ba-grid">
            <Link className="ba-tile" href="/treatments/botox/" aria-label="Placeholder before and after image for Botox — view Botox treatment page">
              <div className="ba-tile__split"><div></div><div></div></div>
              <div className="ba-tile__divider" aria-hidden="true"></div>
              <div className="ba-tile__labels"><span>Before</span><span>After</span></div>
              <div className="ba-tile__caption">Botox® — 6 weeks apart</div>
            </Link>
            <Link className="ba-tile" href="/treatments/renulift/" aria-label="Placeholder before and after image for RENUlift, 9 years apart — view RENUlift treatment page">
              <div className="ba-tile__split"><div></div><div></div></div>
              <div className="ba-tile__divider" aria-hidden="true"></div>
              <div className="ba-tile__labels"><span>Before</span><span>After</span></div>
              <div className="ba-tile__caption">RENUlift™ — 9 years apart</div>
            </Link>
            <Link className="ba-tile" href="/treatments/sculptra/" aria-label="Placeholder before and after image for Dermal Fillers — view Sculptra treatment page">
              <div className="ba-tile__split"><div></div><div></div></div>
              <div className="ba-tile__divider" aria-hidden="true"></div>
              <div className="ba-tile__labels"><span>Before</span><span>After</span></div>
              <div className="ba-tile__caption">Dermal Fillers — 3 months apart</div>
            </Link>
            <Link className="ba-tile" href="/treatments/resurfacing/" aria-label="Placeholder before and after image for Laser Skin Resurfacing — view treatment page">
              <div className="ba-tile__split"><div></div><div></div></div>
              <div className="ba-tile__divider" aria-hidden="true"></div>
              <div className="ba-tile__labels"><span>Before</span><span>After</span></div>
              <div className="ba-tile__caption">Laser Resurfacing — 8 months apart</div>
            </Link>
          </div>

          <div className="ba-footer">
            <Link href="/treatments/" className="btn btn--secondary">View All Treatments</Link>
          </div>
        </div>
      </section>

      <section className="section section--bg-alt" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Patient Stories</span>
            <h2 className="section-title" id="testimonials-heading">What patients are saying</h2>
            <p className="section-sub">A sample of reviews from RENU patients in Stuart and Tequesta.</p>
          </div>

          <div className="testimonial-grid">
            <article className="testimonial-card">
              <div className="testimonial-card__stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="testimonial-card__quote">&quot;Dr. Barrett really takes the time to understand your expectations. I&apos;ve never felt rushed, and the results always look natural.&quot; <em>(placeholder — pending final client-approved copy)</em></p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" role="img" aria-label="Placeholder avatar photo"></div>
                <div><strong>Gary L.</strong><span>Stuart patient</span></div>
              </div>
            </article>
            <article className="testimonial-card">
              <div className="testimonial-card__stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="testimonial-card__quote">&quot;I&apos;ve been coming to RENU for over six years. The whole team makes you feel welcome, not just like another appointment.&quot; <em>(placeholder)</em></p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" role="img" aria-label="Placeholder avatar photo"></div>
                <div><strong>Patient placeholder</strong><span>Tequesta patient</span></div>
              </div>
            </article>
            <article className="testimonial-card">
              <div className="testimonial-card__stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="testimonial-card__quote">&quot;Professional, welcoming, and the results speak for themselves. I recommend RENU to everyone who asks.&quot; <em>(placeholder)</em></p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" role="img" aria-label="Placeholder avatar photo"></div>
                <div><strong>Patient placeholder</strong><span>Stuart patient</span></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--bg-surface" aria-labelledby="membership-heading">
        <div className="container">
          <div className="membership">
            <span className="membership__flag">Concept — Pending Client Approval</span>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <h2 className="section-title" id="membership-heading">RENU Membership</h2>
              <p className="section-sub">Speculative packages module — for internal review only, not yet offered to patients.</p>
            </div>
            <div className="membership-grid">
              <div className="membership-tier">
                <h3 className="membership-tier__name">Essentials</h3>
                <p className="membership-tier__price">$[TBD] <small>/ month</small></p>
                <ul><li>Quarterly Botox® touch-up</li><li>Member pricing on add-ons</li><li>Priority scheduling</li></ul>
                <a href="#" className="btn btn--secondary btn--block">Ask About Membership</a>
              </div>
              <div className="membership-tier membership-tier--featured">
                <h3 className="membership-tier__name">Signature</h3>
                <p className="membership-tier__price">$[TBD] <small>/ month</small></p>
                <ul><li>Everything in Essentials</li><li>Quarterly facial or skin treatment</li><li>Member pricing on injectables</li></ul>
                <a href="#" className="btn btn--primary btn--block">Ask About Membership</a>
              </div>
              <div className="membership-tier">
                <h3 className="membership-tier__name">Elite</h3>
                <p className="membership-tier__price">$[TBD] <small>/ month</small></p>
                <ul><li>Everything in Signature</li><li>Annual Ultherapy® or Sculptra® credit</li><li>Dedicated concierge booking</li></ul>
                <a href="#" className="btn btn--secondary btn--block">Ask About Membership</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
