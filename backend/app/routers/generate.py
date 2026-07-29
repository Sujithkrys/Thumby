"""
Generation router — POST /api/generate

Flow:
1. Validate request + authenticate user (via Supabase JWT)
2. Check server-side generation cap
3. Call OpenAI gpt-image-2
4. Upload result to Cloudflare R2
5. Write generation record to Supabase
6. Return image URL
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional

from app.models.schemas import GenerateRequest, GenerateResponse
from app.services.openai_service import generate_image
from app.services.r2_service import upload_to_r2
from app.services.supabase_service import (
    get_user_from_token,
    check_generation_cap,
    increment_generation_count,
    create_generation_record,
)

router = APIRouter()

# Size mapping: aspect ratio → WIDTHxHEIGHT (divisible by 16)
ASPECT_RATIO_SIZES = {
    "16:9": "1536x864",
    "9:16": "864x1536",
    "1:1": "1024x1024",
}


@router.post("/generate", response_model=GenerateResponse)
async def generate_thumbnail(request: GenerateRequest):
    """Generate a thumbnail from a prompt using gpt-image-2."""

    # 1. Authenticate user
    user = await get_user_from_token(request.access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # 2. Server-side cap enforcement
    can_generate = await check_generation_cap(user["id"])
    if not can_generate:
        raise HTTPException(
            status_code=429,
            detail="Generation limit reached. You've used all your available generations.",
        )

    # 3. Validate aspect ratio
    size = ASPECT_RATIO_SIZES.get(request.aspect_ratio)
    if not size:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid aspect ratio. Must be one of: {', '.join(ASPECT_RATIO_SIZES.keys())}",
        )

    # 4. Generate image via OpenAI
    image_bytes = await generate_image(
        prompt=request.prompt,
        quality=request.quality_tier,
        size=size,
    )

    # 5. Upload to R2
    image_url = await upload_to_r2(
        image_bytes=image_bytes,
        user_id=user["id"],
        file_type="generation",
    )

    # 6. Write generation record + increment count
    generation = await create_generation_record(
        user_id=user["id"],
        prompt=request.prompt,
        aspect_ratio=request.aspect_ratio,
        reference_type=request.reference_type,
        reference_url=request.reference_url,
        quality_tier=request.quality_tier,
        image_url=image_url,
    )
    await increment_generation_count(user["id"])

    return GenerateResponse(
        id=generation["id"],
        image_url=image_url,
        status="completed",
    )


@router.post("/upload-reference")
async def upload_reference_image(
    access_token: str = Form(...),
    file: UploadFile = File(...),
):
    """Upload a user reference image to R2 (scoped to uploading user only)."""

    user = await get_user_from_token(access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    contents = await file.read()

    image_url = await upload_to_r2(
        image_bytes=contents,
        user_id=user["id"],
        file_type="user_upload",
    )

    return {"url": image_url}
