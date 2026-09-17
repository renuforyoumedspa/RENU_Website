'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Treatment } from '@/sanity/lib/queries';
import { imageSrc } from '@/sanity/lib/image';

const AREAS = ['Face', 'Body', 'Skin'];
const CONCERNS = ['Lines & wrinkles', 'Volume loss', 'Sagging & laxity', 'Texture & tone', 'Pigment', 'Acne scars', 'Lips', 'Contour', 'Hair loss', 'Cellulite'];
const TECHS = ['Injectable', 'Laser', 'Energy', 'Thread', 'Topical'];

const AXES = [
  { key: 'area', label: 'Area', values: AREAS },
  { key: 'concern', label: 'Concern', values: CONCERNS },
  { key: 'tech', label: 'Technology', values: TECHS }
] as const;

export default function TreatmentsGrid({ treatments }: { treatments: Treatment[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    area: searchParams.get('area') || 'All',
    concern: searchParams.get('concern') || 'All',
    tech: searchParams.get('tech') || 'All'
  });

  // Keep state in sync if the URL changes out from under us (back/forward nav).
  useEffect(() => {
    setFilters({
      area: searchParams.get('area') || 'All',
      concern: searchParams.get('concern') || 'All',
      tech: searchParams.get('tech') || 'All'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function setAxis(axis: 'area' | 'concern' | 'tech', value: string) {
    const next = { ...filters, [axis]: value };
    setFilters(next);
    const params = new URLSearchParams();
    if (next.area !== 'All') params.set('area', next.area);
    if (next.concern !== 'All') params.set('concern', next.concern);
    if (next.tech !== 'All') params.set('tech', next.tech);
    const qs = params.toString();
    router.replace(qs ? `/treatments/?${qs}` : '/treatments/', { scroll: false });
  }

  function clearAll() {
    setFilters({ area: 'All', concern: 'All', tech: 'All' });
    router.replace('/treatments/', { scroll: false });
  }

  const shown = useMemo(
    () =>
      treatments.filter(
        (t) =>
          (filters.area === 'All' || t.area === filters.area) &&
          (filters.concern === 'All' || t.concern === filters.concern) &&
          (filters.tech === 'All' || t.tech === filters.tech)
      ),
    [treatments, filters]
  );

  return (
    <>
      <section className="idx-filter-bar">
        <div className="idx-filter-bar__inner">
          <div className="idx-filter-row">
            {AXES.map((axis) => (
              <label className="idx-filter-select" key={axis.key}>
                <span className="idx-filter-select__label">{axis.label}</span>
                <select
                  value={filters[axis.key]}
                  onChange={(e) => setAxis(axis.key, e.target.value)}
                  aria-label={`Filter by ${axis.label}`}
                >
                  <option value="All">All</option>
                  {axis.values.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="idx-results">
        <div className="idx-results__inner">
          <div className="idx-results__meta">
            <p className="idx-results__count">Showing <strong>{shown.length}</strong> of {treatments.length} treatments</p>
            <a href="#" className="idx-results__clear" onClick={(e) => { e.preventDefault(); clearAll(); }}>Clear filters</a>
          </div>

          {shown.length > 0 ? (
            <div className="idx-grid">
              {shown.map((t) => (
                <article className="idx-card" key={t._id}>
                  <div className="idx-card__media">
                    {imageSrc(t.image) && <Image src={imageSrc(t.image)!} alt={t.name} fill sizes="(min-width: 1080px) 33vw, (min-width: 620px) 50vw, 90vw" />}
                  </div>
                  <div className="idx-card__body">
                    <div className="idx-card__chips">
                      <span className="idx-chip idx-chip--area">{t.area}</span>
                      <span className="idx-chip idx-chip--tech">{t.tech}</span>
                    </div>
                    <h3 className="idx-card__name">{t.name}</h3>
                    <p className="idx-card__blurb">{t.blurb}</p>
                    <div className="idx-card__actions">
                      <Link href={`/treatments/${t.slug}/`} className="btn btn--primary">See treatment</Link>
                      <Link href={`/book/?treatment=${t.slug}`} className="btn btn--secondary">Book visit</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="idx-empty">
              <p>No treatment matches that combination.</p>
              <a href="#" onClick={(e) => { e.preventDefault(); clearAll(); }}>Reset filters</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
