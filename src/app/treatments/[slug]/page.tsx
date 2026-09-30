import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { getAllTreatments, getTreatmentBySlug, getRelatedTreatments } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';
import { resolveBeforeAfter } from '@/lib/before-after';
import { DEFAULT_VISIT_STEPS, DEFAULT_FAQS, DEFAULT_BEFORE_AFTERS, getDefaultAccordions } from '@/data/shared-content';
import BookingLink from '@/components/BookingLink';
import { abs, breadcrumbJsonLd, faqJsonLd, jsonLdScript } from '@/lib/seo';

export async function generateStaticParams() {
  const treatments = await getAllTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) return {};
  // "Botox® in Stuart & Tequesta, FL | RENU Medical Aesthetics" — the
  // treatment + city pairing is what patients search for, and what the old
  // site's pages ranked on.
  const title = `${treatment.name} in Stuart & Tequesta, FL`;
  const description = `${treatment.blurb} Performed by Dr. Valerie Barrett, MD at RENU in Stuart and Tequesta, serving Jupiter, Port St. Lucie and Palm Beach Gardens.`;
  const image = imageSrc(treatment.image);
  return {
    title,
    description,
    alternates: { canonical: `/treatments/${treatment.slug}/` },
    openGraph: {
      title,
      description,
      url: `/treatments/${treatment.slug}/`,
      images: image ? [{ url: image, width: 1536, height: 1024, alt: treatment.name }] : undefined
    }
  };
}

