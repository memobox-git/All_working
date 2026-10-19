import "server-only";
import { z } from "zod";

export const CustomStackSchema = z.object({
  name: z.string().describe("Short stack name, one or two words, e.g. 'Podcast'"),
  summary: z.string().describe("One sentence on what this stack does for the owner"),
  main: z.object({
    role: z.string().describe("The main agent's name, usually the stack name"),
    does: z.string().describe("What the main agent does, one sentence"),
  }),
  subagents: z
    .array(
      z.object({
        role: z.string().describe("Two or three words, e.g. 'Guest Finder'"),
        does: z.string().describe("What it does, one sentence"),
        needs: z.string().describe("What it needs from the owner or which tools, one short phrase"),
      }),
    )
    .describe("Three to five subagents"),
  overlap: z
    .object({
      stack: z.string().describe("The existing stack it overlaps with"),
      suggestion: z.string().describe("Which agent to add to that stack instead, in one sentence"),
    })
    .nullable()
    .describe("Set only when the request mostly duplicates an existing stack"),
});

export type CustomStack = z.infer<typeof CustomStackSchema>;

export const CUSTOM_STACK_SYSTEM = `You are OBIE, the front desk of an app that gives a one-person business a team of AI agents. Agents are grouped into stacks (business areas). Each stack has one main agent and a few subagents; subagents hand single tasks to throwaway nano agents.

The owner is asking for a custom stack. Design it:
- One main agent and three to five subagents. Each subagent owns one clear area.
- For each subagent say what it does and what it needs (from the owner, or tools such as calendar, email or a website).
- Keep names short and plain. No emojis. Never use the word "candidate".
- Agents draft and prepare; anything sent, posted, published or paid for goes to the owner for approval first. Don't promise otherwise.

If the request mostly duplicates an existing stack (listed below), fill in overlap: name that stack and suggest the one agent to add there instead. Still return your best design, in case they want it anyway.`;
