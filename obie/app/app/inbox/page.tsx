import { ObieOrb } from "@/components/obie-orb";

// On desktop this fills the right pane until a conversation is picked. On the
// phone the list takes the whole screen, so this pane is hidden.
export default function InboxHome() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <ObieOrb size={72} />
      <p className="mt-5 font-semibold">Pick a conversation</p>
      <p className="mt-1 max-w-xs text-sm text-muted">
        Conversations waiting on you are at the top, with a reply ready to read, edit and send.
      </p>
    </main>
  );
}
