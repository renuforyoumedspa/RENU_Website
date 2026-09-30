import type { Metadata } from 'next';
import { Playfair_Display, Jost } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConditionalStickyBar from '@/components/ConditionalStickyBar';
import './globals.css';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, siteJsonLd, jsonLdScript } from '@/lib/seo';

// Self-hosted via next/font — no external Google Fonts request at
// runtime (an actual SEO/performance improvement over the previous
// Astro build's <link> tag: no render-blocking third-party request,
// automatic font-display: swap, and no layout shift once loaded).
const playfair = Playfair_Display({
  variable: '--font-display-family',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic']
});

const jost = Jost({
  variable: '--font-body-family',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600']
});

// Content comes from Sanity. Pages are pre-built, then re-fetched from
// Sanity at most once every 60 seconds, so edits published in the Studio
// show on the live site within about a minute — no redeploy needed.
// Applies to every page (a page can export its own lower value).
export const revalidate = 60;

// metadataBase resolves every page's canonical and social-share URLs.
// Titles: pages set the specific part; the template appends the brand.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Kept under ~60 characters so Google shows it in full.
    default: 'RENU Medical Aesthetics | Med Spa in Stuart & Tequesta, FL',
    template: `%s | ${SITE_NAME}`
  },
  // ~155 characters: Google cuts longer descriptions off mid-sentence.
  description: 'Physician-led med spa in Stuart & Tequesta, FL. Dr. Valerie Barrett, MD offers Botox, fillers, RENUlift™, Ultherapy® and laser treatments near Jupiter.',
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1672, height: 941, alt: SITE_NAME }]
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  formatDetection: { telephone: true, address: true }
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body>
        {/* Business, both clinics and Dr. Barrett — powers Google's local
            knowledge panel and rich results. See src/lib/seo.ts. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(siteJsonLd())} />
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <main id="main-content">{children}</main>
        <ConditionalStickyBar />
        <Footer />
      </body>
    </html>
  );
}
