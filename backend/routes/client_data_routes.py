import json
import re
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from models.db_module import db

client_data_routes = Blueprint('client_data_routes', __name__)
CORS(client_data_routes)

@client_data_routes.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    email = data.get('email').strip()
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({
            'message': 'Please enter a valid email.',
            'status': 'failure',
            'data': {}
        })
    
    response_data = {
        'message': 'Thank you for the message! We will get back to you shortly.',
        'status': 'success',
        'data': {}
    }

    #TODO: Add these to a DB or a queue or some other similar processing structure

    return jsonify(response_data)