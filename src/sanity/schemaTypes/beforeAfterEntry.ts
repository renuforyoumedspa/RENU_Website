import { defineField, defineType } from 'sanity';

// Reusable object — `timeframe` is a distinct field (not text baked into a
// caption string) per the practice owner's explicit request: the time
// between the two photos needs to be real structured data.
export const beforeAfterEntry = defineType({
  name: 'beforeAfterEntry',
  title: 'Before & After Entry',
  type: 'object',
  fields: [
    defineField({ name: 'patient', title: 'Patient label (never a real name)', type: 'string' }),
    defineField({ name: 'timeframe', title: 'Time between photos', type: 'string', description: 'e.g. "6 weeks apart" or "9 years apart"' }),
    defineField({ name: 'beforeImage', title: 'Before photo', type: 'image' }),
    defineField({ name: 'afterImage', title: 'After photo', type: 'image' })
  ],
  preview: {
    select: { title: 'patient', subtitle: 'timeframe' }
  }
});
