# EXTREMELY basic skeleton to let us run a local SMTP server on our Flask app
from aiosmtpd.controller import Controller
from aiosmtpd.handlers import AsyncMessage
from email.message import EmailMessage
from utils.logger import email_logger

# Doesn't actually do anything yet, because there are no emails coming in over SMTP protocol
class CustomAsyncMessageHandler(AsyncMessage):
    async def handle_message():
        return '250 OK'

async def start_smtp_server():
    try:
        email_logger.info("Starting SMTP server...")

        handler = CustomAsyncMessageHandler()
        controller = Controller(handler=handler, hostname='127.0.0.1', port=1025)
        controller.start()

        email_logger.info("SMTP server started successfully.")

    except Exception as e:
        email_logger.error(f"Error starting SMTP server: {e}")

# This just simulates email generation, but doesn't use SMTP protocol
def send_email(body, subject, sender, recipient):
    try:
        message = EmailMessage()
        message.set_content(body)
        message['Subject'] = subject
        message['From'] = sender
        message['To'] = recipient

        email_logger.info(f"Sending email: From: {sender}, To: {recipient}, Subject - {subject}, Content - {body}")

        # Actual SMTP protocol needed for interacting with other SMTP servers, but just local for now for debugging/testing

    except Exception as e:
        email_logger.error(f"Error occurred while sending email: {str(e)}")