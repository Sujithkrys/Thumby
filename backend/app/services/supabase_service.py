"""
Supabase service — server-side operations.

Uses the service role key for:
1. Validating user JWT tokens
2. Checking and enforcing generation caps
3. Creating generation records
"""

from typing import Optional

from supabase import create_client, Client

from app.config import settings

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)


async def get_user_from_token(access_token: str) -> Optional[dict]:
    """
    Validate a Supabase JWT and return the user profile.

    Returns None if the token is invalid or the user is disabled.
    """
    try:
        user_response = supabase.auth.get_user(access_token)
        if not user_response or not user_response.user:
            return None

        user_id = user_response.user.id

        # Check if user is disabled
        profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not profile.data or profile.data.get("is_disabled", False):
            return None

        return profile.data
    except Exception:
        return None


async def check_generation_cap(user_id: str) -> bool:
    """
    Server-side generation cap enforcement.

    Returns True if the user can still generate, False if at cap.
    """
    profile = (
        supabase.table("profiles")
        .select("generation_count, generation_cap")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not profile.data:
        return False

    return profile.data["generation_count"] < profile.data["generation_cap"]


async def increment_generation_count(user_id: str) -> None:
    """Increment the user's generation count by 1."""
    profile = (
        supabase.table("profiles")
        .select("generation_count")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if profile.data:
        new_count = profile.data["generation_count"] + 1
        supabase.table("profiles").update({"generation_count": new_count}).eq("id", user_id).execute()


async def create_generation_record(
    user_id: str,
    prompt: str,
    aspect_ratio: str,
    reference_type: str,
    reference_url: Optional[str],
    quality_tier: str,
    image_url: str,
) -> dict:
    """Create a generation record in the database."""
    result = (
        supabase.table("generations")
        .insert(
            {
                "user_id": user_id,
                "prompt": prompt,
                "aspect_ratio": aspect_ratio,
                "reference_type": reference_type,
                "reference_url": reference_url,
                "quality_tier": quality_tier,
                "status": "completed",
                "image_url": image_url,
            }
        )
        .execute()
    )
    return result.data[0]


async def delete_user_account(user_id: str) -> None:
    """Delete a user account and their associated data."""
    # Delete favourites
    supabase.table("favourites").delete().eq("user_id", user_id).execute()
    
    # Delete generations
    supabase.table("generations").delete().eq("user_id", user_id).execute()
    
    # Delete profile
    supabase.table("profiles").delete().eq("id", user_id).execute()
    
    # Finally, delete user from auth (Supabase Admin API)
    supabase.auth.admin.delete_user(user_id)
