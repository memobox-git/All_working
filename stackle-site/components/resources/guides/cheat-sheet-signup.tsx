"use client";

import { useId, useState, type FormEvent } from "react";
import { joinWaitlist } from "@/lib/supabase";
import { Pixel } from "@/components/icons";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type State = "idle" | "sending" | "invalid" | "joined" | "already" | "error";

// Optional "email me new cheat sheets" sign-up. Adds the address to the waitlist with a source tag;
// the PDF itself is never gated behind it.
export function CheatSheetSignup({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const id = useId();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setState("invalid");
      return;
    }
    setState("sending");
    try {
      setState(await joinWaitlist(email, source));
    } catch {
      setState("error");
    }
  };

  if (state === "joined" || state === "already") {
    return (
      <p role="status" className="flex items-center gap-3 rounded-[12px] bg-fill px-4 py-4 text-[15px] leading-[1.55] text-ink">
        <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-paper">
          <Pixel name="check" size={15} />
        </span>
        <span>
          {state === "joined"
            ? "You're on the list. We'll email you when a new cheat sheet is out."
            : "You're already on the list, so there's nothing else to do."}
        </span>
      </p>
    );
  }

  const message =
    state === "invalid"
      ? "Enter a valid email address, like name@example.com."
      : state === "error"
        ? "Something went wrong. Please try again in a moment."
        : "";

  return (
    <form noValidate onSubmit={onSubmit}>
      <label htmlFor={`${id}-email`} className="text-[14px] font-semibold text-ink-2">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          className="field"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid" || state === "error") setState("idle");
          }}
          aria-invalid={state === "invalid" ? true : undefined}
          aria-describedby={`${id}-msg`}
        />
        <button type="submit" className="btn btn-ink sm:shrink-0" disabled={state === "sending"}>
          {state === "sending" ? "Adding you..." : "Email me"}
        </button>
      </div>
      <p id={`${id}-msg`} role="status" aria-live="polite" className="t-small mt-3 min-h-[1.55em] text-ink">
        {message}
      </p>
    </form>
  );
}
