// Register Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageBox = document.getElementById('messageBox');

    // Validate passwords
    if (password !== confirmPassword) {
        showMessage(messageBox, 'Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(messageBox, 'Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const response = await apiClient.register({
            name,
            email,
            phone,
            password,
        });

        // Store token and user data
        apiClient.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Show success message
        showMessage(messageBox, 'Registration successful! Redirecting...', 'success');

        // Redirect to home
        setTimeout(() => {
            window.location.href = '../index.html';
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
