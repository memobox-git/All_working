import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// Supabase client for Client Components. Runs as the signed-in user, so RLS applies.
export function createClient() {
  assertSupabaseConfigured();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
