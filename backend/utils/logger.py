import logging
from logging.handlers import RotatingFileHandler

ROUTE_LOG_FILE = 'api.log'
JOB_LOG_FILE = 'jobs.log'

# API logs
route_logger = logging.getLogger('route_logger')
route_logger.setLevel(logging.INFO)

formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

route_handler = RotatingFileHandler(ROUTE_LOG_FILE, maxBytes=1024 * 1024 * 100, backupCount=10)
route_handler.setFormatter(formatter)
route_logger.addHandler(route_handler)

# Job logs
job_logger = logging.getLogger('job_logger')
job_logger.setLevel(logging.INFO)

job_handler = RotatingFileHandler(JOB_LOG_FILE, maxBytes=1024 * 1024 * 100, backupCount=10)
job_handler.setFormatter(formatter)
job_logger.addHandler(job_handler)