// Home Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadCategories();
    setupSearch();
});

function loadFeaturedProducts() {
    apiClient
        .getProducts(1, 6)
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
                            <button class="wishlist-btn">❤️</button>
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
                <a href="pages/catalog.html?category=${encodeURIComponent(category)}" class="category-card">
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
                        padding: 3rem 2rem;
                        background-color: #F8F9FA;
                    }
                    
                    .categories-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 1.5rem;
                        max-width: 1200px;
                        margin: 2rem auto;
                    }
                    
                    .category-card {
                        background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
                        color: white;
                        padding: 2rem;
                        text-align: center;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.3s ease;
                    }
                    
                    .category-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    }
                    
                    .category-card h3 {
                        margin-bottom: 0.5rem;
                        color: white;
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
        window.location.href = 'pages/login.html';
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
                window.location.href = `pages/catalog.html?search=${encodeURIComponent(query)}`;
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value;
                if (query.trim()) {
                    window.location.href = `pages/catalog.html?search=${encodeURIComponent(query)}`;
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
