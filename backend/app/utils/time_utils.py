from datetime import datetime, timezone, timedelta

def get_now_ist():
    """
    Returns the current time in IST (UTC+5:30).
    """
    return datetime.now(timezone(timedelta(hours=5, minutes=30)))