// schema.org only accepts these two for a cosmetic procedure's type.
const procedureType = (techs: string[]) =>
  techs.some((t) => t === 'Injectable' || t === 'Thread' || t === 'Microneedling')
    ? 'https://schema.org/PercutaneousProcedure'
    : 'https://schema.org/NoninvasiveProcedure';

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) notFound();

  const visitSteps = treatment.visitSteps?.length ? treatment.visitSteps.map((s) => s.text) : DEFAULT_VISIT_STEPS.map((s) => s.text);
  const faqs = treatment.faqs?.length ? treatment.faqs : DEFAULT_FAQS;
  const beforeAfters = treatment.beforeAfters?.length ? treatment.beforeAfters : DEFAULT_BEFORE_AFTERS;
  const accordions = getDefaultAccordions(treatment);
  const related = await getRelatedTreatments(treatment, 3);
  const heroImageSrc = imageSrc(treatment.image);
  const contentImageSrc = imageSrc(treatment.contentImage);

  // Structured data: the procedure itself, the breadcrumb trail, and the
  // Q&A that's visible on this page (the "What it treats" drop-downs plus
  // the FAQ section) — see src/lib/seo.ts.
  const procedureJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: treatment.name,
    description: treatment.blurb,
    url: abs(`/treatments/${treatment.slug}/`),
    image: heroImageSrc ? abs(heroImageSrc) : undefined,
    procedureType: procedureType(treatment.techs),
    bodyLocation: treatment.areas.join(', ')
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Treatments', path: '/treatments/' },
    { name: treatment.name, path: `/treatments/${treatment.slug}/` }
  ]);
  const faqData = faqJsonLd([...accordions, ...faqs]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(procedureJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqData)} />

      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span className="detail-breadcrumb__sep">/</span>
        <Link href="/treatments/">Treatments</Link> <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__current">{treatment.name}</span>
      </nav>

      <section className="detail-hero">
        <div className="detail-hero__content">
          <span className="detail-hero__eyebrow">{treatment.areas.join(' / ')} · {treatment.techs.join(' / ')}</span>
          <h1 className="detail-hero__title">{treatment.name}</h1>
          <p className="detail-hero__blurb">{treatment.blurb}</p>
          <div className="detail-hero__actions">
            <BookingLink className="btn btn--on-band">{treatment.cta}</BookingLink>
            <Link href="/find-my-treatment/" className="btn btn--ghost-on-band">Is this right for me?</Link>
          </div>
        </div>
        <div className="detail-hero__media">
          {heroImageSrc ? (
            <Image src={heroImageSrc} alt={treatment.name} fill sizes="(min-width: 780px) 50vw, 100vw" priority />
          ) : (
            <span className="detail-placeholder-caption">treatment hero image</span>
          )}
        </div>
      </section>

      <section className="detail-facts">
        <div className="detail-facts__cell"><div className="detail-facts__key">Visit length</div><div className="detail-facts__value">{treatment.facts?.visitLength}</div></div>
        <div className="detail-facts__cell"><div className="detail-facts__key">Downtime</div><div className="detail-facts__value">{treatment.facts?.downtime}</div></div>
        <div className="detail-facts__cell"><div className="detail-facts__key">Results show</div><div className="detail-facts__value">{treatment.facts?.resultsShow}</div></div>
        <div className="detail-facts__cell"><div className="detail-facts__key">Lasts</div><div className="detail-facts__value">{treatment.facts?.lasts}</div></div>
      </section>

      <section className="detail-body">
        <div className="detail-body__inner">
          <div className="detail-body__main">
            <h2 className="detail-h2">What it treats</h2>
            <div className="detail-treats">
              <div className="detail-treats__media">
                {contentImageSrc ? (
                  <Image src={contentImageSrc} alt={treatment.name} fill sizes="(min-width: 780px) 40vw, 90vw" />
                ) : (
                  <span className="detail-placeholder-caption">content image — {treatment.name}</span>
                )}
              </div>
              <div className="detail-treats__info">
                <div className="detail-treats__prose">
                  {treatment.body ? <PortableText value={treatment.body as never} /> : <p>{treatment.blurb}</p>}
                </div>
                <div className="detail-accordion">
                  {accordions.map((a, i) => (
                    <details key={i}>
                      <summary>{a.q}</summary>
                      <p>{a.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="detail-aside">
            <span className="detail-aside__eyebrow">Book {treatment.name}</span>
            <h3 className="detail-aside__title">Pick a time online</h3>
            <div className="detail-aside__actions">
              <BookingLink>Book Online</BookingLink>
              <a href="tel:5614066123" className="detail-aside__call">Call 561-406-6123</a>
            </div>
            <p className="detail-aside__note">Stuart (845 SE Osceola, 772-266-4450) or Tequesta (304 Tequesta Dr, 561-406-6123). Consults are with Dr. Barrett and include a full facial assessment — no obligation to treat that day.</p>
          </aside>
        </div>
      </section>

      <section className="detail-visit">
        <div className="detail-visit__inner">
          <div className="detail-visit__header">
            <span className="eyebrow">What To Expect</span>
            <h2 className="detail-visit__title">How the visit goes</h2>
          </div>
          <div className="detail-visit__grid">
            {visitSteps.map((text, i) => (
              <div className="detail-visit__step" key={i}>
                <span className="detail-visit__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="detail-visit__text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-ba">
        <div className="detail-ba__inner">
          <div className="detail-ba__header">
            <h2 className="detail-ba__title">{treatment.name} before &amp; after</h2>
            <span className="detail-ba__note">Gallery lives here — not on a separate page.</span>
          </div>
          <div className="detail-ba__grid">
            {beforeAfters.map((entry, i) => {
              const resolved = resolveBeforeAfter(entry);
              return (
                <div key={i}>
                  {resolved.mode === 'paired' ? (
                    <div className="detail-ba__pair">
                      <div className="detail-ba__paired">
                        <Image src={resolved.src} alt={`${treatment.name} before and after — ${entry.patient}`} fill sizes="(min-width: 780px) 25vw, 50vw" />
                      </div>
                    </div>
                  ) : (
                    <div className="detail-ba__pair">
                      <div className="detail-ba__half detail-ba__half--before">
                        {resolved.mode === 'separate' && <Image src={resolved.beforeSrc} alt={`${treatment.name} before — ${entry.patient}`} fill sizes="(min-width: 780px) 12.5vw, 25vw" />}
                      </div>
                      <div className="detail-ba__half detail-ba__half--after">
                        {resolved.mode === 'separate' && <Image src={resolved.afterSrc} alt={`${treatment.name} after — ${entry.patient}`} fill sizes="(min-width: 780px) 12.5vw, 25vw" />}
                      </div>
                    </div>
                  )}
                  <div className="detail-ba__caption">{entry.patient} — {entry.timeframe}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="detail-related">
          <div className="detail-related__inner">
            <h2 className="detail-related__title">Often paired with</h2>
            <div className="detail-related__grid">
              {related.map((r) => (
                <Link className="detail-related__card" href={`/treatments/${r.slug}/`} key={r._id}>
                  <div className="detail-related__area">{r.areas[0]}</div>
                  <div className="detail-related__name">{r.name}</div>
                  <div className="detail-related__blurb">{r.blurb}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="detail-faq">
        <div className="detail-faq__inner">
          <h2 className="detail-h2">Questions we get asked</h2>
          <div className="detail-faqs">
            {faqs.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
