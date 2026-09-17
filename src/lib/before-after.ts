import { imageSrc } from '@/sanity/lib/image';
import type { BeforeAfterEntry } from '@/sanity/lib/queries';

// The one place that decides which of RENU's two real photo shapes an
// entry is — a single side-by-side composite, or two separate photos —
// and resolves it down to plain src strings (or 'placeholder' when no
// real image has been uploaded yet). Both the homepage's Before & After
// section and each treatment page's before/after grid call this so a
// site visitor sees the same tile shape regardless of which type an
// editor picked in the Studio.
export type ResolvedBeforeAfter =
  | { mode: 'paired'; src: string }
  | { mode: 'separate'; beforeSrc: string; afterSrc: string }
  | { mode: 'placeholder' };

export function resolveBeforeAfter(entry: BeforeAfterEntry): ResolvedBeforeAfter {
  if (entry.layout === 'sideBySide') {
    const src = imageSrc(entry.pairedImage);
    return src ? { mode: 'paired', src } : { mode: 'placeholder' };
  }
  const beforeSrc = imageSrc(entry.beforeImage);
  const afterSrc = imageSrc(entry.afterImage);
  return beforeSrc && afterSrc ? { mode: 'separate', beforeSrc, afterSrc } : { mode: 'placeholder' };
}
