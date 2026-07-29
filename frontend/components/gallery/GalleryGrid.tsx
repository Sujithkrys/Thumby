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
interface GalleryGridProps {
  initialThumbnails?: GalleryThumbnail[];
}

export function GalleryGrid({ initialThumbnails = [] }: GalleryGridProps) {
  // In Phase 1 we don't have auth, so we just mock favourite actions
  const handleToggleFav = (id: string) => {
    console.log("Toggle fav clicked for", id);
  };
  
  const handleUse = (item: GalleryThumbnail) => {
    console.log("Use clicked for", item);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(155px,1fr))] gap-[14px]">
      {initialThumbnails.length === 0 ? (
        <p className="col-span-full text-[13px] text-slate text-center py-8">
          No thumbnails found for this filter.
        </p>
      ) : (
        initialThumbnails.map((item) => (
          <ThumbnailCard 
            key={item.id} 
            item={item} 
            isFav={false} 
            onToggleFav={handleToggleFav} 
            onUse={handleUse} 
          />
        ))
      )}
    </div>
  );
}
