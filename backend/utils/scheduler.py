from apscheduler.schedulers.background import BackgroundScheduler
from utils.logger import server_logger, error_logger

def init_scheduler(app):
    try:
        server_logger.info("Initializing background scheduler...")
        bg_scheduler = BackgroundScheduler()
        bg_scheduler.app = app 
        server_logger.info("Background scheduler started.")
        return bg_scheduler
    except Exception as e:
        error_logger.error(f"Error initializing background scheduler: {e}")