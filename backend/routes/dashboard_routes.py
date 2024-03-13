# Dashboard and data routes
# Endpoints for retrieving user data for front end display + misc. non-auth tasks

from datetime import datetime
import re
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db_module import db
from models.user_management_models import Appointment, GlucoseLog, Notification

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
                'doctor_name': 'Dr. Smith',
                'doctor_phone': '555-555-5555',
                'doctor_fax': '555-555-5556'
            }
        }
        return jsonify(response_data)
    else:
        response_data = {}

# Three routes -> GET to retrieve current appointments from DB, POST to add a new appointment, delete appointments
@dashboard_routes.route('/appointments', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def appointments():
    current_user_id = get_jwt_identity()
    
    if request.method == 'GET':
        user_appointments = Appointment.query.filter_by(user_id=current_user_id).all()
        appointments = []
        for appointment in user_appointments:
            appointments.append({
                'appointment_id': appointment.appointment_id,
                'appointment_date': appointment.appointment_date.strftime('%Y-%m-%d %H:%M:%S'),
                'doctor_name': appointment.doctor_name,
                'appointment_notes': appointment.appointment_notes
            })
        response_data = {
            'message': 'ok',
            'status': 'success',
            'data': {
                'appointments': appointments
            }
        }
        return jsonify(response_data)
    
    elif request.method == 'POST':
        request_data = request.get_json()
        appointment_date = request_data['dateTime']
        formatted_date = datetime.strptime(appointment_date, "%Y-%m-%dT%H:%M:%S.%fZ") 
        doctor_name = request_data['doctor']
        appointment_notes = request_data['notes']

        new_appointment = Appointment(
            user_id=current_user_id,
            appointment_date=formatted_date,
            doctor_name=doctor_name,
            appointment_notes=appointment_notes
        )

        db.session.add(new_appointment)
        db.session.commit()

        response_data = {
            'message': 'Appointment created!',
            'status': 'success',
        }

        return jsonify({'message': 'Appointment created successfully'})
    
    elif request.method == 'DELETE':
        request_data = request.get_json()
        appointment_id = request_data['appointment_id']
        appointment = Appointment.query.get(appointment_id)

        if appointment:
            db.session.delete(appointment)
            db.session.commit()
            response_data = {
                'message': 'Appointment deleted!',
                'status': 'success',
            }
        else:
            response_data = {
                'message': 'No appointment id found',
                'status': 'failure',
            }   
        return jsonify(response_data)         
    
# Three routes -> GET to retrieve current glucose logs from DB, POST to add a new log, delete logs
@dashboard_routes.route('/glucose', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def glucose():
    current_user_id = get_jwt_identity()
    
    if request.method == 'GET':
        glucose_logs = GlucoseLog.query.filter_by(user_id=current_user_id).all()
        logs = []
        for log in glucose_logs:
            logs.append({
                'log_id': log.log_id,
                'log_timestamp': log.log_timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'glucose_level': log.glucose_level
            })
        response_data = {
            'message': 'ok',
            'status': 'success',
            'data': {
                'logs': logs
            }
        }
        return jsonify(response_data)
    
@dashboard_routes.route('/notifications', methods=['GET'])
@jwt_required()
def notifications():
    current_user_id = get_jwt_identity()
    
    if request.method == 'GET':
        notifications = Notification.query.filter_by(user_id=current_user_id).all()
        notifications_array = []
        for notif in notifications:
            notifications_array.append({
                'status_id': notif.status_id,
                'notification': notif.notification,
                'status_timestamp': notif.status_timestamp.strftime('%Y-%m-%d %H:%M:%S')
            })
            print(notif)
        response_data = {
            'message': 'ok',
            'status': 'success',
            'data': {
                'notifications': notifications_array
            }
        }
        return jsonify(response_data)