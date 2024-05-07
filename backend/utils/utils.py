# Functions for improving routing/modeling, probably other stuff will go here too related to backend services
# Don't need to use these functions for every route, just remember they exist for helping
from functools import wraps
import json
from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from utils.db_module import db
from utils.logger import job_logger, route_logger

# Decorator pattern to handle SQLAlchemy errors and rollback the db session
def handle_sqlalchemy_errors(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except SQLAlchemyError:
            db.session.rollback()
            return jsonify(message = 'Server error occurred'), 500
    return decorated_func

# Decorator pattern to log HTTP requests for backend tracking
def log_http_requests(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        data = json.loads(request.data.decode('utf-8'))

        # Don't post plaintext passwords in the app logs!
        if 'password' in data:
            data['password'] = '******'

        masked_data = json.dumps(data)
        route_logger.info(f"Source: {request.remote_addr} - Request: {request.method} {request.path} - Data: {masked_data}")
        return func(*args, **kwargs)
    return decorated_func

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