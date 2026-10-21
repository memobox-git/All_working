// Everything about Stackle that more than one page uses. Numbers come from Chris's own material
// (the channel intro script and the content plan in stackle-video/), so update them here when they change.

export const site = {
  name: "Stackle",
  url: "https://stackle.io",
  tagline: "Live cohorts in data and AI engineering, taught by an engineer who hires.",
  description:
    "Stackle runs live cohorts in data engineering and AI engineering, taught by Chris (Crispus Roshan): 10+ years in data engineering and 200+ engineers interviewed. Real projects, mock interviews and free career resources.",
  email: "hello@stackle.io",
  legalEmail: "legal@stackle.io",
  privacyEmail: "privacy@stackle.io",
  // The old Lovable app keeps running here for sign-in, checkout and the learner dashboard.
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://learn.stackle.io",
  // The free AI resume coach (a separate app on Vercel).
  coachUrl: "https://app.stackle.io",
  bookCall: "https://calendar.app.google/gCDaTk9dCAgLUJAZ9",
  newsletter: "https://crispusroshan.substack.com/subscribe",
  gaId: "G-805Y4K5PCP",
  // Add the YouTube channel here once its handle is final.
  socials: {
    linkedin: "https://www.linkedin.com/in/crispusroshan",
    meetup: "https://www.meetup.com/stackle-your-career-lab",
    substack: "https://crispusroshan.substack.com",
  },
};

export const instructor = {
  name: "Chris",
  fullName: "Crispus Roshan",
  role: "Founder, Stackle",
  photo: "/img/chris-640.jpg",
  bio: "Chris has spent more than 10 years in data engineering and has interviewed over 200 engineers for companies in healthcare, banking, automotive and financial exchanges. He has also sat on the other side of the table, holding offers from several big tech companies at once. Stackle is where he teaches what gets people hired, and what gets them rejected.",
  // Two-sentence version for the homepage.
  bioShort: "Chris has spent more than 10 years in data engineering and has interviewed over 200 engineers for companies in healthcare, banking, automotive and financial exchanges. Stackle is where he teaches what gets people hired, and what gets them rejected.",
  facts: [
    "10+ years in data engineering",
    "200+ engineers interviewed",
    "Interviewed for companies in healthcare, banking, automotive and financial exchanges",
    "Offers from several big tech companies at the same time",
  ],
  industries: ["Healthcare", "Banking", "Automotive", "Financial exchanges"],
};

// Community numbers from the 47-second intro (git 9f1b913) and stackle-video/plan/content-plan.md.
export const proof = [
  { value: "10+", label: "Years in data engineering" },
  { value: "200+", label: "Engineers interviewed" },
  { value: "13K", label: "Followers on LinkedIn" },
  { value: "3.9K", label: "Meetup community" },
  { value: "511", label: "At one free Claude workshop" },
];

export const nav = [
  { href: "/courses", label: "Academy" },
  { href: "/career", label: "Career" },
  { href: "/resources", label: "Resources" },
  { href: "/#faq", label: "FAQ" },
];
