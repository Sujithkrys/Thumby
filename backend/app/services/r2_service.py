"""
Cloudflare R2 upload service.

Uses boto3 S3-compatible client to upload images to R2.
Uploaded images are scoped by user_id in the key path.
"""

import uuid
from typing import Literal

import boto3

from app.config import settings

s3_client = boto3.client(
    "s3",
    endpoint_url=settings.R2_ENDPOINT_URL,
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    region_name="auto",
)


async def upload_to_r2(
    image_bytes: bytes,
    user_id: str,
    file_type: Literal["generation", "user_upload", "gallery"] = "generation",
) -> str:
    """
    Upload an image to Cloudflare R2.

    Storage layout:
        generations/{user_id}/{uuid}.png
        uploads/{user_id}/{uuid}.png      (user reference images — never publicly listable)
        gallery/{uuid}.png                (founder-uploaded gallery images)

    Args:
        image_bytes: Raw image data.
        user_id: The uploading user's ID (used for path scoping).
        file_type: Determines the storage prefix.

    Returns:
        Public URL of the uploaded image.
    """
    file_id = uuid.uuid4().hex

    if file_type == "generation":
        key = f"generations/{user_id}/{file_id}.png"
    elif file_type == "user_upload":
        key = f"uploads/{user_id}/{file_id}.png"
    elif file_type == "gallery":
        key = f"gallery/{file_id}.png"
    else:
        raise ValueError(f"Unknown file_type: {file_type}")

    s3_client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=key,
        Body=image_bytes,
        ContentType="image/png",
    )

    return f"{settings.R2_PUBLIC_URL}/{key}"
