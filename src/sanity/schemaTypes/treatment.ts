import { defineField, defineType } from 'sanity';

const AREAS = ['Face', 'Body', 'Skin'];
const TECHS = ['Injectable', 'Laser', 'Energy', 'Thread', 'Topical'];
const CONCERNS = [
  'Lines & wrinkles', 'Volume loss', 'Sagging & laxity', 'Texture & tone',
  'Pigment', 'Acne scars', 'Lips', 'Contour', 'Hair loss', 'Cellulite'
];

export const treatment = defineType({
  name: 'treatment',
  title: 'Treatment',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      // No `source` auto-derivation on purpose: SEO URL-matching means this
      // must be settable independently of the display name (e.g. matching
      // a legacy renuforyou.com path exactly), not auto-slugified from it.
      options: { maxLength: 96 },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'legacyUrls',
      title: 'Legacy URLs to redirect (one per line)',
      description: 'Old renuforyou.com paths that should 301-redirect to this treatment, e.g. /botox-jupiter-stuart',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({ name: 'area', title: 'Area', type: 'string', options: { list: AREAS }, validation: (r) => r.required() }),
    defineField({ name: 'concern', title: 'Concern', type: 'string', options: { list: CONCERNS }, validation: (r) => r.required() }),
    defineField({ name: 'tech', title: 'Technology', type: 'string', options: { list: TECHS }, validation: (r) => r.required() }),
    defineField({ name: 'cta', title: 'Booking button text (its own call-to-action verb)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'blurb', title: 'One-line description', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({
      name: 'image',
      title: 'Treatment hero image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'object',
      fields: [
        defineField({ name: 'visitLength', title: 'Visit length', type: 'string' }),
        defineField({ name: 'downtime', title: 'Downtime', type: 'string' }),
        defineField({ name: 'resultsShow', title: 'Results show', type: 'string' }),
        defineField({ name: 'lasts', title: 'Lasts', type: 'string' })
      ]
    }),
    defineField({
      name: 'beforeAfters',
      title: 'Before & after photos',
      description: 'Leave empty to use the site-wide default set.',
      type: 'array',
      of: [{ type: 'beforeAfterEntry' }]
    }),
    defineField({
      name: 'visitSteps',
      title: 'How the visit goes (leave empty for site-wide default)',
      type: 'array',
      of: [{ type: 'object', name: 'step', fields: [{ name: 'text', type: 'string' }] }]
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs (leave empty for site-wide default)',
      type: 'array',
      of: [{ type: 'object', name: 'faq', fields: [{ name: 'q', title: 'Question', type: 'string' }, { name: 'a', title: 'Answer', type: 'text' }] }]
    }),
    defineField({
      name: 'body',
      title: 'What it treats (page body)',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ],
  preview: {
    select: { title: 'name', subtitle: 'area' }
  }
});
