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
