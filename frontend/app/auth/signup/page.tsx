import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up — Thumby",
  description: "Create your Thumby account and start generating thumbnails.",
};

/**
 * Signup page.
 * Build order: Phase 2 (Auth).
 */
export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[480px]">
      <div className="w-[380px] bg-white border border-border-light rounded-[--radius-card] p-8">
        <h1 className="font-heading font-semibold text-[19px] text-ink mb-2">
          Create your account
        </h1>
        <p className="text-[13px] text-slate mb-6">
          Start generating thumbnails in seconds.
        </p>

        {/* TODO: Supabase Auth form — email + OAuth */}
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-slate mb-1.5">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio"
            />
          </div>
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
            Sign up
          </button>
        </div>

        <p className="text-[12px] text-slate mt-4 text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-flare font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
