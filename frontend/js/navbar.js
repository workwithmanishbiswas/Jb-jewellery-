// Navbar JavaScript
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

function updateNavbar() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');

    if (token && user.id) {
        // User is logged in
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            document.getElementById('userName').textContent = user.name || 'User';
        }

        // Update cart count
        updateCartCount();
    } else {
        // User is not logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
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
        .catch((error) => {
            console.error('Error fetching cart:', error);
        });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateNavbar();
        window.location.href = '/';
    });
}

// Dropdown menu toggle
const userDropdown = document.getElementById('userDropdown');
if (userDropdown) {
    userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('dropdownMenu');
        if (menu) {
            menu.style.display =
                menu.style.display === 'block' ? 'none' : 'block';
        }
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.style.display = 'none';
    }
});
