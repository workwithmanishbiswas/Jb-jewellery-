// Catalog Page JavaScript
let currentPage = 1;
let currentSearch = '';
let currentCategory = '';

document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentSearch = urlParams.get('search') || '';
    currentCategory = urlParams.get('category') || '';

    if (currentSearch) {
        document.getElementById('searchInput').value = currentSearch;
    }

    loadProducts();
    loadCategories();
    setupFilters();
    setupSearch();
});

function loadProducts(page = 1) {
    currentPage = page;
    const limit = 12;

    apiClient
        .getProducts(page, limit, currentSearch, currentCategory)
        .then((data) => {
            const container = document.getElementById('productsGrid');
            if (!container) return;

            if (data.products.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found</p>';
                return;
            }

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

            // Setup pagination
            setupPagination(data.total, limit);
        })
        .catch((error) => console.error('Error loading products:', error));
}

function loadCategories() {
    apiClient
        .getCategories()
        .then((data) => {
            const container = document.getElementById('categoryFilter');
            if (!container) return;

            container.innerHTML = data.categories
                .map(
                    (category) => `
                <label>
                    <input type="checkbox" value="${category}" onchange="filterByCategory()">
                    ${category}
                </label>
            `
                )
                .join('');

            // Set current category if any
            if (currentCategory) {
                const checkbox = container.querySelector(`input[value="${currentCategory}"]`);
                if (checkbox) checkbox.checked = true;
            }
        })
        .catch((error) => console.error('Error loading categories:', error));
}

function setupFilters() {
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('change', () => {
            const price = priceRange.value;
            document.getElementById('priceValue').textContent = `₹0 - ₹${price}`;
        });
    }
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            currentSearch = searchInput.value;
            currentPage = 1;
            loadProducts();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = searchInput.value;
                currentPage = 1;
                loadProducts();
            }
        });
    }
}

function filterByCategory() {
    const checkboxes = document.querySelectorAll('#categoryFilter input[type="checkbox"]:checked');
    const selectedCategories = Array.from(checkboxes).map((cb) => cb.value);
    currentCategory = selectedCategories[0] || '';
    currentPage = 1;
    loadProducts();
}

function setupPagination(total, limit) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="loadProducts(${i})">
                ${i}
            </button>
        `;
    }

    paginationContainer.innerHTML = html;
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
