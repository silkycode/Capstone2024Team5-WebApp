# Dashboard and data routes
# Endpoints for retrieving user data for front end display + misc. non-auth tasks
import re
from datetime import datetime
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from models.db_module import db
from utils import handle_request_errors, handle_sqlalchemy_errors, query_database
from models.user_management_models import User, Appointment, GlucoseLog, Notification

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
    except Exception:
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
@handle_sqlalchemy_errors
def profile():
    token = get_jwt_identity()
    user_id = token['user_id']

    if request.method == 'GET':
        user = User.query.get(user_id)
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
        data, error = handle_request_errors(request, ['first_name', 'last_name', 'dob', 'primary_phone', 'secondary_phone', 'address', 'primary_insurance', 'medical_id', 'contact_person'])
        if error:
            return error, 400
        
        user = User.query.get(user_id)

        for field in data:
            setattr(user, field, data[field].strip())

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully.'}), 200

"""
    /dashboard/appointments API endpoint:
        GET:
            - Expected fields: {token}
            - Purpose: Populate dashboard with user's existing appointments
            - Query database to retrieve appoints and return in message
            - Response:
                - 200: Appointment information retrieved
                - 401: Token authorization failure
                - 500: Database issues
        POST:
            - Expected fields: {token, date, doctor_name, notes}
            - Purpose: Create new appointment entry for user
            - Response:
                - 200: Appointment information created
                - 400: Missing fields/incorrect formatting
                - 401: Token authorization failure
                - 500: Database issues
        DELETE:
            - Expected fields: {token, appointment_id}
            - Purpose: Remove appointment from dashboard and database
            - Response:
                - 200: Appointment deletion successful
                - 400: No existing appointment ID
                - 401: Token authorization failure
                - 500: Database issues
"""
@dashboard_routes.route('/appointments', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
@handle_sqlalchemy_errors
def appointments():
    token = get_jwt_identity()
    user_id = token['user_id']
    
    if request.method == 'GET':
        appointment_list = []
        appointments, error = query_database(Appointment, user_id)
        if error:
            return jsonify(message = error), 500

        for appointment in appointments:
            appointment_info = {
                'id': appointment.id,
                'date': appointment.appointment_date,
                'doctor_name': appointment.doctor_name,
                'notes': appointment.appointment_notes
            }
            appointment_list.append(appointment_info)
        return jsonify(appointments = appointment_list), 200
           
    if request.method == 'POST':
        data, error = handle_request_errors(request, ['date', 'doctor_name', 'notes'])
        if error:
            return error, 400
        
        new_appointment = Appointment(
            user_id=user_id,
            appointment_date=data['date'],
            doctor_name=data['doctor_name'],
            appointment_notes=data['notes']
        )

        db.session.add(new_appointment)
        db.session.commit()
        return jsonify(message = 'New appointment created.'), 200

    if request.method == 'DELETE':
        appointment_id = request.args.get('appointment_id') 
        
        if not appointment_id:
            return jsonify(message='appointment_id parameter is required'), 400
        
        appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first() 
        if not appointment:
            return jsonify(message='Appointment not found'), 404
        
        db.session.delete(appointment)
        db.session.commit()
        return jsonify(message='Appointment deleted.'), 200
    
"""
    /dashboard/glucose API endpoint:
        GET:
            - Expected fields: {token}
            - Purpose: Retrieve user's existing glucose logs
            - Query database to retrieve glucose logs and return in message
            - Response:
                - 200: Glucose logs information retrieved
                - 401: Token authorization failure
                - 500: Database issues
        POST:
            - Expected fields: {token, glucose_level, creation_date}
            - Purpose: Create a new glucose log entry for the user
            - Response:
                - 200: Glucose log information created
                - 400: Missing glucose level
                - 401: Token authorization failure
                - 500: Database issues
        DELETE:
            - Expected fields: {token, glucose_log_id}
            - Purpose: Remove glucose log from dashboard and database
            - Response:
                - 200: Glucose log deletion successful
                - 400: No existing glucose log ID
                - 401: Token authorization failure
                - 500: Database issues
"""
@dashboard_routes.route('/glucose', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
@handle_sqlalchemy_errors
def glucose():
    token = get_jwt_identity()
    user_id = token['user_id']
    
    if request.method == 'GET':
        glucose_logs, error = query_database(GlucoseLog, user_id)
        if error:
            return jsonify(message=error), 500

        glucose_log_list = []
        for glucose_log in glucose_logs:
            glucose_log_info = {
                'id': glucose_log.id,
                'glucose_level': glucose_log.glucose_level,
                'creation_date': glucose_log.creation_date
            }
            glucose_log_list.append(glucose_log_info)
        return jsonify(glucose_logs = glucose_log_list), 200
           
    if request.method == 'POST':
        data, error = handle_request_errors(request, ['glucose_level', 'creation_date'])
        if error:
            return error, 400
        
        new_glucose_log = GlucoseLog(
            user_id=user_id,
            glucose_level=data['glucose_level'],
            creation_date=data['creation_date']
        )

        db.session.add(new_glucose_log)
        db.session.commit()
        return jsonify(message='New glucose log created.'), 200

    if request.method == 'DELETE':
        glucose_log_id = request.args.get('glucose_log_id') 
        
        if not glucose_log_id:
            return jsonify(message='glucose_log_id parameter is required'), 400
        
        glucose_log = GlucoseLog.query.filter_by(id=glucose_log_id, user_id=user_id).first() 
        if not glucose_log:
            return jsonify(message='Glucose log not found'), 404
        
        db.session.delete(glucose_log)
        db.session.commit()
        return jsonify(message='Glucose log deleted.'), 200

"""
    /dashboard/notifications API endpoint:
        GET:
            - Expected fields: {token}
            - Purpose: Retrieve user's existing notifications
            - Query database to retrieve notifications and return in message
            - Response:
                - 200: Notifications information retrieved
                - 401: Token authorization failure
                - 500: Database issues
        POST:
            - Expected fields: {token, notification, importance}
            - Purpose: Create a new notification entry for the user
            - Response:
                - 200: Notification information created
                - 400: Missing notification and/or importance
                - 401: Token authorization failure
                - 500: Database issues
        DELETE:
            - Expected fields: {token, notification_id}
            - Purpose: Remove notification from dashboard and database
            - Response:
                - 200: Notification deletion successful
                - 400: No existing notification ID
                - 401: Token authorization failure
                - 500: Database issues
"""    
@dashboard_routes.route('/notifications', methods=['GET'])
@jwt_required()
@handle_sqlalchemy_errors
def notifications():
    token = get_jwt_identity()
    user_id = token['user_id']
    
    if request.method == 'GET':
        notifications, error = query_database(Notification, user_id)
        if error:
            return jsonify(message=error), 500

        notification_list = []
        for notification in notifications:
            notification_info = {
                'id': notification.id,
                'notification': notification.notification,
                'importance': notification.importance,
                'creation_date': notification.creation_date
            }
            notification_list.append(notification_info)
        return jsonify(notifications=notification_list), 200
           
    if request.method == 'POST':
        data, error = handle_request_errors(request, ['notification', 'importance'])
        if error:
            return error, 400
        
        new_notification = Notification(
            user_id=user_id,
            notification=data['notification'],
            importance=data['importance']
        )

        db.session.add(new_notification)
        db.session.commit()
        return jsonify(message='New notification created.'), 200

    if request.method == 'DELETE':
        data, error = handle_request_errors(request, ['notification_id'])
        if error:
            return error, 400
        
        notification_id = data['notification_id']

        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first() 
        if not notification:
            return jsonify(message='Notification not found'), 404
        
        db.session.delete(notification)
        db.session.commit()
        return jsonify(message='Notification deleted.'), 200