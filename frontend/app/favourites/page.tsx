import type { Metadata } from "next";
import { FavouritesClient } from "./FavouritesClient";

export const metadata: Metadata = {
  title: "Favourites — Thumby",
  description: "Your saved favourite thumbnail designs.",
};

/**
 * Favourites page — same card grid as gallery, filtered to starred items.
 * Build order: Phase 4 (requires auth).
 */
export default function FavouritesPage() {
  return (
    <div>
      <h1 className="font-heading font-semibold text-[19px] text-ink mb-4">
        Favourites
      </h1>
      <FavouritesClient />
    </div>
  );
}
