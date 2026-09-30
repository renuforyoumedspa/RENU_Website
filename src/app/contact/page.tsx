import type { Metadata } from 'next';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import { REVIEWS } from '@/data/site-data';
import BookingLink from '@/components/BookingLink';

export const metadata: Metadata = {
  title: 'Contact & Locations: Stuart and Tequesta, FL',
  description: 'Visit RENU Medical Aesthetics at 845 SE Osceola Street, Stuart, FL 34994 or 304 Tequesta Drive, Suite 300, Tequesta, FL 33469. Stuart 772-266-4450, Tequesta 561-406-6123.',
  alternates: { canonical: '/contact/' }
};

function formatReviewLine(review: { count: number; rating: number }) {
  return review.rating >= 5 ? `${review.count} Reviews · 5.0★ Average` : `${review.count} Reviews · ${review.rating.toFixed(1)}★ Average`;
}

export default function ContactPage() {
  return (
    <>
      <section className="page-header page-header--dark">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">Contact Us</span>
          <h1 className="page-header__title">Two clinics, twenty minutes apart.</h1>
          <p className="page-header__lead">Same team, same physician, same treatments at both locations. Call or text <a href="tel:5614066123">561-406-6123</a>, or send a message below.</p>
        </div>
      </section>

      <div className="location-card-grid">
        <article className="location-card">
          <div className="location-card__media">
            <Image src="/assets/location-stuart.jpg" alt="RENU Medical Aesthetics — Stuart location" fill sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
          <div className="location-card__body">
            <h2 className="location-card__city">Stuart</h2>
            <p className="location-card__reviews">{formatReviewLine(REVIEWS.stuart)}</p>
            <p className="location-card__address">845 Southeast Osceola Street<br />Stuart, FL 34994</p>
            <p className="location-card__meta">Mon–Fri 9:00–5:00 · <a href="tel:7722664450">772-266-4450</a></p>
            <div className="location-card__actions">
              <BookingLink className="btn btn--primary">Book Online</BookingLink>
              <a href="https://www.google.com/maps/search/?api=1&query=845+Southeast+Osceola+Street%2C+Stuart%2C+FL+34994" target="_blank" rel="noopener" className="btn btn--secondary">Directions</a>
            </div>
          </div>
        </article>

        <article className="location-card">
          <div className="location-card__media">
            <Image src="/assets/location-tequesta.jpg" alt="RENU Medical Aesthetics — Tequesta location" fill sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
          <div className="location-card__body">
            <h2 className="location-card__city">Tequesta</h2>
            <p className="location-card__reviews">{formatReviewLine(REVIEWS.tequesta)}</p>
            <p className="location-card__address">304 Tequesta Drive, Suite 300<br />Tequesta, FL 33469</p>
            <p className="location-card__meta">Mon–Fri 9:00–5:00 · <a href="tel:5614066123">561-406-6123</a></p>
            <div className="location-card__actions">
              <BookingLink className="btn btn--primary">Book Online</BookingLink>
              <a href="https://www.google.com/maps/search/?api=1&query=304+Tequesta+Drive+Suite+300%2C+Tequesta%2C+FL+33469" target="_blank" rel="noopener" className="btn btn--secondary">Directions</a>
            </div>
          </div>
        </article>
      </div>

      <div className="split-body">
        <div className="split-body__main">
          <ContactForm />
        </div>
        <div className="split-body__aside">
          <div className="contact-panel">
            <h3>Both clinics</h3>
            <div className="contact-panel__row"><strong>Phone &amp; Text</strong><a href="tel:5614066123">561-406-6123</a></div>
            <div className="contact-panel__row"><strong>Email</strong><a href="mailto:info@RENUforyou.com">info@RENUforyou.com</a></div>
            <div className="contact-panel__row"><strong>Hours</strong><span>Mon–Fri 9:00–5:00, weekends by appointment</span></div>
            <div className="contact-panel__row"><BookingLink className="contact-panel__link">Ready to book? →</BookingLink></div>
          </div>
        </div>
      </div>
    </>
  );
}
