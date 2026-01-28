from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

supabase: Client = None

def init_supabase():
    global supabase
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    try:
        supabase = create_client(url, key)
    except Exception as e:
        print(f"Warning: Could not initialize Supabase: {e}")
        supabase = None
    return supabase

def get_supabase():
    global supabase
    if supabase is None:
        init_supabase()
    return supabase
