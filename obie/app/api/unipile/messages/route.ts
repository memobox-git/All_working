import { after, type NextRequest } from "next/server";
import { draftIfStillNewest, recordWebhookMessage, type MessageWebhook } from "@/lib/inbox/store";
import { isUnipileSecret } from "@/lib/inbox/webhook-secret";

export const maxDuration = 120;

// Unipile calls this for every new LinkedIn message on a connected account,
// including ones the owner sends. Store it right away (Unipile wants a 200
// within 30 seconds), then draft a reply after the response.
export async function POST(request: NextRequest) {
  if (!isUnipileSecret(request.headers.get("unipile-auth"))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as MessageWebhook | null;
  if (!payload) return Response.json({ ok: false, reason: "bad payload" }, { status: 400 });

  // Throwing here returns a 500, so Unipile retries the delivery later.
  const toDraft = await recordWebhookMessage(payload);
  if (toDraft) {
    after(async () => {
      // Give them a moment to finish a burst of messages, then answer them all.
      await new Promise((resolve) => setTimeout(resolve, 8_000));
      await draftIfStillNewest(toDraft.workspaceId, toDraft.threadId, toDraft.messageId).catch((error) =>
        console.error("draft failed", toDraft.threadId, error),
      );
    });
  }
  return Response.json({ ok: true });
}
