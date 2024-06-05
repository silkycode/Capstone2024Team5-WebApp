# Dashboard and data routes
# Endpoints for retrieving user data for front end display + misc. non-auth tasks
import base64
import re
from datetime import datetime
import uuid
from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.db_module import db
from utils.logger import route_logger, error_logger, feedback_logger
from utils.aiosmtpd_config import send_email
from datetime import datetime
from utils.utils import handle_request_errors, handle_sqlalchemy_errors, query_database
from models.user_management_models import User, Appointment, GlucoseLog, Notification, Message
from models.product_models import Product

# Register dashboard_routes as a blueprint for importing into app.py + set up CORS
dashboard_routes = Blueprint('dashboard_routes', __name__)
CORS(dashboard_routes)

# Respond 200 if Flask server is running, also send out a test email to verify email capability
@dashboard_routes.route('/debug', methods=['GET'])
async def debug():
    try:
        await send_email(body='test email body', subject='test subject', sender='flaskapp@example.com', recipient='patient@example.com')
        return '', 200
    except Exception as e:
        error_logger.error(f"Error occurred while sending test email: {str(e)}")
        return jsonify({'error': 'An error occurred while sending the test email.'}), 500

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
    request_id = str(uuid.uuid4())
    route_logger.info(f"[{request_id}] Received contact form submission.")
    
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()

    route_logger.info(f"[{request_id}] Processing contact form with email: '{email}' and name: '{name}'.")

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        route_logger.warning(f"[{request_id}] Invalid email format received: '{email}'")
        return jsonify({'message': 'Please enter a valid email.'}), 400

    if not message:
        route_logger.warning(f"[{request_id}] Empty message received from email: '{email}'")
        return jsonify({'message': 'Please provide a feedback message.'}), 400

    try:
        feedback_logger.info(f"[{request_id}] Feedback received from '{email}': " + message)
    except Exception as e:
        route_logger.error(f"[{request_id}] Error handling feedback message from '{email}': {e}")
        return jsonify({'message': 'Error handling feedback message. Try again.'}), 500

    route_logger.info(f"[{request_id}] Contact form processed successfully for email: '{email}'.")
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
    request_id = str(uuid.uuid4())
    try:
        token = get_jwt_identity()
        user_id = token['user_id']
        route_logger.info(f"Request {request_id}: Received appointments request for user ID: {user_id}")

        if request.method == 'GET':
            appointment_list = []
            appointments, error = query_database(Appointment, user_id)
            if error:
                error_message = f"Request {request_id}: Error retrieving appointments: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 500

            for appointment in appointments:
                appointment_info = {
                    'id': appointment.id,
                    'date': appointment.appointment_date,
                    'doctor_name': appointment.doctor_name,
                    'notes': appointment.appointment_notes
                }
                appointment_list.append(appointment_info)
            return jsonify(appointments=appointment_list), 200
           
        if request.method == 'POST':
            data, error = handle_request_errors(request, ['date', 'doctor_name', 'notes'])
            if error:
                error_message = f"Request {request_id}: Error processing appointment request: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 400
            
            new_appointment = Appointment(
                user_id=user_id,
                appointment_date=data['date'],
                doctor_name=data['doctor_name'],
                appointment_notes=data['notes']
            )

            db.session.add(new_appointment)
            db.session.commit()
            route_logger.info(f"Request {request_id}: New appointment created for user ID: {user_id}")
            return jsonify(message='New appointment created.'), 200

        if request.method == 'DELETE':
            appointment_id = request.args.get('appointment_id') 
            
            if not appointment_id:
                error_message = f"Request {request_id}: Missing appointment_id parameter"
                error_logger.error(error_message)
                return jsonify(message=error_message), 400
            
            appointment = Appointment.query.filter_by(id=appointment_id, user_id=user_id).first() 
            if not appointment:
                error_message = f"Request {request_id}: Appointment not found for user ID: {user_id}, appointment ID: {appointment_id}"
                error_logger.error(error_message)
                return jsonify(message="Appointment not found"), 404
            
            db.session.delete(appointment)
            db.session.commit()
            route_logger.info(f"Request {request_id}: Appointment deleted for user ID: {user_id}, appointment ID: {appointment_id}")
            return jsonify(message='Appointment deleted.'), 200

    except Exception as e:
        error_message = f"Request {request_id}: An unexpected error occurred: {str(e)}"
        error_logger.error(error_message)
        return jsonify(message="An unexpected error occurred"), 500
    
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
    request_id = str(uuid.uuid4())
    try:
        token = get_jwt_identity()
        user_id = token['user_id']
        route_logger.info(f"Request {request_id}: Received glucose request for user ID: {user_id}")

        if request.method == 'GET':
            glucose_logs, error = query_database(GlucoseLog, user_id)
            if error:
                error_message = f"Request {request_id}: Error retrieving glucose logs: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 500

            glucose_log_list = []
            for glucose_log in glucose_logs:
                glucose_log_info = {
                    'id': glucose_log.id,
                    'glucose_level': glucose_log.glucose_level,
                    'creation_date': glucose_log.creation_date
                }
                glucose_log_list.append(glucose_log_info)
            route_logger.info(f"Request {request_id}: Glucose logs information retrieved")
            return jsonify(glucose_logs=glucose_log_list), 200
           
        elif request.method == 'POST':
            data, error = handle_request_errors(request, ['glucose_level', 'creation_date'])
            if error:
                error_message = f"Request {request_id}: Error processing glucose log request: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 400
            
            new_glucose_log = GlucoseLog(
                user_id=user_id,
                glucose_level=data['glucose_level'],
                creation_date=data['creation_date']
            )

            db.session.add(new_glucose_log)
            db.session.commit()
            route_logger.info(f"Request {request_id}: New glucose log created for user ID: {user_id}")
            return jsonify(message='New glucose log created.'), 200

        elif request.method == 'DELETE':
            glucose_log_id = request.args.get('glucose_log_id') 
            
            if not glucose_log_id:
                error_message = f"Request {request_id}: glucose_log_id parameter is required"
                error_logger.error(error_message)
                return jsonify(message=error_message), 400
            
            glucose_log = GlucoseLog.query.filter_by(id=glucose_log_id, user_id=user_id).first() 
            if not glucose_log:
                error_message = f"Request {request_id}: Glucose log not found for user ID: {user_id}, glucose log ID: {glucose_log_id}"
                error_logger.error(error_message)
                return jsonify(message='Glucose log not found'), 404
            
            db.session.delete(glucose_log)
            db.session.commit()
            route_logger.info(f"Request {request_id}: Glucose log deleted for user ID: {user_id}, glucose log ID: {glucose_log_id}")
            return jsonify(message='Glucose log deleted.'), 200

    except Exception as e:
        error_message = f"Request {request_id}: An unexpected error occurred: {str(e)}"
        error_logger.error(error_message)
        return jsonify(message="An unexpected error occurred"), 500

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
    request_id = str(uuid.uuid4())
    try:
        token = get_jwt_identity()
        user_id = token['user_id']
        route_logger.info(f"Request {request_id}: Received notifications/message request for user ID: {user_id}")

        if request.method == 'GET':
            notifications, error = query_database(Notification, user_id)
            if error:
                error_message = f"Request {request_id}: Error retrieving notifications: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 500
            
            messages, error = query_database(Message, user_id)
            if error:
                error_message = f"Request {request_id}: Error retrieving messages: {error}"
                error_logger.error(error_message)
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

            message_list = []
            for message in messages:
                message_info = {
                    'id': message.id,
                    'sender': message.sender,
                    'send_date': message.send_date,
                    'subject': message.subject,
                    'body': message.body
                }
                message_list.append(message_info)

            route_logger.info(f"Request {request_id}: Notification and message information retrieved")
            return jsonify(notifications=notification_list, messages=message_list), 200
           
        elif request.method == 'POST':
            data, error = handle_request_errors(request, ['notification', 'importance'])
            if error:
                error_message = f"Request {request_id}: Error processing notification request: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 400
            
            new_notification = Notification(
                user_id=user_id,
                notification=data['notification'],
                importance=data['importance']
            )

            db.session.add(new_notification)
            db.session.commit()
            route_logger.info(f"Request {request_id}: New notification created for user ID: {user_id}")
            return jsonify(message='New notification created.'), 200

        elif request.method == 'DELETE':
            data, error = handle_request_errors(request, ['notification_id'])
            if error:
                error_message = f"Request {request_id}: Error processing delete notification request: {error}"
                error_logger.error(error_message)
                return jsonify(message=error), 400
            
            notification_id = data['notification_id']

            notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first() 
            if not notification:
                error_message = f"Request {request_id}: Notification not found for user ID: {user_id}, notification ID: {notification_id}"
                error_logger.error(error_message)
                return jsonify(message='Notification not found'), 404
            
            db.session.delete(notification)
            db.session.commit()
            route_logger.info(f"Request {request_id}: Notification deleted for user ID: {user_id}, notification ID: {notification_id}")
            return jsonify(message='Notification deleted.'), 200

    except Exception as e:
        error_message = f"Request {request_id}: An unexpected error occurred: {str(e)}"
        error_logger.error(error_message)
        return jsonify(message="An unexpected error occurred"), 500
    
"""
    /dashboard/products API endpoint:
        GET:
            - Expected fields: {none}
            - Purpose: Retrieve product info to populate page
            - Query database to retrieve all products
            - Response:
                - 200: Notifications information retrieved
                - 500: Database/backend issues
"""
@dashboard_routes.route('/products', methods=['GET'])
@handle_sqlalchemy_errors
def products():
    request_id = str(uuid.uuid4())
    try:
        route_logger.info(f"Request {request_id}: Received products request")

        products = Product.query.all()
        products_list = []

        for product in products:
            product_info = {
                'id': product.id,
                'product_type': product.product_type,
                'model_name': product.model_name,
                'description': product.description,
                'image': base64.b64encode(product.image).decode('utf-8') if product.image else None
            }
            products_list.append(product_info)

        route_logger.info(f"Request {request_id}: Products information retrieved")
        return jsonify(products_list), 200

    except Exception as e:
        error_message = f"Request {request_id}: An unexpected error occurred: {str(e)}"
        error_logger.error(error_message)
        return jsonify(message="An unexpected error occurred"), 500