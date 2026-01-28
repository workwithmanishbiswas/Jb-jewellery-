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
    
    # Email Configuration (Zoho)
    ZOHO_MAIL_USER = os.getenv('ZOHO_MAIL_USER')
    ZOHO_MAIL_PASSWORD = os.getenv('ZOHO_MAIL_PASSWORD')
    ZOHO_SMTP_SERVER = 'smtp.zoho.com'
    ZOHO_SMTP_PORT = 465
    
    # Flask Configuration
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
