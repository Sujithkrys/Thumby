import { NextResponse } from "next/server";

/**
 * Supabase Auth callback route.
 * Handles the redirect after OAuth or magic link authentication.
 * Build order: Phase 2 (Auth).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/gallery";

  if (code) {
    // TODO: Exchange code for session using Supabase server client
    // const supabase = createServerClient(...)
    // await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url));
}
