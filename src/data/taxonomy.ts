// Treatment taxonomy — the options for the three filters on /treatments.
// Each treatment can carry several of each (e.g. Sculptra® is both Face
// and Body), so filtering is "has this tag", never "equals".
//
// Mirrored in renu-studio/schemaTypes/treatment.ts (the Studio is a
// separate app and can't import from here) — keep the two lists in sync.
//
// "Radio Frequency" was requested for Technology but is held back until
// the clinic confirms which treatments use it — an option with no
// treatments would only ever show "No treatment matches".

export const AREAS = ['Face', 'Body', 'Skin', 'Chest / Décolleté', 'Hair'] as const;

export const CONCERNS = [
  'Lines & wrinkles',
  'Volume loss',
  'Sagging & laxity',
  'Jowls',
  'Nasolabial folds / Marionette lines',
  'Texture & tone',
  'Pigment',
  'Acne',
  'Scars',
  'Lips',
  'Contour',
  'Hair loss',
  'Cellulite'
] as const;

export const TECHS = ['Injectable', 'Thread', 'Laser', 'Energy', 'Microneedling', 'Skin Care'] as const;

export type Area = (typeof AREAS)[number];
export type Concern = (typeof CONCERNS)[number];
export type Tech = (typeof TECHS)[number];

// "Face, Body and Skin" — for generated sentences on treatment pages.
export function listToSentence(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
