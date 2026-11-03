import Link from '@/components/Link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllTreatments, getTreatmentBySlug, getGalleryTiles, getAgeInReverseSlides, getAboutPageMedia } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';
import { getCombinedReviews } from '@/data/site-data';
import BookingLink from '@/components/BookingLink';
import GalleryMasonry from '@/components/GalleryMasonry';
import AgeInReverseCarousel, { type CarouselSlide } from '@/components/AgeInReverseCarousel';
import { MOST_RECOMMENDED } from '@/data/recommended';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

// "What patients are saying" is a teaser — the first N tiles by display
// order. The full set lives on /gallery.
const HOMEPAGE_GALLERY_LIMIT = 12;

// The first six of the client's most recommended treatments.
const FAVORITE_IDS = MOST_RECOMMENDED.slice(0, 6);
const FAVORITE_CTA_LABELS: Record<string, string> = {
  resurfacing: 'Renew Your Glow',
  ultherapy: 'Lift & Tighten Naturally',
  coollaser: 'Get Flawless Skin',
  necklift: 'Redefine Your Neck',
  eyelid: 'Lift Your Lids',
  browlift: 'Raise Your Brow',
  tightening: 'Tighten Your Skin'
};

export default async function HomePage() {
  const allTreatments = await getAllTreatments();
  const reviews = getCombinedReviews();
  const favorites = (await Promise.all(FAVORITE_IDS.map((slug) => getTreatmentBySlug(slug)))).filter((t) => t !== null);
  const galleryTiles = await getGalleryTiles();
  const ageInReverseSlides = await getAgeInReverseSlides();
  const about = await getAboutPageMedia();
  // "2017–2025" → 8 years apart (only when the field holds two years).
  const yearsApart = (t?: string) => { const m = t?.match(/(\d{4})\D+(\d{4})/); return m ? Math.abs(+m[2] - +m[1]) || undefined : undefined; };
  const ageInReverse: CarouselSlide[] = ageInReverseSlides
    .map((s) => ({ key: s.key, src: imageSrc(s.photo) || '', alt: s.alt || `Before and after photos of a RENU patient${s.timeframe ? `, ${s.timeframe}` : ''}`, timeframe: s.timeframe, yearsApart: yearsApart(s.timeframe), treatments: s.treatments }))
    .filter((s) => s.src);

  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero__media">
          <Image
            src="/assets/renu-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__image"
          />
          <div className="hero__scrim"></div>
        </div>

        <div className="hero__content">
          <span className="hero__eyebrow"><span className="dot" aria-hidden="true"></span>Stuart &amp; Tequesta, Florida</span>
          <h1 className="hero__title">Look like you,<br /><em>only younger.</em></h1>
          <p className="hero__subhead">
            25 years of board-certified, non-surgical care from Dr. Valerie Barrett —
            tailored to your face, your goals, your timeline.
          </p>
          <div className="hero__ctas btn-group">
            <BookingLink className="btn btn--on-band">Book a Consultation</BookingLink>
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
            {/* Portrait managed in Sanity: "Dr. Barrett & Team". */}
            <Image
              src={imageSrc(about.drBarrettPortrait.image)!}
              alt={about.drBarrettPortrait.alt || 'Dr. Valerie Barrett, MD'}
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
              <BookingLink className="btn btn--primary">Book a Consultation</BookingLink>
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
                <div className="favorite-card__media">
                  {imageSrc(t.image)
                    ? <Image src={imageSrc(t.image)!} alt={t.name} fill sizes="(min-width: 1080px) 33vw, (min-width: 640px) 50vw, 90vw" />
                    : <span>{t.name}</span>}
                </div>
                <div className="favorite-card__body">
                  <span className="favorite-card__area">{t.areas[0]}</span>
                  <h3 className="favorite-card__name">{t.name}</h3>
                  <p className="favorite-card__benefit">{t.blurb}</p>
                  <div className="favorite-card__actions">
                    <BookingLink className="btn btn--primary btn--sm">{FAVORITE_CTA_LABELS[t.slug]}</BookingLink>
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
          src="/assets/face-skin-body-banner.webp"
          alt="RENU Medical Aesthetics treatment categories: Face, Skin, and Body"
          width={1838}
          height={681}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
        {/* The banner is one image; each panel gets an invisible link laid
            over it, sized to the photo seams (31.94% and 67.14% across). */}
        <nav className="full-bleed-banner__links" aria-label="Browse treatments by area">
          <Link href="/treatments/?area=Face" className="full-bleed-banner__link" style={{ left: 0, width: '31.94%' }} aria-label="Face treatments"><span className="full-bleed-banner__label" aria-hidden="true">Face</span></Link>
          <Link href="/treatments/?area=Skin" className="full-bleed-banner__link" style={{ left: '31.94%', width: '35.2%' }} aria-label="Skin treatments"><span className="full-bleed-banner__label" aria-hidden="true">Skin</span></Link>
          <Link href="/treatments/?area=Body" className="full-bleed-banner__link" style={{ left: '67.14%', width: '32.86%' }} aria-label="Body treatments"><span className="full-bleed-banner__label" aria-hidden="true">Body</span></Link>
        </nav>
      </section>

      {/* "Age in Reverse" carousel — one slide per patient (before & after
          photo, years, treatments used with links). Sanity: Homepage →
          "Age in Reverse slides". Hidden until at least one slide has a photo. */}
      {ageInReverse.length > 0 && (
      <section className="section section--bg-alt" id="age-in-reverse" aria-labelledby="ba-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Real Results</span>
            <h2 className="section-title" id="ba-heading">Age in Reverse</h2>
            <p className="section-sub">Results that hold up — some of these photos are years apart, not weeks, and patients still look younger than their own starting point.</p>
          </div>

          <AgeInReverseCarousel slides={ageInReverse} />

          <div className="ba-footer">
            <Link href="/treatments/" className="btn btn--secondary">View All Treatments</Link>
          </div>
        </div>
      </section>
      )}

      <section className="section section--bg-alt" id="testimonials" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Patient Stories</span>
            <h2 className="section-title" id="testimonials-heading">What patients are saying</h2>
            <p className="section-sub">Real reviews from RENU patients in Stuart and Tequesta, alongside the team behind them.</p>
          </div>

          <GalleryMasonry tiles={galleryTiles.slice(0, HOMEPAGE_GALLERY_LIMIT)} />

          <div className="ba-footer">
            <Link href="/gallery/" className="btn btn--secondary">View the full gallery</Link>
          </div>
        </div>
      </section>
    </>
  );
}
