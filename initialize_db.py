"""
Script to initialize admin user and add sample products
Run this locally before deploying
"""
import os
import sys
import bcrypt
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from database.supabase_client import get_supabase_client

def add_admin_user():
    """Add admin user to database"""
    supabase = get_supabase_client()
    
    # Admin credentials
    admin_email = "admin@jbjewellery.com"
    admin_password = "Admin@12345"
    admin_name = "Admin User"
    
    # Hash password
    hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Insert admin user
    try:
        response = supabase.table('users').insert({
            'email': admin_email,
            'password': hashed_password,
            'name': admin_name,
            'phone': '+91-9999999999',
            'is_admin': True
        }).execute()
        
        print("✅ Admin user created!")
        print(f"Email: {admin_email}")
        print(f"Password: {admin_password}")
        return True
    except Exception as e:
        print(f"Admin user might already exist: {str(e)}")
        return False

def add_sample_products():
    """Add sample jewelry products"""
    supabase = get_supabase_client()
    
    products = [
        {
            'name': 'Gold Ring - Classic',
            'description': 'Beautiful 22K gold ring with classic design. Perfect for everyday wear.',
            'price': 15000.00,
            'category': 'Rings',
            'image_url': 'https://via.placeholder.com/300x300?text=Gold+Ring',
            'packaging_charge': 0,
            'shipment_charge': 100,
            'stock': 50,
            'status': 'active'
        },
        {
            'name': 'Diamond Necklace',
            'description': 'Elegant diamond pendant necklace with 18K white gold chain.',
            'price': 45000.00,
            'category': 'Necklaces',
            'image_url': 'https://via.placeholder.com/300x300?text=Diamond+Necklace',
            'packaging_charge': 0,
            'shipment_charge': 150,
            'stock': 30,
            'status': 'active'
        },
        {
            'name': 'Pearl Earrings',
            'description': 'Traditional pearl earrings with gold studs. Elegant and timeless.',
            'price': 8500.00,
            'category': 'Earrings',
            'image_url': 'https://via.placeholder.com/300x300?text=Pearl+Earrings',
            'packaging_charge': 0,
            'shipment_charge': 50,
            'stock': 75,
            'status': 'active'
        },
        {
            'name': 'Bangles Set',
            'description': 'Set of 4 gold bangles with traditional design patterns.',
            'price': 28000.00,
            'category': 'Bangles',
            'image_url': 'https://via.placeholder.com/300x300?text=Bangles+Set',
            'packaging_charge': 0,
            'shipment_charge': 120,
            'stock': 40,
            'status': 'active'
        },
        {
            'name': 'Bracelet - Oxidized',
            'description': 'Oxidized silver bracelet with intricate carvings.',
            'price': 5500.00,
            'category': 'Bracelets',
            'image_url': 'https://via.placeholder.com/300x300?text=Oxidized+Bracelet',
            'packaging_charge': 0,
            'shipment_charge': 60,
            'stock': 60,
            'status': 'active'
        },
        {
            'name': 'Engagement Ring',
            'description': 'Solitaire diamond engagement ring in 18K gold.',
            'price': 125000.00,
            'category': 'Rings',
            'image_url': 'https://via.placeholder.com/300x300?text=Engagement+Ring',
            'packaging_charge': 0,
            'shipment_charge': 200,
            'stock': 15,
            'status': 'active'
        },
        {
            'name': 'Pendant - Locket',
            'description': 'Gold locket pendant with customizable photo frame.',
            'price': 12000.00,
            'category': 'Pendants',
            'image_url': 'https://via.placeholder.com/300x300?text=Gold+Locket',
            'packaging_charge': 0,
            'shipment_charge': 80,
            'stock': 45,
            'status': 'active'
        },
        {
            'name': 'Anklet - Payal',
            'description': 'Traditional Indian gold payal with bells.',
            'price': 22000.00,
            'category': 'Anklets',
            'image_url': 'https://via.placeholder.com/300x300?text=Gold+Payal',
            'packaging_charge': 0,
            'shipment_charge': 100,
            'stock': 35,
            'status': 'active'
        },
        {
            'name': 'Brooch - Elegant',
            'description': 'Elegant pearl and gold brooch for special occasions.',
            'price': 9500.00,
            'category': 'Brooches',
            'image_url': 'https://via.placeholder.com/300x300?text=Pearl+Brooch',
            'packaging_charge': 0,
            'shipment_charge': 70,
            'stock': 25,
            'status': 'active'
        },
        {
            'name': 'Nose Ring - Nath',
            'description': 'Traditional gold nose ring with diamond stone.',
            'price': 6500.00,
            'category': 'Nose Rings',
            'image_url': 'https://via.placeholder.com/300x300?text=Gold+Nath',
            'packaging_charge': 0,
            'shipment_charge': 50,
            'stock': 55,
            'status': 'active'
        }
    ]
    
    try:
        response = supabase.table('products').insert(products).execute()
        print(f"✅ Added {len(products)} sample products!")
        return True
    except Exception as e:
        print(f"Error adding products: {str(e)}")
        return False

def main():
    print("🚀 Initializing JB Jewellery Database...")
    print("\n" + "="*50)
    
    print("\n📝 Adding Admin User...")
    add_admin_user()
    
    print("\n📦 Adding Sample Products...")
    add_sample_products()
    
    print("\n" + "="*50)
    print("✅ Database initialization complete!")
    print("\n🔐 Admin Credentials:")
    print("   Email: admin@jbjewellery.com")
    print("   Password: Admin@12345")
    print("\n📧 (Change password after first login)")

if __name__ == '__main__':
    main()
