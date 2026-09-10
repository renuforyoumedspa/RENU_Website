'use client';

import Link from 'next/link';
import { useState } from 'react';
import { QUIZ } from '@/data/site-data';
import type { Treatment } from '@/sanity/lib/queries';

function getRecommendations(treatments: Treatment[], concern: string, noDowntime: boolean, limit = 3) {
  let recs = treatments.filter((t) => t.concern === concern);
  if (noDowntime) recs = [...recs.filter((t) => t.tech !== 'Laser'), ...recs.filter((t) => t.tech === 'Laser')];
  return recs.slice(0, limit);
}

export default function QuizFlow({ treatments }: { treatments: Treatment[] }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function selectAnswer(value: string) {
    const next = answers.slice(0, idx);
    next.push(value);
    setAnswers(next);
    if (idx + 1 >= QUIZ.length) setDone(true);
    else setIdx(idx + 1);
  }

  function restart() {
    setIdx(0);
    setAnswers([]);
    setDone(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (done) {
    const concern = (answers[0] && QUIZ[0]?.map?.[answers[0]]) || 'Lines & wrinkles';
    const noDowntime = answers[1] === 'None — I have plans this week';
    const recs = getRecommendations(treatments, concern, noDowntime, 3);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'renuFade 320ms ease both' }}>
        <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--renu-mauve-deep)' }}>Your assessment</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-regular)', fontSize: 'clamp(1.75rem, 1.4rem + 1.7vw, 2.5rem)', margin: 0 }}>
          For {concern.toLowerCase()}, start here.
        </h2>
        <div>
          {answers.map((a, i) => <span className="quiz-answer-chip" key={i}>{a}</span>)}
        </div>
        <div className="detail-related__grid">
          {recs.map((t) => (
            <Link className="detail-related__card" href={`/treatments/${t.slug}/`} key={t._id}>
              <div className="detail-related__area">{t.area} · {t.tech}</div>
              <div className="detail-related__name">{t.name}</div>
              <div className="detail-related__blurb">{t.blurb}</div>
            </Link>
          ))}
        </div>
        <div className="form-actions form-actions--end">
          <button type="button" className="btn btn--secondary" onClick={restart}>Start over</button>
          <Link href="/book/" className="btn btn--primary">Book a consultation</Link>
        </div>
      </div>
    );
  }

  const q = QUIZ[idx];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div className="quiz-progress-track"><div className="quiz-progress-fill" style={{ width: `${Math.round((idx / QUIZ.length) * 100)}%` }} /></div>
      <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--renu-mauve-soft)' }}>Question {idx + 1} of {QUIZ.length}</span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-regular)', fontSize: 'clamp(1.625rem, 1.3rem + 1.6vw, 2.375rem)', lineHeight: 1.2, margin: 0 }}>
        {q.q}
      </h2>
      <div className="quiz-options">
        {q.options.map((opt) => (
          <button type="button" key={opt} className="quiz-option" onClick={() => selectAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {idx > 0 && (
        <button type="button" className="btn btn--secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setIdx(idx - 1)}>Back</button>
      )}
    </div>
  );
}
