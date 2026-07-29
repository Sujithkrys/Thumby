import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Thumby",
};

export default function SignupPage() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <SignupForm />
    </div>
  );
}
