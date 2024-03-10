import re
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from models.users import User

auth_routes = Blueprint('auth_routes', __name__)
CORS(auth_routes)


"""
    /login API endpoint:
        - Expected format: {username: username, password: password}
        - Purpose: Validates and authenticates submitted credentials
        - Compare hashed password with the stored hash for the given username if exists.
        - If match:
            - Respond with 'success,' indicating successful authentication.
        - If no match:
            - Respond with 'failure,' indicating authentication failure.
"""
@auth_routes.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    hashed_password = generate_password_hash(request_data['password'], method='scrypt')

    #TODO: Check submitted username and password hash against users database
    response_data = {
        'message': 'ok',
        'status': 'success',
        'data': {
            'email': request_data.get('email', ''),
            'hashed_password': hashed_password
        }
    }

    return jsonify(response_data)

"""
    /forgot-password API endpoint:
        - Expected format: {email: email}
        - Purpose: Retrieve a submitted email for password recovery options.
        - Validate the email, send 'ok' message back ("Thank you! Check your email for recovery options."),
          client can handle poorly formed emails.
        - If email is found:
            - Send an email with recovery methods (to be implemented).
        - If email is not found:
            - Do nothing on the client side, but keep server-side.
              No reason for the user to know if the email exists or not.
"""
@auth_routes.route('/forgot-password', methods=['POST'])    
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    # Double check bad emails if they get through
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'status': 'Invalid email format'}), 400
    
    #TODO: Check if email exists in database and send recovery email

    return jsonify({'status': 'ok'}), 200