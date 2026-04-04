import csv
import os
from app.utils.time_utils import get_now_ist
from app.database.connection import db

base_dir = os.path.dirname(os.path.dirname(__file__))
db_dir = os.path.join(base_dir, "database")
if not os.path.exists(db_dir):
    os.makedirs(db_dir)

def get_file_path(mode="demo"):
    if mode == "live":
        return os.path.join(db_dir, "logs_live.csv")
    return os.path.join(db_dir, "logs.csv")

def save_log(data, prediction, response, mode="demo"):
    print("Writing to Firestore, Mode:", mode)
    if db is not None:
        try:
            col = "logs_live" if mode == "live" else "logs_demo"
            db.collection(col).add({
                "timestamp": get_now_ist().isoformat(),
                "input": data.get("input", ""),
                "prediction": prediction,
                "response": response
            })
            return
        except Exception as e:
            print(f"[FIRESTORE] Failed to save log: {e}")

    # Fallback to CSV if Firestore isn't connected
    target_path = get_file_path(mode)
    with open(target_path, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            get_now_ist().isoformat(),
            data.get("input"),
            prediction,
            response
        ])

def log_attack(log_data: dict, mode="demo"):
    if db is not None:
        try:
            col = "logs_live" if mode == "live" else "logs_demo"
            db.collection(col).add({
                "timestamp": log_data.get("timestamp", get_now_ist().isoformat()),
                "input": log_data.get("input", ""),
                "attack_type": log_data.get("attack_type", "unknown"),
                "response": log_data.get("response", "")
            })
            return
        except Exception as e:
            print(f"[FIRESTORE] Failed to save attack log: {e}")

    # Fallback to CSV if Firestore isn't connected
    target_path = get_file_path(mode)
    with open(target_path, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            log_data.get("timestamp", get_now_ist().isoformat()),
            log_data.get("input", ""),
            log_data.get("attack_type", "unknown"),
            log_data.get("response", "")
        ])

