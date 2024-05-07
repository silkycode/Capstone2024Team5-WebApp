import os
import secrets
import logging
from logging.handlers import RotatingFileHandler

class Config:
    DEBUG = True

    # Mail configs
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'aimplusportal@gmail.com'
    MAIL_PASSWORD = 'cwyb czoj koub aikm'

    # Database configs
    # Cloud service URIs go here when implemented
    SQLALCHEMY_BINDS = {
        'user_management': 'sqlite:///' + os.path.abspath('../database/user_management.db'),
        'products': 'sqlite:///' + os.path.abspath('../database/products.db')
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Log configs
    ROUTE_LOG_FILE = 'api.log'
    JOB_LOG_FILE = 'jobs.log'
    LOG_LEVEL = logging.INFO

    @classmethod
    def init_app(cls, app):
        route_log_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        route_log_handler = RotatingFileHandler(cls.ROUTE_LOG_FILE, maxBytes=1024 * 1024 * 100, backupCount=20)
        route_log_handler.setFormatter(route_log_formatter)
        route_log_handler.setLevel(cls.LOG_LEVEL)
        app.logger.addHandler(route_log_handler)

        job_log_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        job_log_handler = RotatingFileHandler(cls.JOB_LOG_FILE, maxBytes=1024 * 1024 * 100, backupCount=20)
        job_log_handler.setFormatter(job_log_formatter)
        job_log_handler.setLevel(cls.LOG_LEVEL)
        app.logger.addHandler(job_log_handler)

        cls.logger = logging.getLogger(__name__)
        cls.logger.setLevel(cls.LOG_LEVEL)
        
        cls.logger.addHandler(route_log_handler)
        cls.logger.addHandler(job_log_handler)

    # JWT configs
    JWT_SECRET_KEY = secrets.token_hex(32)