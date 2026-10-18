import { after, type NextRequest } from "next/server";
import { draftMany, saveConnectedAccount, syncAccount } from "@/lib/inbox/store";
import { isUnipileSecret } from "@/lib/inbox/webhook-secret";

// The first sync and drafts run after the response, and can take a minute.
export const maxDuration = 300;

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Unipile calls this when the owner finishes signing in to LinkedIn on its
// hosted page. `name` is the workspace id OBIE put on the link.
export async function POST(request: NextRequest) {
  if (!isUnipileSecret(request.nextUrl.searchParams.get("secret"))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    status?: string;
    account_id?: string;
    name?: string;
  } | null;
  if (!body?.account_id || !body.name || !uuid.test(body.name)) {
    return Response.json({ ok: false, reason: "bad payload" }, { status: 400 });
  }
  if (body.status !== "CREATION_SUCCESS" && body.status !== "RECONNECTED") {
    return Response.json({ ok: true, ignored: body.status });
  }

  const account = await saveConnectedAccount(body.name, body.account_id, request.nextUrl.origin);
  if (!account) return Response.json({ ok: false, reason: "unknown workspace" }, { status: 404 });

  after(async () => {
    // A new account can take a few seconds before Unipile serves its chats.
    for (const wait of [5_000, 20_000]) {
      await new Promise((resolve) => setTimeout(resolve, wait));
      try {
        const threadIds = await syncAccount(account);
        await draftMany(account.workspace_id, threadIds);
        return;
      } catch (error) {
        console.error("first LinkedIn sync failed", error);
      }
    }
  });

  return Response.json({ ok: true });
}
