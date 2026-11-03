'use client';

import Image from 'next/image';
import Link from '@/components/Link';
import { useEffect, useRef, useState } from 'react';

// Homepage "Age in Reverse" carousel. One slide per patient: their before &
// after photo, the years, and the treatments they had (each linking to its
// page). Content: Sanity → Homepage → "Age in Reverse slides".
//
// Built on native scroll-snap, so swiping on phones feels like the platform;
// the arrows, dots and ←/→ keys just scroll the track.
//
// Auto-advances every AUTOPLAY_MS while the section is on screen. It stops
// for good once the visitor takes control (arrows, dots, swipe, keys, or the
// pause button), pauses while hovered or focused, and never starts for
// people with "reduce motion" on. The pause button is required for anything
// that moves on its own for 5+ seconds (WCAG 2.2.2).
export interface CarouselSlide {
  key: string;
  src: string;
  alt: string;
  timeframe?: string;
  yearsApart?: number;
  treatments: { name: string; slug: string; blurb?: string }[];
}

const AUTOPLAY_MS = 6000;

export default function AgeInReverseCarousel({ slides }: { slides: CarouselSlide[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false); // visitor took control — stays stopped
  const [held, setHeld] = useState(false); // hovered / focused — resumes after
  const [onScreen, setOnScreen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = slides.length;

  // Keep the active dot in sync with swipes and arrow-driven scrolls.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / el.clientWidth))));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [count]);

  // Only rotate while the section is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const playing = count > 1 && !stopped && !held && onScreen && !reduceMotion;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  function go(i: number) {
    const el = track.current;
    if (!el) return;
    const next = (i + count) % count;
    el.scrollTo({ left: next * el.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // Any deliberate navigation by the visitor ends auto-advance.
  function userGo(i: number) {
    setStopped(true);
    go(i);
  }

  return (
    <div
      className="air-carousel"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Patient before and after results"
      // Hold while a mouse is over it or keyboard focus is inside. Touch taps
      // fire emulated hover/focus too, so only real mouse pointers and
      // keyboard (:focus-visible) focus count — otherwise a tap on a phone
      // would leave it paused.
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHeld(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHeld(false); }}
      onFocus={(e) => { if ((e.target as HTMLElement).matches(':focus-visible')) setHeld(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}
    >
      <div
        className="air-carousel__track"
        ref={track}
        tabIndex={0}
        // Announce slide changes only once the visitor is driving it.
        aria-live={stopped ? 'polite' : 'off'}
        // A swipe or trackpad scroll is the visitor taking control.
        onTouchStart={() => setStopped(true)}
        onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) setStopped(true); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); userGo(index + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); userGo(index - 1); }
        }}
      >
        {slides.map((s, i) => (
          <article className="air-slide" key={s.key} aria-roledescription="slide" aria-label={`Patient ${i + 1} of ${count}`}>
            <div className="air-slide__photo">
              <Image src={s.src} alt={s.alt} fill sizes="(min-width: 900px) 320px, 70vw" />
            </div>
            <div className="air-slide__info">
              {s.timeframe && <p className="air-slide__years">{s.timeframe}</p>}
              {s.yearsApart ? <p className="air-slide__apart">{s.yearsApart} years apart</p> : null}
              {s.treatments.length > 0 && (
                <>
                  <h3 className="air-slide__heading">Treatments used</h3>
                  <ul className="air-slide__treatments">
                    {s.treatments.map((t) => (
                      <li key={t.slug}>
                        <Link href={`/treatments/${t.slug}/`} className="air-slide__treatment">
                          <span className="air-slide__treatment-name">{t.name}</span>
                          {t.blurb && <span className="air-slide__treatment-blurb">{t.blurb}</span>}
                          <span className="air-slide__treatment-more">Learn more →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {count > 1 && (
        <div className="air-carousel__controls">
          <button type="button" className="air-carousel__arrow" onClick={() => userGo(index - 1)} aria-label="Previous patient">←</button>
          <div className="air-carousel__dots">
            {slides.map((s, i) => (
              <button
                type="button"
                key={s.key}
                className="air-carousel__dot"
                aria-label={`Show patient ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => userGo(i)}
              />
            ))}
          </div>
          <button type="button" className="air-carousel__arrow" onClick={() => userGo(index + 1)} aria-label="Next patient">→</button>
          {!reduceMotion && (
            <button
              type="button"
              className="air-carousel__pause"
              onClick={() => setStopped((s) => !s)}
              aria-label={stopped ? 'Play slideshow' : 'Pause slideshow'}
            >
              {stopped ? '▶' : '❚❚'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
