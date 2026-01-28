"""
Vercel serverless function entry point
This file exports the Flask app for Vercel to recognize
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the Flask app from backend/app.py
from app import app

# Export for Vercel
__all__ = ['app']
