# Admin routes
# Endpoints for user management, app management, admin tasks
import re
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.db_module import db
from utils.utils import log_http_requests, handle_sqlalchemy_errors
from models.user_management_models import GlucoseLog, Appointment, Account
from sqlalchemy.exc import SQLAlchemyError

# Register admin_routes as a blueprint for importing into app.py + set up CORS
admin_routes = Blueprint('admin_routes', __name__)
CORS(admin_routes)

# Respond 200 if admin routes are ok
@admin_routes.route('/debug', methods=['GET'])
@log_http_requests
def debug():
    return jsonify({'message': 'Debug check, server is running'}), 200

# User management tools for admins
# GET to retrieve usernames, ids, emails -- {search_string}
# POST to update usernames, passwords, emails -- {email, username, password}
# DELETE to remove an account {id}
@admin_routes.route('/manage-accounts', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
@handle_sqlalchemy_errors
@log_http_requests
def manage_accounts():
    access_token = get_jwt_identity()
    if access_token['is_admin'] != 1:
        return jsonify(message="Invalid authentication"), 401

    if request.method == 'GET':
        search_string = request.args.get('search_string', '')

        accounts_query = Account.query.filter(
            (Account.username.ilike(f'%{search_string}%')) | 
            (Account.email.ilike(f'%{search_string}%')),
            Account.is_admin == 0
        )
        accounts = accounts_query.all()

        account_data = [{
            'account_id': account.id,
            'username': account.username,
            'email': account.email,
            'last_login_date': account.last_login_date,
            'date_created': account.date_created,
        } for account in accounts]

        return jsonify(account_data), 200
    
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('account_id')

        if not user_id:
            return jsonify(message="Account ID not provided"), 400
        
        account = Account.query.get(user_id)

        if 'email' in data and data.get('email') != "":
            if not re.match(r"[^@]+@[^@]+\.[^@]+", data.get('email')):
                return jsonify(message="Incorrectly formatted email field"), 400
            account.email = data['email']
        if 'username' in data:
            account.username = data['username']
        if 'password' in data:
            account.password = data['password']
        db.session.commit()
        return jsonify(message = "Account details updated successfully."), 200
    
    if request.method == 'DELETE':
        user_id = request.args.get('user_id')
        account = Account.query.get(user_id)
        if not account:
            return jsonify(message="Account not found"), 400
        
        db.session.delete(account)
        db.session.commit()

        return jsonify(message="Account deleted successfully"), 200



"""
    /admin/glucose API endpoint:
        GET:
            - Expected fields: {user_id}
            - Purpose: Retrieve all existing glucose logs
            - Query database to retrieve glucose logs and return in message
            - Response:
                - 200: Glucose logs information retrieved
                - 500: Database issues
        POST:
            - Expected fields: {user_id, glucose_level, creation_date}
            - Purpose: Create a new glucose log entry for the user
            - Response:
                - 200: Glucose log information created
                - 404: No existing glucose log 
                - 500: Database issues
        DELETE:
            - Expected fields: {user_id, glucose_log_id}
            - Purpose: Remove glucose log from dashboard and database
            - Response:
                - 200: Glucose log deletion successful
                - 404: No existing glucose log 
                - 500: Database issues
        PUT:
            - Expected fields: {user_id, glucose_level, creation_date}
            - Purpose: Update glucose log for existing logs
            - Response:
                - 200: Glucose log update successful
                - 404: No existing glucose log 
                - 500: Database issues
"""
@admin_routes.route('/admin/glucose', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
@log_http_requests
def admin_glucose():
    # Get JWT identity and verify if user is admin
    token = get_jwt_identity()
    account_id = token['account_id']
    account = Account.query.get(account_id)

    if not account or account.is_admin == 0:
        return jsonify(message="Unauthorized access"), 401

    try:
        if request.method == 'GET':
            # Retrieve logs for a specific user if `user_id` is provided
            user_id = request.args.get('user_id')
            if user_id:
                glucose_logs = GlucoseLog.query.filter_by(user_id=user_id).all()
            else:
                # Retrieve all glucose logs
                glucose_logs = GlucoseLog.query.all()

            glucose_log_list = [{'id': log.id, 'user_id': log.user_id, 'glucose_level': log.glucose_level, 'creation_date': log.creation_date} for log in glucose_logs]
            return jsonify(glucose_logs=glucose_log_list), 200

        # Create new glucose log
        elif request.method == 'POST':
            data = request.json
            new_glucose_log = GlucoseLog(
                user_id=data['user_id'],
                glucose_level=data['glucose_level'],
                creation_date=data['creation_date']
            )
            db.session.add(new_glucose_log)
            db.session.commit()
            return jsonify(message='New glucose log created.'), 201

        # Update existing glucose log
        elif request.method == 'PUT':
            log_id = request.args.get('log_id')
            data = request.json
            glucose_log = GlucoseLog.query.filter_by(id=log_id).first()
            if not glucose_log:
                return jsonify(message='Glucose log not found'), 404

            glucose_log.glucose_level = data.get('glucose_level', glucose_log.glucose_level)
            glucose_log.creation_date = data.get('creation_date', glucose_log.creation_date)
            db.session.commit()
            return jsonify(message='Glucose log updated.'), 200

        # Delete a glucose log
        elif request.method == 'DELETE':
            log_id = request.args.get('log_id')
            glucose_log = GlucoseLog.query.filter_by(id=log_id).first()
            if not glucose_log:
                return jsonify(message='Glucose log not found'), 404

            db.session.delete(glucose_log)
            db.session.commit()
            return jsonify(message='Glucose log deleted.'), 200

    # Rollback the session and handle the SQL error
    except SQLAlchemyError as e:
        return jsonify(message=str(e)), 500

    return jsonify(message="Method not allowed"), 405


"""
    /admin/appointments API endpoint:
        GET:
            - Expected fields: {user_id}
            - Purpose: Retrieve all existing appointments
            - Query database to retrieve appointments and return in message
            - Response:
                - 200: appointments information retrieved
                - 500: Database issues
        POST:
            - Expected fields: {user_id, appointments, creation_date}
            - Purpose: Create a new appointment entry for the user
            - Response:
                - 200: Appointments information created
                - 404: No existing appointment 
                - 500: Database issues
        DELETE:
            - Expected fields: {user_id, appointments_id}
            - Purpose: Remove appointment from dashboard and database
            - Response:
                - 200: Appointment deletion successful
                - 404: No existing appointment 
                - 500: Database issues
        PUT:
            - Expected fields: {user_id, appointments, creation_date}
            - Purpose: Update appointment for existing appointments
            - Response:
                - 200: Appointment update successful
                - 404: No existing appointment
                - 500: Database issues
"""
@admin_routes.route('/admin/appointments', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required()
@log_http_requests
def admin_appointments():
    # Get JWT identity and verify if user is admin
    token = get_jwt_identity()
    account_id = token['account_id']
    account = Account.query.get(account_id)

    if not account or account.is_admin == 0:
        return jsonify(message="Unauthorized access"), 401

    try:
        # Fetch all appointments
        if request.method == 'GET':
            user_id = request.args.get('user_id')
            if user_id:
                appointments = Appointment.query.filter_by(user_id=user_id).all()
            else:
                appointments = Appointment.query.all()
            appointment_list = [{'id': appt.id, 'user_id': appt.user_id, 'date': appt.appointment_date, 'doctor_name': appt.doctor_name, 'notes': appt.appointment_notes} for appt in appointments]
            return jsonify(appointments=appointment_list), 200

        # Create new appointment
        elif request.method == 'POST':
            data = request.json
            new_appointment = Appointment(
                user_id=data['user_id'],
                appointment_date=data['date'],
                doctor_name=data['doctor_name'],
                appointment_notes=data['notes']
            )
            db.session.add(new_appointment)
            db.session.commit()
            return jsonify(message='New appointment created.'), 201

        # Update an existing appointment
        elif request.method == 'PUT':
            appointment_id = request.args.get('appointment_id')
            data = request.json
            appointment = Appointment.query.filter_by(id=appointment_id).first()
            if not appointment:
                return jsonify(message='Appointment not found'), 404

            appointment.appointment_date = data.get('date', appointment.appointment_date)
            appointment.doctor_name = data.get('doctor_name', appointment.doctor_name)
            appointment.appointment_notes = data.get('notes', appointment.appointment_notes)
            db.session.commit()
            return jsonify(message='Appointment updated.'), 200

        # Delete an appointment
        elif request.method == 'DELETE':
            appointment_id = request.args.get('appointment_id')
            appointment = Appointment.query.filter_by(id=appointment_id).first()
            if not appointment:
                return jsonify(message='Appointment not found'), 404

            db.session.delete(appointment)
            db.session.commit()
            return jsonify(message='Appointment deleted.'), 200

    # Rollback the session and handle the SQL error
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(message=str(e)), 500

    return jsonify(message="Method not allowed"), 405