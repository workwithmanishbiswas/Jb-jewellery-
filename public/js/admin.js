// Admin Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user.is_admin) {
        alert('Admin access required');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('adminName').textContent = user.name || 'Admin';

    setupNavigation();
    loadDashboard();
    setupLogout();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');

            // Hide all sections
            document.querySelectorAll('.admin-section').forEach((s) => {
                s.classList.remove('active');
            });

            // Remove active class from all links
            navLinks.forEach((l) => l.classList.remove('active'));

            // Show selected section
            document.getElementById(section).classList.add('active');
            link.classList.add('active');

            // Load section data
            switch (section) {
                case 'orders':
                    loadOrders();
                    break;
                case 'products':
                    loadProducts();
                    break;
                case 'wholesale':
                    loadWholesaleInquiries();
                    break;
            }
        });
    });
}

function loadDashboard() {
    apiClient
        .getDashboard()
        .then((data) => {
            document.getElementById('totalOrders').textContent = data.total_orders;
            document.getElementById('pendingOrders').textContent = data.pending_orders;
            document.getElementById('totalRevenue').textContent = `₹${data.total_revenue.toLocaleString('en-IN')}`;
            document.getElementById('totalProducts').textContent = data.total_products;
        })
        .catch((error) => console.error('Error loading dashboard:', error));
}

function loadOrders() {
    const status = document.getElementById('orderStatusFilter').value;

    apiClient
        .getAllOrders(status)
        .then((data) => {
            const tbody = document.querySelector('#ordersTable tbody');
            if (!tbody) return;

            tbody.innerHTML = data.orders
                .map(
                    (order) => `
                <tr>
                    <td>${order.order_id.substring(0, 8)}</td>
                    <td>${order.users?.name || 'Unknown'}</td>
                    <td>₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                    <td><span class="order-status status-${order.status}">${order.status}</span></td>
                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn view-btn" onclick="viewOrderDetails('${order.order_id}')">View</button>
                        ${order.status === 'pending' ? `
                            <button class="action-btn approve-btn" onclick="approveOrder('${order.order_id}')">Approve</button>
                        ` : ''}
                    </td>
                </tr>
            `
                )
                .join('');
        })
        .catch((error) => console.error('Error loading orders:', error));
}

function loadProducts() {
    apiClient
        .getProducts(1, 100)
        .then((data) => {
            const tbody = document.querySelector('#productsTable tbody');
            if (!tbody) return;

            tbody.innerHTML = data.products
                .map(
                    (product) => `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>₹${parseFloat(product.price).toLocaleString('en-IN')}</td>
                    <td>${product.stock || 0}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `
                )
                .join('');
        })
        .catch((error) => console.error('Error loading products:', error));
}

function loadWholesaleInquiries() {
    apiClient
        .getWholesaleInquiries()
        .then((data) => {
            const tbody = document.querySelector('#wholesaleTable tbody');
            if (!tbody) return;

            tbody.innerHTML = data.inquiries
                .map(
                    (inquiry) => `
                <tr>
                    <td>${inquiry.company_name}</td>
                    <td>${inquiry.contact_name || 'N/A'}</td>
                    <td>${inquiry.email}</td>
                    <td>${inquiry.quantity || 'Not specified'}</td>
                    <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td><span class="order-status status-${inquiry.status}">${inquiry.status}</span></td>
                    <td>
                        <button class="action-btn view-btn" onclick="viewInquiry('${inquiry.id}')">View</button>
                    </td>
                </tr>
            `
                )
                .join('');
        })
        .catch((error) => console.error('Error loading inquiries:', error));
}

