from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS
import os
import base64
import sqlite3

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath('../database/users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    __tablename__ = 'users'

@app.route('/api/debug', methods=['GET'])
def debug():
    # Query all users from the User table
    users = User.query.all()

    # Extract usernames from the users and create a list
    usernames = [user.username for user in users]

    # Return the usernames as a JSON response
    return jsonify({'usernames': usernames})    

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'authorized'})
    else:
        return jsonify({'message': 'denied'}), 401

def get_db_connection():
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
    return jsonify(products_list)


if __name__ == '__main__':
    app.run(debug=True)