// Shared, non-treatment site config — ported from the static prototype's
// site-data.js. Same rationale for staying in code rather than a content
// collection: these are form/quiz definitions and review stats, not
// repeatable content entries.

export const REVIEWS = {
  stuart: { location: "Stuart", count: 181, rating: 5.0 },
  tequesta: { location: "Tequesta", count: 98, rating: 4.9 }
};

export function getCombinedReviews() {
  const count = REVIEWS.stuart.count + REVIEWS.tequesta.count;
  const weighted = (REVIEWS.stuart.count * REVIEWS.stuart.rating + REVIEWS.tequesta.count * REVIEWS.tequesta.rating) / count;
  return { count, rating: Math.round(weighted * 10) / 10 };
}

export const SOURCES = [
  "Google search", "Google Maps / GBP", "Instagram", "Facebook", "TikTok",
  "Friend or family referral", "Existing patient", "Drove past the clinic",
  "Event or open house", "Print or mailer", "Other"
];

export const INTEREST_OPTIONS = [
  "Botox / neurotoxin", "Filler", "RENUlift™", "Ultherapy", "Laser resurfacing",
  "Lips", "Microneedling", "Body contouring", "Hair restoration", "Not sure yet"
];

export const QUIZ = [
  {
    q: "What bothers you most when you look in the mirror?",
    options: ["Lines and wrinkles", "Sagging or a softening jawline", "Skin texture, pores or scarring", "Volume loss — I look tired or hollow"],
    map: {
      "Lines and wrinkles": "Lines & wrinkles",
      "Sagging or a softening jawline": "Sagging & laxity",
      "Skin texture, pores or scarring": "Texture & tone",
      "Volume loss — I look tired or hollow": "Volume loss"
    } as Record<string, string>
  },
  { q: "How much downtime can you take?", options: ["None — I have plans this week", "A weekend", "A week if the result is worth it"] },
  { q: "Have you had aesthetic treatment before?", options: ["Never — this would be my first", "A little Botox or filler", "Regularly, for years"] },
  { q: "What's your timeline?", options: ["An event in the next month", "Next few months", "No rush, I want the best long-term result"] }
];
