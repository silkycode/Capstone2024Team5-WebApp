from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from routes import auth, debug
from models.users import db

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
db.init_app(app)

# General debugging API, response verifies API host is running
app.add_url_rule('/api/debug', view_func=debug.debug, methods=['GET'])

# Handle user login call
app.add_url_rule('/api/login', view_func=auth.login, methods=['POST'])

# Handle user forgot password request
app.add_url_rule('/api/forgot_password', view_func=auth.forgot_password, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)