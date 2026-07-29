"use client";

import { ImageIcon, Flag } from "lucide-react";

interface PreviewPanelProps {
  ratio?: "16:9" | "9:16" | "1:1";
  resultImageUrl?: string | null;
}

function getAspectRatio(ratio: "16:9" | "9:16" | "1:1"): string {
  if (ratio === "9:16") return "9 / 16";
  if (ratio === "1:1") return "1 / 1";
  return "16 / 9";
}

/**
 * Preview panel — right column of the generate view.
 * Shows dashed placeholder before generation, generated image after.
 */
export function PreviewPanel({ ratio = "16:9", resultImageUrl = null }: PreviewPanelProps) {
  const aspectRatio = getAspectRatio(ratio);

  return (
    <div className="flex-1 bg-white border border-border-light rounded-[--radius-card] p-6 flex flex-col min-h-[460px]">
      <span className="font-heading font-semibold text-[15px] text-ink mb-4">
        Preview
      </span>

      <div className="flex-1 flex items-center justify-center">
        {resultImageUrl ? (
          <div className="w-full max-w-[440px]">
            <img
              src={resultImageUrl}
              alt="Generated thumbnail"
              className="w-full object-cover rounded-[12px] block mb-[10px]"
              style={{ aspectRatio }}
            />
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-slate">
                Saved to your generations
              </span>
              <span className="text-[12px] text-slate flex items-center gap-1 cursor-pointer hover:text-ink">
                <Flag size={12} aria-hidden="true" /> Report
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-full max-w-[440px] border-[1.5px] border-dashed border-border-dashed rounded-[12px] flex flex-col items-center justify-center gap-[10px] text-slate"
            style={{ aspectRatio }}
          >
            <ImageIcon size={26} aria-hidden="true" />
            <span className="text-[12.5px]">
              Your thumbnail will appear here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
