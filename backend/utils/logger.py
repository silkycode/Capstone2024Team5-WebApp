import logging
from logging.handlers import RotatingFileHandler

def setup_logger(logger_name, log_file):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.INFO)

    handler = RotatingFileHandler(log_file, maxBytes=1024 * 1024 * 100, backupCount=10)
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger

ROUTE_LOG_FILE = 'api.log'
JOB_LOG_FILE = 'jobs.log'
EMAIL_LOG_FILE ='emails.log'

formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

# API logs
route_logger = setup_logger('route_logger', ROUTE_LOG_FILE)

# Job logs
job_logger = setup_logger('job_logger', JOB_LOG_FILE)

# Fake email logs
email_logger = setup_logger('email_logger', EMAIL_LOG_FILE)