# Zoho Mail Integration Guide

## Setup Instructions

### 1. Create Zoho Mail Account

1. Go to https://www.zoho.com/mail/
2. Sign up for a free account
3. Create your email address (e.g., support@jbjewellery.com)
4. Verify your domain (optional but recommended)

### 2. Get Credentials

1. Go to Zoho Mail Settings
2. Find SMTP Settings
3. Copy your email and app password
4. Add them to your `.env` file:

```env
ZOHO_MAIL_USER=your-email@zoho.com
ZOHO_MAIL_PASSWORD=your-app-password
```

### 3. Zoho Mail SMTP Settings

```
Server: smtp.zoho.com
Port: 465 (SSL) or 587 (TLS)
Username: your-email@zoho.com
Password: app-specific password
```

## Email Templates

### 1. Order Confirmation Email

Sent to customer after order creation:
- Order ID
- Order items
- Total amount
- Estimated delivery date

### 2. Admin Notification Email

Sent to admin for new orders:
- Order details
- Customer information
- Amount to be approved

### 3. Order Status Update Email

Sent when order status changes:
- Shipment ID (when shipped)
- Delivery updates
- Tracking information

## Custom Email Domain (Optional)

To use your own domain with Zoho Mail:

1. Add domain in Zoho Mail settings
2. Add DNS records to your domain registrar
3. Verify domain ownership
4. Update email address in `.env`

## Testing Email Integration

Run the test script:

```python
from backend.utils.email_service import send_email

# Test email
send_email(
    'test@example.com',
    'Test Subject',
    '<h1>Test Email</h1><p>This is a test email</p>',
    is_html=True
)
```

## Email Limits

- **Free Plan**: Up to 100 emails per day
- **Paid Plans**: Higher limits with additional features

## Troubleshooting

### "Authentication Failed"
- Check username and password
- Use app-specific password, not main password
- Enable "Allow Less Secure Apps" if needed

### "Connection Timeout"
- Check if port 465 or 587 is not blocked
- Try different port
- Check firewall settings

### "Email Not Delivered"
- Check recipient email address
- Verify SMTP credentials
- Check email logs in Zoho Mail dashboard
- Verify SPF/DKIM records for custom domain

## Email Security

1. Use environment variables for credentials
2. Never commit `.env` file to version control
3. Use app-specific passwords instead of main password
4. Enable two-factor authentication
5. Regularly rotate passwords

## References

- Zoho Mail Documentation: https://www.zoho.com/mail/help/
- SMTP Configuration: https://www.zoho.com/mail/help/smtp.html
- App Passwords: https://www.zoho.com/accounts/security/app-passwords.html
