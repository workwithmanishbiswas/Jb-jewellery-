# JB Jewellery Collection

## Overview

JB Jewellery Collection is a full-stack e-commerce platform for jewelry shopping. The platform supports customer browsing, cart management, checkout with Cashfree payments, order tracking, and a comprehensive admin dashboard for managing products, orders, and wholesale inquiries. The application uses a Python Flask backend with Supabase (PostgreSQL) for data storage, and serves a vanilla HTML/CSS/JavaScript frontend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML5, CSS3, and JavaScript (no framework)
- **Structure**: Static files served from the `public/` directory
- **Routing**: File-based routing where each HTML file represents a page (e.g., `catalog.html`, `login.html`)
- **API Communication**: Custom `APIClient` class in `public/js/api-client.js` handles all backend requests with JWT token management
- **Styling**: Modular CSS with separate files for components (`navbar.css`, `footer.css`) and pages (`catalog.css`, `admin.css`)

### Backend Architecture
- **Framework**: Python Flask with Blueprint-based route organization
- **Entry Point**: `api/index.py` serves as Vercel serverless function entry, importing the Flask app from `backend/app.py`
- **Route Structure**:
  - `/api/auth/*` - Authentication (login, register, profile)
  - `/api/products/*` - Product catalog operations
  - `/api/cart/*` - Shopping cart management
  - `/api/orders/*` - Order creation and tracking
  - `/api/admin/*` - Admin-only operations (requires admin JWT)
- **Authentication**: JWT-based with decorators (`@token_required`, `@admin_required`) for protected routes
- **Password Security**: bcrypt hashing for user passwords

### Data Storage
- **Database**: Supabase (hosted PostgreSQL)
- **Client**: Official Supabase Python SDK (`supabase-py`)
- **Tables**: users, products, cart, orders (inferred from route operations)
- **Connection**: Initialized once at app startup via `init_supabase()`, accessed via `get_supabase()` singleton

### Deployment Configuration
- **Platform**: Vercel with serverless Python functions
- **Routing** (`vercel.json`):
  - All `/api/*` requests route to the Flask backend
  - Static assets (CSS, JS, images) served directly from `public/` with caching headers
  - HTML pages served from `public/` with clean URL support
- **Build**: No build step required (`"buildCommand": "true"`)

### Key Design Decisions

1. **No Frontend Framework**: Chose vanilla JS for simplicity and fast initial load times. Trade-off is more manual DOM manipulation.

2. **Monorepo Structure**: Backend and frontend coexist in single repo. Backend in `backend/`, frontend in `public/`, Vercel entry in `api/`.

3. **Supabase over Raw PostgreSQL**: Provides authentication, real-time capabilities, and hosted database without infrastructure management.

4. **JWT in LocalStorage**: Tokens stored client-side for persistence. The `APIClient` class automatically attaches tokens to requests.

5. **Blueprint Pattern**: Flask routes organized by domain (auth, products, cart, orders, admin) for maintainability.

## External Dependencies

### Database
- **Supabase**: PostgreSQL database hosting and client SDK
- Environment variables: `SUPABASE_URL`, `SUPABASE_KEY`

### Payment Processing
- **Cashfree**: Payment gateway for checkout
- Environment variables: `CASHFREE_KEY_ID`, `CASHFREE_KEY_SECRET`, `CASHFREE_API_URL`

### Email Service
- **Zoho Mail**: OAuth2-based email for order confirmations and notifications
- Environment variables: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_MAIL_USER`, `ZOHO_ORG_ID`
- Token refresh handled automatically with 55-minute expiry buffer

### Hosting
- **Vercel**: Serverless deployment platform
- Python runtime for backend, static file serving for frontend

### Python Dependencies (requirements.txt)
- Flask, Flask-CORS for API server
- supabase for database client
- PyJWT, bcrypt for authentication
- python-dotenv for environment configuration
- requests for external API calls
- gunicorn for production WSGI server