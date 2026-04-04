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
            docs = db.collection(col).limit(500).stream()
            
            raw_docs = []
            for doc in docs:
                raw_docs.append(doc.to_dict())
            
            # 🔥 In-Memory Sort: Newest first (Descending by ISO Timestamp)
            sorted_docs = sorted(raw_docs, key=lambda x: x.get("timestamp", ""), reverse=True)
            
            for data in sorted_docs:
                p = data.get("attack_type", data.get("prediction", "normal"))
                attacks.append(p)
                
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
