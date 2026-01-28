from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from routes.auth import auth_bp
from routes.products import products_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.admin import admin_bp
from database.supabase_client import init_supabase

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
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif path == "" or not "." in path:
        # If it's a page request (no extension) or root, serve index.html or the named html file
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
    # This handler might still be reached for some /api/ routes
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Resource not found'}), 404
    return serve_frontend(request.path)

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=5000)
