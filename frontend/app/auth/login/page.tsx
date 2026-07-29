import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — Thumby",
  description: "Log in to your Thumby account to generate thumbnails.",
};

/**
 * Login page.
 * Build order: Phase 2 (Auth).
 */
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[480px]">
      <div className="w-[380px] bg-white border border-border-light rounded-[--radius-card] p-8">
        <h1 className="font-heading font-semibold text-[19px] text-ink mb-2">
          Welcome back
        </h1>
        <p className="text-[13px] text-slate mb-6">
          Log in to generate thumbnails.
        </p>

        {/* TODO: Supabase Auth form — email + OAuth */}
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-slate mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio"
            />
          </div>
          <div>
            <label className="block text-[12px] text-slate mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio"
            />
          </div>
          <button className="w-full p-[13px] rounded-[11px] border-none bg-flare text-flare-muted font-body text-[14px] font-semibold cursor-pointer">
            Log in
          </button>
        </div>

        <p className="text-[12px] text-slate mt-4 text-center">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-flare font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
