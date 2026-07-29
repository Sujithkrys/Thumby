"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { createClient } from "@/lib/supabase-client";
import type { GalleryThumbnail } from "@/lib/types";

export function FavouritesClient() {
  const { favourites } = useStore();
  const [thumbnails, setThumbnails] = useState<GalleryThumbnail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavourites() {
      if (favourites.size === 0) {
        setThumbnails([]);
        setLoading(false);
        return;
      }
      
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery_thumbnails")
        .select("*, categories(slug)")
        .in("id", Array.from(favourites));
        
      if (data) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          title: t.title,
          imageUrl: t.image_url,
          prompt: t.prompt,
          aspectRatio: t.aspect_ratio,
          categoryId: t.category_id,
          categorySlug: t.categories?.slug || "unknown",
          uploadedBy: t.uploaded_by,
          favouriteCount: t.favourite_count,
          isFeatured: t.is_featured,
          isActive: t.is_active,
          createdAt: t.created_at,
        }));
        setThumbnails(mapped);
      }
      setLoading(false);
    }
    
    loadFavourites();
  }, [favourites]);

  if (loading) {
    return <p className="text-[13px] text-slate">Loading favourites...</p>;
  }

  if (favourites.size === 0) {
    return (
      <p className="text-[13px] text-slate">
        Nothing favourited yet &mdash; star a thumbnail in the gallery to save it here.
      </p>
    );
  }

  return <GalleryGrid initialThumbnails={thumbnails} />;
}
