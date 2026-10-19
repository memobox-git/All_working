import { z } from "zod";

// The Business Profile OBIE builds during onboarding. Every field can be
// empty until the owner has answered it.

export const TALK_CHANNELS = ["LinkedIn", "WhatsApp", "Slack", "Instagram", "Email", "Meetup", "Other"] as const;

export const BusinessProfileSchema = z.object({
  business_name: z.string().nullable().describe("The business or brand name"),
  offer: z.string().nullable().describe("What they sell"),
  price: z.string().nullable().describe("Price or price range, as the owner said it"),
  buyers: z.string().nullable().describe("Who buys it"),
  found_via: z.string().nullable().describe("Where customers find them"),
  talk_channels: z.array(z.enum(TALK_CHANNELS)).describe("Where they talk to customers"),
  talk_channels_other: z.string().nullable().describe("Other places they talk to customers, if 'Other'"),
  goal: z.string().nullable().describe("Their main goal"),
  goal_deadline: z.string().nullable().describe("When they want to hit the goal, e.g. 'by March 2027'"),
  hours_per_week: z.number().nullable().describe("Hours per week they can put in"),
  time_sinks: z.string().nullable().describe("What eats most of their time right now"),
  website: z.string().nullable().describe("Website or LinkedIn URL, if shared"),
  summary: z.string().nullable().describe("Two sentences describing the business"),
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;

export const emptyProfile: BusinessProfile = {
  business_name: null,
  offer: null,
  price: null,
  buyers: null,
  found_via: null,
  talk_channels: [],
  talk_channels_other: null,
  goal: null,
  goal_deadline: null,
  hours_per_week: null,
  time_sinks: null,
  website: null,
  summary: null,
};

// Fills gaps from a stored value so old or partial rows always render.
export function toProfile(value: unknown): BusinessProfile {
  const parsed = BusinessProfileSchema.partial().safeParse(value ?? {});
  return { ...emptyProfile, ...(parsed.success ? parsed.data : {}) };
}
