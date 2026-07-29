import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

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
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
