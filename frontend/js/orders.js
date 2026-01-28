// Orders Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    loadOrders();
    setupModal();
});

function loadOrders() {
    apiClient
        .getOrders()
        .then((data) => {
            const container = document.getElementById('ordersList');
            if (!container) return;

            if (!data.orders || data.orders.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <p>No orders yet</p>
                        <a href="catalog.html" class="btn-primary" style="margin-top: 1rem;">Continue Shopping</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = data.orders
                .map(
                    (order) => `
                <div class="order-card" onclick="viewOrder('${order.order_id}')">
                    <div class="order-header">
                        <div>
                            <div class="order-id">Order #${order.order_id.substring(0, 8)}</div>
                        </div>
                        <div>
                            <div class="order-amount">₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                            <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
                        </div>
                        <div>
                            <div class="detail-item">${new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="order-details">
                        <div class="detail-item">
                            <div class="detail-label">Items</div>
                            <div>${order.items.length} item(s)</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Shipping</div>
                            <div>₹${order.shipping_charge}</div>
                        </div>
                        ${order.shipment_id ? `
                            <div class="detail-item">
                                <div class="detail-label">Tracking ID</div>
                                <div>${order.shipment_id}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `
                )
                .join('');
        })
        .catch((error) => console.error('Error loading orders:', error));
}

function viewOrder(orderId) {
    apiClient
        .getOrder(orderId)
        .then((order) => {
            const modal = document.getElementById('orderModal');
            const orderDetails = document.getElementById('orderDetails');

            let deliveryUpdatesHTML = '';
            if (order.delivery_updates && order.delivery_updates.length > 0) {
                deliveryUpdatesHTML = `
                    <h3>Delivery Updates</h3>
                    <ul>
                        ${order.delivery_updates
                            .map(
                                (update) => `
                            <li>
                                <strong>${new Date(update.timestamp).toLocaleString()}</strong>
                                <p>${update.update}</p>
                            </li>
                        `
                            )
                            .join('')}
                    </ul>
                `;
            }

            orderDetails.innerHTML = `
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${order.order_id}</p>
                <p><strong>Status:</strong> <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span></p>
                <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                
                <h3>Items</h3>
                <ul>
                    ${order.items
                        .map(
                            (item) => `
                        <li>
                            ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                        </li>
                    `
                        )
                        .join('')}
                </ul>
                
                <h3>Shipping Address</h3>
                <p>
                    ${order.shipping_address.firstName} ${order.shipping_address.lastName}<br>
                    ${order.shipping_address.address}<br>
                    ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.pincode}<br>
                    ${order.shipping_address.country}<br>
                    ${order.shipping_address.phone}
                </p>
                
                <h3>Total Amount</h3>
                <p><strong>₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</strong></p>
                
                ${order.shipment_id ? `
                    <h3>Shipment Information</h3>
                    <p><strong>Tracking ID:</strong> ${order.shipment_id}</p>
                    <p><strong>Carrier:</strong> ${order.carrier || 'Not specified'}</p>
                ` : ''}
                
                ${deliveryUpdatesHTML}
                
                ${order.status === 'pending' ? `
                    <button class="view-btn" onclick="cancelOrder('${order.order_id}')">Cancel Order</button>
                ` : ''}
            `;

            modal.style.display = 'block';
        })
        .catch((error) => alert('Error: ' + error.message));
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        apiClient
            .cancelOrder(orderId)
            .then(() => {
                alert('Order cancelled successfully');
                document.getElementById('orderModal').style.display = 'none';
                loadOrders();
            })
            .catch((error) => alert('Error: ' + error.message));
    }
}

function setupModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}
