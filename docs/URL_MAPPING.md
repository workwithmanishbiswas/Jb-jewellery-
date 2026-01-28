# JB Jewellery - URL Mapping & API Routes

## Website Pages (Frontend)

### Public Pages
| URL | File | Purpose |
|-----|------|---------|
| `/` | `public/index.html` | Home page with featured products |
| `/catalog.html` | `public/catalog.html` | Browse all jewelry products |
| `/about.html` | `public/about.html` | About JB Jewellery |
| `/contact.html` | `public/contact.html` | Contact form & support |

### Authentication Pages
| URL | File | Purpose |
|-----|------|---------|
| `/login.html` | `public/login.html` | User login |
| `/register.html` | `public/register.html` | User registration |

### User Pages (Requires Login)
| URL | File | Purpose |
|-----|------|---------|
| `/cart.html` | `public/cart.html` | Shopping cart |
| `/checkout.html` | `public/checkout.html` | Payment checkout |
| `/orders.html` | `public/orders.html` | Order history |

### Admin Pages (Admin Only)
| URL | File | Purpose |
|-----|------|---------|
| `/admin.html` | `public/admin.html` | Admin dashboard |

---

## API Routes (Backend)

### Base URL
```
Production: /api
Local: http://localhost:5000/api
```

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/profile` | Get user profile |

### Product Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/products/category/:category` | Get products by category |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Cart Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:item_id` | Update cart item |
| DELETE | `/api/cart/remove/:item_id` | Remove from cart |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Order Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/orders/create` | Create new order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

### Admin Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/dashboard` | Get admin dashboard data |
| GET | `/api/admin/users` | Get all users (Admin) |
| GET | `/api/admin/orders` | Get all orders (Admin) |

### Health Check
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | API health status |

---

## Static Assets

| Path | Location | Purpose |
|------|----------|---------|
| `/css/*` | `public/css/` | Stylesheets |
| `/js/*` | `public/js/` | JavaScript files |
| `/images/*` | `public/images/` | Product images |

---

## Directory Structure

```
Jb-jewellery-/
├── api/                          # Vercel serverless entry point
│   └── index.py                  # Flask app export for Vercel
│
├── backend/                       # Backend application
│   ├── app.py                    # Main Flask app
│   ├── config.py                 # Configuration
│   ├── database/                 # Database connections
│   │   └── supabase_client.py    # Supabase client
│   ├── routes/                   # API route handlers
│   │   ├── auth.py              # Authentication routes
│   │   ├── products.py          # Product routes
│   │   ├── cart.py              # Cart routes
│   │   ├── orders.py            # Order routes
│   │   └── admin.py             # Admin routes
│   └── utils/                    # Utilities
│       ├── email_service.py     # Email functionality
│       └── auth.py              # Auth helpers
│
├── public/                        # Static website files (served by Vercel)
│   ├── index.html               # Home page
│   ├── catalog.html             # Product catalog
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   ├── cart.html                # Shopping cart
│   ├── checkout.html            # Checkout page
│   ├── orders.html              # Order history
│   ├── admin.html               # Admin panel
│   ├── about.html               # About page
│   ├── contact.html             # Contact page
│   ├── css/                     # Stylesheets
│   ├── js/                      # JavaScript files
│   └── images/                  # Product images
│
├── docs/                         # Documentation
│   ├── ADMIN_CREDENTIALS.md     # Admin login info
│   └── URL_MAPPING.md           # This file
│
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── .vercelignore                 # Vercel ignore rules
├── INITIALIZE_SAMPLE_DATA.sql    # Database initialization SQL
├── README.md                     # Project overview
├── requirements.txt              # Python dependencies
├── package.json                  # Node configuration
└── vercel.json                   # Vercel deployment config
```

---

## Admin Credentials

**Email:** `admin@jbjewellery.com`  
**Password:** `Admin@12345`

See `docs/ADMIN_CREDENTIALS.md` for more details.

---

## Frontend JavaScript Files

| File | Purpose |
|------|---------|
| `api-client.js` | Centralized API communication |
| `navbar.js` | Navigation bar functionality |
| `home.js` | Home page logic |
| `catalog.js` | Product listing and filtering |
| `login.js` | Login functionality |
| `register.js` | User registration |
| `cart.js` | Shopping cart logic |
| `checkout.js` | Payment processing |
| `orders.js` | Order history display |
| `admin.js` | Admin panel dashboard |

---

## Frontend CSS Files

| File | Purpose |
|------|---------|
| `style.css` | Global styles |
| `navbar.css` | Navigation styling |
| `auth.css` | Login/Register styling |
| `catalog.css` | Product listing styling |
| `cart.css` | Cart page styling |
| `checkout.css` | Checkout page styling |
| `orders.css` | Orders page styling |
| `admin.css` | Admin panel styling |
| `about.css` | About page styling |
| `contact.css` | Contact page styling |
| `footer.css` | Footer styling |

---

## Environment Variables

See `.env` file for configuration:
- `SUPABASE_URL` - Database URL
- `SUPABASE_KEY` - Database API key
- `JWT_SECRET` - JWT token secret
- `SECRET_KEY` - Flask secret key
- `ZOHO_CLIENT_ID` - Zoho OAuth client ID
- `ZOHO_REFRESH_TOKEN` - Zoho refresh token
- `CASHFREE_APP_ID` - Cashfree app ID
- `CASHFREE_SECRET_KEY` - Cashfree secret key
