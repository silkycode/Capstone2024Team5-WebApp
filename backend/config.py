import os
import secrets
from datetime import timedelta

class Config:
    DEBUG = True

    # Mail configs
    # MAIL_SERVER = 'smtp.gmail.com'
    # MAIL_PORT = 587
    # MAIL_USE_TLS = True
    # MAIL_USERNAME = ''
    # MAIL_PASSWORD = ''

    # Database configs
    # Cloud service URIs go here when implemented
    # assume dbs stored on same server as Flask app
    SQLALCHEMY_BINDS = {
        'user_management': 'sqlite:///' + os.path.abspath('../database/src/user_management.db'),
        'products': 'sqlite:///' + os.path.abspath('../database/src/products.db'),
        'food_info': 'sqlite:///' + os.path.abspath('../database/src/usdafood.db')
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configs
    JWT_SECRET_KEY = secrets.token_hex(32)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)