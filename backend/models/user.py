from models.db_module import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
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

    credentials_id = db.Column(db.Integer, db.ForeignKey('credentials.id'), nullable=False)
    credentials = db.relationship('UserCredentials', backref=db.backref('user', uselist=False, lazy=True))

    def __repr__(self):
        return f"<User {self.credentials.username}>"