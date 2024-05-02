from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.dashboard_routes import dashboard_routes
from routes.auth_routes import auth_routes
from config import Config
from models.db_module import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import base64
import sqlite3

app = Flask(__name__)
app.config.from_object(Config)
jwt = JWTManager(app)
CORS(app)

db.init_app(app)

app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(dashboard_routes, url_prefix='/dashboard')

























# Product Page
def get_productsDB_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'products.db')
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/products', methods=['GET'])
def products():
    conn = get_productsDB_connection()
    products = conn.execute('SELECT * FROM product').fetchall()
    products_list = []
    for product in products:
        product_dict = dict(product)
        if product_dict['image']:
            product_dict['image'] = base64.b64encode(product_dict['image']).decode('utf-8')
        products_list.append(product_dict)
    conn.close()
    return jsonify(products_list)


# Glucose Log Page
def get_glucose_log_db_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'glucose_log.db')
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/glucose', methods=['POST'])
@jwt_required()
def add_glucose_log():
    current_user_id = get_jwt_identity()
    data = request.json

    # Combind date and time into datetime
    datetime_str = f"{data['date']} {data['time']}"
    log_datetime = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')

    conn = get_glucose_log_db_connection()
    conn.execute('INSERT INTO glucose_logs (user_id, glucose_level, log_timestamp) VALUES (?, ?, ?)',
                 (current_user_id, data['glucose_level'], log_datetime))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Log added successfully'}), 201

@app.route('/glucose/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_glucose_log(log_id):
    current_user_id = get_jwt_identity()
    conn = get_glucose_log_db_connection()
    log_owner = conn.execute('SELECT user_id FROM glucose_logs WHERE log_id = ?', (log_id,)).fetchone()
    if log_owner is None or log_owner['user_id'] != current_user_id:
        return jsonify({'message': 'Unauthorized to delete this log'}), 403
    conn.execute('DELETE FROM glucose_logs WHERE log_id = ?', (log_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Log deleted successfully'}), 200

@app.route('/glucose', methods=['GET'])
@jwt_required()
def get_glucose_logs():
    current_user_id = get_jwt_identity()
    conn = get_glucose_log_db_connection()
    logs = conn.execute('SELECT * FROM glucose_logs WHERE user_id = ?', (current_user_id,)).fetchall()
    conn.close()
    return jsonify([dict(log) for log in logs])


# Appointment Page
def get_appointmentDB_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'user_management.db')
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/appointments', methods=['POST'])
def add_appointment():
    data = request.json
    conn = get_appointmentDB_connection()  
    conn.execute('INSERT INTO appointments (user_id, appointment_date, appointment_time, doctor_name, appointment_notes) VALUES (?, ?, ?, ?, ?)',
                 (data['user_id'], data['date'], data['time'], data['doctor_name'], data['notes']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Appointment added successfully'}), 201

@app.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    conn = get_appointmentDB_connection()  
    conn.execute('DELETE FROM appointments WHERE appointment_id = ?', (appointment_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Appointment deleted successfully'}), 200

@app.route('/appointments', methods=['GET'])
def get_appointments():
    conn = get_appointmentDB_connection()  
    appointments = conn.execute('SELECT * FROM appointments').fetchall()
    conn.close()
    return jsonify([dict(appointment) for appointment in appointments])


if __name__ == '__main__':
    app.run(debug=True)