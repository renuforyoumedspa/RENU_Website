import { Suspense } from 'react';
import type { Metadata } from 'next';
import BookForm from '@/components/BookForm';

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description: "Request a consultation at RENU Medical Aesthetics — Stuart or Tequesta, FL.",
  alternates: { canonical: '/book/' }
};

export default function BookPage() {
  return (
    <>
      <section className="simple-hero">
        <div className="simple-hero__inner">
          <span className="simple-hero__eyebrow">Consultation request</span>
          <h1 className="simple-hero__title">Let&apos;s build your plan.</h1>
          <p className="simple-hero__lead">Three short steps. Dr. Barrett&apos;s office confirms by phone within one business day.</p>
        </div>
      </section>

      <div className="book-wrap">
        {/* useSearchParams() inside BookForm requires a Suspense boundary
            for Next.js's static-generation pass. */}
        <Suspense fallback={null}>
          <BookForm />
        </Suspense>
      </div>
    </>
  );
}
