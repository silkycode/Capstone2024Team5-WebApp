import re
from flask import request, jsonify, Blueprint
from flask_cors import CORS
import hashlib
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from models.db_module import db

# Register auth_routes as a blueprint for importing into app.py + set up CORS functionality and DB connection
auth_routes = Blueprint('auth_routes', __name__)
CORS(auth_routes)

# Define credentials model
class user_Credentials(db.Model):
    __tablename__ = 'credentials'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(255), nullable=False)

"""
    /login API endpoint:
        - Expected format: {email: email, password: password}
        - Purpose: Validates and authenticates submitted credentials
        - Compare hashed password with the stored hash for the given email if exists.
        - If match:
            - Respond with 'success,' indicating successful authentication.
        - If no match:
            - Respond with 'failure,' indicating authentication failure.
"""
@auth_routes.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    email = request_data.get('email', '').strip()
    password = request_data.get('password', '').strip()
    hashed_password = hashlib.sha3_256(password.encode()).digest() 

    try:
        creds = user_Credentials.query.filter_by(email=email, password_hash=hashed_password).first()
        if creds:
            response_data = {
                'message': 'Authentication success',
                'status': 'success',
                'data': {
                    'email': email,
                    'username': creds.username,
                }
            }
        else:
            response_data = {
                'message': 'Authentication failure',
                'status': 'failure',
                'data': {}
            }
      
    except SQLAlchemyError as e:
        response_data = {
            'message': 'Database issue',
            'status': 'error',
            'data': {}
        }
        print(e)
    
    return jsonify(response_data)

"""
    /forgot-password API endpoint:
        - Expected format: {email: email}
        - Purpose: Retrieve a submitted email for password recovery options.
        - Validate the email, send 'success' message back if correct
        - If email is found:
            - Send an email with recovery methods (to be implemented).
        - If email is not found:
            - Do nothing on the client side, but keep server-side.
              No reason for the user to know if the email exists or not.
"""
@auth_routes.route('/forgot-password', methods=['POST'])    
def forgot_password():
    data = request.get_json()
    email = data.get('email').strip()
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({
            'message': 'Bad email format',
            'status': 'failure',
            'data': {}
        })
    
    response_data = {
        'message': 'Email received',
        'status': 'success',
        'data': {
            'Sending recovery email to': email
        }
    }
    
    try:
        creds = user_Credentials.query.filter_by(email=email).first()
        #TODO: need method for sending email and recovery options
     
    except SQLAlchemyError as e:
        response_data = {
            'message': 'Database issue',
            'status': 'error',
            'data': {}
        }
        print(e)

    return jsonify(response_data)