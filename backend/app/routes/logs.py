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
            docs = db.collection(col).limit(100).stream()
            
            raw_docs = []
            for doc in docs:
                raw_docs.append(doc.to_dict())
            
            # 🔥 In-Memory Sort: Newest first (Descending by ISO Timestamp)
            sorted_docs = sorted(raw_docs, key=lambda x: x.get("timestamp", ""), reverse=True)
            
            for data in sorted_docs:
                prediction = data.get("prediction", data.get("attack_type", "unknown"))
                
                # Ensure the Resolution (index 3) is a clean, formatted string
                resolution_str = data.get("forensic_resolution") or data.get("response") or "Detailed telemetry captured."
                
                if isinstance(resolution_str, dict):
                    resolution_str = resolution_str.get("response", "Metadata available in insights.")

                # Frontend expects array: [timestamp, input, attack_type, response]
                logs.append([
                    data.get("timestamp", ""),
                    data.get("input_payload", data.get("input", "")),
                    prediction,
                    resolution_str
                ])
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
