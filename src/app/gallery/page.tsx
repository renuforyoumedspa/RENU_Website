import type { Metadata } from 'next';
import { getGalleryTiles } from '@/sanity/lib/queries';
import GalleryMasonry from '@/components/GalleryMasonry';
import BookingLink from '@/components/BookingLink';

export const metadata: Metadata = {
  title: 'Patient Reviews & Gallery',
  description: 'Real patient reviews and a look inside RENU Medical Aesthetics, rated 5 stars by patients in Stuart, Tequesta and Jupiter, FL.',
  alternates: { canonical: '/gallery/' }
};

// Full version of the homepage's "What patients are saying" section —
// every gallery tile, same component. Tiles are managed in Sanity under
// "Patient Gallery Tiles".
export default async function GalleryPage() {
  const tiles = await getGalleryTiles();

  return (
    <>
      <section className="page-header">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">Gallery</span>
          <h1 className="page-header__title">Patient stories, in their words.</h1>
          <p className="page-header__lead">Real reviews from RENU patients in Stuart and Tequesta, alongside a look inside the practice and the team behind every visit.</p>
        </div>
      </section>

      <section className="section section--bg-alt" id="testimonials" aria-label="Photos and patient reviews">
        <div className="container">
          <GalleryMasonry tiles={tiles} />

          <div className="ba-footer">
            <BookingLink className="btn btn--primary">Book a Consultation</BookingLink>
          </div>
        </div>
      </section>
    </>
  );
}
