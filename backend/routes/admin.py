from flask import Blueprint, request, jsonify
from database.supabase_client import get_supabase
from utils.jwt_handler import admin_required
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    """Get all orders (admin only)"""
    try:
        supabase = get_supabase()
        
        # Get filter params
        status = request.args.get('status')
        
        query = supabase.table('orders').select('*, users(*)')
        
        if status:
            query = query.eq('status', status)
        
        response = query.order('created_at', desc=True).execute()
        
        return jsonify({
            'orders': response.data,
            'total': len(response.data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>/approve', methods=['POST'])
@admin_required
def approve_order(order_id):
    """Approve order (admin only)"""
    try:
        data = request.get_json()
        
        supabase = get_supabase()
        
        response = supabase.table('orders').update({
            'status': 'approved',
            'approved_at': datetime.now().isoformat(),
            'admin_notes': data.get('notes', '')
        }).eq('order_id', order_id).execute()
        
        if response.data:
            return jsonify({'message': 'Order approved'}), 200
        else:
            return jsonify({'error': 'Order not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>/reject', methods=['POST'])
@admin_required
def reject_order(order_id):
    """Reject order (admin only)"""
    try:
        data = request.get_json()
        
        supabase = get_supabase()
        
        response = supabase.table('orders').update({
            'status': 'rejected',
            'rejection_reason': data.get('reason', '')
        }).eq('order_id', order_id).execute()
        
        if response.data:
            return jsonify({'message': 'Order rejected'}), 200
        else:
            return jsonify({'error': 'Order not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>/shipment', methods=['POST'])
@admin_required
def add_shipment(order_id):
    """Add shipment tracking (admin only)"""
    try:
        data = request.get_json()
        shipment_id = data.get('shipment_id')
        carrier = data.get('carrier')
        
        if not shipment_id:
            return jsonify({'error': 'Shipment ID required'}), 400
        
        supabase = get_supabase()
        
        response = supabase.table('orders').update({
            'shipment_id': shipment_id,
            'carrier': carrier,
            'status': 'shipped',
            'shipped_at': datetime.now().isoformat()
        }).eq('order_id', order_id).execute()
        
        if response.data:
            return jsonify({'message': 'Shipment added'}), 200
        else:
            return jsonify({'error': 'Order not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>/delivery-update', methods=['POST'])
@admin_required
def update_delivery(order_id):
    """Update delivery status (admin only)"""
    try:
        data = request.get_json()
        update_text = data.get('update')
        
        if not update_text:
            return jsonify({'error': 'Update text required'}), 400
        
        supabase = get_supabase()
        
        # Get current order
        order = supabase.table('orders').select('*').eq('order_id', order_id).execute()
        
        if not order.data:
            return jsonify({'error': 'Order not found'}), 404
        
        # Add update to delivery updates array
        delivery_updates = order.data[0].get('delivery_updates', [])
        delivery_updates.append({
            'timestamp': datetime.now().isoformat(),
            'update': update_text
        })
        
        response = supabase.table('orders').update({
            'delivery_updates': delivery_updates,
            'last_update': datetime.now().isoformat()
        }).eq('order_id', order_id).execute()
        
        if response.data:
            return jsonify({'message': 'Delivery update added'}), 200
        else:
            return jsonify({'error': 'Failed to update'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>/complete', methods=['POST'])
@admin_required
def complete_order(order_id):
    """Mark order as delivered (admin only)"""
    try:
        supabase = get_supabase()
        
        response = supabase.table('orders').update({
            'status': 'delivered',
            'delivered_at': datetime.now().isoformat()
        }).eq('order_id', order_id).execute()
        
        if response.data:
            return jsonify({'message': 'Order marked as delivered'}), 200
        else:
            return jsonify({'error': 'Order not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/wholesale-inquiries', methods=['GET'])
@admin_required
def get_wholesale_inquiries():
    """Get all wholesale inquiries (admin only)"""
    try:
        supabase = get_supabase()
        
        response = supabase.table('wholesale_inquiries').select('*').order('created_at', desc=True).execute()
        
        return jsonify({
            'inquiries': response.data,
            'total': len(response.data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard():
    """Get admin dashboard stats"""
    try:
        supabase = get_supabase()
        
        # Get total orders
        orders = supabase.table('orders').select('*', count='exact').execute()
        
        # Get pending orders
        pending = supabase.table('orders').select('*', count='exact').eq('status', 'pending').execute()
        
        # Get total revenue
        delivered_orders = supabase.table('orders').select('total_amount').eq('status', 'delivered').execute()
        total_revenue = sum([order['total_amount'] for order in delivered_orders.data]) if delivered_orders.data else 0
        
        return jsonify({
            'total_orders': orders.count or 0,
            'pending_orders': pending.count or 0,
            'total_revenue': total_revenue,
            'total_products': 0  # Calculate from products table
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
