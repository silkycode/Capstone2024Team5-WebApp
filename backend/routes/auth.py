from flask import request, jsonify
from werkzeug.security import check_password_hash
from models.users import User

def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'User authenticated'}), 200
    else:
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid username or password'}), 401
    
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    return jsonify({'message': email}), 200