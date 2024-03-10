import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.abspath('../database/user_management.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False