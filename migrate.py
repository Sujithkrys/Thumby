import psycopg2
import sys
import urllib.parse

password = urllib.parse.quote_plus("Svastrino@123")
conn_string = f"postgresql://postgres:{password}@db.ijwcmtdvkobmkzonjlrc.supabase.co:5432/postgres"

print("Connecting to Supabase...")
try:
    conn = psycopg2.connect(conn_string)
    conn.autocommit = True
    cursor = conn.cursor()
    
    print("Reading migration file...")
    with open("supabase/migrations/001_initial_schema.sql", "r", encoding="utf-8") as f:
        sql = f.read()
        
    print("Executing SQL...")
    cursor.execute(sql)
    print("Schema created successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
finally:
    if 'conn' in locals():
        conn.close()
