import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { getAllTreatments, getTreatmentBySlug, getRelatedTreatments } from '@/sanity/lib/queries';
import { DEFAULT_VISIT_STEPS, DEFAULT_FAQS, DEFAULT_BEFORE_AFTERS } from '@/data/shared-content';

export async function generateStaticParams() {
  const treatments = await getAllTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) return {};
  return {
    title: treatment.name,
    description: treatment.blurb,
    alternates: { canonical: `/treatments/${treatment.slug}/` },
    openGraph: { title: treatment.name, description: treatment.blurb }
  };
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) notFound();

  const visitSteps = treatment.visitSteps?.length ? treatment.visitSteps.map((s) => s.text) : DEFAULT_VISIT_STEPS.map((s) => s.text);
  const faqs = treatment.faqs?.length ? treatment.faqs : DEFAULT_FAQS;
  const beforeAfters = treatment.beforeAfters?.length ? treatment.beforeAfters : DEFAULT_BEFORE_AFTERS;
  const related = await getRelatedTreatments(treatment, 3);

  // Structured data: helps Google understand this is a specific medical
  // procedure page, distinct from generic marketing copy — part of
  // "robust SEO," not just a nice-to-have.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: treatment.name,
    description: treatment.blurb,
    procedureType: treatment.tech
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span className="detail-breadcrumb__sep">/</span>
        <Link href="/treatments/">Treatments</Link> <span className="detail-breadcrumb__sep">/</span>
        <span className="detail-breadcrumb__current">{treatment.name}</span>
      </nav>

      <section className="detail-hero">
        <div className="detail-hero__content">
          <span className="detail-hero__eyebrow">{treatment.area} · {treatment.tech}</span>
          <h1 className="detail-hero__title">{treatment.name}</h1>
          <p className="detail-hero__blurb">{treatment.blurb}</p>
          <div className="detail-hero__actions">
            <Link href={`/book/?treatment=${treatment.slug}`} className="btn btn--on-band">{treatment.cta}</Link>
            <Link href="/find-my-treatment/" className="btn btn--ghost-on-band">Is this right for me?</Link>
          </div>
        </div>
        <div className="detail-hero__media">
          <span className="detail-placeholder-caption">treatment hero image</span>
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
            <div>
              <h2 className="detail-h2">What it treats</h2>
              <div className="detail-treats__prose">
                {treatment.body ? <PortableText value={treatment.body as never} /> : <p>{treatment.blurb}</p>}
              </div>
            </div>

            <div>
              <h2 className="detail-h2">How the visit goes</h2>
              <div className="detail-steps">
                {visitSteps.map((text, i) => (
                  <div className="detail-steps__row" key={i}>
                    <span className="detail-steps__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="detail-steps__text">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
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
          </div>

          <aside className="detail-aside">
            <span className="detail-aside__eyebrow">Book {treatment.name}</span>
            <h3 className="detail-aside__title">Choose your clinic</h3>
            <div className="detail-aside__actions">
              <Link href={`/book/?location=Stuart&treatment=${treatment.slug}`}>Stuart — 845 SE Osceola</Link>
              <Link href={`/book/?location=Tequesta&treatment=${treatment.slug}`}>Tequesta — 304 Tequesta Dr</Link>
              <a href="tel:5614066123" className="detail-aside__call">Call 561-406-6123</a>
            </div>
            <p className="detail-aside__note">Consults are with Dr. Barrett and include a full facial assessment — no obligation to treat that day.</p>
          </aside>
        </div>
      </section>

      <section className="detail-ba">
        <div className="detail-ba__inner">
          <div className="detail-ba__header">
            <h2 className="detail-ba__title">{treatment.name} before &amp; after</h2>
            <span className="detail-ba__note">Gallery lives here — not on a separate page.</span>
          </div>
          <div className="detail-ba__grid">
            {beforeAfters.map((entry, i) => (
              <div key={i}>
                <div className="detail-ba__pair">
                  <div className="detail-ba__half detail-ba__half--before"></div>
                  <div className="detail-ba__half detail-ba__half--after"></div>
                </div>
                <div className="detail-ba__caption">{entry.patient} — {entry.timeframe}</div>
              </div>
            ))}
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
                  <div className="detail-related__area">{r.area}</div>
                  <div className="detail-related__name">{r.name}</div>
                  <div className="detail-related__blurb">{r.blurb}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
