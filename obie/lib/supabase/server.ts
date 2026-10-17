import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// Supabase client for Server Components, Route Handlers and Server Actions.
// Runs as the signed-in user, so RLS applies. Reading cookies makes the caller
// dynamic: in a page, keep it behind a <Suspense> boundary.
export async function createClient() {
  assertSupabaseConfigured();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can't set cookies. proxy.ts refreshes the
          // session on every request, so this is safe to ignore.
        }
      },
    },
  });
}
