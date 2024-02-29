from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS
import os

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

if __name__ == '__main__':
    app.run(debug=True)