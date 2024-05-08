from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
import asyncio

# Import helper/utility/server tools
from utils.utils import log_http_requests
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
CORS(app)

# Set up db, mail, JWT connections
db.init_app(app)
jwt = JWTManager(app)

# Start background scheduler
bg_scheduler = init_scheduler(app)
schedule_background_jobs(app, bg_scheduler)
bg_scheduler.start()

# Initialize route logger
log_http_decorator = log_http_requests(utils.logger.route_logger)

# Add routes
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(dashboard_routes, url_prefix='/dashboard')
app.register_blueprint(admin_routes, url_prefix='/admin')

async def run():
    await asyncio.gather(start_smtp_server(), app_task())

async def app_task():
    app.run(debug=True, use_reloader=False)

if __name__ == '__main__':
    asyncio.run(run())