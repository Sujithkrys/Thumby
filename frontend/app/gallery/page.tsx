import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SortTabs } from "@/components/gallery/SortTabs";
import { CategoryFilter } from "@/components/gallery/CategoryFilter";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Gallery — Thumby",
  description:
    "Browse proven thumbnail designs across gaming, tech, vlogs, beauty, and finance. Pick one as a reference to generate your own.",
};

interface GalleryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const sort = (params.sort as string) || "featured";
  const category = (params.category as string) || "all";

  const supabase = await createClient();

  // Base query
  let query = supabase
    .from("gallery_thumbnails")
    .select("*, categories(name, slug)")
    .eq("is_active", true);

  // Apply category filter
  if (category !== "all") {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
      
    if (catData) {
      query = query.eq("category_id", catData.id);
    }
  }

  // Apply sort
  if (sort === "featured") {
    query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "popular") {
    query = query.order("favourite_count", { ascending: false });
  }

  const { data: thumbnails, error } = await query.limit(50);
  
  if (error) {
    console.error("Error fetching thumbnails:", error);
  }

  // Map to frontend type
  const mappedThumbnails = (thumbnails || []).map((t: any) => ({
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

  return (
    <div>
      <div className="flex justify-end mb-4">
        <SortTabs />
      </div>
      
      <CategoryFilter />

      <GalleryGrid initialThumbnails={mappedThumbnails} />
    </div>
  );
}
