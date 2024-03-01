import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.abspath('../database/users.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False