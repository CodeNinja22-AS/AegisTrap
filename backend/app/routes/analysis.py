from fastapi import APIRouter
import csv
import os
from collections import Counter
from app.utils.logger import get_file_path
from app.utils.settings_manager import load_settings
from app.database.connection import db

router = APIRouter()

@router.get("/analysis")
def analyze(mode: str = None):
    settings = load_settings()
    current_mode = mode or settings.get("work_mode", "demo")
    
    attacks = []

    if db is not None:
        try:
            col = "logs_live" if current_mode == "live" else "logs_demo"
            docs = db.collection(col).stream()
            for doc in docs:
                data = doc.to_dict()
                # `attack_type` is what we store. `prediction` is the fallback metric mapping.
                prediction = data.get("prediction", data.get("attack_type", "normal"))
                attacks.append(prediction)
                
            count = Counter(attacks)
            return {
                "attack_counts": dict(count),
                "total": len(attacks)
            }
        except Exception as e:
            print(f"[FIRESTORE] Failed to fetch analysis data: {e}")

    # Fallback to local CSV
    target_path = get_file_path(current_mode)
    if not os.path.exists(target_path):
        return {
            "attack_counts": {},
            "total": 0
        }

    with open(target_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) > 2:
                attacks.append(row[2])  # prediction column

    count = Counter(attacks)

    return {
        "attack_counts": dict(count),
        "total": len(attacks)
    }
