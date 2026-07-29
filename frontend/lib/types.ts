/**
 * Shared TypeScript types for the Thumby frontend.
 * Maps to the Supabase data model defined in 001_initial_schema.sql.
 */

// ── Database Row Types ──

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  profile_picture: string | null;
  is_founder: boolean;
  is_disabled: boolean;
  generation_count: number;
  generation_cap: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface GalleryThumbnail {
  id: string;
  title: string;
  imageUrl: string;
  prompt: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  categoryId: string;
  categorySlug: string; // Joined from categories table
  uploadedBy: string;
  favouriteCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Favourite {
  id: string;
  userId: string;
  thumbnailId: string;
  createdAt: string;
}

export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  referenceType: "gallery" | "upload" | "none";
  referenceUrl: string | null;
  qualityTier: "low" | "medium" | "high";
  status: "pending" | "completed" | "failed";
  imageUrl: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  generationId: string;
  reason: string;
  createdAt: string;
}

export interface UserUpload {
  id: string;
  userId: string;
  r2Key: string;
  r2Url: string;
  createdAt: string;
}

// ── API Types ──

export interface GenerateRequest {
  prompt: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  qualityTier: "low" | "medium" | "high";
  referenceType: "gallery" | "upload" | "none";
  referenceUrl?: string;
}

export interface GenerateResponse {
  id: string;
  imageUrl: string;
  status: "completed" | "failed";
}

// ── UI Types ──

export type SortOption = "featured" | "newest" | "popular";

export type CategorySlug = "all" | "gaming" | "tech" | "vlogs" | "beauty" | "finance";

export const CATEGORY_LABELS: Record<string, string> = {
  gaming: "Gaming",
  tech: "Tech",
  vlogs: "Vlogs",
  beauty: "Beauty",
  finance: "Finance",
};

export const ASPECT_RATIOS = ["16:9", "9:16", "1:1"] as const;

export const QUALITY_TIERS = [
  { value: "low" as const, label: "Low" },
  { value: "medium" as const, label: "Med" },
  { value: "high" as const, label: "High" },
];
