"""
FastAPI application for Thumby — handles image generation and R2 storage.

This service is responsible for:
1. Receiving generation requests from the frontend
2. Enforcing the server-side generation cap
3. Calling OpenAI's gpt-image-2 API
4. Uploading generated/user images to Cloudflare R2
5. Writing generation records back to Supabase
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import generate


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown


app = FastAPI(
    title="Thumby API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
