"use client";

import { ThumbnailCard } from "./ThumbnailCard";
import type { GalleryThumbnail } from "@/lib/types";

/**
 * Gallery grid — responsive card layout.
 * Grid: repeat(auto-fit, minmax(155px, 1fr)), gap 14px.
 *
 * TODO: Wire to Supabase query for gallery_thumbnails.
 * Currently renders placeholder message.
 */
export function GalleryGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(155px,1fr))] gap-[14px]">
      {/* TODO: Map over gallery thumbnails from Supabase */}
      <p className="col-span-full text-[13px] text-slate text-center py-8">
        Gallery thumbnails will appear here once data is seeded.
      </p>
    </div>
  );
}
