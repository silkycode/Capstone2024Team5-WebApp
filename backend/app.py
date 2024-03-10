from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import sqlite3
from routes.auth_routes import auth_routes
from config import Config
from routes import debug
from models.db_module import db

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

app.register_blueprint(auth_routes, url_prefix='/auth')

""" def get_db_connection():
    database_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'products.db')
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/products', methods=['GET'])
def products():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    products_list = []
    for product in products:
        product_dict = dict(product)
        if product_dict['image']:
            product_dict['image'] = base64.b64encode(product_dict['image']).decode('utf-8')
        products_list.append(product_dict)
    conn.close()
    return jsonify(products_list) """


if __name__ == '__main__':
    app.run(debug=True)