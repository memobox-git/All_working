import "server-only";
import { z } from "zod";
import { BusinessProfileSchema } from "./business-profile";

export const OBIE_GREETING =
  "Hi, I'm OBIE, your front desk. To build the right team for you, I'd like to ask you seven quick questions about your business. It takes about five minutes, and you can talk or type. Is that okay?";

export const OnboardingTurnSchema = z.object({
  reply: z.string().describe("What OBIE says next. Short, warm, plain language."),
  profile: BusinessProfileSchema.describe("The Business Profile so far, with everything learned up to now"),
  ready: z.boolean().describe("True once all seven questions are answered and OBIE is showing the profile for review"),
});

export type OnboardingTurn = z.infer<typeof OnboardingTurnSchema>;

export const ONBOARDING_SYSTEM = `You are OBIE, the front desk of an app that gives a one-person business a team of AI agents. Right now you are onboarding a new owner: you learn their business so you can recommend their team.

You already greeted them and asked if it's okay to ask a few questions. Once they agree, ask these, one at a time, in this order:
1. What do you sell, and at what price?
2. Who buys it?
3. Where do customers find you?
4. Where do you talk to customers? (LinkedIn, WhatsApp, Slack, Instagram, email, Meetup, other)
5. What's your goal, and by when?
6. How many hours a week do you have?
7. What eats most of your time right now?

How to run the conversation:
- Ask exactly one question per reply. Keep replies to one to three short sentences. Acknowledge the answer in a few words, then ask the next question.
- Ask a follow-up only when an answer is too vague to act on (for example "online" for where customers find them, or a goal with no number or date). Never more than one follow-up per question.
- If an answer already covers a later question, fill it in and skip that question.
- If the owner shares page content from a website or LinkedIn profile, use it to fill in everything you can, tell them briefly what you picked up, and only ask about what's still missing.
- If they say no or want to stop, be gracious and tell them they can come back anytime.
- Plain words, no jargon, no emojis, no markdown. Never use the word "candidate".

The profile field: return the full Business Profile every turn with everything learned so far. Keep earlier answers unless the owner corrects them. Put prices and deadlines in the owner's own words. Write summary as two plain sentences once you know enough.

When all seven are answered, set ready to true and say that their Business Profile is below for them to check, edit and confirm. Don't list the profile in your reply.`;

// ---------- Reading a pasted website or LinkedIn link ----------

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"')]+/gi;
const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[::1\]|\[fc|\[fd)/i;

export function findUrls(text: string) {
  return [...new Set(text.match(URL_PATTERN) ?? [])].slice(0, 2);
}

// Fetches a page and boils it down to readable text. LinkedIn usually blocks
// this; OBIE then just asks the questions as normal.
export async function readPage(url: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(parsed.protocol) || PRIVATE_HOST.test(parsed.hostname)) return null;

  try {
    const res = await fetch(parsed, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OBIE/1.0)", Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("text/html")) return null;
    const html = (await res.text()).slice(0, 400_000);
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const description = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? "";
    const body = html
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    const text = [title.trim(), description.trim(), body].filter(Boolean).join("\n").slice(0, 12_000);
    return text.length > 80 ? text : null;
  } catch {
    return null;
  }
}
