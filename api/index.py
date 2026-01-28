from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Add the project root to the path so we can import from backend
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

# Handle imports by adjusting sys.path
from backend.config import Config
from backend.routes.auth import auth_bp
from backend.routes.products import products_bp
from backend.routes.cart import cart_bp
from backend.routes.orders import orders_bp
from backend.routes.admin import admin_bp
from backend.database.supabase_client import init_supabase

load_dotenv()

# Use 'public' as static folder to serve frontend files
app = Flask(__name__, static_folder='../public', static_url_path='')
app.config.from_object(Config)

# Initialize CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize Supabase
init_supabase()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(cart_bp, url_prefix='/api/cart')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'JB Jewellery API is running'}), 200

# Route to serve the frontend pages
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # Check if the path is an API route
    if path.startswith('api/'):
        return jsonify({'error': 'Resource not found'}), 404

    # Try to serve the exact file if it exists
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    
    # Page request handling
    if path == "" or not "." in path:
        if path == "":
            return send_from_directory(app.static_folder, 'index.html')
        
        # Try serving path.html for clean URLs
        html_file = f"{path}.html"
        if os.path.exists(os.path.join(app.static_folder, html_file)):
            return send_from_directory(app.static_folder, html_file)
            
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(404)
def not_found(error):
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Resource not found'}), 404
    path = request.path.lstrip('/')
    return serve_frontend(path)

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
