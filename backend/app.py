from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

from utils.utils import log_http_requests
from utils.db_module import db
from utils.email import mail
from utils.logger import route_logger
from utils.jobs import schedule_background_jobs
from utils.scheduler import init_scheduler

from routes.dashboard_routes import dashboard_routes
from routes.auth_routes import auth_routes
from routes.admin_routes import admin_routes

app = Flask(__name__)
app.config.from_object(Config)
jwt = JWTManager(app)
CORS(app)

# Set up db and mail server connections
db.init_app(app)
mail.init_app(app)

# Start background scheduler
bg_scheduler = init_scheduler(app)
schedule_background_jobs(app, bg_scheduler)
bg_scheduler.start()

# Initialize route logger
log_http_decorator = log_http_requests(route_logger)

# Add routes
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(dashboard_routes, url_prefix='/dashboard')
app.register_blueprint(admin_routes, url_prefix='/admin')


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)