from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import sqlite3
from routes.client_data_routes import client_data_routes
from routes.auth_routes import auth_routes
from config import Config
from models.db_module import db

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
    conn = get_glucose_log_db_connection()
    conn.execute('INSERT INTO glucose_logs (username, date, time, glucose_level) VALUES (?, ?, ?, ?)',
                 (data['username'], data['date'], data['time'], data['glucose_level']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Log added successfully'}), 201

@app.route('/glucose', methods=['GET'])
def get_glucose_logs():
    username = request.args.get('username') # Assume you pass username as query parameter
    conn = get_glucose_log_db_connection()
    logs = conn.execute('SELECT * FROM glucose_logs WHERE username = ?', (username,)).fetchall()
    conn.close()
    return jsonify([dict(log) for log in logs])

if __name__ == '__main__':
    app.run(debug=True)