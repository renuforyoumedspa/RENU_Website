import type { Metadata } from 'next';
import { getAllTreatments } from '@/sanity/lib/queries';
import QuizFlow from '@/components/QuizFlow';

export const metadata: Metadata = {
  title: 'Find My Treatment: Free 60-Second Skin Assessment',
  description: 'Answer four quick questions and get matched with the right non-surgical treatment at RENU Medical Aesthetics in Stuart and Tequesta, FL. No email required.',
  alternates: { canonical: '/find-my-treatment/' }
};

export default async function FindMyTreatmentPage() {
  const treatments = await getAllTreatments();

  return (
    <>
      <section className="simple-hero simple-hero--bronze">
        <div className="simple-hero__inner">
          <span className="simple-hero__eyebrow">Self assessment</span>
          <h1 className="simple-hero__title">Four questions. Then we&apos;ll point you somewhere.</h1>
          <p className="simple-hero__lead">No email required to see your results.</p>
        </div>
      </section>

      <div className="book-wrap">
        <QuizFlow treatments={treatments} />
      </div>
    </>
  );
}
