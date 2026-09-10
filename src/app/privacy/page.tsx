import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for RENU Medical Aesthetics.',
  alternates: { canonical: '/privacy/' },
  robots: { index: false, follow: true } // draft legal text — see page content
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-header page-header--narrow">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">Privacy Matters at RENU</span>
          <h1 className="page-header__title">Our Commitment to Your Privacy</h1>
          <p className="page-header__lead">Discover how RENU Medical Aesthetics prioritizes your privacy and safeguards your personal information. This is drafted text pending final review by counsel — not legal advice, and not yet published to patients.</p>
        </div>
      </section>

      <div className="split-body" style={{ maxWidth: 820, display: 'block', paddingBlock: '56px 90px' }}>
        <div className="privacy-section">
          <div>
            <h2>Our Privacy Commitment</h2>
            <p>At RENU Medical Aesthetics, we are dedicated to ensuring the confidentiality and security of your personal information. Our privacy policy reflects our commitment to transparency and integrity in handling your data. We adhere to stringent privacy standards to protect your information and provide you with peace of mind. Our team is continuously working to enhance our privacy measures and stay ahead of any potential threats, ensuring that your data is always safe with us.</p>
          </div>

          <div>
            <h2>Personal Data Collection and Usage</h2>
            <p style={{ margin: '10px 0 16px' }}>What we collect, why, how long we keep it, and who (if anyone) it&apos;s shared with:</p>
            <div style={{ overflowX: 'auto' }}>
              <table className="crm-table" aria-label="Personal data collection and usage">
                <thead>
                  <tr><th>Type of Data</th><th>Purpose of Collection</th><th>Retention Period</th><th>Sharing Policy</th></tr>
                </thead>
                <tbody>
                  <tr><td>Contact Information</td><td>To communicate updates and offers</td><td>Stored for 2 years</td><td>Shared with service providers only</td></tr>
                  <tr><td>Usage Data</td><td>To improve user experience</td><td>Kept for 1 year</td><td>Not shared externally</td></tr>
                  <tr><td>Transaction Details</td><td>To process payments and orders</td><td>Maintained for 3 years</td><td>Shared with payment processors only</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2>Protected Health Information</h2>
            <p><em>Not on the live site&apos;s current privacy page — added here because it&apos;s a real gap for a medical practice, not a stylistic choice.</em> Information you share about your health, goals, or treatment history is treated as Protected Health Information (PHI) under HIPAA from the moment you submit it, even through a marketing-facing form like our booking or contact page. Clinical records are kept in a separate, access-controlled system from our general marketing and email tools — the two are never merged.</p>
          </div>

          <div>
            <h2>Privacy Policy FAQs</h2>
            <div className="detail-faqs">
              <details><summary>What personal data do we collect?</summary><p>We collect information such as your name, email address, and phone number when you interact with our website or services.</p></details>
              <details><summary>How is my data used?</summary><p>Your data is used to enhance your experience, process transactions, and communicate with you about our services.</p></details>
              <details><summary>Is my information shared with third parties?</summary><p>We do not sell your personal information. However, we may share data with trusted partners to provide better services.</p></details>
              <details><summary>How can I access my personal data?</summary><p>You can request access to your personal data by contacting us through the information below.</p></details>
              <details><summary>What are my rights regarding my data?</summary><p>You have the right to request correction, deletion, or restriction of your personal data at any time.</p></details>
            </div>

            <div className="financing-panel" style={{ marginTop: 24 }}>
              <div className="contact-panel__row"><strong>Phone</strong><a href="tel:5614066123">561-406-6123</a></div>
              <div className="contact-panel__row" style={{ marginTop: 14 }}><strong>Email</strong><a href="mailto:info@RENUforyou.com" style={{ color: 'var(--renu-purple)' }}>info@RENUforyou.com</a></div>
              <div className="contact-panel__row" style={{ marginTop: 14 }}><strong>Stuart</strong><span>845 SE Osceola Street, Stuart, FL 34994</span></div>
              <div className="contact-panel__row" style={{ marginTop: 14 }}><strong>Tequesta</strong><span>304 Tequesta Drive, Suite 300, Tequesta, FL 33469</span></div>
            </div>
          </div>

          <div>
            <h2>Privacy Policy Terms</h2>
            <p style={{ marginBottom: 16 }}><strong>Data Collection.</strong> We collect personal data to improve our services and ensure a personalized experience for our users.</p>
            <p style={{ marginBottom: 16 }}><strong>Data Usage.</strong> Your information is used in accordance with privacy laws to provide and enhance our services.</p>
            <p style={{ marginBottom: 16 }}><strong>Third-Party Sharing.</strong> We may share your data with third-party service providers to facilitate our operations, subject to strict confidentiality agreements.</p>
            <p style={{ marginBottom: 16 }}><strong>User Rights.</strong> You have the right to access, modify, or delete your personal data by contacting us directly.</p>
            <p><strong>Policy Updates.</strong> We reserve the right to update our privacy policy at any time. Changes will be communicated through our website.</p>
          </div>

          <div>
            <h2>Review Our Privacy Policy</h2>
            <p>We invite you to carefully review our privacy policy to understand how we protect your personal information. If you have any questions or concerns, please reach out to RENU Medical Aesthetics. Your privacy is our priority, and we&apos;re here to assist you.</p>
            <div style={{ marginTop: 16 }}>
              <Link href="/contact/" className="btn btn--primary">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
