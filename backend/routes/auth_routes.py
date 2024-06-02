# Endpoints for authentication, authorization, and interacting with user account details
from datetime import datetime, timedelta
import uuid
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, get_jwt_identity, jwt_required
import re
import time
import hashlib
from sqlalchemy.exc import SQLAlchemyError
from utils.db_module import db
from utils.logger import route_logger
from utils.utils import handle_sqlalchemy_errors, handle_request_errors, log_http_requests
from models.user_management_models import Account, User, RefreshToken

# Register auth_routes as a blueprint for importing into app.py + set up CORS
auth_routes = Blueprint('auth_routes', __name__)
CORS(auth_routes, supports_credentials=True)

"""
    /auth/login API endpoint:
        - Expected format: {email: email, password: password}
        - Purpose: Validates and authenticates submitted credentials, to return an auth and session token
        - Compare hashed password with the stored hash for the given email if exists.
        - Return 400 on missing fields
        - If match:
            - Respond with 200 indicating user exists and has valid credentials.
        - If no match:
            - Respond with 401 indicating bad credentials.
        - Return 500 on backend errors
"""
@auth_routes.route('/login', methods=['POST'])
@handle_sqlalchemy_errors
@log_http_requests
def login():
    expected_fields = ['email', 'password']
    data, error = handle_request_errors(request, expected_fields)
    if error:
        return error, 400

    email = data['email'].strip()
    hashed_password = hashlib.sha3_256(data['password'].encode()).digest() 

    account = Account.query.filter_by(email=email).first()
    
    if not account:
        time.sleep(0.1)
        route_logger.info(f"Attempt by email: '{email}' to log in, no matching account.")
        return jsonify(message = 'Could not log in with provided credentials. Please try again.'), 401
    
    if hashed_password == account.password_hash:
        access_token_payload = {
            'user_id': account.id,
            'username': account.username,
            'is_admin': account.is_admin
        }
        refresh_token_payload = {
            'user_id': account.id
        }

        access_token = create_access_token(identity=access_token_payload)
        refresh_token = create_refresh_token(identity=refresh_token_payload)
        
        expiration_time = datetime.now() + timedelta(days=7)
        session_id = str(uuid.uuid4())
        new_refresh_token = RefreshToken(user_id=account.id, refresh_token=refresh_token, expiration_time=expiration_time, session_id=session_id)
        db.session.add(new_refresh_token)
        db.session.commit()

        response_data = {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'session_id': session_id
        }
        
        userType = "admin" if account.is_admin == 1 else "user"
        route_logger.info(f"{userType} '{account.username}' logged in successfully.")
        return jsonify(response_data), 200
    
    else:
        account.failed_logins += 1
        db.session.commit()
        route_logger.info(f"{account.username}' failed to log in successfully: bad credentials")
        time.sleep(0.1)
        return jsonify(message = 'Could not log in with provided credentials. Please try again.'), 401

"""
    /auth/logout API endpoint:
        - Expected fields: {access_token, session_id}
        - Purpose: Log user or admin out of an application session
        - Remove session data from db corresponding to user session
        - Return 400 on missing fields
        - Respond 200 indicating db removal was successful
        - Respond with 401 indicating bad tokens.
        - Return 500 on backend errors
"""
@auth_routes.route('/logout', methods=['POST'])
@jwt_required()
@handle_sqlalchemy_errors
@log_http_requests
def logout():
    access_token = get_jwt_identity()
    user_id = access_token['user_id']
    session_id = request.cookies.get('session_id')

    refresh_token = RefreshToken.query.filter_by(user_id=user_id, session_id=session_id).first()


    if refresh_token:
        db.session.delete(refresh_token)
        db.session.commit()
        return jsonify(message = "Logout successful"), 200
    else:
        return jsonify(message="Invalid authentication"), 401

"""
    /auth/refresh API endpoint:
        - Expected format: {refresh_token, session_id}
        - Purpose: Send back a fresh JWT to a user with a non-expired refresh token
        - Return 200 if JWT generation is okay
        - Return 401 with expired or missing refresh token
"""
@auth_routes.route('/refresh', methods=['POST'])
@handle_sqlalchemy_errors
@log_http_requests
def refresh():
    refresh_token = request.cookies.get('refresh_token')
    session_id = request.cookies.get('session_id')

    user_id = decode_token(refresh_token)

    stored_token = RefreshToken.query.filter_by(user_id=user_id, session_id=session_id, refresh_token=refresh_token).first()
    if not stored_token:
        return jsonify(message="Invalid session credentials."), 401
    
    refresh_token_expiration = datetime.strptime(stored_token.expiration_time, '%Y-%m-%d %H:%M:%S.%f')
    current_time = datetime.now() 
    if current_time > refresh_token_expiration:
        return jsonify(message="Expired refresh privilege credentials. Log in again."), 401
    
    account = Account.query.get(user_id)
    access_token_payload = {
        'user_id': account.id,
        'username': account.username,
        'is_admin': account.is_admin
    }
    
    new_access_token = create_access_token(identity=access_token_payload)
    return jsonify(access_token=new_access_token), 200

"""
    /auth/forgot-password API endpoint:
        - Expected format: {email: email}
        - Purpose: Retrieve a submitted email for password recovery options.
        - Return 200 if correctly formatted
        - Return 400 on badly formatted email messages
"""
@auth_routes.route('/forgot-password', methods=['POST'])    
@log_http_requests
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
@log_http_requests
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
        route_logger.info(f"User '{new_account.username}' with id {new_account.id} registered and was added to database.")
        return jsonify(response_data), 200

    except SQLAlchemyError:
        response_data = {
            'message': 'Server error occurred.',
        }
        db.session.rollback()
        return jsonify(response_data), 500