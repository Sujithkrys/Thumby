import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { GenerateClient } from "./GenerateClient";

export const metadata: Metadata = {
  title: "Generate — Thumby",
  description:
    "Create a professional thumbnail with AI. Enter your prompt, pick a reference, choose quality and aspect ratio, and generate.",
};

export default async function GeneratePage() {
  const supabase = await createClient();
  const { data: topThumbnails } = await supabase
    .from("gallery_thumbnails")
    .select("*")
    .eq("is_active", true)
    .order("favourite_count", { ascending: false })
    .limit(20);

  const inspirations = [];
  const seenCategories = new Set();
  
  if (topThumbnails) {
    for (const thumb of topThumbnails) {
      if (!seenCategories.has(thumb.category_id)) {
        inspirations.push(thumb);
        seenCategories.add(thumb.category_id);
      }
      if (inspirations.length >= 5) break;
    }
    
    // Fill remaining if needed
    if (inspirations.length < 5) {
      for (const thumb of topThumbnails) {
        if (!inspirations.some(i => i.id === thumb.id)) {
          inspirations.push(thumb);
        }
        if (inspirations.length >= 5) break;
      }
    }
  }

  return <GenerateClient initialInspirations={inspirations} />;
}
