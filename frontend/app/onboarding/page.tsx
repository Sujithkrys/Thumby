"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Pre-fill name if available in user_metadata
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.name) {
        setName(user.user_metadata.name);
      } else if (user?.email) {
        setName(user.email.split("@")[0]);
      }
    });
  }, []);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    // 1. Update user_metadata to set onboarded = true and save name
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name,
        onboarded: true,
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Update profiles table with the new name
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);

    if (dbError) {
      setError("Failed to update profile details.");
      setLoading(false);
      return;
    }

    // 3. Redirect to gallery
    router.push("/gallery");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-studio items-center justify-center p-6">
      <div className="w-full max-w-[400px] p-8 bg-white border border-border-light rounded-[--radius-card] shadow-sm">
        <h1 className="font-heading text-[19px] text-ink mb-2 text-center">Welcome to Thumby</h1>
        <p className="text-slate text-[13px] text-center mb-6">Let's get to know you before you start generating.</p>
        
        <form onSubmit={handleOnboard} className="flex flex-col gap-4">
          <Input
            label="What should we call you?"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={setName}
          />
          
          {error && <p className="text-flare text-[13px]">{error}</p>}
          
          <Button 
            variant="primary" 
            disabled={loading} 
            onClick={() => {}}
            className="mt-4"
          >
            {loading ? "Saving..." : "Continue to Gallery"}
          </Button>
        </form>
      </div>
    </div>
  );
}
