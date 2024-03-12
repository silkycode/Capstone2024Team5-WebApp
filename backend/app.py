from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import sqlite3
from routes.client_data_routes import client_data_routes
from routes.auth_routes import auth_routes
from config import Config
from models.db_module import db
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(client_data_routes, url_prefix='/services')

def get_productsDB_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'products.db')
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/products', methods=['GET'])
def products():
    conn = get_productsDB_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    products_list = []
    for product in products:
        product_dict = dict(product)
        if product_dict['image']:
            product_dict['image'] = base64.b64encode(product_dict['image']).decode('utf-8')
        products_list.append(product_dict)
    conn.close()
    return jsonify(products_list)

def get_glucose_log_db_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'glucose_log.db')
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/glucose', methods=['POST'])
def add_glucose_log():
    data = request.json

    # Combind dat and time into datetime
    datetime_str = f"{data['date']} {data['time']}"
    log_datetime = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')

    conn = get_glucose_log_db_connection()
    conn.execute('INSERT INTO glucose_logs (username, date, time, glucose_level) VALUES (?, ?, ?, ?)',
                 (data['username'], log_datetime, data['glucose_level']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Log added successfully'}), 201

@app.route('/glucose/<int:log_id>', methods=['DELETE'])
def delete_glucose_log(log_id):
    conn = get_glucose_log_db_connection()
    conn.execute('DELETE FROM glucose_logs WHERE log_id = ?', (log_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Log deleted successfully'}), 200

@app.route('/glucose', methods=['GET'])
def get_glucose_logs():
    username = request.args.get('username') # Assume you pass username as query parameter
    conn = get_glucose_log_db_connection()
    logs = conn.execute('SELECT * FROM glucose_logs WHERE username = ?', (username,)).fetchall()
    conn.close()
    return jsonify([dict(log) for log in logs])

def get_appointmentDB_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'appointments.db')
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