from datetime import datetime
import re
from app.utils.time_utils import get_now_ist

def is_within_shift(shift_string: str) -> bool:
    """
    Checks if current time is within the provided shift range.
    Expected format: "HH:MM - HH:MM (Suffix)"
    """
    if not shift_string:
        return True # Default to always logging if not set

    try:
        # Extract times using regex (e.g., "17:00" and "01:00")
        times = re.findall(r"(\d{2}:\d{2})", shift_string)
        if len(times) < 2:
            return True

        now = get_now_ist().time()


        start_time = datetime.strptime(times[0], "%H:%M").time()
        end_time = datetime.strptime(times[1], "%H:%M").time()

        if start_time < end_time:
            # Normal shift (e.g., 09:00 - 17:00)
            return start_time <= now <= end_time
        else:
            # Overnight shift (e.g., 17:00 - 01:00)
            return now >= start_time or now <= end_time
            
    except Exception as e:
        print(f"[SHIFT SERVICE] Parsing Error: {e}")
        return True
