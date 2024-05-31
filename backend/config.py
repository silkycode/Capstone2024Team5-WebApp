import os
import secrets

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
    SQLALCHEMY_BINDS = {
        'user_management': 'sqlite:///' + os.path.abspath('../database/user_management.db'),
        'products': 'sqlite:///' + os.path.abspath('../database/products.db'),
        'food_info': 'sqlite:///' + os.path.abspath('../database/src/food/usdafood.db')
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configs
    JWT_SECRET_KEY = secrets.token_hex(32)