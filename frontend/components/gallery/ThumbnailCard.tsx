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
  const aspectRatioString = item.aspectRatio.replace(":", "/");

  return (
    <div 
      className="relative group break-inside-avoid mb-[14px] rounded-[--radius-card] overflow-hidden cursor-pointer bg-studio"
      onClick={() => onUse(item)}
      style={{ aspectRatio: aspectRatioString }}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover block"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 pointer-events-auto">
        
        {/* Top area */}
        <div className="flex justify-between items-start">
          <span className="bg-black/30 backdrop-blur-md text-white font-mono text-[11px] px-[7px] py-[3px] rounded-[--radius-badge]">
            {item.aspectRatio}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(item.id);
            }}
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md transition-colors border-none flex items-center justify-center cursor-pointer"
          >
            <Star
              size={17}
              fill={isFav ? "var(--color-gold)" : "none"}
              color={isFav ? "var(--color-gold)" : "white"}
            />
          </button>
        </div>

        {/* Bottom area */}
        <div>
          <p className="font-body font-semibold text-[14px] text-white m-0 mb-1 leading-tight line-clamp-2">
            {item.title}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] px-2 py-[2px] rounded-[--radius-pill] font-body">
              {CATEGORY_LABELS[item.categorySlug] || item.categorySlug}
            </span>
            <span className="font-body text-[11px] text-white/80">
              {item.favouriteCount} likes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
