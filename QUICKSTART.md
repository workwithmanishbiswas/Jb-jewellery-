# JB Jewellery Collection - Quick Start Guide

## 📋 Prerequisites

- Python 3.8 or higher
- Git
- A modern web browser
- Text editor or IDE

## 🚀 Quick Setup (3 Steps)

### Step 1: Clone and Install

**Linux/Mac:**
```bash
git clone https://github.com/workwithmanishbiswas/Jb-jewellery-.git
cd Jb-jewellery-
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
git clone https://github.com/workwithmanishbiswas/Jb-jewellery-.git
cd Jb-jewellery-
setup.bat
```

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`
2. Fill in your credentials:
   - Supabase URL and Key (from https://supabase.com)
   - Cashfree credentials (from https://cashfree.com)
   - Zoho Mail credentials (from https://zoho.com)

### Step 3: Start Development

```bash
# Activate virtual environment (if not already activated)
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Start backend
python backend/app.py

# In another terminal, open frontend
# Navigate to http://localhost:5000
```

## 🏗️ Project Structure Overview

```
frontend/          → HTML, CSS, JavaScript files
├── index.html     → Home page
├── pages/         → All page files
├── css/           → Styling
└── js/            → JavaScript logic

backend/           → Python Flask API
├── app.py         → Main application
├── routes/        → API endpoints
└── utils/         → Helper functions

requirements.txt   → Python dependencies
.env              → Environment variables
```

## 📝 Key Features to Test

1. **Home Page** → View featured products and categories
2. **Login/Register** → Create account and login
3. **Catalog** → Browse products, search, filter
4. **Shopping Cart** → Add items, manage quantities
5. **Checkout** → Enter shipping address
6. **Orders** → View order history and tracking
7. **Admin Panel** → Manage products and orders (use admin account)
8. **Contact** → Submit inquiries and wholesale requests

## 🔐 Creating Admin Account

After setup, create an admin account:

1. Register normally on the website
2. Update the user in Supabase:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
   ```
3. Login and access `/pages/admin.html`

## 🌐 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Add Environment Variables**
   - Go to Project Settings
   - Add all variables from your `.env` file
   - Deploy

4. **Update Frontend API URL**
   - Update `frontend/js/api-client.js` with your Vercel URL
   - Push changes

## 🎨 Customization

### Colors
Edit `/frontend/css/style.css` `:root` section:
```css
--primary-color: #F39C12;      /* Yellow-Orange */
--secondary-color: #27AE60;    /* Garden Green */
--light-bg: #FFFFFF;           /* White */
```

### Logo & Branding
- Replace "JB JEWELLERY" text in navbar
- Update color scheme in CSS
- Add your logo image to `/frontend/images/`

### Database Schema
Add or modify tables in Supabase following the `SUPABASE_SETUP.md` guide

## 📞 Support & Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000    # Windows
```

### API Connection Error
- Check backend is running on port 5000
- Verify API URL in `api-client.js`
- Check network tab in browser DevTools

### Database Connection Error
- Verify Supabase credentials in `.env`
- Check if Supabase project is active
- Ensure tables are created (see SUPABASE_SETUP.md)

### Email Not Sending
- Verify Zoho Mail credentials
- Check email limits (free plan: 100/day)
- Review Zoho Mail logs

## 📚 Documentation

- [Backend API Setup](./SUPABASE_SETUP.md)
- [Cashfree Payment Integration](./CASHFREE_SETUP.md)
- [Zoho Mail Configuration](./ZOHO_MAIL_SETUP.md)
- [Full README](./README.md)

## 🎯 Next Steps

1. ✅ Complete setup
2. ✅ Configure Supabase
3. ✅ Test locally
4. ✅ Deploy to Vercel
5. ✅ Set up custom domain (optional)
6. ✅ Configure SSL certificate
7. ✅ Go live!

## 💡 Tips

- Use Supabase dashboard to manage data
- Check browser console for JavaScript errors
- Use Postman to test API endpoints
- Review logs for debugging issues
- Keep `.env` file secure and never commit it

---

**Happy Coding! 🎉**

For detailed setup instructions, refer to the main README.md
