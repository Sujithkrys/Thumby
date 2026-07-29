import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client — for client components.
 * Used for: gallery reads, favourites CRUD, profile reads, auth state.
 *
 * Environment variables must be set:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
