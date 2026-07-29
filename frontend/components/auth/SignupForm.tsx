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
    } else {
      // Assuming auto-confirm is enabled or we just let them log in
      router.push("/gallery");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-[400px] p-8 bg-white border border-border-light rounded-[--radius-card] shadow-sm">
      <h1 className="font-heading text-[19px] text-ink mb-6 text-center">Create your account</h1>
      
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
        
        {error && <p className="text-flare text-[13px]">{error}</p>}
        
        <Button 
          variant="primary" 
          disabled={loading} 
          onClick={() => {}}
          className="mt-2"
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </form>
      
      <p className="mt-6 text-center text-slate text-[13px]">
        Already have an account? <Link href="/auth/login" className="text-ink font-semibold">Log in</Link>
      </p>
    </div>
  );
}
