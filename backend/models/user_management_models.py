from datetime import datetime, timedelta
from utils.db_module import db

class UserModel(db.Model):
    __abstract__ = True
    __bind_key__ = 'user_management'

class Account(UserModel):
    __tablename__ = 'account'

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    last_login_date = db.Column(db.String, default=None)
    failed_logins = db.Column(db.Integer, default=0)
    date_created = db.Column(db.String, default=db.func.current_timestamp(), nullable=False)
    is_admin = db.Column(db.Integer, default=0, nullable=False)
    deleted = db.Column(db.Integer, default=0, nullable=False)
    delete_time = db.Column(db.String, default=None)
    
    # one-to-one relationship w/ user, one-to-many w/ refresh_token
    user = db.relationship('User', uselist=False, backref='account', cascade='all, delete-orphan')
    refresh_token = db.relationship('RefreshToken', backref='account', cascade='all, delete-orphan')

    def soft_delete(self):
        if not self.deleted:
            self.deleted = 1
            delete_time = datetime.now() + timedelta(hours=48)
            self.delete_time = delete_time.strftime('%Y:%m:%d %H:%M:%S')

    def recover(self):
        if self.deleted:
            self.deleted = 0
            self.delete_time = None

class RefreshToken(UserModel):
    __tablename__ = 'refresh_token'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    refresh_token = db.Column(db.String, unique=True, nullable=False)
    expiration_time = db.Column(db.String, unique=True, nullable=False)
    session_id = db.Column(db.String, unique=True, nullable=False)

class User(UserModel):
    __tablename__ = 'user'

    id = db.Column(db.Integer, db.ForeignKey('account.id'), primary_key=True)

    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    dob = db.Column(db.String)
    primary_phone = db.Column(db.String)
    secondary_phone = db.Column(db.String)
    address = db.Column(db.String)
    primary_insurance = db.Column(db.String)
    medical_id = db.Column(db.String)
    contact_person = db.Column(db.String)
    
    # one-to-many relationships between user and dashboard info tables (1 user can have many of each)
    glucose_logs = db.relationship('GlucoseLog', backref='user', cascade='all, delete-orphan')
    appointments = db.relationship('Appointment', backref='user', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', cascade='all, delete-orphan')
    
class GlucoseLog(UserModel):
    __tablename__ = 'glucose_log'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    glucose_level = db.Column(db.Integer, nullable=False)
    creation_date = db.Column(db.String, default=db.func.current_timestamp(), nullable=False)

class Appointment(UserModel):
    __tablename__ = 'appointment'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_date = db.Column(db.String, nullable=False)
    doctor_name = db.Column(db.String, nullable=False)
    appointment_notes = db.Column(db.String, nullable=True)
    creation_date = db.Column(db.String, default=db.func.current_timestamp(), nullable=False)

class Notification(UserModel):
    __tablename__ = 'notification'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    notification = db.Column(db.String, nullable=False)
    importance = db.Column(db.Integer, nullable=False)
    type = db.Column(db.Integer, nullable=False)
    creation_date = db.Column(db.String, default=db.func.current_timestamp(), nullable=False)    