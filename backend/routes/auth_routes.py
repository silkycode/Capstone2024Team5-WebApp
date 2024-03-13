# Auth routes
# Endpoints for authentication, authorization, and interacting with user account details

import re
import time
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import create_access_token
import hashlib
from sqlalchemy.exc import SQLAlchemyError
from models.db_module import db

# Register auth_routes as a blueprint for importing into app.py + set up CORS functionality and DB connection
auth_routes = Blueprint('auth_routes', __name__)
CORS(auth_routes)

# Define credentials model
class UserCredentials(db.Model):
    __tablename__ = 'credentials'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(255), nullable=False)

# Define user info model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    dob = db.Column(db.Date)
    primary_phone = db.Column(db.String(20))
    secondary_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    primary_insurance = db.Column(db.String(255))
    id_number = db.Column(db.String(20))
    contact_person = db.Column(db.String(255))
    last_office_visit = db.Column(db.Date)
    doctor_name = db.Column(db.String(255))
    doctor_phone = db.Column(db.String(20))
    doctor_fax = db.Column(db.String(20))

    credentials_id = db.Column(db.Integer, db.ForeignKey('credentials.id'), nullable=False)
    credentials = db.relationship('UserCredentials', backref=db.backref('user', uselist=False, lazy=True))

    def __repr__(self):
        return f"<User {self.credentials.username}>"


"""
    /login API endpoint:
        - Expected format: {email: email, password: password}
        - Purpose: Validates and authenticates submitted credentials, to return an auth token
        - Compare hashed password with the stored hash for the given email if exists.
        - If match:
            - Respond with 'success,' indicating user exists and has valid credentials.
        - If no match:
            - Respond with 'failure,' indicating bad credentials.
"""
@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip()
    hashed_password = hashlib.sha3_256(data.get('password').encode()).digest() 

    try:
        creds = UserCredentials.query.filter_by(email=email, password_hash=hashed_password).first()
        if creds:
            access_token = create_access_token(identity=creds.id)
            response_data = {
                'message': 'Authentication success',
                'status': 'success',
                'access_token': access_token
            }
            return jsonify(response_data), 200
        else:
            time.sleep(0,1)
            response_data = {
                'message': 'Authentication failure. Please try again.',
                'status': 'failure',
                'data': {}
            } 
            return jsonify(response_data), 401
      
    except SQLAlchemyError as e:
        response_data = {
            'message': 'Database error occurred.',
            'status': 'error',
            'data': {}
        }
        print(e)
        return jsonify(response_data), 500

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
            'message': 'Please enter a valid email.',
            'status': 'failure',
            'data': {}
        })
    
    response_data = {
        'message': 'Thank you! Please check your email for recovery options.',
        'status': 'success',
        'data': {
            'Sending recovery email to': email
        }
    }
    
    try:
        creds = UserCredentials.query.filter_by(email=email).first()
        #TODO: need method for sending email and recovery options
     
    except SQLAlchemyError as e:
        response_data = {
            'message': 'Database error occurred.',
            'status': 'error',
            'data': {}
        }
        print(e)

    return jsonify(response_data)

"""
    /register API endpoint:
        - Expected format: {firstName: 'firstName', lastName: 'lastName', email: 'email', username: 'username', password: 'password'}
        - Purpose: Validate and enter a user into the user database, create an account
        - Validate the fields submitted, and enter them into user_management.db if no errors are found
        - Response:
            - Message: Information about submission/registration
            - status: failure or success
            - data: If anything is needed to be sent back
"""
@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required_fields = ['firstName', 'lastName', 'email', 'username', 'password']
    if not all(field in data for field in required_fields):
        response_data = {
            'message': 'Missing fields! Please provide all required fields.',
            'status': 'failure',
            'data': {}
        }
        return jsonify(response_data)
    
    first_name = data.get('firstName').strip()
    last_name = data.get('lastName').strip()
    email = data.get('email').strip()
    username = data.get('username').strip()
    password = data.get('password', '').strip()
    hashed_password = hashlib.sha3_256(password.encode()).digest()

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({
            'message': 'Incorrect email format! Please provide a correct email.',
            'status': 'failure',
            'data': {}
        })
    
    if UserCredentials.query.filter_by(email=data['email']).first() or UserCredentials.query.filter_by(username=data['username']).first():
        response_data = {
            'message': 'User already exists with the provided email or username.',
            'status': 'failure',
            'data': {}
        }
        return jsonify(response_data)

    try:
        new_creds = UserCredentials(
            username=username,
            email=email,
            password_hash=hashed_password
        )
        print(new_creds)
        db.session.add(new_creds)
        db.session.commit()

        #TODO: Fix user table update after credentials registration

        """         
        user_id = new_creds.id
        new_user = User(
            id=user_id,
            first_name=first_name,
            last_name=last_name,
        )
        db.session.add(new_user)
        db.session.commit() 
        """
        
        response_data = {
            'message': 'Registration successful! Check your email for verification.',
            'status': 'success',
            'data': {}
        }
    except SQLAlchemyError as e:
        response_data = {
            'message': 'Database error occurred.',
            'status': 'failure',
            'data': {}
        }
        print(e)

    return jsonify(response_data)