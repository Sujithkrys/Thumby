import psycopg2
import urllib.parse
import sys

password = urllib.parse.quote_plus("Svastrino@123")
conn_string = f"postgresql://postgres:{password}@db.ijwcmtdvkobmkzonjlrc.supabase.co:5432/postgres"

sql = """
-- Drop old tables
DROP TABLE IF EXISTS public.favourites CASCADE;
DROP TABLE IF EXISTS public.generations CASCADE;
DROP TABLE IF EXISTS public.gallery_thumbnails CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- 1. categories
CREATE TABLE public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories FOR SELECT USING (true);

-- 2. gallery_thumbnails
CREATE TABLE public.gallery_thumbnails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL CHECK (aspect_ratio IN ('16:9','9:16','1:1')),
    category_id TEXT REFERENCES public.categories(id),
    model TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    favourite_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_thumbnails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active thumbnails" ON public.gallery_thumbnails FOR SELECT USING (is_active = true);
CREATE POLICY "founders insert" ON public.gallery_thumbnails FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_founder = true
    )
);

-- 3. favourites
CREATE TABLE public.favourites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    thumbnail_id UUID REFERENCES public.gallery_thumbnails(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, thumbnail_id)
);
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own favourites" ON public.favourites
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. generations
CREATE TABLE public.generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    prompt TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    reference_type TEXT CHECK (reference_type IN ('gallery','upload','none')),
    reference_url TEXT,
    quality_tier TEXT,
    status TEXT NOT NULL DEFAULT 'processing',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own generations" ON public.generations
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed Categories
INSERT INTO public.categories (id, name) VALUES 
('gaming', 'Gaming'),
('tech', 'Tech'),
('vlogs', 'Vlogs'),
('beauty', 'Beauty'),
('finance', 'Finance');

-- Seed gallery_thumbnails
INSERT INTO public.gallery_thumbnails (category_id, aspect_ratio, model, title, prompt, image_url) VALUES 
('gaming', '16:9', 'nanobanana', 'Boss fight reaction', 'A young man sitting in a gaming chair in a dimly lit room lit by RGB LED strips, mouth open in shock, eyes wide, hands gripping a gaming headset, monitor glow reflecting blue and purple across his face, motion-blurred action visible on the screen behind him, shallow depth of field, dramatic rim lighting, no text or logos.', 'https://picsum.photos/seed/th1/800/450'),
('gaming', '16:9', 'gpt-image-2', '1v5 clutch highlight', 'Create a high-click-through YouTube thumbnail: a young man in a gaming chair, mouth open in shock, eyes wide, gripping a headset, lit by RGB strips in a dim room, monitor glow reflecting blue and purple on his face. Compose with the subject occupying the right two-thirds of the frame, leaving open negative space on the left third for a title overlay. Motion-blurred game action visible on the screen behind him. No text, no logos, no watermark.', 'https://picsum.photos/seed/th2/800/450'),
('gaming', '1:1', 'nanobanana', 'New season, new meta', 'Close-up of a controller and a glowing trophy on a dark reflective surface, dramatic top-down lighting, purple and gold color grade, shallow depth of field, no text or logos.', 'https://picsum.photos/seed/th3/800/800'),
('tech', '16:9', 'gpt-image-2', 'iPhone 17 review', 'Create a high-click-through YouTube thumbnail: commercial product photography of a sleek black smartphone floating above a reflective dark surface, single strong rim light, orange-to-blue gradient background, subtle floating light particles. Center the product with balanced negative space above it reserved for a title overlay. Sharp focus on the camera module. No text, no logos, no watermark.', 'https://picsum.photos/seed/th4/800/450'),
('tech', '16:9', 'nanobanana', 'This app changed everything', 'A person holding a smartphone toward the camera, screen glowing brightly, surprised expression lit by the screen''s blue light, dark background, shallow depth of field, no text or logos.', 'https://picsum.photos/seed/th5/800/450'),
('tech', '16:9', 'gpt-image-2', 'Unboxing the setup', 'Create a high-click-through YouTube thumbnail: an overhead flat-lay of a minimalist desk setup — keyboard, mouse, monitor edge, coffee cup — soft natural window light, muted neutral tones, balanced negative space in the upper third for a title overlay. No text, no logos, no watermark.', 'https://picsum.photos/seed/th6/800/450'),
('vlogs', '9:16', 'nanobanana', 'A day in my life', 'A woman standing at a cliffside overlook in Santorini at golden hour, white-and-blue buildings behind her, wind in her hair, arms outstretched, warm backlight creating a glowing edge around her silhouette, wide-angle lens, vibrant saturated colors, no text or logos.', 'https://picsum.photos/seed/th7/450/800'),
('vlogs', '9:16', 'gpt-image-2', 'I tried this for 30 days', 'Create a high-click-through Instagram Reels thumbnail: a person journaling at a cafe table by a window, warm natural light, coffee cup and notebook in frame, soft bokeh background. Frame the subject in the upper two-thirds, leaving the lower third open for a caption overlay. No text, no logos, no watermark.', 'https://picsum.photos/seed/th8/450/800'),
('vlogs', '1:1', 'nanobanana', 'City walk at night', 'A person walking through a neon-lit city street at night, reflections on wet pavement, cinematic teal and magenta color grade, motion blur in the background, sharp focus on the subject, no text or logos.', 'https://picsum.photos/seed/th9/800/800'),
('beauty', '9:16', 'gpt-image-2', 'Get ready with me', 'Create a high-click-through Instagram Reels thumbnail: a young woman at a vanity mirror ringed with warm bulb lights, applying makeup with a brush, soft golden studio lighting, pastel pink and cream palette. Frame her face and shoulders in the upper two-thirds, leaving the lower third clear of clutter for a caption overlay. No text, no logos, no watermark.', 'https://picsum.photos/seed/th10/450/800'),
('beauty', '9:16', 'nanobanana', 'Skincare routine that works', 'A close-up of a woman applying skincare product to her face, dewy glowing skin, soft diffused lighting, clean white bathroom background, pastel tones, no text or logos.', 'https://picsum.photos/seed/th11/450/800'),
('beauty', '1:1', 'gpt-image-2', 'Five minute makeup', 'Create a high-click-through thumbnail: flat-lay of makeup products arranged on a marble surface, soft overhead lighting, pastel color palette, balanced negative space in one corner for a title overlay. No text, no logos, no watermark.', 'https://picsum.photos/seed/th12/800/800'),
('finance', '16:9', 'nanobanana', 'Stock market crash?', 'A man in a suit staring intensely at multiple monitors showing red stock charts, dim blue office lighting, tense expression, shallow depth of field, dramatic and moody color grade, no text or logos.', 'https://picsum.photos/seed/th13/800/450'),
('finance', '1:1', 'gpt-image-2', 'How I saved my first $10k', 'Create a high-click-through thumbnail: a stack of coins and a small potted plant on a wooden desk beside a laptop showing a rising graph, soft warm natural light, shallow depth of field. Leave balanced negative space in the upper third for a title overlay. No text, no logos, no watermark.', 'https://picsum.photos/seed/th14/800/800'),
('finance', '16:9', 'nanobanana', 'Budgeting that actually works', 'A person writing in a budget planner next to a calculator and coffee cup, warm desk lamp lighting, cozy home office background softly blurred, shallow depth of field, no text or logos.', 'https://picsum.photos/seed/th15/800/450');
"""

