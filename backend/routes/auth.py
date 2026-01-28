from flask import Blueprint, request, jsonify
import bcrypt
try:
    from database.supabase_client import get_supabase
except ImportError:
    from backend.database.supabase_client import get_supabase

try:
    from utils.jwt_handler import create_token, verify_token
except ImportError:
    from backend.utils.jwt_handler import create_token, verify_token

try:
    from utils.email_service import send_email
except ImportError:
    from backend.utils.email_service import send_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        phone = data.get('phone')
        
        if not email or not password or not name:
            return jsonify({'error': 'Missing required fields'}), 400
        
        supabase = get_supabase()
        
        # Check if user exists
        existing = supabase.table('users').select('*').eq('email', email).execute()
        if existing.data:
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        user_data = {
            'email': email,
            'password': hashed_password,
            'name': name,
            'phone': phone,
            'is_admin': False
        }
        
        response = supabase.table('users').insert(user_data).execute()
        
        if response.data:
            user = response.data[0]
            token = create_token(user['id'], user['email'], False)
            
            # Send welcome email
            send_email(email, 'Welcome to JB Jewellery Collection', 
                      f'<h2>Welcome {name}!</h2><p>Your account has been created successfully.</p>', 
                      is_html=True)
            
            return jsonify({
                'message': 'Registration successful',
                'token': token,
                'user': {'id': user['id'], 'email': user['email'], 'name': user['name']}
            }), 201
        else:
            return jsonify({'error': 'Registration failed'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        supabase = get_supabase()
        
        # Get user by email
        response = supabase.table('users').select('*').eq('email', email).execute()
        
        if not response.data:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user = response.data[0]
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = create_token(user['id'], user['email'], user.get('is_admin', False))
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'is_admin': user.get('is_admin', False)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify-token', methods=['POST'])
def verify():
    """Verify token"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token required'}), 400
        
        payload = verify_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return jsonify({
            'valid': True,
            'user_id': payload['user_id'],
            'email': payload['email'],
            'is_admin': payload.get('is_admin', False)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        
        token = auth_header.split(" ")[1]
        payload = verify_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid token'}), 401
        
        supabase = get_supabase()
        response = supabase.table('users').select('*').eq('id', payload['user_id']).execute()
        
        if response.data:
            user = response.data[0]
            return jsonify({
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'phone': user.get('phone'),
                'created_at': user.get('created_at')
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
