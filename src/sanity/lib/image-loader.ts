// next/image loader (wired up in next.config.ts → images.loaderFile).
//
// Sanity photos are resized and delivered by Sanity's own image CDN
// (cdn.sanity.io) instead of Netlify's image service — same sizes and
// formats, but the bandwidth is no longer billed against Netlify credits.
// Those images were ~70% of every page view's bytes.
//
// Local files in /public (hero, logo, banner, clinic photos) are served
// as-is from Netlify's CDN — a custom loader turns off Next's built-in
// /_next/image optimizer, so those files are kept pre-sized and compressed
// (all under ~130 KB). Add new local images already web-sized.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('https://cdn.sanity.io/')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality || 75));
    url.searchParams.set('auto', 'format'); // WebP/AVIF when the browser supports it
    url.searchParams.set('fit', 'max'); // never upscale past the original
    return url.toString();
  }
  // ?w= keeps each srcset entry distinct (Next requires the loader to use
  // the width); the static file server ignores it.
  return `${src}?w=${width}`;
}
