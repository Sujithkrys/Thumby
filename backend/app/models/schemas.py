"""
Pydantic request/response models for the generation API.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal


class GenerateRequest(BaseModel):
    """Request body for POST /api/generate."""

    access_token: str = Field(..., description="Supabase JWT access token")
    prompt: str = Field(..., min_length=1, max_length=2000, description="Image generation prompt")
    aspect_ratio: Literal["16:9", "9:16", "1:1"] = Field(
        default="16:9", description="Output aspect ratio"
    )
    quality_tier: Literal["low", "medium", "high"] = Field(
        default="medium", description="Generation quality tier"
    )
    reference_type: Literal["gallery", "upload", "none"] = Field(
        default="none", description="Type of reference image"
    )
    reference_url: Optional[str] = Field(
        default=None, description="URL of the reference image (gallery or uploaded)"
    )


class GenerateResponse(BaseModel):
    """Response body for POST /api/generate."""

    id: str = Field(..., description="Generation record ID")
    image_url: str = Field(..., description="URL of the generated image in R2")
    status: Literal["completed", "failed"] = Field(..., description="Generation status")


class UploadReferenceResponse(BaseModel):
    """Response body for POST /api/upload-reference."""

    url: str = Field(..., description="R2 URL of the uploaded reference image")
