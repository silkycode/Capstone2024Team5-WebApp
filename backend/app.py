import json
import logging
import uuid
from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
import asyncio

# Import helper/utility/server tools
from utils.db_module import db
import utils.logger
from utils.jobs import schedule_background_jobs
from utils.scheduler import init_scheduler
from utils.aiosmtpd_config import start_smtp_server

# Import API route blueprints
from routes.dashboard_routes import dashboard_routes
from routes.auth_routes import auth_routes
from routes.admin_routes import admin_routes

# Init app, config, and enable CORS for resource sharing
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)

# Set up db, JWT connection
db.init_app(app)

utils.logger.server_logger.info("Setting up JWT...")
jwt = JWTManager(app)
utils.logger.server_logger.info("JWT setup completed.")

# Start background scheduler
bg_scheduler = init_scheduler(app)
schedule_background_jobs(app, bg_scheduler)
bg_scheduler.start()

# Add routes
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(dashboard_routes, url_prefix='/dashboard')
app.register_blueprint(admin_routes, url_prefix='/admin')

@app.before_request
def before_request():
    request.unique_id = str(uuid.uuid4())
    request.source_ip = request.remote_addr 

    if request.method in ['POST', 'DELETE']:
        try:
            data = json.loads(request.data.decode('utf-8'))
        except json.JSONDecodeError:
            data = {}
    else:
        data = {}
    
    # Censor passwords in the request data
    if 'password' in data:
        data['password'] = '******'
    
    request.censored_data = data

@app.after_request
def after_request(response):
    utils.logger.route_logger.info(f"Request {request.unique_id}: {request.method} {request.path} - Source IP: {request.source_ip} - {response.status}")
    return response

async def run():
    utils.logger.server_logger.info("Starting SMTP server...")
    await asyncio.gather(start_smtp_server(), app_task())

async def app_task():
    utils.logger.server_logger.info("Starting Flask app...")
    app.run(debug=True, use_reloader=False)

if __name__ == '__main__':
    asyncio.run(run())