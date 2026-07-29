-- Thumby: Initial Schema
-- Migration 001 — all tables, RLS policies, functions, and seed data.

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

-- profiles (synced with auth.users via trigger)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    profile_picture TEXT,
    is_founder BOOLEAN NOT NULL DEFAULT false,
    is_disabled BOOLEAN NOT NULL DEFAULT false,
    generation_count INTEGER NOT NULL DEFAULT 0,
    generation_cap INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- gallery_thumbnails
CREATE TABLE public.gallery_thumbnails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    favourite_count INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- favourites
CREATE TABLE public.favourites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    thumbnail_id UUID NOT NULL REFERENCES public.gallery_thumbnails(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, thumbnail_id)
);

-- generations
CREATE TABLE public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')),
    reference_type TEXT NOT NULL CHECK (reference_type IN ('gallery', 'upload', 'none')),
    reference_url TEXT,
    quality_tier TEXT NOT NULL CHECK (quality_tier IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- reports
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    generation_id UUID NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- user_uploads (reference images — scoped to uploading user only)
CREATE TABLE public.user_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL,
    r2_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_gallery_thumbnails_category ON public.gallery_thumbnails(category_id);
CREATE INDEX idx_gallery_thumbnails_active ON public.gallery_thumbnails(is_active);
CREATE INDEX idx_gallery_thumbnails_featured ON public.gallery_thumbnails(is_featured);
CREATE INDEX idx_favourites_user ON public.favourites(user_id);
CREATE INDEX idx_favourites_thumbnail ON public.favourites(thumbnail_id);
CREATE INDEX idx_generations_user ON public.generations(user_id);
CREATE INDEX idx_reports_generation ON public.reports(generation_id);
CREATE INDEX idx_user_uploads_user ON public.user_uploads(user_id);

-- ============================================================
-- Functions
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic generation count increment (called from FastAPI via RPC)
CREATE OR REPLACE FUNCTION public.increment_generation_count(user_id_input UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET generation_count = generation_count + 1,
        updated_at = now()
    WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update favourite_count when favourites change
CREATE OR REPLACE FUNCTION public.update_favourite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.gallery_thumbnails
        SET favourite_count = favourite_count + 1
        WHERE id = NEW.thumbnail_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.gallery_thumbnails
        SET favourite_count = favourite_count - 1
        WHERE id = OLD.thumbnail_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_favourite_change
    AFTER INSERT OR DELETE ON public.favourites
    FOR EACH ROW EXECUTE FUNCTION public.update_favourite_count();

-- ============================================================
-- Row-Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_thumbnails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_uploads ENABLE ROW LEVEL SECURITY;

-- profiles: users can read/update their own row only
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- categories: anyone authenticated can read
CREATE POLICY "Authenticated users can read categories"
    ON public.categories FOR SELECT
    TO authenticated
    USING (true);

-- gallery_thumbnails: anyone authenticated can read active thumbnails
CREATE POLICY "Authenticated users can read active thumbnails"
    ON public.gallery_thumbnails FOR SELECT
    TO authenticated
    USING (is_active = true);

-- gallery_thumbnails: only founders can insert
CREATE POLICY "Founders can insert gallery thumbnails"
    ON public.gallery_thumbnails FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_founder = true
        )
    );

-- favourites: users can CRUD their own
CREATE POLICY "Users can view own favourites"
    ON public.favourites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites"
    ON public.favourites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites"
    ON public.favourites FOR DELETE
    USING (auth.uid() = user_id);

-- generations: users can read their own only
CREATE POLICY "Users can view own generations"
    ON public.generations FOR SELECT
    USING (auth.uid() = user_id);

-- generations: service role inserts (from FastAPI) — no user-facing insert policy needed

-- reports: users can insert their own
CREATE POLICY "Users can insert reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- user_uploads: users can read their own only — NEVER publicly listable
CREATE POLICY "Users can view own uploads"
    ON public.user_uploads FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================
-- Seed Data: Categories
-- ============================================================
INSERT INTO public.categories (name, slug) VALUES
    ('Gaming', 'gaming'),
    ('Tech', 'tech'),
    ('Vlogs', 'vlogs'),
    ('Beauty', 'beauty'),
    ('Finance', 'finance');
