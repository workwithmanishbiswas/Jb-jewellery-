// Login Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('messageBox');

    try {
        const response = await apiClient.login(email, password);

        // Store token and user data
        apiClient.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Show success message
        showMessage(messageBox, 'Login successful! Redirecting...', 'success');

        // Redirect to home or previous page
        setTimeout(() => {
            const redirectUrl = sessionStorage.getItem('redirectUrl') || '../index.html';
            window.location.href = redirectUrl;
        }, 1000);
    } catch (error) {
        showMessage(messageBox, error.message, 'error');
    }
}

function showMessage(element, message, type) {
    if (!element) return;
    element.innerHTML = `<div class="alert ${type}">${message}</div>`;
    element.querySelector('.alert').style.display = 'block';
}
