import { defineField, defineType } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Short description (blog list + SEO)', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'pubDate', title: 'Publish date', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'draft', title: 'Draft (hidden from the live site)', type: 'boolean', initialValue: false }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] })
  ],
  preview: {
    select: { title: 'title', subtitle: 'pubDate' }
  }
});
