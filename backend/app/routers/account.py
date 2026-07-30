from fastapi import APIRouter, HTTPException, Depends, Header
from app.services.supabase_service import get_user_from_token, delete_user_account

router = APIRouter()

@router.delete("/account")
async def delete_account(
    authorization: str = Header(None),
):
    """Delete the authenticated user's account and all associated data."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
        
    token = authorization.replace("Bearer ", "")
    user = await get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    try:
        await delete_user_account(user["id"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")

    return {"status": "success", "message": "Account deleted successfully"}
