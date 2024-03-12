# Dashboard and data routes
# Endpoints for retrieving user data for front end display + misc. non-auth tasks

import re
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db_module import db

dashboard_routes = Blueprint('dashboard_routes', __name__)
CORS(dashboard_routes)

# Basic debug route to test server
@dashboard_routes.route('/debug', methods=['GET'])
def debug():
    response_data = {
        'message': 'Debug endpoint accessed',
        'status': 'success',
        'data': {}
    }

    return jsonify(response_data)

# Sending messages from front end to server for user feedback/contact
@dashboard_routes.route('/contact', methods=['POST'])
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

    #TODO: Add these to a DB or a queue or some other similar processing structure for reading messages

    return jsonify(response_data)

# Two routes based on HTTP -> GET to populate profile fields, POST to update profile info
@dashboard_routes.route('/profile', methods=['GET', 'POST'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    if request.method == 'GET':
        response_data = {
            'message': 'ok',
            'status': 'success',
            'data': {
                'user_id': current_user_id,
                'email': 'doejohn@email.com',
                'username': 'johndoe',
                'first_name': 'John',
                'last_name': 'Doe',
                'dob': '1990-01-01',
                'primary_phone': '123-456-7890',
                'secondary_phone': '987-654-3210',
                'address': '123 Main St, City, Country',
                'primary_insurance': 'Insurance Company ABC',
                'id_number': 'ABC123',
                'contact_person': 'Jane Doe',
                'last_office_visit': '2022-01-01',
                'doctor_name': 'Dr. Smith',
                'doctor_phone': '555-555-5555',
                'doctor_fax': '555-555-5556'
            }
        }
        return jsonify(response_data)
    else:
        response_data = {}

# Two routes -> GET to retrieve current appointments from DB, POST to add a new appointment. Implement autodelete?
@dashboard_routes.route('/appointments', methods=['GET', 'POST'])
def appointments():
    if request.method == 'GET':
        response_data = {
            'message': 'ok',
            'status': 'success',
            'data': {
                'appointment_id1': {
                    'appointment_date': '2024-03-15 09:00:00',
                    'doctor_name': 'Dr. Smith',
                    'appointment_notes': 'Follow up appointment for screening.'
                },
                'appointment_id2': {
                    'appointment_date': '2024-03-18 12:00:00',
                    'doctor_name': 'Dr. James',
                    'appointment_notes': 'Blood draw.'
                }
            }
        }
        return jsonify(response_data)
    else:
        response_data = {}

