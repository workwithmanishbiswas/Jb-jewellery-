# URL Mapping for JB Jewellery Collection

## Frontend Routes (Vercel)

All pages are now served directly from the frontend root directory for Vercel compatibility.

### Page URLs

| Page | URL | File Location |
|------|-----|---------------|
| **Home** | `/` or `/index.html` | `/frontend/index.html` |
| **Catalog** | `/catalog.html` | `/frontend/catalog.html` |
| **About** | `/about.html` | `/frontend/about.html` |
| **Contact** | `/contact.html` | `/frontend/contact.html` |
| **Login** | `/login.html` | `/frontend/login.html` |
| **Register** | `/register.html` | `/frontend/register.html` |
| **Cart** | `/cart.html` | `/frontend/cart.html` |
| **Checkout** | `/checkout.html` | `/frontend/checkout.html` |
| **Orders** | `/orders.html` | `/frontend/orders.html` |
| **Admin** | `/admin.html` | `/frontend/admin.html` |
| **Admin (alt)** | `/admin` | `/frontend/admin.html` |

### Static Asset URLs

| Type | URL Pattern | Location |
|------|-------------|----------|
| **CSS** | `/css/*.css` | `/frontend/css/` |
| **JavaScript** | `/js/*.js` | `/frontend/js/` |
| **Images** | `/images/*` | `/frontend/images/` |

### API Endpoints

| Endpoint | Backend Route |
|----------|---------------|
| `/api/auth/*` | `backend/routes/auth.py` |
| `/api/products/*` | `backend/routes/products.py` |
| `/api/cart/*` | `backend/routes/cart.py` |
| `/api/orders/*` | `backend/routes/orders.py` |
| `/api/admin/*` | `backend/routes/admin.py` |

## Navigation Examples

### From Home Page (/)
- Click "Catalog" → `/catalog.html` ✅
- Click "About" → `/about.html` ✅
- Click "Contact" → `/contact.html` ✅
- Click "Login" → `/login.html` ✅
- Click "Register" → `/register.html` ✅

### From Any Page
- Click "JB JEWELLERY" (logo) → `/` ✅
- Click "Home" → `/` ✅
- Click "Cart" icon → `/cart.html` ✅
- Click "My Orders" → `/orders.html` ✅

## Vercel Routing Rules (vercel.json)

```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.py" },
    { "src": "/css/(.*)", "dest": "frontend/css/$1" },
    { "src": "/js/(.*)", "dest": "frontend/js/$1" },
    { "src": "/images/(.*)", "dest": "frontend/images/$1" },
    { "src": "/(index\\.html)?$", "dest": "frontend/index.html" },
    { "src": "/([^.]+)(\\.html)?$", "dest": "frontend/$1.html" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

## File Structure

```
frontend/
├── index.html              → Home page
├── catalog.html            → Product catalog
├── about.html              → About page
├── contact.html            → Contact page
├── login.html              → Login page
├── register.html           → Register page
├── cart.html               → Shopping cart
├── checkout.html           → Checkout
├── orders.html             → Order history
├── admin.html              → Admin dashboard
├── css/                    → Stylesheets
│   ├── style.css
│   ├── navbar.css
│   └── ... (other CSS files)
├── js/                     → JavaScript files
│   ├── api-client.js
│   ├── navbar.js
│   └── ... (other JS files)
└── images/                 → Images
```

## Testing URLs

On your Vercel domain (e.g., `https://jb-jewellery.vercel.app`):

- ✅ `https://jb-jewellery.vercel.app/` → Home
- ✅ `https://jb-jewellery.vercel.app/catalog.html` → Catalog
- ✅ `https://jb-jewellery.vercel.app/login.html` → Login
- ✅ `https://jb-jewellery.vercel.app/admin.html` → Admin
- ✅ `https://jb-jewellery.vercel.app/api/products` → API

All pages should load with proper styling and functionality! 🎉
