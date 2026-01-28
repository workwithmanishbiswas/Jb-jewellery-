// API Client
const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = this.getAuthHeaders();

        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth Endpoints
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async verifyToken(token) {
        return this.request('/auth/verify-token', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    // Product Endpoints
    async getProducts(page = 1, limit = 12, search = '', category = '') {
        let endpoint = `/products?page=${page}&limit=${limit}`;
        if (search) endpoint += `&search=${search}`;
        if (category) endpoint += `&category=${category}`;
        return this.request(endpoint);
    }

    async getProduct(productId) {
        return this.request(`/products/${productId}`);
    }

    async createProduct(productData) {
        return this.request('/products/admin/create', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    async updateProduct(productId, productData) {
        return this.request(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    }

    async deleteProduct(productId) {
        return this.request(`/products/${productId}`, {
            method: 'DELETE',
        });
    }

    async getCategories() {
        return this.request('/products/categories');
    }

    // Cart Endpoints
    async addToCart(productId, quantity = 1) {
        return this.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity }),
        });
    }

    async getCart() {
        return this.request('/cart');
    }

    async removeFromCart(cartItemId) {
        return this.request(`/cart/${cartItemId}`, {
            method: 'DELETE',
        });
    }

    async updateCartItem(cartItemId, quantity) {
        return this.request(`/cart/${cartItemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    }

    async clearCart() {
        return this.request('/cart/clear', {
            method: 'POST',
        });
    }

    // Order Endpoints
    async createOrder(orderData) {
        return this.request('/orders/create', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getOrders() {
        return this.request('/orders');
    }

    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async cancelOrder(orderId) {
        return this.request(`/orders/${orderId}/cancel`, {
            method: 'POST',
        });
    }

    async submitWholesaleInquiry(inquiryData) {
        return this.request('/orders/wholesale-inquiry', {
            method: 'POST',
            body: JSON.stringify(inquiryData),
        });
    }

    // Admin Endpoints
    async getAllOrders(status = '') {
        let endpoint = '/admin/orders';
        if (status) endpoint += `?status=${status}`;
        return this.request(endpoint);
    }

    async approveOrder(orderId, notes = '') {
        return this.request(`/admin/orders/${orderId}/approve`, {
            method: 'POST',
            body: JSON.stringify({ notes }),
        });
    }

    async rejectOrder(orderId, reason = '') {
        return this.request(`/admin/orders/${orderId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async addShipment(orderId, shipmentId, carrier = '') {
        return this.request(`/admin/orders/${orderId}/shipment`, {
            method: 'POST',
            body: JSON.stringify({ shipment_id: shipmentId, carrier }),
        });
    }

    async updateDelivery(orderId, update) {
        return this.request(`/admin/orders/${orderId}/delivery-update`, {
            method: 'POST',
            body: JSON.stringify({ update }),
        });
    }

    async completeOrder(orderId) {
        return this.request(`/admin/orders/${orderId}/complete`, {
            method: 'POST',
        });
    }

    async getWholesaleInquiries() {
        return this.request('/admin/wholesale-inquiries');
    }

    async getDashboard() {
        return this.request('/admin/dashboard');
    }
}

// Global API client instance
const apiClient = new APIClient();
