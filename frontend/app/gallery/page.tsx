import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SortTabs } from "@/components/gallery/SortTabs";
import { CategoryPill } from "@/components/ui/CategoryPill";

export const metadata: Metadata = {
  title: "Gallery — Thumby",
  description:
    "Browse proven thumbnail designs across gaming, tech, vlogs, beauty, and finance. Pick one as a reference to generate your own.",
};

/**
 * Gallery page — browse seeded thumbnails with category filters and sort tabs.
 * Build order: Phase 1 (no auth required).
 */
export default function GalleryPage() {
  return (
    <div>
      {/* Sort tabs: Featured / Newest / Popular — right-aligned */}
      <div className="flex justify-end mb-4">
        <SortTabs />
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-[18px]">
        <CategoryPill label="All categories" slug="all" />
        <CategoryPill label="Gaming" slug="gaming" />
        <CategoryPill label="Tech" slug="tech" />
        <CategoryPill label="Vlogs" slug="vlogs" />
        <CategoryPill label="Beauty" slug="beauty" />
        <CategoryPill label="Finance" slug="finance" />
      </div>

      {/* Thumbnail card grid */}
      <GalleryGrid />
    </div>
  );
}
