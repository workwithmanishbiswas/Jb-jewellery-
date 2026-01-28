import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email, subject, body, is_html=False):
    """Send email using Zoho Mail"""
    try:
        sender_email = os.getenv('ZOHO_MAIL_USER')
        sender_password = os.getenv('ZOHO_MAIL_PASSWORD')
        
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = sender_email
        message['To'] = to_email
        
        if is_html:
            message.attach(MIMEText(body, 'html'))
        else:
            message.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP_SSL('smtp.zoho.com', 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, message.as_string())
        
        return True
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
