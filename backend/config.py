import os
import secrets

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
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.abspath('../database/user_management.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configs
    JWT_SECRET_KEY = secrets.token_hex(32)