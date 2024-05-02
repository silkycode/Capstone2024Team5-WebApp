# Endpoints for authentication, authorization, and interacting with user account details
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token
import re
import time
import hashlib
from sqlalchemy.exc import SQLAlchemyError
from models.db_module import db
from models.user_management_models import Account, User

# Register auth_routes as a blueprint for importing into app.py + set up CORS
auth_routes = Blueprint('auth_routes', __name__)
CORS(auth_routes)

"""
    /auth/login API endpoint:
        - Expected format: {email: email, password: password}
        - Purpose: Validates and authenticates submitted credentials, to return an auth token
        - Compare hashed password with the stored hash for the given email if exists.
        - If match:
            - Respond with 200 indicating user exists and has valid credentials.
        - If no match:
            - Respond with 401 indicating bad credentials.
        - Return 500 on backend errors
"""
@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip()
    hashed_password = hashlib.sha3_256(data.get('password').encode()).digest() 

    try:
        # Encode ID, username, and admin privileges in access token
        account = Account.query.filter_by(email=email, password_hash=hashed_password).first()
        if account:
            jwt_payload = {
                'user_id': account.id,
                'username': account.username,
                'is_admin': account.is_admin
            }
            access_token = create_access_token(identity=jwt_payload)
            response_data = {
                'message': 'Authentication success',
                'access_token': access_token,
                'username': account.username
            }
            return jsonify(response_data), 200
        else:
            time.sleep(0.1)
            response_data = {
                'message': 'Authentication failure. Please try again.',
            } 
            return jsonify(response_data), 401
      
    except SQLAlchemyError:
        response_data = {
            'message': 'Server error occurred.',
        }
        return jsonify(response_data), 500

"""
    /auth/forgot-password API endpoint:
        - Expected format: {email: email}
        - Purpose: Retrieve a submitted email for password recovery options.
        - Return 200 if correctly formatted
        - Return 400 on badly formatted email messages
"""
@auth_routes.route('/forgot-password', methods=['POST'])    
def forgot_password():
    data = request.get_json()
    email = data.get('email', '').strip()
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'message': 'Please enter a valid email.',}), 400
    
    #TODO: need method for sending email and recovery options

    response_data = {
        'message': 'Thank you! Please check your email for recovery options.',
    }
    
    return jsonify(response_data), 200

"""
    /auth/register API endpoint:
        - Expected format: {firstName: 'firstName', lastName: 'lastName', email: 'email', username: 'username', password: 'password'}
        - Purpose: Validate and enter a user into the user database, create an account
        - Validate the fields submitted, and enter them into user_management.db if no errors are found
        - Response:
            - 400: Poorly formatted submission
            - 401: Registration failure
            - 200: New account created
            - 500: Database issues
"""
@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required_fields = ['first_name', 'last_name', 'email', 'username', 'password']
    if not all(field in data for field in required_fields):
        response_data = {
            'message': 'Missing fields! Please provide all required fields.',
        }
        return jsonify(response_data), 400
    
    first_name = data.get('first_name').strip()
    last_name = data.get('last_name').strip()
    email = data.get('email').strip()
    username = data.get('username').strip()
    password = data.get('password', '').strip()
    hashed_password = hashlib.sha3_256(password.encode()).digest()

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        response_data = {
            'message': 'Incorrect email format. Please provide a proper email.',
        }
        return jsonify(response_data), 400
    
    if Account.query.filter_by(email=data['email']).first() or Account.query.filter_by(username=data['username']).first():
        response_data = {
            'message': 'A user already exists with the provided email or username.',
        }
        return jsonify(response_data), 401

    try:
        # Create a new account to be put into account table
        new_account = Account(
            username=username,
            email=email,
            password_hash=hashed_password
        )
        db.session.add(new_account)
        db.session.commit()

        # Update user table with backreference to the account table, new account now present
        user_id = new_account.id
        new_user = User(
            id=user_id,
            first_name=first_name,
            last_name=last_name,
        )
        db.session.add(new_user)
        db.session.commit() 
        
        response_data = {
            'message': 'Registration successful! Check your email for verification.',
        }
        return jsonify(response_data), 200

    except SQLAlchemyError:
        response_data = {
            'message': 'Server error occurred.',
        }
        db.session.rollback()
        return jsonify(response_data), 500