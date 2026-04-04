import json
import os
from app.database.connection import db

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "..", "database", "settings.json")

DEFAULT_SETTINGS = {
    "analyst_email": "analyst@example.com",
    "priority_attacks": ["sqli", "command_injection", "xss"],
    "automation_enabled": True,
    "report_tier": "Tier 1",
    "work_mode": "demo"
}

def load_settings():
    # If Firestore is connected, pull from cloud
    if db is not None:
        try:
            doc = db.collection("system").document("settings").get()
            if doc.exists:
                return doc.to_dict()
        except Exception as e:
            print(f"[FIRESTORE] Load Settings Error: {e}")

    # Fallback to local JSON
    if not os.path.exists(SETTINGS_FILE):
        os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)
        save_settings(DEFAULT_SETTINGS) # Will try Firestore then fallback
        return DEFAULT_SETTINGS

    try:
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"[SETTINGS] Load Error: {e}")
        return DEFAULT_SETTINGS

def save_settings(settings):
    # If Firestore is connected, save to cloud
    if db is not None:
        try:
            db.collection("system").document("settings").set(settings)
        except Exception as e:
            print(f"[FIRESTORE] Save Settings Error: {e}")

    # Always save a local copy as backup
    try:
        with open(SETTINGS_FILE, "w") as f:
            json.dump(settings, f, indent=4)
        return True
    except Exception as e:
        print(f"[SETTINGS] Save Error: {e}")
        return False
