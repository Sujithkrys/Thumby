"use client";

import { Star } from "lucide-react";
import type { GalleryThumbnail } from "@/lib/types";

interface ThumbnailCardProps {
  item: GalleryThumbnail;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onUse: (item: GalleryThumbnail) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  gaming: "Gaming",
  tech: "Tech",
  vlogs: "Vlogs",
  beauty: "Beauty",
  finance: "Finance",
};

/**
 * Thumbnail card component.
 * Shows: image (128px height), aspect-ratio badge (top-left),
 * star toggle (top-right), title, category pill, popularity %.
 * Clicking the image uses it as a generation reference.
 */
export function ThumbnailCard({
  item,
  isFav,
  onToggleFav,
  onUse,
}: ThumbnailCardProps) {
  return (
    <div className="bg-white border border-border-light rounded-[--radius-card] overflow-hidden">
      {/* Image area */}
      <div className="relative">
        <button
          onClick={() => onUse(item)}
          className="block w-full p-0 border-none cursor-pointer bg-none"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-[128px] object-cover block bg-studio"
          />
        </button>

        {/* Aspect ratio badge */}
        <span className="absolute top-[9px] left-[9px] bg-ratio-badge-bg text-studio font-mono text-[11px] px-[7px] py-[3px] rounded-[--radius-badge] pointer-events-none">
          {item.aspectRatio}
        </span>

        {/* Favourite star */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(item.id);
          }}
          className="absolute top-[9px] right-[9px] cursor-pointer leading-none"
        >
          <Star
            size={17}
            fill={isFav ? "var(--color-gold)" : "none"}
            color={isFav ? "var(--color-gold)" : "white"}
            style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }}
          />
        </span>
      </div>

      {/* Card body */}
      <div className="p-[11px_13px]">
        <p className="font-body font-semibold text-[13px] text-ink m-0 mb-[6px]">
          {item.title}
        </p>
        <div className="flex justify-between items-center">
          <span className="border border-slate text-slate text-[11px] px-2 py-[2px] rounded-[--radius-pill] font-body">
            {CATEGORY_LABELS[item.categorySlug] || item.categorySlug}
          </span>
          <span className="font-body text-[11px] text-slate">
            {item.favouriteCount}% liked
          </span>
        </div>
      </div>
    </div>
  );
}
