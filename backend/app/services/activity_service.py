import json
import os

ACTIVITY_FILE = os.path.join(os.path.dirname(__file__), "..", "database", "analyst_activity.json")

def log_analyst_activity(log_data, settings):
    """
    Appends an attack record to the analyst's activity log.
    """
    if not os.path.exists(ACTIVITY_FILE):
        # Initialize if missing (This should happen in settings route too)
        with open(ACTIVITY_FILE, "w") as f:
            json.dump([], f)

    try:
        with open(ACTIVITY_FILE, "r") as f:
            data = json.load(f)

        if not data:
            return  # No profile initialized yet

        # Assuming we track only the CURRENT active analyst (data[0])
        analyst = data[0]

        entry = {
            "timestamp": log_data["timestamp"],
            "attack_type": log_data["attack_type"],
            "payload": log_data["input"],
            "system_response": log_data["response"],
            "stage": log_data.get("stage", "unknown"),
            "mode": settings.get("mode", "IDS")
        }

        # Avoid double logging the same entry within the same session
        analyst["activity_log"].append(entry)

        # Keep only last 100 entries per session to avoid file bloat
        if len(analyst["activity_log"]) > 100:
            analyst["activity_log"] = analyst["activity_log"][-100:]

        with open(ACTIVITY_FILE, "w") as f:
            json.dump(data, f, indent=2)

    except Exception as e:
        print(f"[ACTIVITY SERVICE] Error Logging: {e}")
