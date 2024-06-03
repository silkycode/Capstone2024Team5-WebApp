# Functions for improving routing/modeling, probably other stuff will go here too related to backend services
# Don't need to use these functions for every route, just remember they exist for helping
import datetime
from functools import wraps
import json
from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from utils.db_module import db
from utils.logger import route_logger
from models.user_management_models import RefreshToken

# Handle SQLAlchemy errors and rollback the db session
def handle_sqlalchemy_errors(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except SQLAlchemyError:
            db.session.rollback()
            return jsonify(message = 'Server error occurred'), 500
    return decorated_func

# Add logging HTTP requests for backend tracking
def log_http_requests(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        # Handle HTTP requests that may have empty payloads (like GET)
        if request.method in ['POST', 'DELETE']:
            try:
                data = json.loads(request.data.decode('utf-8'))
            except json.JSONDecodeError:
                data = {}
        else:
            data = {}

        # Don't post plaintext passwords in the app logs!
        if 'password' in data:
            data['password'] = '******'

        masked_data = json.dumps(data)
        route_logger.info(f"Source: {request.remote_addr} - Request: {request.method} {request.path} - Data: {masked_data}")
        return func(*args, **kwargs)
    return decorated_func

# Add session requirement to protected routes, along with JWTs
def refresh_token_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        refresh_token = request.headers.get('Authorization')

        # Missing session token
        if not refresh_token:
            return jsonify(message='Authentication required.'), 401
        
        current_refresh_token = RefreshToken.query.filter_by(refresh_token=refresh_token).first()

        # Missing session for user
        if not current_refresh_token:
            return jsonify(message='Authentication failed.'), 401
        # Expired session
        if current_refresh_token.expiration_time < datetime.now():
            return jsonify(message='Token expired.'), 401

        request.refresh_token = refresh_token

        return func(*args, **kwargs)
    return decorated_function

# Error handling and database querying generic helper for user ID related queries
def query_database(model, user_id, filters=None):
    try:
        query = model.query.filter_by(user_id=user_id)
        if filters:
            query = query.filter(filters)
        return query.all(), None
    
    except SQLAlchemyError:
        return None, 'Server error occurred'
    
# Handle request errors and missing fields
def handle_request_errors(request, expected_fields):
    data = request.get_json()
    if not data or not all(field in data for field in expected_fields):
        return jsonify(message=f'Missing fields: {", ".join(expected_fields)}'), 400
    return data, None