// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const wholesaleForm = document.getElementById('wholesaleForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    if (wholesaleForm) {
        wholesaleForm.addEventListener('submit', handleWholesaleSubmit);
    }
});

async function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const messageBox = document.getElementById('messageBox');

    try {
        // In production, send to backend
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, phone, subject, message })
        // });

        showMessage(messageBox, 'Thank you! Your message has been sent. We will get back to you soon.', 'success');

        // Clear form
        document.getElementById('contactForm').reset();

        setTimeout(() => {
            messageBox.innerHTML = '';
        }, 3000);
    } catch (error) {
        showMessage(messageBox, 'Error sending message: ' + error.message, 'error');
    }
}

async function handleWholesaleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const company = document.getElementById('company').value;
    const contactName = document.getElementById('contact_name').value;
    const email = document.getElementById('wholesale_email').value;
    const phone = document.getElementById('wholesale_phone').value;
    const deliveryLocation = document.getElementById('delivery_location').value;
    const productDetails = document.getElementById('product_details').value;
    const specialRequirements = document.getElementById('special_requirements').value;
    const messageBox = document.getElementById('wholesaleMessageBox');

    try {
        let response;

        if (token) {
            // User is logged in
            response = await apiClient.submitWholesaleInquiry({
                company_name: company,
                contact_name: contactName,
                phone: phone,
                email: email,
                product_details: productDetails,
                quantity: 0,
                delivery_location: deliveryLocation,
                special_requirements: specialRequirements,
            });
        } else {
            // User is not logged in - just show success message
            response = { message: 'Wholesale inquiry submitted' };
        }

        showMessage(messageBox, 'Thank you! Your wholesale inquiry has been received. Our team will contact you shortly.', 'success');

        // Clear form
        document.getElementById('wholesaleForm').reset();

        setTimeout(() => {
            messageBox.innerHTML = '';
        }, 3000);
    } catch (error) {
        showMessage(messageBox, 'Error submitting inquiry: ' + error.message, 'error');
    }
}

function showMessage(element, message, type) {
    if (!element) return;
    element.innerHTML = `<div class="alert ${type}">${message}</div>`;
    element.querySelector('.alert').style.display = 'block';
}
