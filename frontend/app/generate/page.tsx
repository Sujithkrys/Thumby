import type { Metadata } from "next";
import { GenerateForm } from "@/components/generate/GenerateForm";
import { PreviewPanel } from "@/components/generate/PreviewPanel";

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
  return (
    <div className="flex gap-5 items-start h-full">
      {/* Left: Generation form panel (340px) */}
      <GenerateForm />

      {/* Right: Live preview panel (flex: 1) */}
      <PreviewPanel />
    </div>
  );
}
