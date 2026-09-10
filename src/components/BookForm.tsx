'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { INTEREST_OPTIONS, SOURCES } from '@/data/site-data';

const STEP_LABELS = ['What you want', 'Your details', 'How you found us'];
const LOCATION_OPTIONS = ['Stuart', 'Tequesta', 'Either — whichever is sooner'];
const PATIENT_OPTIONS = ['New patient', 'Returning patient'];

interface FormState {
  location: string;
  interests: string[];
  goals: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  patient: string;
  source: string;
  referrer: string;
  optIn: boolean;
}

function Pills({ options, isSelected, onPick }: { options: string[]; isSelected: (o: string) => boolean; onPick: (o: string) => void }) {
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button key={opt} type="button" className="pill" aria-pressed={isSelected(opt)} onClick={() => onPick(opt)}>{opt}</button>
      ))}
    </div>
  );
}

export default function BookForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ firstName: false, lastName: false, contactMethod: false });
  const [form, setForm] = useState<FormState>({
    location: 'Stuart', interests: [], goals: '', firstName: '', lastName: '',
    phone: '', email: '', patient: 'New patient', source: '', referrer: '', optIn: true
  });

  useEffect(() => {
    const location = searchParams.get('location');
    const treatment = searchParams.get('treatment');
    setForm((f) => {
      const next = { ...f };
      if (location) {
        const match = LOCATION_OPTIONS.find((l) => l.startsWith(location));
        if (match) next.location = match;
      }
      if (treatment) next.goals = `Interested in: ${treatment}`;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleInterest(opt: string) {
    setForm((f) => ({ ...f, interests: f.interests.includes(opt) ? f.interests.filter((i) => i !== opt) : [...f.interests, opt] }));
  }

  function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  function submitStep2(e: React.FormEvent) {
    e.preventDefault();
    const hasFirstName = form.firstName.trim().length > 0;
    const hasLastName = form.lastName.trim().length > 0;
    const hasContactMethod = form.phone.trim().length > 0 || form.email.trim().length > 0;
    setErrors({ firstName: !hasFirstName, lastName: !hasLastName, contactMethod: !hasContactMethod });
    if (hasFirstName && hasLastName && hasContactMethod) setStep(3);
  }

  function submitStep3(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    const phone = form.phone || form.email || 'you';
    const rows: [string, string][] = [
      ['Name', `${form.firstName} ${form.lastName}`.trim() || '—'],
      ['Mobile', form.phone || '—'],
      ['Email', form.email || '—'],
      ['Preferred clinic', form.location],
      ['Treatment interest', form.interests.length ? form.interests.join(', ') : 'Not specified'],
      ['Goals (verbatim)', form.goals || '—'],
      ['Patient status', form.patient],
      ['How did you hear about us', form.source || 'Not answered'],
      ['Referred by', form.referrer || '—'],
      ['Email marketing opt-in', form.optIn ? 'Yes' : 'No']
    ];
    return (
      <div>
        <div className="confirm-panel">
          <h2 className="confirm-panel__title">Request received.</h2>
          <p className="confirm-panel__text">We&apos;ll call {phone} within one business day to confirm your time at {form.location}.</p>
        </div>
        <table className="crm-table" aria-label="What this submission would send to a real CRM">
          <thead><tr><th>Field</th><th>Captured value</th></tr></thead>
          <tbody>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="step-indicator">
        {[1, 2, 3].map((n) => (
          <div className="step-indicator__cell" data-state={step === n ? 'current' : step > n ? 'done' : 'upcoming'} key={n}>
            <span className="step-indicator__num">Step {n}</span>
            <span className="step-indicator__label">{STEP_LABELS[n - 1]}</span>
          </div>
        ))}
      </div>

      <form className="book-step" data-active={step === 1} onSubmit={submitStep1} noValidate>
        <div className="form-field">
          <label>Clinic</label>
          <Pills options={LOCATION_OPTIONS} isSelected={(o) => form.location === o} onPick={(o) => setForm((f) => ({ ...f, location: o }))} />
        </div>
        <div className="form-field">
          <label>Interests <span style={{ fontWeight: 400, opacity: 0.7 }}>(choose any that apply)</span></label>
          <Pills options={[...INTEREST_OPTIONS]} isSelected={(o) => form.interests.includes(o)} onPick={toggleInterest} />
        </div>
        <div className="form-field">
          <label htmlFor="goals">Tell us more</label>
          <textarea id="goals" rows={4} placeholder="Tell us in your own words — jawline, undereyes, texture, anything." value={form.goals} onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))} />
        </div>
        <div className="form-actions form-actions--end">
          <button type="submit" className="btn btn--primary">Continue</button>
        </div>
      </form>

      <form className="book-step" data-active={step === 2} onSubmit={submitStep2} noValidate>
        <div className="form-grid">
          <div className={`form-field${errors.firstName ? ' has-error' : ''}`}>
            <label htmlFor="firstName">First name</label>
            <input type="text" id="firstName" autoComplete="given-name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
            <span className="form-field__error">First name is required.</span>
          </div>
          <div className={`form-field${errors.lastName ? ' has-error' : ''}`}>
            <label htmlFor="lastName">Last name</label>
            <input type="text" id="lastName" autoComplete="family-name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
            <span className="form-field__error">Last name is required.</span>
          </div>
          <div className="form-field">
            <label htmlFor="phone">Mobile</label>
            <input type="tel" id="phone" placeholder="561-000-0000" autoComplete="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" autoComplete="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
        </div>
        {errors.contactMethod && <p className="form-field__error" style={{ display: 'block' }}>Please provide a mobile number or an email so we can reach you.</p>}
        <div className="form-field">
          <label>Patient status</label>
          <Pills options={PATIENT_OPTIONS} isSelected={(o) => form.patient === o} onPick={(o) => setForm((f) => ({ ...f, patient: o }))} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={() => setStep(1)}>Back</button>
          <button type="submit" className="btn btn--primary">Continue</button>
        </div>
      </form>

      <form className="book-step" data-active={step === 3} onSubmit={submitStep3} noValidate>
        <p className="form-callout">This step is how we track what&apos;s actually bringing patients in — word of mouth, a Google search, an ad. It takes five seconds and helps us spend our marketing budget on what&apos;s working.</p>
        <div className="form-field">
          <label>How did you hear about us?</label>
          <Pills options={[...SOURCES]} isSelected={(o) => form.source === o} onPick={(o) => setForm((f) => ({ ...f, source: o }))} />
        </div>
        {(form.source === 'Friend or family referral' || form.source === 'Existing patient') && (
          <div className="form-field">
            <label htmlFor="referrer">Who referred you? We&apos;ll thank them.</label>
            <input type="text" id="referrer" style={{ maxWidth: 420 }} value={form.referrer} onChange={(e) => setForm((f) => ({ ...f, referrer: e.target.value }))} />
          </div>
        )}
        <label className="checkbox-row">
          <input type="checkbox" checked={form.optIn} onChange={(e) => setForm((f) => ({ ...f, optIn: e.target.checked }))} />
          <span>Email me RENU specials, new treatments and event invitations.</span>
        </label>
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={() => setStep(2)}>Back</button>
          <button type="submit" className="btn btn--primary">Request consultation</button>
        </div>
      </form>
    </>
  );
}
