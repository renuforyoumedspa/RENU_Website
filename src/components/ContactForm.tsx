'use client';

import { useState } from 'react';
import { SOURCES } from '@/data/site-data';

const CONTACT_LOCATIONS = ['Stuart', 'Tequesta', 'Either'];

export default function ContactForm() {
  const [location, setLocation] = useState('Stuart');
  const [source, setSource] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const emailValid = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setNameError(name.length === 0);
    setEmailError(!emailValid);
    if (name.length === 0 || !emailValid) return;

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="confirm-panel" style={{ animation: 'renuFade 320ms ease both' }}>
        <h2 className="confirm-panel__title">Message received.</h2>
        <p className="confirm-panel__text">Thanks — Dr. Barrett&apos;s office will get back to you shortly. For anything time-sensitive, call or text <a href="tel:5614066123" style={{ color: 'var(--renu-purple-deep)' }}>561-406-6123</a>.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="detail-h2">Send us a message</h2>
      <p className="detail-treats__p" style={{ marginBottom: 20 }}>For appointment requests, the <a href="/book/" style={{ color: 'var(--renu-purple)' }}>booking form</a> gets Dr. Barrett&apos;s office back to you faster. Use this for everything else.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid" style={{ marginBottom: 18 }}>
          <div className={`form-field${nameError ? ' has-error' : ''}`}>
            <label htmlFor="cName">Name</label>
            <input type="text" id="cName" name="name" />
            <span className="form-field__error">Name is required.</span>
          </div>
          <div className={`form-field${emailError ? ' has-error' : ''}`}>
            <label htmlFor="cEmail">Email</label>
            <input type="email" id="cEmail" name="email" />
            <span className="form-field__error">A valid email helps us reply.</span>
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

        <button type="submit" className="btn btn--primary">Send message</button>
      </form>
    </div>
  );
}
