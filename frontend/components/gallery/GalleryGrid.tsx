"use client";

import { ThumbnailCard } from "./ThumbnailCard";
import type { GalleryThumbnail } from "@/lib/types";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

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
  const { favourites, toggleFav, setDraftReference } = useStore();
  const router = useRouter();
  
  const handleUse = (item: GalleryThumbnail) => {
    setDraftReference(item);
    router.push("/generate");
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
            isFav={favourites.has(item.id)} 
            onToggleFav={() => toggleFav(item.id)} 
            onUse={handleUse} 
          />
        ))
      )}
    </div>
  );
}
