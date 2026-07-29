from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.r2_service import upload_to_r2
from app.services.supabase_service import get_user_from_token

router = APIRouter()

@router.post("/internal/upload-gallery")
async def upload_gallery_image(
    access_token: str = Form(...),
    file: UploadFile = File(...),
):
    """Upload a gallery thumbnail to R2 (founders only)."""
    user = await get_user_from_token(access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not user.get("is_founder"):
        raise HTTPException(status_code=403, detail="Only founders can upload gallery thumbnails")

    contents = await file.read()
    image_url = await upload_to_r2(
        image_bytes=contents,
        user_id=user["id"],
        file_type="gallery_thumbnail",
    )

    return {"url": image_url}
