from fastapi import APIRouter
import csv
import os
from app.utils.logger import get_file_path
from app.utils.settings_manager import load_settings
from app.database.connection import db
from firebase_admin import firestore

router = APIRouter()

@router.get("/logs")
def get_logs(mode: str = None):
    settings = load_settings()
    current_mode = mode or settings.get("work_mode", "demo")
    
    logs = []

    # Attempt to fetch from Firestore first
    if db is not None:
        try:
            col = "logs_live" if current_mode == "live" else "logs_demo"
            docs = db.collection(col).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(100).stream()
            for doc in docs:
                data = doc.to_dict()
                # Frontend expects array: [timestamp, input, attack_type, response]
                logs.append([
                    data.get("timestamp", ""),
                    data.get("input", ""),
                    data.get("prediction", data.get("attack_type", "")),
                    data.get("response", "")
                ])
            # Reverse to match chronological order if needed, but UI usually wants newest top
            return logs
        except Exception as e:
            print(f"[FIRESTORE] Failed to fetch logs: {e}")

    # Fallback to Local CSV
    target_path = get_file_path(current_mode)
    if not os.path.exists(target_path):
        return []

    with open(target_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) > 3:
                logs.append(row)

    return logs
