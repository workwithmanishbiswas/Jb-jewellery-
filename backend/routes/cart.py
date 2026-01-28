from flask import Blueprint, request, jsonify
from database.supabase_client import get_supabase
from utils.jwt_handler import token_required
from datetime import datetime

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/add', methods=['POST'])
@token_required
def add_to_cart():
    """Add item to cart"""
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'error': 'Product ID required'}), 400
        
        supabase = get_supabase()
        
        # Check if product exists
        product = supabase.table('products').select('*').eq('id', product_id).execute()
        if not product.data:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if item already in cart
        existing = supabase.table('cart').select('*').eq('user_id', request.user_id).eq('product_id', product_id).execute()
        
        if existing.data:
            # Update quantity
            new_quantity = existing.data[0]['quantity'] + quantity
            response = supabase.table('cart').update({'quantity': new_quantity}).eq('id', existing.data[0]['id']).execute()
        else:
            # Add new item
            cart_item = {
                'user_id': request.user_id,
                'product_id': product_id,
                'quantity': quantity,
                'added_at': datetime.now().isoformat()
            }
            response = supabase.table('cart').insert(cart_item).execute()
        
        return jsonify({'message': 'Item added to cart'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart():
    """Get user's cart"""
    try:
        supabase = get_supabase()
        
        # Get cart items with product details
        response = supabase.table('cart').select('*, products(*)').eq('user_id', request.user_id).execute()
        
        return jsonify({
            'cart': response.data,
            'total_items': len(response.data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/<int:cart_item_id>', methods=['DELETE'])
@token_required
def remove_from_cart(cart_item_id):
    """Remove item from cart"""
    try:
        supabase = get_supabase()
        
        response = supabase.table('cart').delete().eq('id', cart_item_id).eq('user_id', request.user_id).execute()
        
        return jsonify({'message': 'Item removed from cart'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/<int:cart_item_id>', methods=['PUT'])
@token_required
def update_cart_item(cart_item_id):
    """Update cart item quantity"""
    try:
        data = request.get_json()
        quantity = data.get('quantity', 1)
        
        if quantity < 1:
            return jsonify({'error': 'Quantity must be at least 1'}), 400
        
        supabase = get_supabase()
        
        response = supabase.table('cart').update({'quantity': quantity}).eq('id', cart_item_id).eq('user_id', request.user_id).execute()
        
        if response.data:
            return jsonify({'message': 'Cart item updated'}), 200
        else:
            return jsonify({'error': 'Cart item not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/clear', methods=['POST'])
@token_required
def clear_cart():
    """Clear entire cart"""
    try:
        supabase = get_supabase()
        
        response = supabase.table('cart').delete().eq('user_id', request.user_id).execute()
        
        return jsonify({'message': 'Cart cleared'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
