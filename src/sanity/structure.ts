import type { StructureResolver } from 'sanity/structure';

// Custom desk structure — mostly Sanity's default, but groups documents
// under friendlier top-level labels so a non-technical editor sees
// "Treatments" / "Blog Posts" / "Shop Products" rather than a flat,
// alphabetical document type list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('RENU Content')
    .items([
      S.documentTypeListItem('treatment').title('Treatments'),
      S.documentTypeListItem('blogPost').title('Blog Posts'),
      S.documentTypeListItem('product').title('Shop Products')
    ]);
