import logging
from logging.handlers import RotatingFileHandler
from config import Config

# Create a logger instance
logger = logging.getLogger(__name__)
logger.setLevel(Config.LOG_LEVEL)
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
handler = RotatingFileHandler(Config.LOG_FILE, maxBytes=1024 * 1024 * 100, backupCount=10)
handler.setFormatter(formatter)
logger.addHandler(handler)