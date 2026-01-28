// Checkout Page JavaScript
let cartItems = [];
let cartTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadCheckoutData();
    setupPaymentButton();
});

function loadCheckoutData() {
    apiClient
        .getCart()
        .then((data) => {
            cartItems = data.cart;

            if (!cartItems || cartItems.length === 0) {
                alert('Your cart is empty');
                window.location.href = 'cart.html';
                return;
            }

            // Load order summary
            let summaryHTML = '';
            let subtotal = 0;

            cartItems.forEach((item) => {
                const itemTotal = item.products.price * item.quantity;
                subtotal += itemTotal;
                summaryHTML += `
                    <div class="summary-item">
                        <strong>${item.products.name} x${item.quantity}</strong>
                        <span>₹${itemTotal.toLocaleString('en-IN')}</span>
                    </div>
                `;
            });

            document.getElementById('orderSummary').innerHTML = summaryHTML;

            // Update totals
            const shippingCharge = document.getElementById('shippingCharge');
            updateTotal(subtotal, 0);

            if (shippingCharge) {
                shippingCharge.addEventListener('change', () => {
                    const shipping = parseFloat(shippingCharge.value) || 0;
                    updateTotal(subtotal, shipping);
                });
            }
        })
        .catch((error) => console.error('Error loading cart:', error));
}

function updateTotal(subtotal, shipping) {
    const total = subtotal + shipping;
    document.getElementById('totalAmount').textContent = `₹${total.toLocaleString('en-IN')}`;
    cartTotal = total;
    sessionStorage.setItem('cartTotal', total);
}

function setupPaymentButton() {
    const paymentBtn = document.getElementById('paymentBtn');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', handlePayment);
    }
}

function handlePayment(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    const country = document.getElementById('country').value;
    const phone = document.getElementById('phone').value;
    const notes = document.getElementById('notes').value;
    const shippingCharge = parseFloat(document.getElementById('shippingCharge').value) || 0;

    // Validate form
    if (!firstName || !lastName || !address || !city || !state || !pincode || !phone) {
        alert('Please fill in all required fields');
        return;
    }

    const shippingAddress = {
        firstName,
        lastName,
        address,
        city,
        state,
        pincode,
        country,
        phone,
    };

    // Create order
    const orderData = {
        cart_items: cartItems.map((item) => ({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
        shipping_charge: shippingCharge,
        notes: notes,
    };

    apiClient
        .createOrder(orderData)
        .then((data) => {
            // Store order ID for payment
            sessionStorage.setItem('orderId', data.order.order_id);
            sessionStorage.setItem('orderAmount', cartTotal);

            // Redirect to payment
            initiatePayment(data.order);
        })
        .catch((error) => {
            alert('Error creating order: ' + error.message);
        });
}

function initiatePayment(order) {
    // Integrate with Cashfree API
    // For now, simulating payment
    alert('Order created! Order ID: ' + order.order_id);

    // In production, integrate with Cashfree:
    // const config = {
    //     key_id: 'YOUR_CASHFREE_KEY_ID',
    //     order_id: order.order_id,
    //     customer_details: {
    //         customer_id: 'user_id',
    //         customer_name: shipping_address.firstName,
    //         customer_email: user.email,
    //         customer_phone: shipping_address.phone
    //     },
    //     order_meta: {
    //         notify_url: 'YOUR_BACKEND_URL/payment-callback',
    //         return_url: window.location.origin + '/pages/orders.html'
    //     },
    //     amount: cartTotal * 100 // Cashfree expects amount in paise
    // };
    // Cashfree.checkout(config);

    // Clear cart and redirect
    apiClient
        .clearCart()
        .then(() => {
            window.location.href = `orders.html?order=${order.order_id}`;
        })
        .catch((error) => console.error('Error clearing cart:', error));
}
