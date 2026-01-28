-- Initialize JB Jewellery Database with Sample Data
-- Run this in Supabase SQL Editor

-- Insert Admin User
-- Email: admin@jbjewellery.com
-- Password: Admin@12345 (hashed with bcrypt)
INSERT INTO users (email, password, name, phone, is_admin) VALUES (
  'admin@jbjewellery.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmy.44m',
  'Admin User',
  '+91-9999999999',
  true
);

-- Insert Sample Products
INSERT INTO products (name, description, price, category, image_url, packaging_charge, shipment_charge, stock, status) VALUES
('Gold Ring - Classic', 'Beautiful 22K gold ring with classic design. Perfect for everyday wear.', 15000.00, 'Rings', 'https://via.placeholder.com/300x300?text=Gold+Ring', 0, 100, 50, 'active'),
('Diamond Necklace', 'Elegant diamond pendant necklace with 18K white gold chain.', 45000.00, 'Necklaces', 'https://via.placeholder.com/300x300?text=Diamond+Necklace', 0, 150, 30, 'active'),
('Pearl Earrings', 'Traditional pearl earrings with gold studs. Elegant and timeless.', 8500.00, 'Earrings', 'https://via.placeholder.com/300x300?text=Pearl+Earrings', 0, 50, 75, 'active'),
('Bangles Set', 'Set of 4 gold bangles with traditional design patterns.', 28000.00, 'Bangles', 'https://via.placeholder.com/300x300?text=Bangles+Set', 0, 120, 40, 'active'),
('Bracelet - Oxidized', 'Oxidized silver bracelet with intricate carvings.', 5500.00, 'Bracelets', 'https://via.placeholder.com/300x300?text=Oxidized+Bracelet', 0, 60, 60, 'active'),
('Engagement Ring', 'Solitaire diamond engagement ring in 18K gold.', 125000.00, 'Rings', 'https://via.placeholder.com/300x300?text=Engagement+Ring', 0, 200, 15, 'active'),
('Pendant - Locket', 'Gold locket pendant with customizable photo frame.', 12000.00, 'Pendants', 'https://via.placeholder.com/300x300?text=Gold+Locket', 0, 80, 45, 'active'),
('Anklet - Payal', 'Traditional Indian gold payal with bells.', 22000.00, 'Anklets', 'https://via.placeholder.com/300x300?text=Gold+Payal', 0, 100, 35, 'active'),
('Brooch - Elegant', 'Elegant pearl and gold brooch for special occasions.', 9500.00, 'Brooches', 'https://via.placeholder.com/300x300?text=Pearl+Brooch', 0, 70, 25, 'active'),
('Nose Ring - Nath', 'Traditional gold nose ring with diamond stone.', 6500.00, 'Nose Rings', 'https://via.placeholder.com/300x300?text=Gold+Nath', 0, 50, 55, 'active');
