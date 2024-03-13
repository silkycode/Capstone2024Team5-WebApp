from models.db_module import db

class UserCredentials(db.Model):
    __tablename__ = 'credentials'
    credentials_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(255), nullable=False)

class User(db.Model):
    __tablename__ = 'users'
    credentials_id = db.Column(db.Integer, db.ForeignKey('credentials.credentials_id'), primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    dob = db.Column(db.Date)
    primary_phone = db.Column(db.String(20))
    secondary_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    primary_insurance = db.Column(db.String(255))
    id_number = db.Column(db.String(20))
    contact_person = db.Column(db.String(255))
    last_office_visit = db.Column(db.Date)
    doctor_name = db.Column(db.String(255))
    doctor_phone = db.Column(db.String(20))
    doctor_fax = db.Column(db.String(20))

    credentials = db.relationship('UserCredentials', backref=db.backref('user', uselist=False, lazy=True))

    def __repr__(self):
        return f"<User {self.credentials.username}>"
    
class GlucoseLog(db.Model):
    __tablename__ = 'glucose_log'

    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.credentials_id', ondelete='CASCADE'))
    glucose_level = db.Column(db.Integer)
    log_timestamp = db.Column(db.DateTime)

class Appointment(db.Model):
    __tablename__ = 'appointment'

    appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.credentials_id', ondelete='CASCADE'))
    appointment_date = db.Column(db.DateTime)
    doctor_name = db.Column(db.String(255))
    appointment_notes = db.Column(db.Text)

class Notification(db.Model):
    __tablename__ = 'notification'

    status_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.credentials_id', ondelete='CASCADE'))
    notification = db.Column(db.Text)
    importance = db.Column(db.Integer)
    status_timestamp = db.Column(db.DateTime)
    