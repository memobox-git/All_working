import type { BusinessProfile } from "./business-profile";

// Picks stacks and agents from the Business Profile with plain rules, so the
// owner can see exactly why each agent is (or isn't) on the team.

export type Blueprint = {
  id: string;
  slug: string | null;
  parent_id: string | null;
  stack: string;
  role: string;
  level: "main" | "sub" | "nano";
  description: string | null;
  is_custom: boolean;
  sort_order: number;
};

export type Pick = {
  blueprint: Blueprint;
  on: boolean;
  reason: string;
  weeklyCredits: number;
  depth: 0 | 1 | 2;
};

export type StackPick = { stack: string; title: string; main: Pick; agents: Pick[] };

export type CustomStackSuggestion = { name: string; reason: string; request: string };

// Rough weekly credits for an agent that's switched on (1 credit = $0.0015).
const CREDITS = { main: 40, sub: 25, platform: 15 };

const PLATFORMS: Record<string, RegExp> = {
  "marketing.social.youtube": /youtube/i,
  "marketing.social.linkedin": /linkedin/i,
  "marketing.social.instagram": /instagram|\binsta\b|\big\b/i,
  "marketing.social.tiktok": /tiktok|tik tok/i,
  "marketing.social.facebook": /facebook|\bfb\b/i,
  "marketing.social.x": /\btwitter\b|\bx\.com\b|\bon x\b|\bx\b(?= ?\(|,| and| or|\.)/i,
};

function signals(p: BusinessProfile) {
  const all = [
    p.offer,
    p.price,
    p.buyers,
    p.found_via,
    p.goal,
    p.time_sinks,
    p.summary,
    p.talk_channels_other,
    p.talk_channels.join(" "),
  ]
    .filter(Boolean)
    .join(" \n ");
  const has = (re: RegExp) => re.test(all);
  const reach = [p.found_via, p.talk_channels.join(" "), p.talk_channels_other].filter(Boolean).join(" ");
  const priceNumbers = (p.price ?? "").match(/\d[\d,]*/g)?.map((n) => Number(n.replace(/,/g, ""))) ?? [];
  return {
    has,
    reach,
    calls: has(/\bcall|coach|consult|session|discovery|demo|1[: -]?on[: -]?1|one[- ]on[- ]one|mentor/i),
    course: has(/course|cohort|curriculum|bootcamp|program|workshop|class|lesson|module/i),
    coaching: has(/coach|mentor|consult/i),
    highTicket: priceNumbers.some((n) => n >= 500) || has(/high[- ]ticket|premium|retainer/i),
    email: p.talk_channels.includes("Email") || has(/newsletter|email list|mailing list/i),
    community: p.talk_channels.includes("Meetup") || p.talk_channels.includes("Slack") || has(/community|meetup|discord|members|group/i),
    meetups: p.talk_channels.includes("Meetup") || has(/meetup|events?\b/i),
    podcast: has(/podcast/i),
    ads: has(/\bads?\b|advertis|paid (social|traffic|campaign)|sponsor/i),
    reviews: has(/review|testimonial|case stud|referral/i),
    payments: has(/invoice|payment|stripe|paypal|billing|refund/i),
    files: has(/files?\b|documents?|drive|notion|admin|paperwork/i),
    contentHeavy: has(/post|content|video|write|writing|youtube|linkedin|newsletter/i),
  };
}

export function recommendTeam(profile: BusinessProfile, blueprints: Blueprint[]) {
  const s = signals(profile);
  const catalog = blueprints.filter((b) => !b.is_custom && b.slug && b.stack !== "obie");
  const bySlug = new Map(catalog.map((b) => [b.slug!, b]));

  const rules: Record<string, () => [boolean, string]> = {
    "sales.inbound": () => [true, "Every business needs new leads answered quickly."],
    "sales.booking": () =>
      s.calls ? [true, "You sell through calls, so this agent books them."] : [false, "You don't mention selling on calls."],
    "sales.call_prep": () =>
      s.calls ? [true, "Researches each lead before your calls."] : [false, "Only needed if you sell on calls."],
    "sales.follow_up": () =>
      s.calls || s.highTicket
        ? [true, "Follows up after calls so no lead goes quiet."]
        : [false, "Your sale looks simple enough without follow-ups."],
    "sales.close": () =>
      s.highTicket ? [true, "Your price is high enough to need proposals."] : [false, "Your price doesn't need proposals."],
    "sales.pipeline": () =>
      s.calls || s.highTicket
        ? [true, "Keeps track of every deal toward your goal."]
        : [false, "Turn on once you have many deals in flight."],
    "marketing.strategy": () => [true, "Plans what to say each week toward your goal."],
    "marketing.content": () => [true, "Writes the posts, emails and scripts you need."],
    "marketing.social": () =>
      Object.values(PLATFORMS).some((re) => re.test(s.reach))
        ? [true, "You reach customers on social media."]
        : [false, "You don't mention social media."],
    "marketing.ads": () => (s.ads ? [true, "You run or plan to run ads."] : [false, "You don't mention ads."]),
    "marketing.nurture": () =>
      s.email ? [true, "You use email, so this warms up your list."] : [false, "You don't mention an email list."],
    "marketing.community": () =>
      s.community ? [true, "You run a community or meetups."] : [false, "You don't mention a community."],
    "customers.onboarding": () => [true, "Gives every new customer a great start."],
    "customers.support": () => [true, "Drafts answers to customer questions."],
    "customers.homework": () =>
      s.course || s.coaching
        ? [true, "You teach, so this reviews student work."]
        : [false, "Only needed if you teach or coach."],
    "customers.reviews": () =>
      s.reviews ? [true, "You care about reviews and testimonials."] : [false, "Turn on when you want testimonials."],
    "product.course_builder": () =>
      s.course ? [true, "You sell a course, so this builds lessons."] : [false, "You don't sell a course."],
    "product.materials": () =>
      s.course || s.coaching ? [true, "Makes worksheets and templates for clients."] : [false, "Only needed if you teach."],
    "operations.payments": () => [true, "Keeps an eye on invoices and payments."],
    "operations.files": () =>
      s.files ? [true, "You mention admin and documents."] : [false, "Turn on when your files get messy."],
    "operations.scheduling": () =>
      s.calls ? [true, "Manages your calendar around calls."] : [false, "You don't run many calls."],
  };
  for (const [slug, re] of Object.entries(PLATFORMS)) {
    const name = bySlug.get(slug)?.role ?? slug;
    rules[slug] = () => (re.test(s.reach) ? [true, `You use ${name}.`] : [false, `You don't use ${name}.`]);
  }

  const mains = catalog.filter((b) => b.level === "main").sort((a, b) => a.sort_order - b.sort_order);
  const stacks: StackPick[] = mains.map((main) => {
    const children = catalog.filter((b) => b.parent_id === main.id).sort((a, b) => a.sort_order - b.sort_order);
    const agents: Pick[] = [];
    for (const child of children) {
      const [on, reason] = rules[child.slug!]?.() ?? [true, child.description ?? ""];
      agents.push({ blueprint: child, on, reason, weeklyCredits: CREDITS.sub, depth: 1 });
      for (const grand of catalog.filter((b) => b.parent_id === child.id).sort((a, b) => a.sort_order - b.sort_order)) {
        const [gOn, gReason] = rules[grand.slug!]?.() ?? [false, grand.description ?? ""];
        agents.push({ blueprint: grand, on: on && gOn, reason: gReason, weeklyCredits: CREDITS.platform, depth: 2 });
      }
    }
    // A stack is worth having if any of its agents are.
    const on = agents.some((a) => a.on);
    return {
      stack: main.stack,
      title: main.role,
      main: { blueprint: main, on, reason: main.description ?? "", weeklyCredits: CREDITS.main, depth: 0 },
      agents,
    };
  });

  const suggestions: CustomStackSuggestion[] = [];
  if (s.meetups) {
    suggestions.push({
      name: "Community",
      reason: "You run meetups, which the default stacks only touch on.",
      request: "A Community stack that plans meetups, invites members, writes event recaps and keeps the group active.",
    });
  }
  if (s.podcast) {
    suggestions.push({
      name: "Podcast",
      reason: "You mention a podcast.",
      request: "A Podcast stack that finds guests, preps episodes and writes show notes.",
    });
  }

  return { stacks, suggestions };
}

export function weeklyCredits(stacks: StackPick[]) {
  return stacks.reduce(
    (sum, s) => sum + (s.main.on ? s.main.weeklyCredits : 0) + s.agents.reduce((a, p) => a + (p.on ? p.weeklyCredits : 0), 0),
    0,
  );
}
