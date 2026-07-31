import type { GenerateRequest, GenerateResponse } from "./types";

/**
 * FastAPI HTTP client.
 * Used only for generation requests — everything else goes via Supabase SDK.
 *
 * Environment variable:
 *   NEXT_PUBLIC_API_URL — FastAPI base URL (e.g. https://api.thumby.app)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generate a thumbnail via the FastAPI backend.
 */
export async function generateThumbnail(
  request: GenerateRequest,
  accessToken: string
): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
      access_token: accessToken,
      aspect_ratio: request.aspectRatio,
      quality_tier: request.qualityTier,
      reference_type: request.referenceType,
      reference_url: request.referenceUrl,
      rights_confirmed: request.rightsConfirmed,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Generation failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return {
    id: data.id,
    imageUrl: data.image_url,
    status: data.status,
  };
}

/**
 * Upload a reference image via the FastAPI backend.
 * Returns the R2 URL of the uploaded image.
 */
export async function uploadReferenceImage(
  file: File,
  accessToken: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("access_token", accessToken);

  const response = await fetch(`${API_URL}/api/upload-reference`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.url;
}

/**
 * Upload a gallery thumbnail image via the FastAPI backend (founders only).
 * Returns the R2 URL of the uploaded image.
 */
export async function uploadGalleryImage(
  file: File,
  accessToken: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("access_token", accessToken);

  const response = await fetch(`${API_URL}/api/internal/upload-gallery`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.url;
}

/**
 * Upload a gallery thumbnail bypassing login (for specific admins).
 */
export async function addAdminThumbnail(
  file: File,
  adminEmail: string,
  title: string,
  prompt: string,
  categoryId: string,
  aspectRatio: string
): Promise<Record<string, unknown>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("admin_email", adminEmail);
  formData.append("title", title);
  formData.append("prompt", prompt);
  formData.append("category_id", categoryId);
  formData.append("aspect_ratio", aspectRatio);

  const response = await fetch(`${API_URL}/api/internal/add-thumbnail`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Upload failed with status ${response.status}`
    );
  }

  return await response.json();
}

/**
 * Get thumbnails uploaded by a specific admin.
 */
export async function getAdminThumbnails(adminEmail: string): Promise<Record<string, unknown>[]> {
  const response = await fetch(`${API_URL}/api/internal/thumbnails?admin_email=${encodeURIComponent(adminEmail)}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Fetch failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.thumbnails;
}

/**
 * Update a thumbnail uploaded by an admin.
 */
export async function updateAdminThumbnail(
  thumbnailId: string,
  adminEmail: string,
  title: string,
  prompt: string,
  categoryId: string,
  aspectRatio: string
): Promise<Record<string, unknown>> {
  const formData = new FormData();
  formData.append("admin_email", adminEmail);
  formData.append("title", title);
  formData.append("prompt", prompt);
  formData.append("category_id", categoryId);
  formData.append("aspect_ratio", aspectRatio);

  const response = await fetch(`${API_URL}/api/internal/thumbnails/${thumbnailId}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Update failed with status ${response.status}`
    );
  }

  return await response.json();
}

/**
 * Delete a thumbnail uploaded by an admin.
 */
export async function deleteAdminThumbnail(
  thumbnailId: string,
  adminEmail: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/internal/thumbnails/${thumbnailId}?admin_email=${encodeURIComponent(adminEmail)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || `Delete failed with status ${response.status}`
    );
  }
}
