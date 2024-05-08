from apscheduler.schedulers.background import BackgroundScheduler

def init_scheduler(app):
    bg_scheduler = BackgroundScheduler()
    bg_scheduler.app = app 
    return bg_scheduler