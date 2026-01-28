# Cashfree Payment Integration Guide

## Setup Instructions

### 1. Get Cashfree Credentials

1. Go to https://www.cashfree.com
2. Sign up for a merchant account
3. Go to Dashboard > Settings > API Keys
4. Copy your Key ID and Key Secret
5. Add them to your `.env` file:

```env
CASHFREE_KEY_ID=your_key_id
CASHFREE_KEY_SECRET=your_key_secret
CASHFREE_API_URL=https://api.cashfree.com/pg  # Production
# For testing: CASHFREE_API_URL=https://sandbox.cashfree.com/pg
```

## Integration Implementation

### Backend (app.py)

```python
import requests
import json

def create_cashfree_payment(order_id, amount, customer_email, customer_phone):
    """
    Create payment session with Cashfree
    """
    url = f"{Config.CASHFREE_API_URL}/orders"
    
    headers = {
        "accept": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": Config.CASHFREE_KEY_ID,
        "x-client-secret": Config.CASHFREE_KEY_SECRET,
        "Content-Type": "application/json"
    }
    
    payload = {
        "order_id": order_id,
        "order_amount": amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": customer_id,
            "customer_email": customer_email,
            "customer_phone": customer_phone
        },
        "order_meta": {
            "notify_url": "https://your-domain.com/api/payment-callback",
            "return_url": "https://your-domain.com/pages/orders.html"
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def verify_payment(order_id):
    """
    Verify payment status with Cashfree
    """
    url = f"{Config.CASHFREE_API_URL}/orders/{order_id}"
    
    headers = {
        "accept": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": Config.CASHFREE_KEY_ID,
        "x-client-secret": Config.CASHFREE_KEY_SECRET
    }
    
    response = requests.get(url, headers=headers)
    return response.json()
```

### Frontend (checkout.js)

```javascript
// Update the initiatePayment function

function initiatePayment(order) {
    // Create payment order on backend
    fetch('/api/create-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            order_id: order.order_id,
            amount: cartTotal
        })
    })
    .then(response => response.json())
    .then(data => {
        // Use Cashfree SDK to open payment page
        Cashfree.redirectToCheckout({
            sessionId: data.session_id
        });
    })
    .catch(error => console.error('Error:', error));
}
```

## Testing

### Test Credentials (Sandbox)

Use the following test cards in sandbox environment:

**Success Cards:**
- Visa: 4111 1111 1111 1111
- Mastercard: 5555 5555 5555 4444
- Expiry: Any future date
- CVV: Any 3 digits

**Failed Cards:**
- Card: 4000 0000 0000 0002

## Security Considerations

1. Never expose your Key Secret on the frontend
2. Always validate payments on the backend
3. Use HTTPS for production
4. Store payment status securely in database
5. Handle payment callbacks securely

## Payment Webhook

Set up a webhook endpoint to handle payment notifications:

```python
@app.route('/api/payment-callback', methods=['POST'])
def payment_callback():
    data = request.json
    
    # Verify payment signature
    # Update order status based on payment result
    # Send confirmation emails
    
    return {'status': 'success'}, 200
```

## References

- Cashfree API Documentation: https://docs.cashfree.com
- Payment Gateway Integration Guide: https://docs.cashfree.com/integration-guide
- Test Cards: https://docs.cashfree.com/test-cards
