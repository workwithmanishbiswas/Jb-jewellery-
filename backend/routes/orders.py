from flask import Blueprint, request, jsonify
try:
    from database.supabase_client import get_supabase
except ImportError:
    from backend.database.supabase_client import get_supabase

try:
    from utils.jwt_handler import token_required
except ImportError:
    from backend.utils.jwt_handler import token_required

try:
    from utils.email_service import send_order_confirmation, send_admin_notification
except ImportError:
    from backend.utils.email_service import send_order_confirmation, send_admin_notification
from datetime import datetime
import uuid

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/create', methods=['POST'])
@token_required
def create_order():
    """Create new order"""
    try:
        data = request.get_json()
        cart_items = data.get('cart_items', [])
        shipping_address = data.get('shipping_address')
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        if not shipping_address:
            return jsonify({'error': 'Shipping address required'}), 400
        
        supabase = get_supabase()
        
        # Calculate total
        total_amount = 0
        for item in cart_items:
            total_amount += item['price'] * item['quantity']
        
        # Add shipping charge
        shipping_charge = data.get('shipping_charge', 0)
        total_amount += shipping_charge
        
        # Create order
        order_id = str(uuid.uuid4())
        order_data = {
            'order_id': order_id,
            'user_id': request.user_id,
            'items': cart_items,
            'total_amount': total_amount,
            'shipping_charge': shipping_charge,
            'shipping_address': shipping_address,
            'status': 'pending',
            'payment_status': 'pending',
            'created_at': datetime.now().isoformat(),
            'notes': data.get('notes', '')
        }
        
        response = supabase.table('orders').insert(order_data).execute()
        
        if response.data:
            order = response.data[0]
            
            # Clear cart
            supabase.table('cart').delete().eq('user_id', request.user_id).execute()
            
            # Get user email
            user = supabase.table('users').select('email, name').eq('id', request.user_id).execute()
            
            # Send confirmation email
            if user.data:
                send_order_confirmation(user.data[0]['email'], order_id, cart_items)
                send_admin_notification({
                    'order_id': order_id,
                    'customer_name': user.data[0]['name'],
                    'customer_email': user.data[0]['email'],
                    'total_amount': total_amount
                })
            
            return jsonify({
                'message': 'Order created successfully',
                'order': order
            }), 201
        else:
            return jsonify({'error': 'Failed to create order'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/', methods=['GET'])
@token_required
def get_orders():
    """Get user's orders"""
    try:
        supabase = get_supabase()
        
        response = supabase.table('orders').select('*').eq('user_id', request.user_id).order('created_at', desc=True).execute()
        
        return jsonify({
            'orders': response.data,
            'total': len(response.data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<order_id>', methods=['GET'])
@token_required
def get_order(order_id):
    """Get order details"""
    try:
        supabase = get_supabase()
        
        response = supabase.table('orders').select('*').eq('order_id', order_id).eq('user_id', request.user_id).execute()
        
        if response.data:
            return jsonify(response.data[0]), 200
        else:
            return jsonify({'error': 'Order not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<order_id>/cancel', methods=['POST'])
@token_required
def cancel_order(order_id):
    """Cancel order"""
    try:
        supabase = get_supabase()
        
        # Check order status
        response = supabase.table('orders').select('*').eq('order_id', order_id).eq('user_id', request.user_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Order not found'}), 404
        
        order = response.data[0]
        if order['status'] != 'pending':
            return jsonify({'error': 'Can only cancel pending orders'}), 400
        
        # Update order status
        updated = supabase.table('orders').update({'status': 'cancelled'}).eq('order_id', order_id).execute()
        
        return jsonify({'message': 'Order cancelled successfully'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/wholesale-inquiry', methods=['POST'])
@token_required
def wholesale_inquiry():
    """Create wholesale/bulk order inquiry"""
    try:
        data = request.get_json()
        
        inquiry_data = {
            'user_id': request.user_id,
            'company_name': data.get('company_name'),
            'phone': data.get('phone'),
            'email': data.get('email'),
            'product_details': data.get('product_details'),
            'quantity': data.get('quantity'),
            'delivery_location': data.get('delivery_location'),
            'special_requirements': data.get('special_requirements'),
            'status': 'new',
            'created_at': datetime.now().isoformat()
        }
        
        supabase = get_supabase()
        response = supabase.table('wholesale_inquiries').insert(inquiry_data).execute()
        
        if response.data:
            return jsonify({
                'message': 'Wholesale inquiry submitted successfully',
                'inquiry': response.data[0]
            }), 201
        else:
            return jsonify({'error': 'Failed to submit inquiry'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
