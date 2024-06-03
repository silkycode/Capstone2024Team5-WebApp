from flask_sqlalchemy import SQLAlchemy
from utils.logger import server_logger, error_logger

try:
    db = SQLAlchemy()
    server_logger.info("Database initialized successfully")
except Exception as e:
    error_logger.error(f"Error initializing database: {str(e)}")
    raise