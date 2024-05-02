# Functions for improving routing/modeling, probably other stuff will go here too related to backend services
from functools import wraps
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from models.db_module import db

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

# Error handling and database querying generic helper
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