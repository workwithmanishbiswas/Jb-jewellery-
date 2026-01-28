// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadCart();
    setupCheckoutButton();
});

function loadCart() {
    apiClient
        .getCart()
        .then((data) => {
            const container = document.getElementById('cartItems');
            if (!container) return;

            if (!data.cart || data.cart.length === 0) {
                container.innerHTML = `
                    <div class="empty-cart">
                        <h3>Your cart is empty</h3>
                        <p>Start shopping to add items to your cart</p>
                        <a href="catalog.html" class="btn-primary" style="margin-top: 1rem;">Continue Shopping</a>
                    </div>
                `;
                document.getElementById('subtotal').textContent = '₹0';
                document.getElementById('shipping').textContent = '₹0';
                document.getElementById('total').textContent = '₹0';
                return;
            }

            let subtotal = 0;
            container.innerHTML = data.cart
                .map(
                    (item) => {
                        const itemTotal = item.products.price * item.quantity;
                        subtotal += itemTotal;
                        return `
                    <div class="cart-item">
                        <img src="${item.products.image_url}" alt="${item.products.name}" class="item-image">
                        <div class="item-details">
                            <h3>${item.products.name}</h3>
                            <p>₹${parseFloat(item.products.price).toLocaleString('en-IN')}</p>
                        </div>
                        <div class="item-quantity">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" value="${item.quantity}" readonly>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <div class="item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
                    }
                )
                .join('');

            // Update summary
            const shipping = 0;
            const total = subtotal + shipping;

            document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
            document.getElementById('shipping').textContent = `₹${shipping.toLocaleString('en-IN')}`;
            document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;

            // Store cart total for checkout
            sessionStorage.setItem('cartTotal', total);
        })
        .catch((error) => console.error('Error loading cart:', error));
}

function removeFromCart(cartItemId) {
    if (confirm('Remove this item from cart?')) {
        apiClient
            .removeFromCart(cartItemId)
            .then(() => {
                loadCart();
                updateCartCount();
            })
            .catch((error) => alert('Error: ' + error.message));
    }
}

function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
    }

    apiClient
        .updateCartItem(cartItemId, newQuantity)
        .then(() => {
            loadCart();
        })
        .catch((error) => alert('Error: ' + error.message));
}

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to proceed');
                window.location.href = 'login.html';
                return;
            }

            window.location.href = 'checkout.html';
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
