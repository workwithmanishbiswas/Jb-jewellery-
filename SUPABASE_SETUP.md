# Supabase Setup Instructions

## Database Schema

Run these SQL commands in your Supabase SQL Editor to create the necessary tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  packaging_charge DECIMAL(10, 2) DEFAULT 0,
  shipment_charge DECIMAL(10, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  items JSONB,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_charge DECIMAL(10, 2) DEFAULT 0,
  shipping_address JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'pending',
  shipment_id VARCHAR(255),
  carrier VARCHAR(100),
  delivery_updates JSONB,
  notes TEXT,
  approved_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wholesale Inquiries table
CREATE TABLE wholesale_inquiries (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  product_details TEXT,
  quantity INTEGER,
  delivery_location TEXT,
  special_requirements TEXT,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_wholesale_status ON wholesale_inquiries(status);
```

## Supabase Configuration

1. Get your Supabase URL and Key from the Supabase dashboard
2. Add them to your `.env` file:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
```

## Row Level Security (Optional but Recommended)

Enable RLS policies for security:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_inquiries ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Carts are user-specific
CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert to own cart"
  ON cart FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Orders are user-specific
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());
```

## Storage Buckets (Optional)

To store product images:

```sql
-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true);

-- Set up RLS policy for public access to images
CREATE POLICY "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );
```
