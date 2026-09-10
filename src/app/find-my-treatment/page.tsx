import type { Metadata } from 'next';
import { getAllTreatments } from '@/sanity/lib/queries';
import QuizFlow from '@/components/QuizFlow';

export const metadata: Metadata = {
  title: 'Find My Treatment',
  description: 'A four-question self-assessment pointing you toward the right RENU treatment. No email required.',
  alternates: { canonical: '/find-my-treatment/' }
};

export default async function FindMyTreatmentPage() {
  const treatments = await getAllTreatments();

  return (
    <>
      <section className="simple-hero simple-hero--plum">
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
