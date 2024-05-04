# Admin routes
# Endpoints for user management, app management, admin tasks
from flask import Blueprint, jsonify
from flask_cors import CORS

# Register admin_routes as a blueprint for importing into app.py + set up CORS
admin_routes = Blueprint('admin_routes', __name__)
CORS(admin_routes)

# Respond 200 if Flask server is running
@admin_routes.route('/debug', methods=['GET'])
def debug():
    return jsonify({'message': 'Debug check, server is running'}), 200