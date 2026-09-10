import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

// useCdn: false while we're actively editing content during setup/migration
// — the CDN is fine (and faster) once content is stable, but can serve
// slightly-stale reads for a minute or two after a write.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false
});
