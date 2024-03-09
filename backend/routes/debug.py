from flask import request, jsonify
from datetime import datetime

def debug():
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sender_ip = request.remote_addr
    debug_message = f'This is a debug message for API testing. Current time: {current_time}. Sender IP: {sender_ip}'
    return jsonify({'message': debug_message}), 200  