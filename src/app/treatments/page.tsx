import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllTreatments } from '@/sanity/lib/queries';
import TreatmentsGrid from '@/components/TreatmentsGrid';

export const metadata: Metadata = {
  title: 'Med Spa Treatments in Stuart & Tequesta, FL',
  description: 'Every non-surgical treatment at RENU Medical Aesthetics: Botox®, dermal fillers, RENUlift™, Ultherapy®, laser resurfacing, microneedling and more. Serving Stuart, Tequesta, Jupiter and Port St. Lucie, FL.',
  alternates: { canonical: '/treatments/' }
};

export default async function TreatmentsIndexPage() {
  const treatments = await getAllTreatments();

  return (
    <>
      <section className="idx-header idx-header--dark">
        <div className="idx-header__inner">
          <span className="idx-header__eyebrow">All treatments</span>
          <h1 className="idx-header__title">Every treatment RENU offers, on one page.</h1>
          <p className="idx-header__lead">Filter by area, by what&apos;s bothering you, or by technology. Each treatment opens its own page — one template, {treatments.length} treatments.</p>
        </div>
      </section>

      <Suspense fallback={null}>
        <TreatmentsGrid treatments={treatments} />
      </Suspense>
    </>
  );
}
