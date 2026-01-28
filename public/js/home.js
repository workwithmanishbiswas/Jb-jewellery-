// Home Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    handleSearch();
    loadFeaturedProducts();
    loadCategories();
    setupSearch();
    updateCartCount();
});

function handleSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        document.getElementById('searchInput').value = searchQuery;
        // Optionally filter products based on search
    }
}

function loadFeaturedProducts() {
    apiClient
        .getProducts(1, 12)
        .then((data) => {
            const container = document.getElementById('featuredProducts');
            if (!container) return;

            container.innerHTML = data.products
                .map(
                    (product) => `
                <div class="product-card">
                    <img src="${product.image_url}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <div class="product-category">${product.category || 'Jewellery'}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description.substring(0, 50)}...</div>
                        <div class="product-price">₹${parseFloat(product.price).toLocaleString('en-IN')}</div>
                        <div class="product-actions">
                            <button class="add-to-cart-btn" onclick="addProductToCart(${product.id})">Add to Cart</button>
                            <button class="wishlist-btn" title="Add to Wishlist"><span class="icon-heart"></span></button>
                        </div>
                    </div>
                </div>
            `
                )
                .join('');
        })
        .catch((error) => console.error('Error loading products:', error));
}

function loadCategories() {
    apiClient
        .getCategories()
        .then((data) => {
            const container = document.getElementById('categoriesGrid');
            if (!container) return;

            container.innerHTML = data.categories
                .slice(0, 6)
                .map(
                    (category) => `
                <a href="/#products" class="category-card">
                    <h3>${category}</h3>
                    <p>Shop Now →</p>
                </a>
            `
                )
                .join('');

            // Add CSS for category cards
            if (!document.querySelector('style[data-category-styles]')) {
                const style = document.createElement('style');
                style.setAttribute('data-category-styles', 'true');
                style.textContent = `
                    .categories-section {
                        padding: 4rem 2rem;
                        background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
                        border-top: 2px solid #ECF0F1;
                        border-bottom: 2px solid #ECF0F1;
                    }
                    
                    .categories-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                        gap: 2rem;
                        max-width: 1200px;
                        margin: 3rem auto;
                    }
                    
                    .category-card {
                        background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
                        color: white;
                        padding: 2.5rem 1.5rem;
                        text-align: center;
                        border-radius: 12px;
                        text-decoration: none;
                        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 4px 12px rgba(243, 156, 18, 0.2);
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .category-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                        transition: left 0.5s ease;
                    }
                    
                    .category-card:hover::before {
                        left: 100%;
                    }
                    
                    .category-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 24px rgba(243, 156, 18, 0.35);
                    }
                    
                    .category-card h3 {
                        margin-bottom: 0.8rem;
                        color: white;
                        font-size: 1.3rem;
                    }
                    
                    .category-card p {
                        color: rgba(255, 255, 255, 0.9);
                    }
                `;
                document.head.appendChild(style);
            }
        })
        .catch((error) => console.error('Error loading categories:', error));
}

function addProductToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    apiClient
        .addToCart(productId, 1)
        .then((data) => {
            alert('Product added to cart!');
            updateCartCount();
        })
        .catch((error) => {
            alert('Error adding to cart: ' + error.message);
        });
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            if (query.trim()) {
                window.location.href = `/?search=${encodeURIComponent(query)}#products`;
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value;
                if (query.trim()) {
                    window.location.href = `/?search=${encodeURIComponent(query)}#products`;
                }
            }
        });
    }
}

function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    apiClient
        .getCart()
        .then((data) => {
            const cartCount = data.total_items || 0;
            const cartElements = document.querySelectorAll('#cartCount');
            cartElements.forEach((el) => {
                el.textContent = cartCount;
            });
        })
        .catch((error) => console.error('Error fetching cart:', error));
}
