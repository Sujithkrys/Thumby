from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.services.r2_service import upload_to_r2
from app.services.supabase_service import (
    get_user_from_token,
    get_user_id_by_email,
    insert_gallery_thumbnail,
    get_admin_thumbnails,
    update_admin_thumbnail,
    delete_admin_thumbnail
)

router = APIRouter()

ALLOWED_ADMIN_EMAILS = ["thalathotysujith@gmail.com", "phanniuddandam1@gmail.com"]

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
        file_type="gallery",
    )

    return {"url": image_url}


@router.post("/internal/add-thumbnail")
async def add_thumbnail(
    admin_email: str = Form(...),
    title: str = Form(...),
    prompt: str = Form(...),
    category_id: str = Form(...),
    aspect_ratio: str = Form(...),
    file: UploadFile = File(...),
):
    """Upload and insert a gallery thumbnail without login for specific admins."""
    if admin_email not in ALLOWED_ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user_id = await get_user_id_by_email(admin_email)
    if not user_id:
        raise HTTPException(status_code=404, detail="Admin profile not found")

    contents = await file.read()
    image_url = await upload_to_r2(
        image_bytes=contents,
        user_id=user_id,
        file_type="gallery",
    )
    
    thumbnail = await insert_gallery_thumbnail(
        title=title,
        prompt=prompt,
        image_url=image_url,
        category_id=category_id,
        aspect_ratio=aspect_ratio,
        user_id=user_id
    )
    return thumbnail


@router.get("/internal/thumbnails")
async def list_admin_thumbnails(admin_email: str):
    """List thumbnails uploaded by an admin."""
    if admin_email not in ALLOWED_ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user_id = await get_user_id_by_email(admin_email)
    if not user_id:
        raise HTTPException(status_code=404, detail="Admin profile not found")
        
    thumbnails = await get_admin_thumbnails(user_id)
    return {"thumbnails": thumbnails}


@router.put("/internal/thumbnails/{thumbnail_id}")
async def update_thumbnail(
    thumbnail_id: str,
    admin_email: str = Form(...),
    title: str = Form(...),
    prompt: str = Form(...),
    category_id: str = Form(...),
    aspect_ratio: str = Form(...),
):
    """Update a thumbnail."""
    if admin_email not in ALLOWED_ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user_id = await get_user_id_by_email(admin_email)
    if not user_id:
        raise HTTPException(status_code=404, detail="Admin profile not found")
        
    try:
        thumbnail = await update_admin_thumbnail(
            thumbnail_id, user_id, title, prompt, category_id, aspect_ratio
        )
        return thumbnail
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/internal/thumbnails/{thumbnail_id}")
async def delete_thumbnail(
    thumbnail_id: str,
    admin_email: str,
):
    """Delete a thumbnail."""
    if admin_email not in ALLOWED_ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user_id = await get_user_id_by_email(admin_email)
    if not user_id:
        raise HTTPException(status_code=404, detail="Admin profile not found")
        
    try:
        await delete_admin_thumbnail(thumbnail_id, user_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
