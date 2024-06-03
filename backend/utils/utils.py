# Functions for improving routing/modeling, probably other stuff will go here too related to backend services
# Don't need to use these functions for every route, just remember they exist for helping
import datetime
from functools import wraps
from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from utils.db_module import db
from utils.logger import error_logger
from models.user_management_models import RefreshToken

# Handle SQLAlchemy errors and rollback the db session
def handle_sqlalchemy_errors(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except SQLAlchemyError as e:
            error_logger.error(f"SQLAlchemy error occurred: {str(e)}")
            db.session.rollback()
            return jsonify(message = 'Server error occurred'), 500
    return decorated_func

# Add session requirement to protected routes, along with JWTs
def refresh_token_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        refresh_token = request.headers.get('Authorization')

        # Missing session token
        if not refresh_token:
            error_logger.error("Authentication required: No refresh token provided.")
            return jsonify(message='Authentication required.'), 401
        
        current_refresh_token = RefreshToken.query.filter_by(refresh_token=refresh_token).first()

        # Missing session for user
        if not current_refresh_token:
            error_logger.error("Authentication failed: Invalid refresh token.")
            return jsonify(message='Authentication failed.'), 401
        # Expired session
        if current_refresh_token.expiration_time < datetime.datetime.now():
            error_logger.error("Authentication failed: Refresh token expired.")
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
    
    except SQLAlchemyError as e:
        error_logger.error(f"Database query error occurred: {str(e)}")
        return None, 'Server error occurred'
    
# Handle request errors and missing fields
def handle_request_errors(request, expected_fields):
    data = request.get_json()
    if not data or not all(field in data for field in expected_fields):
        error_logger.error(f"Request error: Missing fields: {', '.join(expected_fields)}")
        return jsonify(message=f'Missing fields: {", ".join(expected_fields)}'), 400
    return data, None

# Change byte displays to more human readable formats
def human_readable_size(size):
    units = ['B', 'KB', 'MB', 'GB', 'TB']
    index = 0
    while size >= 1024 and index < len(units) - 1:
        size /= 1024
        index += 1
    return f"{size:.2f} {units[index]}"