function viewOrderDetails(orderId) {
    apiClient
        .getOrder(orderId)
        .then((order) => {
            const modal = document.getElementById('orderDetailsModal');
            const content = document.getElementById('orderDetailsContent');

            content.innerHTML = `
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${order.order_id}</p>
                <p><strong>Customer:</strong> ${order.users?.name || 'Unknown'}</p>
                <p><strong>Email:</strong> ${order.users?.email || 'Unknown'}</p>
                <p><strong>Status:</strong> <span class="order-status status-${order.status}">${order.status}</span></p>
                <p><strong>Total Amount:</strong> ₹${parseFloat(order.total_amount).toLocaleString('en-IN')}</p>
                
                <h3>Items</h3>
                <ul>
                    ${order.items.map((item) => `<li>${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}</li>`).join('')}
                </ul>
                
                <h3>Shipping Address</h3>
                <p>${JSON.stringify(order.shipping_address, null, 2)}</p>
                
                ${order.status === 'pending' ? `
                    <textarea id="adminNotes" placeholder="Add notes (optional)" style="width: 100%; height: 80px; margin: 1rem 0;"></textarea>
                    <button class="action-btn approve-btn" onclick="confirmApproveOrder('${order.order_id}')">Approve Order</button>
                    <button class="action-btn delete-btn" onclick="confirmRejectOrder('${order.order_id}')">Reject Order</button>
                ` : order.status === 'approved' ? `
                    <div style="margin: 1rem 0;">
                        <input type="text" id="shipmentId" placeholder="Enter Shipment ID" style="width: 100%; padding: 8px; margin-bottom: 0.5rem;">
                        <input type="text" id="carrier" placeholder="Enter Carrier Name" style="width: 100%; padding: 8px; margin-bottom: 0.5rem;">
                        <button class="action-btn approve-btn" onclick="addShipment('${order.order_id}')">Add Shipment</button>
                    </div>
                ` : ''}
            `;

            modal.style.display = 'block';
        })
        .catch((error) => alert('Error: ' + error.message));
}

function confirmApproveOrder(orderId) {
    const notes = document.getElementById('adminNotes').value;
    approveOrder(orderId, notes);
}

function approveOrder(orderId, notes = '') {
    apiClient
        .approveOrder(orderId, notes)
        .then(() => {
            alert('Order approved!');
            document.getElementById('orderDetailsModal').style.display = 'none';
            loadOrders();
        })
        .catch((error) => alert('Error: ' + error.message));
}

function confirmRejectOrder(orderId) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
        apiClient
            .rejectOrder(orderId, reason)
            .then(() => {
                alert('Order rejected!');
                document.getElementById('orderDetailsModal').style.display = 'none';
                loadOrders();
            })
            .catch((error) => alert('Error: ' + error.message));
    }
}

function addShipment(orderId) {
    const shipmentId = document.getElementById('shipmentId').value;
    const carrier = document.getElementById('carrier').value;

    if (!shipmentId) {
        alert('Please enter shipment ID');
        return;
    }

    apiClient
        .addShipment(orderId, shipmentId, carrier)
        .then(() => {
            alert('Shipment added!');
            document.getElementById('orderDetailsModal').style.display = 'none';
            loadOrders();
        })
        .catch((error) => alert('Error: ' + error.message));
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        apiClient
            .deleteProduct(productId)
            .then(() => {
                alert('Product deleted!');
                loadProducts();
            })
            .catch((error) => alert('Error: ' + error.message));
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../index.html';
        });
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('orderDetailsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Filter orders by status
const statusFilter = document.getElementById('orderStatusFilter');
if (statusFilter) {
    statusFilter.addEventListener('change', () => {
        loadOrders();
    });
}

// Add product form
const addProductBtn = document.getElementById('addProductBtn');
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        document.getElementById('productForm').style.display = 'block';
    });
}

const cancelProductBtn = document.getElementById('cancelProductBtn');
if (cancelProductBtn) {
    cancelProductBtn.addEventListener('click', () => {
        document.getElementById('productForm').style.display = 'none';
    });
}

const productForm = document.getElementById('productFormElement');
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            image_url: document.getElementById('productImage').value,
            packaging_charge: parseFloat(document.getElementById('productPackaging').value) || 0,
            shipment_charge: parseFloat(document.getElementById('productShipment').value) || 0,
            stock: parseInt(document.getElementById('productStock').value) || 0,
        };

        apiClient
            .createProduct(productData)
            .then(() => {
                alert('Product created!');
                document.getElementById('productForm').style.display = 'none';
                productForm.reset();
                loadProducts();
            })
            .catch((error) => alert('Error: ' + error.message));
    });
}
