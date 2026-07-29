"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user && !data.session) {
      setError("Success! Please check your email to confirm your account before logging in.");
      setLoading(false);
    } else {
      // Assuming auto-confirm is enabled or we just let them log in
      router.push("/gallery");
      router.refresh();
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] p-8 bg-white border border-border-light rounded-[--radius-card] shadow-sm">
      <h1 className="font-heading text-[19px] text-ink mb-6 text-center">Create your account</h1>
      
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 bg-white border border-border-medium rounded-[--radius-button] py-[9px] text-[14px] font-semibold text-ink hover:bg-studio transition-colors mb-5 cursor-pointer disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px bg-border-light flex-1"></div>
        <span className="text-[12px] text-slate font-medium">OR</span>
        <div className="h-px bg-border-light flex-1"></div>
      </div>

      {error && !error.includes("Success") && <p className="text-flare text-[13px]">{error}</p>}
      
      {error && error.includes("Success") ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 bg-studio rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <h2 className="font-heading text-[17px] text-ink mb-2">Check your email</h2>
          <p className="text-slate text-[13px] mb-6">
            We've sent a confirmation link to <span className="font-semibold text-ink">{email}</span>. Please click the link to verify your account.
          </p>
          <Link href="/auth/login" className="text-[13px] font-semibold text-ink hover:underline">
            Return to Log in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={setName}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />
            
            <Button 
              variant="primary" 
              disabled={loading} 
              onClick={() => {}}
              className="mt-2"
            >
              {loading ? "Signing up..." : "Sign up with Email"}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-slate text-[13px]">
            Already have an account? <Link href="/auth/login" className="text-ink font-semibold">Log in</Link>
          </p>
        </>
      )}
    </div>
  );
}
