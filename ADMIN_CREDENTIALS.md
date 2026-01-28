# JB Jewellery Collection - Admin Credentials

## 🔐 Admin Account Access

### Credentials:
```
Email:    admin@jbjewellery.com
Password: Admin@12345
```

### Access:
- **Admin Panel URL:** `https://yourdomain.vercel.app/admin.html`
- Or: `https://yourdomain.vercel.app/admin`

## 🚀 How to Access Admin Panel

1. Visit your website
2. Go to **Login** page: `https://yourdomain.vercel.app/login.html`
3. Enter credentials:
   - Email: `admin@jbjewellery.com`
   - Password: `Admin@12345`
4. Click **Login**
5. You'll be redirected to **Admin Dashboard**: `/admin.html`

## 📋 Admin Panel Features

### Dashboard Tab
- **Order Statistics** - View pending/approved/shipped orders
- **Revenue Metrics** - Total revenue, average order value
- **Inventory Status** - Stock levels for all products

### Orders Tab
- **View All Orders** - See pending, approved, shipped, delivered
- **Approve Orders** - Accept pending orders with notes
- **Reject Orders** - Reject orders with reason
- **Add Shipment** - Track shipment with carrier and tracking ID
- **Update Delivery** - Add delivery updates/tracking information
- **Complete Orders** - Mark orders as delivered

### Products Tab
- **View Catalog** - See all products in inventory
- **Add Product** - Create new jewelry products
- **Edit Product** - Update product details (name, price, stock)
- **Delete Product** - Remove products from catalog
- **Categories** - View product categories

### Wholesale Tab
- **View Inquiries** - See wholesale bulk order requests
- **Filter by Status** - new, processing, quoted, approved, completed
- **Add Quotes** - Send pricing quotes for bulk orders
- **Approve Requests** - Approve wholesale orders

## 📊 Sample Products Already Added

The database is initialized with 10 sample jewelry products:

1. **Gold Ring - Classic** - ₹15,000
2. **Diamond Necklace** - ₹45,000
3. **Pearl Earrings** - ₹8,500
4. **Bangles Set** - ₹28,000
5. **Bracelet - Oxidized** - ₹5,500
6. **Engagement Ring** - ₹125,000
7. **Pendant - Locket** - ₹12,000
8. **Anklet - Payal** - ₹22,000
9. **Brooch - Elegant** - ₹9,500
10. **Nose Ring - Nath** - ₹6,500

You can:
- ✅ View all products in the catalog
- ✅ Edit product details (name, price, description, stock)
- ✅ Add new products
- ✅ Delete products
- ✅ See stock levels

## 🛡️ Security Tips

⚠️ **Important:**
1. Change admin password after first login
2. Use strong passwords (minimum 8 characters, mix of uppercase, lowercase, numbers)
3. Don't share admin credentials with non-admin users
4. Admin panel is accessible to logged-in admins only
5. Regular backups recommended

## 🔄 User Roles

- **Admin** - Full access to admin panel (can manage all features)
- **Customer** - Can browse catalog, add to cart, checkout, view orders
- **Guest** - Can browse catalog but cannot add to cart or checkout

## 📝 How to Manage Products

### Add New Product:
1. Go to Admin Panel → Products Tab
2. Click "Add Product"
3. Fill details:
   - Name: Product name
   - Category: Select category
   - Price: Product price
   - Description: Product details
   - Stock: Quantity in inventory
   - Image URL: Product image link
4. Click "Create"

### Edit Product:
1. Go to Admin Panel → Products Tab
2. Find product in list
3. Click "Edit" button
4. Update details
5. Click "Update"

### Delete Product:
1. Go to Admin Panel → Products Tab
2. Find product in list
3. Click "Delete" button
4. Confirm deletion

## 📱 Manage Orders

### Approve Order:
1. Go to Admin Panel → Orders Tab
2. Filter by "Pending" status
3. Click "Approve"
4. Add optional notes
5. Click "Confirm"

### Add Shipment:
1. Click order
2. Scroll to "Shipment"
3. Enter:
   - Tracking ID
   - Carrier name (e.g., "Fedex", "Delhivery")
4. Click "Add Shipment"
5. Customer gets notification

### Update Delivery:
1. Click order
2. Scroll to "Delivery Updates"
3. Add status update (e.g., "Out for delivery")
4. Click "Update"
5. Customer can see real-time updates

## 🌐 Frontend URLs

- **Home:** `https://yourdomain.vercel.app/`
- **Catalog:** `https://yourdomain.vercel.app/catalog.html`
- **Login:** `https://yourdomain.vercel.app/login.html`
- **Register:** `https://yourdomain.vercel.app/register.html`
- **About:** `https://yourdomain.vercel.app/about.html`
- **Contact:** `https://yourdomain.vercel.app/contact.html`
- **Admin:** `https://yourdomain.vercel.app/admin.html`

## 🆘 Troubleshooting

**Can't login?**
- Check email and password
- Make sure you're using the admin account (not customer account)
- Clear browser cache and try again

**Admin panel not showing?**
- Make sure you're logged in as admin
- Check browser console for errors
- Verify JWT token in localStorage

**Products not appearing?**
- Refresh page with Ctrl+Shift+R (hard refresh)
- Check Supabase database for products
- Verify product status is "active"

---

**Last Updated:** January 28, 2026
**Version:** 1.0
