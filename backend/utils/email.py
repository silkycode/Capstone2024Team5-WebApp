from flask_mail import Mail, Message
from config import Config

mail = Mail()

def send_email(subject, recipients, body):
    msg = Message(subject, recipients=recipients, body=body, sender=Config.MAIL_USERNAME)
    mail.send(msg)