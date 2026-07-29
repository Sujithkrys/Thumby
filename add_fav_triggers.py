import psycopg2
import urllib.parse

password = urllib.parse.quote_plus("Svastrino@123")
conn_string = f"postgresql://postgres:{password}@db.ijwcmtdvkobmkzonjlrc.supabase.co:5432/postgres"

sql = """
CREATE OR REPLACE FUNCTION increment_favourite_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.gallery_thumbnails
    SET favourite_count = favourite_count + 1
    WHERE id = NEW.thumbnail_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_favourite_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.gallery_thumbnails
    SET favourite_count = favourite_count - 1
    WHERE id = OLD.thumbnail_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_favourite_insert ON public.favourites;
CREATE TRIGGER on_favourite_insert
    AFTER INSERT ON public.favourites
    FOR EACH ROW EXECUTE FUNCTION increment_favourite_count();

DROP TRIGGER IF EXISTS on_favourite_delete ON public.favourites;
CREATE TRIGGER on_favourite_delete
    AFTER DELETE ON public.favourites
    FOR EACH ROW EXECUTE FUNCTION decrement_favourite_count();
"""

try:
    conn = psycopg2.connect(conn_string)
    conn.autocommit = True
    cursor = conn.cursor()
    print("Executing triggers...")
    cursor.execute(sql)
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
