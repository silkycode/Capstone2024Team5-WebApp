# Functions and methods for backend jobs, data manipulation, db population, cleanup, etc.

from datetime import datetime, time, timedelta
from time import sleep
from utils.db_module import db
from utils.logger import job_logger
from sqlalchemy.exc import SQLAlchemyError
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from models.user_management_models import User, Appointment, GlucoseLog, Notification
from utils.email import send_email

# Simple debug job, prints to terminal to ensure scheduler is functioning
def heartbeat(app):
    with app.app_context():
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message = f"{timestamp} - Debug: this message repeats every minute. Searching for tasks..."
        print(message)
        sleep(5)

"""
notification_generator():
    - Generic helper function to store new notifications in user db, should be called by specific notification generators
    - Parameters:
        - query: Function to retrieve relevant data used for notification generation
        - message_generator: Function to generate notification message for each processed data object
        - importance: Ranking system for severity of notification, higher is more important
"""
def notification_generator(query_func, msg_generator, importance, type):
    total_notifications = 0
    start_time = datetime.now()
    
    try:
        notifs = query_func()
        for notif_obj in notifs:
            notif_msg = msg_generator(notif_obj)
            notif = Notification(user_id=notif_obj.user_id, notification=notif_msg, importance=importance, type=type)
            db.session.add(notif)
            total_notifications += 1

        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        job_logger.error(f"Error occurred while generating notifications: {str(e)}")

    end_time = datetime.now()
    time_taken = end_time - start_time
    return total_notifications, time_taken

"""
generate_glucose_notifs():
    - Scan db for users with most recent glucose logs that are over one day old, generate notification
    - Two subfunctions:
        - query_glucose(): isolate glucose logs that have not had an update in over a day
        - glucose_notif_msg_generator(): Populate notification message field for frontend things
"""
def generate_glucose_notifs(app):
    with app.app_context():
        def query_glucose():
            overdue_logs = []
            subquery = db.session.query(
                GlucoseLog.user_id,
                db.func.max(GlucoseLog.creation_date).label('max_date')
            ).group_by(GlucoseLog.user_id).subquery()

            logs_to_notify = db.session.query(GlucoseLog).join(
                subquery, db.and_(
                    GlucoseLog.user_id == subquery.c.user_id,
                    GlucoseLog.creation_date == subquery.c.max_date
                )
            ).all()

            for log in logs_to_notify:                
                try:
                    log_creation_date = datetime.strptime(log.creation_date, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    log_creation_date = datetime.strptime(log.creation_date, '%Y-%m-%d %H:%M')

                time_difference_seconds = (datetime.now() - log_creation_date).total_seconds()
                if time_difference_seconds > 24 * 60 * 60:
                    overdue_logs.append(log)

            return overdue_logs

        def glucose_notif_msg_generator(glucose_log):
            msg = f"No new logs added since account #{glucose_log.user_id}'s glucose level at {glucose_log.creation_date}"
            return msg

        try:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"{timestamp} - Executing glucose log notification generation...")
            total_notifications, time_taken = notification_generator(
                query_glucose, 
                glucose_notif_msg_generator, 
                importance=3,
                type=1
            )
            job_logger.info(f"Generated {total_notifications} glucose log notifications in {time_taken} seconds.")
        except Exception as e:
            job_logger.error(f"Error generating glucose log notifications: {str(e)}")

"""
generate_appointment_notifs():
    - Scan db for appointments that are now past current time, send a notification for 
    - Two subfunctions:
        - query_glucose(): isolate appointments that have passed
        - glucose_notif_msg_generator(): Populate notification message field for frontend things
"""
def generate_appointment_notifs(app):
    with app.app_context():
        def query_appointments():
            past_appointments = db.session.query(Appointment).filter(
                Appointment.appointment_date < datetime.now()
            ).all()

            return past_appointments
        
        def appointment_notif_msg_generator(appointment):
            msg = f"Past appointment at {appointment.appointment_date} with {appointment.doctor_name}"
            return msg
        
        try:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"{timestamp} - Executing appointment notification generation...")
            total_notifications, time_taken = notification_generator(
                query_appointments, 
                appointment_notif_msg_generator, 
                importance=3,
                type=2
            )
            job_logger.info(f"Generated {total_notifications} appointment notifications in {time_taken} seconds.")
        except Exception as e:
            job_logger.error(f"Error generating appointment notifications: {str(e)}")

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
            - Schedule: Daily at Midnight
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
def send_glucose_reminder_email():
    today = datetime.now().date()
    ninety_days_ago = today - timedelta(days=90)
    users = User.query.all()  # Assuming User model has an email attribute

    for user in users:
        last_glucose_entry = GlucoseLog.query.filter_by(user_id=user.id).order_by(GlucoseLog.creation_date.desc()).first()
        if last_glucose_entry:
            last_entry_date = datetime.strptime(last_glucose_entry.creation_date, '%Y-%m-%d').date()
            if last_entry_date < today and last_entry_date >= ninety_days_ago:
                send_email("Reminder to log your glucose", user.email, "Please remember to log your daily glucose level.")

def send_appointment_reminder_email():
    tomorrow = datetime.now().date() + timedelta(days=1)
    appointments = Appointment.query.filter_by(appointment_date=tomorrow.strftime('%Y-%m-%d')).all()

    for appointment in appointments:
        user = User.query.get(appointment.user_id)
        send_email("Appointment Reminder", user.email, f"Reminder: You have an appointment with {appointment.doctor_name} on {appointment.appointment_date}.")


def schedule_background_jobs(app, scheduler):
    scheduler.add_job(
        heartbeat,
        trigger=IntervalTrigger(seconds=60),
        id='heartbeat',
        name='Scheduler is Alive',
        args=[app]
    )

    scheduler.add_job(
        generate_glucose_notifs,
        trigger=CronTrigger(hour='0'),
        id='generate_glucose_notifs_midnight',
        name='Generate glucose log notifications (Midnight)',
        args=[app]
    )

    scheduler.add_job(
        generate_glucose_notifs,
        trigger=CronTrigger(hour='12'),
        id='generate_glucose_notifs_noon',
        name='Generate glucose log notifications (Noon)',
        args=[app]
    )

    scheduler.add_job(
        send_appointment_reminder_email,
        trigger=CronTrigger(hour='0'),
        id='send_appointment_reminder_email',
        name='Sent out appointment reminder email (Midnight)',
        args=[app]
    )

    scheduler.add_job(
        send_glucose_reminder_email,
        trigger=CronTrigger(hour='0'),
        id='send_glucose_reminder_email',
        name='Sent out glucose logging reminder email (Midnight)',
        args=[app]
    )