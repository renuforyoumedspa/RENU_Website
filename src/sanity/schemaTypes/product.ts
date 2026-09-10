import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({ name: 'brand', title: 'Brand', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Product name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'name', maxLength: 96 } }),
    defineField({ name: 'note', title: 'One-line note', type: 'text', rows: 2 }),
    defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "$165"' }),
    defineField({ name: 'image', title: 'Product image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'buyUrl', title: 'External "Buy" link (hosted store)', type: 'url' })
  ],
  preview: {
    select: { title: 'name', subtitle: 'brand' }
  }
});