try:
    conn = psycopg2.connect(conn_string)
    conn.autocommit = True
    cursor = conn.cursor()
    print("Executing schema and seed...")
    cursor.execute(sql)
    print("Success!")
    
    # Now let's test RLS
    print("\n--- Testing RLS ---")
    
    # 1. Insert a mock favourite for a dummy user so we have something to test against
    dummy_user_id = '11111111-1111-1111-1111-111111111111'
    # Ensure auth.users has this dummy user so the foreign key doesn't fail
    cursor.execute(f"INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES ('{dummy_user_id}', 'dummy@example.com', '{{\"name\":\"Dummy\"}}') ON CONFLICT DO NOTHING;")
    
    # Get a thumbnail id
    cursor.execute("SELECT id FROM public.gallery_thumbnails LIMIT 1;")
    thumb_id = cursor.fetchone()[0]
    
    cursor.execute(f"INSERT INTO public.favourites (user_id, thumbnail_id) VALUES ('{dummy_user_id}', '{thumb_id}') ON CONFLICT DO NOTHING;")
    
    # Let's switch to the authenticated role and masquerade as a DIFFERENT user
    different_user_id = '22222222-2222-2222-2222-222222222222'
    cursor.execute("SET ROLE authenticated;")
    cursor.execute(f"SET request.jwt.claims TO '{{\"sub\": \"{different_user_id}\"}}';")
    
    print(f"Querying favourites as user {different_user_id}...")
    cursor.execute("SELECT * FROM public.favourites;")
    results = cursor.fetchall()
    
    print(f"Results: {results}")
    if len(results) == 0:
        print("RLS Test Passed: Query returned empty!")
    else:
        print("RLS Test Failed: Query returned rows!")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
