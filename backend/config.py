import os
import secrets


class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.abspath('../database/user_management.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = secrets.token_hex(32)