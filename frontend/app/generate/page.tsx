import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { GenerateClient } from "./GenerateClient";

export const metadata: Metadata = {
  title: "Generate — Thumby",
  description:
    "Create a professional thumbnail with AI. Enter your prompt, pick a reference, choose quality and aspect ratio, and generate.",
};

export default function GeneratePage() {
  return <GenerateClient />;
}
