import type { Metadata } from 'next';
import { Playfair_Display, Jost } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConditionalStickyBar from '@/components/ConditionalStickyBar';
import './globals.css';

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

// TODO: swap to https://renuforyou.com once DNS actually cuts over —
// metadataBase resolves every page's canonical/OG URLs from this.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://renumedspa.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'RENU Medical Aesthetics', template: '%s — RENU Medical Aesthetics' },
  description: 'Board-certified, non-surgical medical aesthetics in Stuart & Tequesta, FL — led by Dr. Valerie Barrett, MD.',
  openGraph: {
    siteName: 'RENU Medical Aesthetics',
    type: 'website',
    locale: 'en_US'
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <main id="main-content">{children}</main>
        <ConditionalStickyBar />
        <Footer />
      </body>
    </html>
  );
}
