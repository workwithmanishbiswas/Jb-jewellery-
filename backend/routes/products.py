from flask import Blueprint, request, jsonify
try:
    from database.supabase_client import get_supabase
except ImportError:
    from backend.database.supabase_client import get_supabase

try:
    from utils.jwt_handler import token_required, admin_required
except ImportError:
    from backend.utils.jwt_handler import token_required, admin_required

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products"""
    try:
        supabase = get_supabase()
        
        # Get pagination params
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 12, type=int)
        offset = (page - 1) * limit
        
        # Get search query
        search = request.args.get('search', '')
        
        # Get category filter
        category = request.args.get('category', '')
        
        query = supabase.table('products').select('*')
        
        if search:
            query = query.ilike('name', f'%{search}%')
        
        if category:
            query = query.eq('category', category)
        
        response = query.range(offset, offset + limit - 1).execute()
        
        return jsonify({
            'products': response.data,
            'page': page,
            'limit': limit,
            'total': len(response.data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product"""
    try:
        supabase = get_supabase()
        response = supabase.table('products').select('*').eq('id', product_id).execute()
        
        if response.data:
            return jsonify(response.data[0]), 200
        else:
            return jsonify({'error': 'Product not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/admin/create', methods=['POST'])
@admin_required
def create_product():
    """Create new product (admin only)"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'description', 'price', 'category', 'image_url']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        product_data = {
            'name': data['name'],
            'description': data['description'],
            'price': data['price'],
            'category': data['category'],
            'image_url': data['image_url'],
            'packaging_charge': data.get('packaging_charge', 0),
            'shipment_charge': data.get('shipment_charge', 0),
            'stock': data.get('stock', 0),
            'status': 'active'
        }
        
        supabase = get_supabase()
        response = supabase.table('products').insert(product_data).execute()
        
        if response.data:
            return jsonify({
                'message': 'Product created successfully',
                'product': response.data[0]
            }), 201
        else:
            return jsonify({'error': 'Failed to create product'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    """Update product (admin only)"""
    try:
        data = request.get_json()
        
        supabase = get_supabase()
        response = supabase.table('products').update(data).eq('id', product_id).execute()
        
        if response.data:
            return jsonify({
                'message': 'Product updated successfully',
                'product': response.data[0]
            }), 200
        else:
            return jsonify({'error': 'Product not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    """Delete product (admin only)"""
    try:
        supabase = get_supabase()
        response = supabase.table('products').delete().eq('id', product_id).execute()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        supabase = get_supabase()
        response = supabase.table('products').select('category').execute()
        
        categories = list(set([p['category'] for p in response.data if p.get('category')]))
        
        return jsonify({'categories': categories}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
