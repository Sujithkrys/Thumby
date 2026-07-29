import type { Metadata } from "next";
import { GenerateClient } from "./GenerateClient";

export const metadata: Metadata = {
  title: "Generate — Thumby",
  description:
    "Create a professional thumbnail with AI. Enter your prompt, pick a reference, choose quality and aspect ratio, and generate.",
};

/**
 * Generate page — two-column layout: form (left) + preview (right).
 * Build order: Phase 3 (requires auth).
 */
export default function GeneratePage() {
  return <GenerateClient />;
}
