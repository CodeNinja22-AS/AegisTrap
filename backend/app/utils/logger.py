import csv
import os
from app.utils.time_utils import get_now_ist
from app.database.connection import db
from app.utils.log_processor import processor
import json

base_dir = os.path.dirname(os.path.dirname(__file__))
db_dir = os.path.join(base_dir, "database")
if not os.path.exists(db_dir):
    os.makedirs(db_dir)

def get_file_path(mode="demo"):
    if mode == "live": return os.path.join(db_dir, "logs_live.csv")
    return os.path.join(db_dir, "logs.csv")

def save_log(data, prediction, response, mode="demo"):
    """
    Saves a log entry by first calculating risk/severity via LogProcessor.
    """
    raw_log = {
        "timestamp": get_now_ist().isoformat(),
        "input": data.get("input", ""),
        "attack_type": prediction,
        "response": response,
        "metadata": data.get("metadata", {})
    }
    structured_log = processor.process_log(raw_log)
    col = "logs_live" if mode == "live" else "logs_demo"
    
    if db is not None:
        try:
            db.collection(col).add(structured_log)
            return
        except Exception as e:
            print(f"[FIRESTORE] Failed to save structured log: {e}")

    # Fallback to CSV (storing JSON for structured consistency)
    target_path = get_file_path(mode)
    with open(target_path, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            structured_log["timestamp"],
            structured_log["input_payload"],
            structured_log["attack_type"],
            json.dumps(structured_log) 
        ])

def log_attack(log_data: dict, mode="demo"):
    """
    Processes and saves an attack log with full risk metrics.
    """
    structured_log = processor.process_log(log_data)
    col = "logs_live" if mode == "live" else "logs_demo"
    
    if db is not None:
        try:
            db.collection(col).add(structured_log)
            return
        except Exception as e:
            print(f"[FIRESTORE] Failed to save structured attack log: {e}")

    # Fallback to CSV
    target_path = get_file_path(mode)
    with open(target_path, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            structured_log["timestamp"],
            structured_log["input_payload"],
            structured_log["attack_type"],
            json.dumps(structured_log)
        ])

