# Dashboard and data routes
# Endpoints for retrieving user data for front end display + misc. non-auth tasks
import re
from datetime import datetime
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from models.db_module import db
from models.user_management_models import Account, User, Appointment, GlucoseLog, Notification

# Register dashboard_routes as a blueprint for importing into app.py + set up CORS
dashboard_routes = Blueprint('dashboard_routes', __name__)
CORS(dashboard_routes)

# Respond 200 if Flask server is running
@dashboard_routes.route('/debug', methods=['GET'])
def debug():
    return jsonify({'message': 'Debug check, server is running'}), 200

"""
    /dashboard/contact API endpoint:
        - Expected fields: {name, email, password}
        - Purpose: Save visitor-submitted messages
        - Responses:
            - 400 for poorly formed email or missing message
            - 200 for message received
            - 500 for backend errors (message storage)
"""
@dashboard_routes.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'message': 'Please enter a valid email.',}), 400    
    
    if not message:
        return jsonify({'message': 'Please provide a feedback message.',}), 400
    
    #TODO: Add these to a DB or a queue or some other similar processing structure for reading messages. Just writes to textfile for now.
    try:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open('feedback.txt', 'a') as file:
            file.write(f"[{timestamp}] Email: {email}, Message: {message}, Author: {name}\n")
    except Exception as e:
        return jsonify({'message': 'Error handling feedback message. Try again.'}), 500

    return jsonify({'message': 'Thank you for the message! We will get back to you shortly.'}), 200

"""
    /dashboard/profile API endpoint:
        GET:
            - Expected fields: {token}
            - Purpose: Populate profile info fields from user's account
            - Query database to retrieve fields and return in message
            - Response:
                - 200: Profile information retrieved
                - 401: Token authorization failure
                - 500: Database issues
        POST:
            - Expected fields: {first_name, last_name, dob, primary_phone, secondary_phone, address, primary_insurance, medical_id, contact_person}
            - Purpose: Update user info in users DB
            - Insert provided fields into DB for current user
            - Response:
                - 200: Profile information updated
                - 400: Missing fields/incorrect formatting
                - 401: Token authorization failure
                - 500: Database issues
"""
@dashboard_routes.route('/profile', methods=['GET', 'POST'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()

    if request.method == 'GET':
        response_data = {
            'message': current_user_id
        }
        user = User.query.get(current_user_id)

        if user:
            user_data = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'dob': user.dob,
                'primary_phone': user.primary_phone,
                'secondary_phone': user.secondary_phone,
                'address': user.address,
                'primary_insurance': user.primary_insurance,
                'medical_id': user.medical_id,
                'contact_person': user.contact_person
            }
            return jsonify(user_data), 200
        else:
            return jsonify({'message': 'Authorization failure'}), 401
    
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.get(current_user_id)

        allowed_fields = [
            'first_name', 'last_name', 'dob', 'primary_phone',
            'secondary_phone', 'address', 'primary_insurance',
            'medical_id', 'contact_person'
        ]

        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field].strip())

        try: 
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully.'}), 200
        except SQLAlchemyError:
            response_data = {
                'message': 'Database error occurred.',
            }
            return jsonify(response_data), 500


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