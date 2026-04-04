import json
import os

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "..", "database", "settings.json")

DEFAULT_SETTINGS = {
    "analyst_email": "analyst@example.com",
    "priority_attacks": ["sqli", "command_injection", "xss"],
    "automation_enabled": True,
    "report_tier": "Tier 1",
    "work_mode": "demo"
}

def load_settings():
    """
    Loads settings from the JSON file or returns defaults.
    """
    if not os.path.exists(SETTINGS_FILE):
        os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)
        save_settings(DEFAULT_SETTINGS)
        return DEFAULT_SETTINGS

    try:
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"[SETTINGS] Load Error: {e}")
        return DEFAULT_SETTINGS

def save_settings(settings):
    """
    Saves settings to the JSON file.
    """
    try:
        with open(SETTINGS_FILE, "w") as f:
            json.dump(settings, f, indent=4)
        return True
    except Exception as e:
        print(f"[SETTINGS] Save Error: {e}")
        return False
