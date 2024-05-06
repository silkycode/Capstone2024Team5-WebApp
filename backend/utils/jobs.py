# Functions and methods for backend jobs, data manipulation, db population, cleanup, etc.

from datetime import datetime, timedelta
from apscheduler.triggers.interval import IntervalTrigger
from models.user_management_models import User, Appointment, GlucoseLog
from utils.email import send_email
from utils.scheduler import scheduler as job_scheduler

# Simple debug job, prints to terminal to ensure scheduler is functioning
def print_message_job():
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message = f"{timestamp} - Debug: this message repeats every 20 seconds. Job scheduler online."
    print(message)

job_scheduler.add_job(
    print_message_job,
    trigger=IntervalTrigger(seconds=20),
    id='print_message_job',
    name='Print Message Job',
    replace_existing=True
)

"""
Auto Email Reminder System:
    Scheduled Tasks:
        - Task: remind_glucose_log
            - Schedule: Daily at Midnight
            - Purpose: Checks if users have logged their glucose levels in the last 24 hours during their 90-day tracking period. Sends a reminder email if not logged.
            - Method: Queries the 'glucose_log' table to find the last entry date for each user and compares it with the current date.
            - Email Trigger:
                - Subject: "Reminder to log your glucose"
                - Body: "Please remember to log your daily glucose level."
            - Response:
                - Success: Reminder email sent successfully.
                - Failure: Issues in querying the database or sending email.

        - Task: remind_appointment
            - Schedule: Daily at Noon
            - Purpose: Sends an email reminder to users about their appointments scheduled for the next day.
            - Method: Queries the 'appointment' table for appointments that are scheduled for the next day.
            - Email Trigger:
                - Subject: "Appointment Reminder"
                - Body: "Reminder: You have an appointment with {doctor_name} on {appointment_date}."
            - Response:
                - Success: Reminder email sent successfully.
                - Failure: Issues in querying the database or sending email.

    Technical Configuration:
        - Flask-Mail Configuration:
            - MAIL_SERVER: 'smtp.gmail.com'
            - MAIL_PORT: 465
            - MAIL_USE_SSL: True
            - Credentials are securely configured using environment variables.
"""    
def remind_glucose_log():
    today = datetime.now().date()
    ninety_days_ago = today - timedelta(days=90)
    users = User.query.all()  # Assuming User model has an email attribute

    for user in users:
        last_glucose_entry = GlucoseLog.query.filter_by(user_id=user.id).order_by(GlucoseLog.creation_date.desc()).first()
        if last_glucose_entry:
            last_entry_date = datetime.strptime(last_glucose_entry.creation_date, '%Y-%m-%d').date()
            if last_entry_date < today and last_entry_date >= ninety_days_ago:
                send_email("Reminder to log your glucose", user.email, "Please remember to log your daily glucose level.")

def remind_appointment():
    tomorrow = datetime.now().date() + timedelta(days=1)
    appointments = Appointment.query.filter_by(appointment_date=tomorrow.strftime('%Y-%m-%d')).all()

    for appointment in appointments:
        user = User.query.get(appointment.user_id)
        send_email("Appointment Reminder", user.email, f"Reminder: You have an appointment with {appointment.doctor_name} on {appointment.appointment_date}.")


job_scheduler.add_job(remind_glucose_log, 'cron', hour=0)  # Runs daily at midnight
job_scheduler.add_job(remind_appointment, 'cron', hour=12)  # Runs daily at noon