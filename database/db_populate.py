import hashlib
import sqlite3
import random
from faker import Faker

fake = Faker()
conn = sqlite3.connect('user_management.db')
cursor = conn.cursor()

def generate_dob():
    return fake.date_of_birth(minimum_age=18, maximum_age=90)

def generate_phone():
    return fake.phone_number()

def generate_insurance():
    return random.choice(['Blue Cross', 'Apple Health', 'Medina', 'United Healthcare'])

def generate_medical_id():
    return fake.random_number(digits=7)

def generate_notification():
    return fake.sentence()

def generate_glucose_level():
    return random.randint(80, 200)

def generate_appointment_date():
    return fake.date_time_this_year(before_now=False, after_now=True).strftime('%Y-%m-%d %H:%M')

def insert_user():
    first_name = fake.first_name()
    last_name = fake.last_name()
    dob = generate_dob()
    primary_phone = generate_phone()
    secondary_phone = generate_phone()
    address = fake.address()
    primary_insurance = generate_insurance()
    medical_id = generate_medical_id()
    contact_person = fake.name()
    password = b"password"

    while True:
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 100)}@example.com"
        cursor.execute("SELECT COUNT(*) FROM account WHERE email = ?", (email,))
        count = cursor.fetchone()[0]
        if count == 0:
            break

    while True:
        username = f"{first_name.lower()}{last_name.lower()}{random.randint(1, 100)}"
        cursor.execute("SELECT COUNT(*) FROM account WHERE username = ?", (username,))
        count = cursor.fetchone()[0]
        if count == 0:
            break

    password_hash = hashlib.sha3_256(password).digest()

    cursor.execute("INSERT INTO user (first_name, last_name, dob, primary_phone, secondary_phone, address, primary_insurance, medical_id, contact_person) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   (first_name, last_name, dob, primary_phone, secondary_phone, address, primary_insurance, medical_id, contact_person))
    user_id = cursor.lastrowid

    cursor.execute("INSERT INTO account (id, username, email, password_hash, is_admin) VALUES (?, ?, ?, ?, ?)",
                   (user_id, username, email, password_hash, 0))

    return user_id

def insert_glucose_logs(user_id):
    for _ in range(random.randint(1, 80)):
        glucose_level = generate_glucose_level()
        creation_date = fake.date_time_this_year(before_now=True, after_now=False).strftime('%Y-%m-%d %H:%M:%S')

        cursor.execute("INSERT INTO glucose_log (user_id, glucose_level, creation_date) VALUES (?, ?, ?)",
                       (user_id, glucose_level, creation_date))

def insert_appointments(user_id):
    for _ in range(random.randint(1, 8)):
        appointment_date = generate_appointment_date()
        doctor_name = fake.name()
        appointment_notes = fake.sentence()

        cursor.execute("INSERT INTO appointment (user_id, appointment_date, doctor_name, appointment_notes) VALUES (?, ?, ?, ?)",
                       (user_id, appointment_date, doctor_name, appointment_notes))

for _ in range(1000):
    user_id = insert_user()
    insert_glucose_logs(user_id)
    insert_appointments(user_id)

conn.commit()
conn.close()