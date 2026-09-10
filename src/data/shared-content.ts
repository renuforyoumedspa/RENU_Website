// Shared defaults for treatment detail pages — used when a treatment's own
// Markdown frontmatter doesn't override visitSteps/faqs/beforeAfters. Kept
// as code (not CMS-editable) for now since these apply site-wide; could
// become a Decap "settings" singleton later if the client wants to edit
// this copy without a developer.

export const DEFAULT_VISIT_STEPS = [
  { text: "Full-face consultation with Dr. Barrett — photographs, assessment, and an honest read on whether this is the right treatment." },
  { text: "Numbing where it applies, then the treatment itself." },
  { text: "Aftercare instructions in writing, plus a direct line if anything surprises you." },
  { text: "Follow-up photos at the interval that matches this treatment." }
];

export const DEFAULT_FAQS = [
  { q: "Will I look overdone?", a: "No. Dr. Barrett's practice is built on conservative dosing and staged plans — you can always add, and patients routinely come back for a second, smaller session rather than one dramatic one." },
  { q: "Does it hurt?", a: "Most patients describe pressure rather than pain. Topical numbing is standard where it helps, and we can pause at any point." },
  { q: "How soon can I go back to work?", a: "See the downtime figure above. For most injectable treatments patients return the same day; laser and thread treatments need a short social buffer." },
  { q: "What does it cost?", a: "Pricing depends on units, syringes or sessions, so it's quoted at consultation. Financing is available." }
];

export const DEFAULT_BEFORE_AFTERS = [
  { patient: "Patient A", timeframe: "6 weeks apart" },
  { patient: "Patient B", timeframe: "3 months apart" },
  { patient: "Patient C", timeframe: "8 months apart" },
  { patient: "Patient D", timeframe: "1 year apart" }
];
