import csv
import os
from datetime import datetime
from app.utils.time_utils import get_now_ist

base_dir = os.path.dirname(os.path.dirname(__file__)) # goes to app/
db_dir = os.path.join(base_dir, "database")

# Ensure the database directory exists
if not os.path.exists(db_dir):
    os.makedirs(db_dir)

# Instead of hardcoded file_path, we define a getter
def get_file_path(mode="demo"):
    if mode == "live":
        return os.path.join(db_dir, "logs_live.csv")
    return os.path.join(db_dir, "logs.csv")

# For backward compatibility if strictly needed natively elsewhere
file_path = get_file_path("demo")

def save_log(data, prediction, response, mode="demo"):
    target_path = get_file_path(mode)
    print("Writing to:", target_path, "Mode:", mode)  # Debug

    with open(target_path, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            get_now_ist().isoformat(),
            data.get("input"),
            prediction,
            response
        ])

def log_attack(log_data: dict, mode="demo"):
    target_path = get_file_path(mode)
    with open(target_path, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            log_data.get("timestamp", get_now_ist().isoformat()),
            log_data.get("input", ""),
            log_data.get("attack_type", "unknown"),
            log_data.get("response", "")
        ])

