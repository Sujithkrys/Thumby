"use client";

import { ThumbnailCard } from "./ThumbnailCard";
import type { GalleryThumbnail } from "@/lib/types";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThumbnailDetailModal } from "./ThumbnailDetailModal";

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
  const { favourites, toggleFav, setDraftReference, setDraftPrompt } = useStore();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<GalleryThumbnail | null>(null);
  
  const handleUseAsPrompt = () => {
    if (selectedItem) {
      setDraftPrompt(selectedItem);
      router.push("/generate");
    }
  };

  const handleUseAsReference = () => {
    if (selectedItem) {
      setDraftReference(selectedItem);
      router.push("/generate");
    }
  };

  if (initialThumbnails.length === 0) {
    return (
      <p className="text-[13px] text-slate text-center py-8">
        No thumbnails found for this filter.
      </p>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-[14px]">
        {initialThumbnails.map((item) => (
          <ThumbnailCard 
            key={item.id} 
            item={item} 
            isFav={favourites.has(item.id)} 
            onToggleFav={() => toggleFav(item.id)} 
            onClick={setSelectedItem} 
          />
        ))}
      </div>
      
      {selectedItem && (
        <ThumbnailDetailModal
          item={selectedItem}
          isFav={favourites.has(selectedItem.id)}
          onToggleFav={toggleFav}
          onUseAsPrompt={handleUseAsPrompt}
          onUseAsReference={handleUseAsReference}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
