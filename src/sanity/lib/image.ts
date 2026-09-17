import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { dataset, isSanityConfigured, projectId } from '../env';

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// Every image field on every schema (treatment.image, teamMember.photo,
// galleryTile.image, beforeAfterEntry's before/after/paired photos) comes
// through this instead of urlForImage directly, because in mock-data mode
// those fields hold a plain "/assets/..." string (a local public/ file),
// not a real Sanity asset reference — this is the one place that tells
// the two apart, so every component can stay agnostic of which mode it's
// rendering in.
export function imageSrc(image: unknown): string | null {
  if (!image) return null;
  if (!isSanityConfigured) return typeof image === 'string' ? image : null;
  return urlForImage(image as SanityImageSource).url();
}
