"""
OpenAI image generation service.

Wraps the gpt-image-2 API call pattern from test_gptimage.py.
"""

import base64
from typing import Literal

from openai import AsyncOpenAI

from app.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

MODEL = "gpt-image-2"


async def generate_image(
    prompt: str,
    quality: Literal["low", "medium", "high"] = "medium",
    size: str = "1536x864",
) -> bytes:
    """
    Generate an image using OpenAI's gpt-image-2 model.

    Args:
        prompt: The image generation prompt.
        quality: Rendering fidelity — "low", "medium", or "high".
        size: Output dimensions as "WIDTHxHEIGHT" (must be divisible by 16).

    Returns:
        Raw image bytes (decoded from base64).

    Raises:
        RuntimeError: If the API returns no image data.
    """
    result = await client.images.generate(
        model=MODEL,
        prompt=prompt,
        quality=quality,
        size=size,
    )

    image_base64 = result.data[0].b64_json
    if not image_base64:
        raise RuntimeError(
            f"OpenAI returned no image data. Full response: {result}"
        )

    return base64.b64decode(image_base64)
