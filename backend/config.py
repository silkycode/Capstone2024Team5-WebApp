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
    LOG_FILE = 'app.log'
    LOG_LEVEL = logging.INFO

    @classmethod
    def init_app(cls, app):
        log_formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        log_handler = RotatingFileHandler(cls.LOG_FILE, maxBytes=1024 * 1024 * 100, backupCount=20)
        log_handler.setFormatter(log_formatter)
        log_handler.setLevel(cls.LOG_LEVEL)
        app.logger.addHandler(log_handler)

        # Create a logger instance for other modules
        cls.logger = logging.getLogger(__name__)
        cls.logger.setLevel(cls.LOG_LEVEL)
        cls.logger.addHandler(log_handler)

    # JWT configs
    JWT_SECRET_KEY = secrets.token_hex(32)