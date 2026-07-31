"""
Application settings loaded from environment variables.
Secrets live only in environment variables — never hardcoded.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # OpenAI
    OPENAI_API_KEY: str

    # Cloudflare R2
    R2_ACCESS_KEY_ID: str
    R2_SECRET_ACCESS_KEY: str
    R2_BUCKET_NAME: str
    R2_ENDPOINT_URL: str  # e.g. https://<account_id>.r2.cloudflarestorage.com
    R2_PUBLIC_URL: str  # Public URL prefix for stored objects

    # Supabase (server-side, for cap enforcement and writing records)
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Founder emails (comma-separated)
    FOUNDER_EMAILS: str = ""

    # Generation cap default
    DEFAULT_GENERATION_CAP: int = 20

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()  # type: ignore[call-arg]
