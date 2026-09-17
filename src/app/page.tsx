import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllTreatments, getTreatmentBySlug, getGalleryTiles, getHomepageFeaturedBeforeAfters } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';
import { resolveBeforeAfter } from '@/lib/before-after';
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
  const galleryTiles = await getGalleryTiles();
  const featuredBeforeAfters = await getHomepageFeaturedBeforeAfters();

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
            25 years of board-certified, non-surgical care from Dr. Valerie Barrett —
            tailored to your face, your goals, your timeline.
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
          <div className="provider__media">
            <Image
              src="/assets/dr-valerie-barrett.jpg"
              alt="Dr. Valerie Barrett, MD, founder of RENU Medical Aesthetics"
              fill
              sizes="(min-width: 960px) 40vw, 90vw"
              priority
            />
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
              25 years, tens of thousands of procedures, two Florida practices —
              every plan is personalized, never one-size-fits-all.
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

      <section className="full-bleed-banner" aria-label="Face, Skin, Body">
        <Image
          src="/assets/face-skin-body-banner.png"
          alt="RENU Medical Aesthetics treatment categories: Face, Skin, and Body"
          width={1838}
          height={681}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </section>

      <section className="section section--bg-alt" aria-labelledby="ba-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Real Results</span>
            <h2 className="section-title" id="ba-heading">Before &amp; After</h2>
            <p className="section-sub">Results that hold up — some of these photos are years apart, not weeks, and patients still look younger than their own starting point.</p>
          </div>

          <div className="ba-grid">
            {featuredBeforeAfters.map((f) => {
              const resolved = resolveBeforeAfter(f.entry);
              return (
                <Link
                  className="ba-tile"
                  href={`/treatments/${f.treatmentSlug}/`}
                  aria-label={`Before and after photos for ${f.label} — view ${f.label} treatment page`}
                  key={f.treatmentSlug}
                >
                  {resolved.mode === 'paired' ? (
                    <div className="ba-tile__paired">
                      <Image src={resolved.src} alt={`${f.label} before and after`} fill sizes="(min-width: 780px) 25vw, 50vw" />
                    </div>
                  ) : (
                    <>
                      <div className="ba-tile__split">
                        <div>{resolved.mode === 'separate' && <Image src={resolved.beforeSrc} alt={`${f.label} before`} fill sizes="(min-width: 780px) 12.5vw, 25vw" />}</div>
                        <div>{resolved.mode === 'separate' && <Image src={resolved.afterSrc} alt={`${f.label} after`} fill sizes="(min-width: 780px) 12.5vw, 25vw" />}</div>
                      </div>
                      <div className="ba-tile__divider" aria-hidden="true"></div>
                    </>
                  )}
                  <div className="ba-tile__labels"><span>Before</span><span>After</span></div>
                  <div className="ba-tile__caption">{f.label} — {f.entry.timeframe}</div>
                </Link>
              );
            })}
          </div>

          <div className="ba-footer">
            <Link href="/treatments/" className="btn btn--secondary">View All Treatments</Link>
          </div>
        </div>
      </section>

      <section className="section section--bg-alt" id="testimonials" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Patient Stories</span>
            <h2 className="section-title" id="testimonials-heading">What patients are saying</h2>
            <p className="section-sub">Real reviews from RENU patients in Stuart and Tequesta, alongside the team behind them.</p>
          </div>

          <div className="gallery-masonry">
            {galleryTiles.map((tile) => {
              if (tile.kind === 'photo') {
                const src = imageSrc(tile.image);
                return (
                  <div className={`gallery-tile gallery-tile--photo gallery-tile--${tile.shape}`} key={tile._id}>
                    {src && <Image src={src} alt={tile.alt} fill sizes="(min-width: 1080px) 25vw, (min-width: 640px) 33vw, 90vw" />}
                  </div>
                );
              }
              return (
                <article className="gallery-tile gallery-tile--review" key={tile._id}>
                  <div className="gallery-tile__stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <p className="gallery-tile__quote">&quot;{tile.quote}&quot;</p>
                  <div className="gallery-tile__author">
                    <strong>{tile.reviewerName}</strong>
                    <span>{tile.source}</span>
                  </div>
                </article>
              );
            })}
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
