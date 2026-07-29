import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — Thumby",
};

export default function LoginPage() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
