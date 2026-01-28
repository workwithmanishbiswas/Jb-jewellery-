import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import requests
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Global variable to store access token
_zoho_access_token = None
_token_expiry = None

def get_zoho_access_token():
    """Get access token from Zoho using refresh token"""
    global _zoho_access_token, _token_expiry
    
    # Check if token is still valid
    if _zoho_access_token and _token_expiry and datetime.now() < _token_expiry:
        return _zoho_access_token
    
    try:
        client_id = os.getenv('ZOHO_CLIENT_ID')
        client_secret = os.getenv('ZOHO_CLIENT_SECRET')
        refresh_token = os.getenv('ZOHO_REFRESH_TOKEN')
        
        token_url = 'https://accounts.zoho.in/oauth/v2/token'
        
        payload = {
            'grant_type': 'refresh_token',
            'client_id': client_id,
            'client_secret': client_secret,
            'refresh_token': refresh_token
        }
        
        response = requests.post(token_url, data=payload)
        
        if response.status_code == 200:
            token_data = response.json()
            _zoho_access_token = token_data.get('access_token')
            # Token expires in 1 hour, set expiry to 55 minutes to be safe
            _token_expiry = datetime.now() + timedelta(minutes=55)
            return _zoho_access_token
        else:
            print(f"Failed to get access token: {response.text}")
            return None
    except Exception as e:
        print(f"Error getting access token: {str(e)}")
        return None

def send_email(to_email, subject, body, is_html=False):
    """Send email using Zoho Mail OAuth2"""
    try:
        access_token = get_zoho_access_token()
        if not access_token:
            raise Exception("Failed to get Zoho access token")
        
        sender_email = os.getenv('ZOHO_MAIL_USER')
        org_id = os.getenv('ZOHO_ORG_ID')
        
        # Using Zoho Mail API v1
        url = f'https://mail.zoho.com/api/accounts/{org_id}/messages'
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'to': [{'email': to_email}],
            'from': {'email': sender_email},
            'subject': subject,
            'content': body,
            'contentType': 'html' if is_html else 'plain'
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            return True
        else:
            print(f"Email API error: {response.text}")
            return False
    except Exception as e:
        print(f"Email send failed: {str(e)}")
        return False

def send_order_confirmation(user_email, order_id, order_items):
    """Send order confirmation email"""
    subject = f"Order Confirmation - {order_id}"
    body = f"""
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p><strong>Order ID:</strong> {order_id}</p>
    <h3>Items:</h3>
    <ul>
    """
    for item in order_items:
        body += f"<li>{item['name']} - ₹{item['price']}</li>"
    body += "</ul>"
    
    return send_email(user_email, subject, body, is_html=True)

def send_admin_notification(order_data):
    """Send admin notification about new order"""
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@jbjewellery.com')
    subject = f"New Order - {order_data['order_id']}"
    body = f"""
    <h2>New Order Received</h2>
    <p><strong>Order ID:</strong> {order_data['order_id']}</p>
    <p><strong>Customer:</strong> {order_data['customer_name']}</p>
    <p><strong>Email:</strong> {order_data['customer_email']}</p>
    <p><strong>Total Amount:</strong> ₹{order_data['total_amount']}</p>
    <p>Please review and approve this order.</p>
    """
    
    return send_email(admin_email, subject, body, is_html=True)
