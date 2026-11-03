'use client';

import { useState } from 'react';
import { SOURCES } from '@/data/site-data';
import BookingLink from '@/components/BookingLink';

const CONTACT_LOCATIONS = ['Stuart', 'Tequesta', 'Either'];

// Submissions go to Netlify Forms (Netlify → Forms → "contact"). The form
// is registered by its static twin in public/__forms.html — keep the field
// names in sync. Posting to that static file means Netlify's edge handles
// it directly; nothing runs in Next.js.
const NETLIFY_FORM_ENDPOINT = '/__forms.html';

export default function ContactForm() {
  const [location, setLocation] = useState('Stuart');
  const [source, setSource] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [contactError, setContactError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const emailValid = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // Need some way to reply: a valid email or a phone number.
    const canReply = emailValid && (email !== '' || phone.replace(/\D/g, '').length >= 10);

    setNameError(name.length === 0);
    setContactError(!canReply);
    if (name.length === 0 || !canReply) return;

    setSending(true);
    setSendError(false);
    try {
      const res = await fetch(NETLIFY_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString()
      });
      if (!res.ok) throw new Error(`Form submission failed: ${res.status}`);
      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="confirm-panel" style={{ animation: 'renuFade 320ms ease both' }}>
        <h2 className="confirm-panel__title">Message received.</h2>
        <p className="confirm-panel__text">Thanks — Dr. Barrett&apos;s office will get back to you shortly. For anything time-sensitive, call or text <a href="tel:5614066123" style={{ color: 'var(--renu-espresso)' }}>561-406-6123</a>.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="detail-h2">Send us a message</h2>
      <p className="detail-treats__p" style={{ marginBottom: 20 }}>For appointments, <BookingLink>book online</BookingLink> to pick a time right away. Use this for everything else.</p>

      <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="form-name" value="contact" />
        {/* Pill choices aren't inputs, so their values ride along here. */}
        <input type="hidden" name="location" value={location} />
        <input type="hidden" name="source" value={source} />
        {/* Spam trap: hidden from people, filled in by bots. */}
        <p hidden>
          <label>Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
        </p>

        <div className="form-grid" style={{ marginBottom: 18 }}>
          <div className={`form-field${nameError ? ' has-error' : ''}`}>
            <label htmlFor="cName">Name</label>
            <input type="text" id="cName" name="name" autoComplete="name" />
            <span className="form-field__error">Name is required.</span>
          </div>
          <div className={`form-field${contactError ? ' has-error' : ''}`}>
            <label htmlFor="cEmail">Email</label>
            <input type="email" id="cEmail" name="email" autoComplete="email" />
            <span className="form-field__error">Add a valid email or a phone number so we can reply.</span>
          </div>
          <div className={`form-field${contactError ? ' has-error' : ''}`}>
            <label htmlFor="cPhone">Phone</label>
            <input type="tel" id="cPhone" name="phone" autoComplete="tel" />
          </div>
        </div>

        <div className="form-field" style={{ marginBottom: 18 }}>
          <label>Which clinic?</label>
          <div className="pill-group">
            {CONTACT_LOCATIONS.map((opt) => (
              <button type="button" key={opt} className="pill" aria-pressed={location === opt} onClick={() => setLocation(opt)}>{opt}</button>
            ))}
          </div>
        </div>

        <div className="form-field" style={{ marginBottom: 18 }}>
          <label htmlFor="cMessage">Message</label>
          <textarea id="cMessage" name="message" rows={4} />
        </div>

        <div className="form-field" style={{ marginBottom: 24 }}>
          <label>How did you hear about us?</label>
          <div className="pill-group">
            {SOURCES.map((opt) => (
              <button type="button" key={opt} className="pill" aria-pressed={source === opt} onClick={() => setSource(opt)}>{opt}</button>
            ))}
          </div>
        </div>

        {sendError && (
          <p className="form-field__error" role="alert" style={{ display: 'block', marginBottom: 16 }}>
            Sorry — your message didn&apos;t send. Please try again, or call <a href="tel:5614066123">561-406-6123</a>.
          </p>
        )}
        <button type="submit" className="btn btn--primary" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
      </form>
    </div>
  );
}
