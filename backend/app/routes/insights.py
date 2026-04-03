from fastapi import APIRouter
import csv
import os
from collections import Counter
from app.utils.logger import get_file_path
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/insights")
def get_insights(mode: str = "demo"):
    if mode == "demo":
        # Generate rich dashboard data simulating a heavy cyber attack over 24 hours
        time_series = []
        now = datetime.now()
        
        for i in range(24, -1, -1):
            target_hour = now - timedelta(hours=i)
            time_series.append({
                "time": target_hour.strftime("%H:00"),
                "sqli": random.randint(10, 150),
                "xss": random.randint(5, 80),
                "bruteforce": random.randint(20, 200),
                "command_injection": random.randint(5, 120),
                "path_traversal": random.randint(10, 90),
                "file_upload_attack": random.randint(5, 45),
                "ddos_pattern": random.randint(20, 300),
                "csrf": random.randint(10, 60),
                "jwt_attack": random.randint(5, 40),
                "api_abuse": random.randint(30, 150),
                "suspicious": random.randint(5, 30)
            })
            
        return {
            "mode": "dummy",
            "time_series": time_series,
            "top_payloads": [
                {"payload": "admin' OR '1'='1", "count": 1342, "type": "sqli"},
                {"payload": "admin123", "count": 856, "type": "bruteforce"},
                {"payload": "AAAAAA repeated spam", "count": 780, "type": "ddos_pattern"},
                {"payload": "<script>alert(1)</script>", "count": 643, "type": "xss"},
                {"payload": "shell.php", "count": 512, "type": "file_upload_attack"},
                {"payload": "1; DROP TABLE users", "count": 421, "type": "sqli"},
                {"payload": "/api/login spam", "count": 395, "type": "api_abuse"},
                {"payload": "../../../../etc/passwd", "count": 310, "type": "path_traversal"},
                {"payload": "<form action='/transfer'>", "count": 250, "type": "csrf"},
                {"payload": "; cat /etc/shadow", "count": 215, "type": "command_injection"}
            ],
            "classification_accuracy": [
                {"name": "Confident (ML >90%)", "value": 85},
                {"name": "Probable (ML 70-90%)", "value": 10},
                {"name": "Uncertain (ML <70%)", "value": 5}
            ]
        }
    else:
        # Logic to extract real data from logs_live.csv
        target_path = get_file_path(mode)
        time_series_data = {}
        payload_counter = Counter()
        
        if not os.path.exists(target_path):
             return {
                 "mode": "live",
                 "time_series": [],
                 "top_payloads": [],
                 "classification_accuracy": []
             }
             
        with open(target_path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) > 3:
                    ts_str, payload, prediction, _ = row
                    
                    try:
                        # Parse standard timestamp to extract hour
                        dt = datetime.fromisoformat(ts_str.replace('Z', ''))
                        hour_key = dt.strftime("%H:00")
                        
                        if hour_key not in time_series_data:
                            time_series_data[hour_key] = {"time": hour_key, "sqli": 0, "xss": 0, "bruteforce": 0, "suspicious": 0, "command_injection": 0, "path_traversal": 0, "file_upload_attack": 0, "ddos_pattern": 0, "csrf": 0, "jwt_attack": 0, "api_abuse": 0}
                        
                        if prediction in time_series_data[hour_key]:
                            time_series_data[hour_key][prediction] += 1
                            
                    except ValueError:
                        pass
                        
                    payload_counter[payload] += 1
        
        # Sort time series by hour
        sorted_times = sorted(time_series_data.keys())
        time_series = [time_series_data[k] for k in sorted_times]
        
        # Top 5 payloads
        top_payloads = [{"payload": p, "count": c, "type": "Real Log"} for p, c in payload_counter.most_common(5) if p and p.strip() != ""]
        
        return {
            "mode": "real",
            "time_series": time_series,
            "top_payloads": top_payloads,
            "classification_accuracy": [
                {"name": "Auto-Blocked", "value": 90},
                {"name": "Flagged", "value": 10}
            ]
        }
