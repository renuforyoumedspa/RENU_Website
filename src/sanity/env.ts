// Central place reading Sanity connection info from environment variables.
// PLACEHOLDER: projectId/dataset fall back to obviously-fake values so the
// app can still build before a real Sanity project exists — replace via
// .env.local (see .env.local.example) once you've created one at
// sanity.io/manage. dataset is almost always "production" by convention.

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-01';

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
);

// Sanity validates projectId as lowercase a-z/0-9/dashes only, so the
// placeholder has to satisfy that syntax even though it isn't a real
// project — a real one is required to actually connect (see .env.local.example).
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'replace-me-0000',
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
