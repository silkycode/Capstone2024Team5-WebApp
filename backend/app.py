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
import logging

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

if __name__ == '__main__':
    app.run(debug=True)