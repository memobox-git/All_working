import "server-only";
import { createClient } from "@supabase/supabase-js";
import { assertSupabaseConfigured, supabaseUrl } from "./env";

// Service role client. It bypasses RLS, so use it only in trusted server code
// (the worker, cron jobs, webhooks) and always filter by workspace_id yourself.
export function createAdminClient() {
  assertSupabaseConfigured();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set (see .env.example).");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
