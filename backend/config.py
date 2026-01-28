import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    # JWT Configuration
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')
    JWT_ALGORITHM = 'HS256'
    
    # Cashfree Configuration
    CASHFREE_KEY_ID = os.getenv('CASHFREE_KEY_ID')
    CASHFREE_KEY_SECRET = os.getenv('CASHFREE_KEY_SECRET')
    CASHFREE_API_URL = os.getenv('CASHFREE_API_URL', 'https://sandbox.cashfree.com/pg')
    
    # Email Configuration (Zoho OAuth2)
    ZOHO_CLIENT_ID = os.getenv('ZOHO_CLIENT_ID')
    ZOHO_CLIENT_SECRET = os.getenv('ZOHO_CLIENT_SECRET')
    ZOHO_REFRESH_TOKEN = os.getenv('ZOHO_REFRESH_TOKEN')
    ZOHO_MAIL_USER = os.getenv('ZOHO_MAIL_USER')
    ZOHO_ORG_ID = os.getenv('ZOHO_ORG_ID')
    
    # Flask Configuration
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

