from fastapi import APIRouter
import csv
import os
import json
from collections import Counter, defaultdict
from app.utils.logger import get_file_path
from datetime import datetime, timedelta
from app.utils.time_utils import get_now_ist
from app.database.connection import db

router = APIRouter()

@router.get("/insights")
def get_insights(mode: str = "demo"):
    """
    Returns real-time threat intelligence by aggregating logs from CSV or Firestore.
    """
    target_path = get_file_path(mode)
    time_series_data = defaultdict(lambda: defaultdict(int))
    payload_counter = Counter()
    classification_counts = Counter()
    
    # 🔹 Data Structure for Frontend
    attacks_of_interest = [
        "sqli", "xss", "bruteforce", "command_injection", "path_traversal", 
        "file_upload_attack", "ddos_pattern", "csrf", "jwt_attack", "api_abuse", "suspicious"
    ]

    now = get_now_ist()
    # Initialize last 24 hours with zeros to ensure smooth charts
    for i in range(23, -1, -1):
        hour_str = (now - timedelta(hours=i)).strftime("%H:00")
        time_series_data[hour_str] = {attack: 0 for attack in attacks_of_interest}

    # 1. Fetch from Firestore if available
    if db is not None:
        try:
            col = "logs_live" if mode == "live" else "logs_demo"
            # Get logs from last 24 hours
            since = now - timedelta(hours=24)
            docs = db.collection(col).where("timestamp", ">=", since.isoformat()).stream()
            
            for doc in docs:
                data = doc.to_dict()
                ts_str = data.get("timestamp", "")
                attack_type = data.get("attack_type", "normal")
                payload = data.get("input_payload", "N/A")
                confidence = data.get("risk_assessment", {}).get("confidence", 0)
                
                try:
                    dt = datetime.fromisoformat(ts_str.replace('Z', ''))
                    hour_key = dt.strftime("%H:00")
                    if hour_key in time_series_data:
                        if attack_type in time_series_data[hour_key]:
                            time_series_data[hour_key][attack_type] += 1
                except:
                    pass
                
                if attack_type != "normal":
                    payload_counter[(payload, attack_type)] += 1
                    
                # Classification Accuracy Simulation using AI confidence
                if confidence > 0.9: classification_counts["Confident (ML >90%)"] += 1
                elif confidence > 0.7: classification_counts["Probable (ML 70-90%)"] += 1
                else: classification_counts["Uncertain (ML <70%)"] += 1

        except Exception as e:
            print(f"[INSIGHTS] Firestore error: {e}")

    # 2. Fallback/Sync with Local CSV
    if os.path.exists(target_path):
        try:
            with open(target_path, "r", encoding="utf-8") as file:
                reader = csv.reader(file)
                for row in reader:
                    if len(row) < 4: continue
                    ts_str, payload, attack_type, full_json_str = row
                    
                    try:
                        # Only process data from last 24 hours
                        dt = datetime.fromisoformat(ts_str.replace('Z', ''))
                        if dt < (now - timedelta(hours=24)): continue
                        
                        hour_key = dt.strftime("%H:00")
                        if hour_key in time_series_data:
                            if attack_type in time_series_data[hour_key]:
                                time_series_data[hour_key][attack_type] += 1
                        
                        if attack_type != "normal":
                            payload_counter[(payload, attack_type)] += 1
                        
                        # Extract confidence from JSON if available
                        full_data = json.loads(full_json_str)
                        conf = full_data.get("risk_assessment", {}).get("confidence", 0.5)
                        if conf > 0.9: classification_counts["Confident (ML >90%)"] += 1
                        elif conf > 0.7: classification_counts["Probable (ML 70-90%)"] += 1
                        else: classification_counts["Uncertain (ML <70%)"] += 1
                        
                    except:
                        pass
        except Exception as e:
            print(f"[INSIGHTS] CSV error: {e}")

    # 🔹 Format for Recharts AreaChart
    sorted_times = sorted(time_series_data.keys(), key=lambda x: (x < now.strftime("%H:00"), x))
    time_series = []
    for k in sorted_times:
        entry = {"time": k}
        entry.update(time_series_data[k])
        time_series.append(entry)

    # 🔹 Format Top Payloads
    top_payloads = []
    for (p, t), c in payload_counter.most_common(10):
        top_payloads.append({"payload": p, "count": c, "type": t})

    # 🔹 Format Classification Accuracy
    accuracy_data = []
    total_classified = sum(classification_counts.values())
    if total_classified == 0:
        accuracy_data = [
            {"name": "Confident (ML >90%)", "value": 0},
            {"name": "Probable (ML 70-90%)", "value": 0},
            {"name": "Uncertain (ML <70%)", "value": 0}
        ]
    else:
        for name in ["Confident (ML >90%)", "Probable (ML 70-90%)", "Uncertain (ML <70%)"]:
            accuracy_data.append({"name": name, "value": classification_counts[name]})

    return {
        "mode": "live" if mode == "live" else "demo",
        "time_series": time_series,
        "top_payloads": top_payloads,
        "classification_accuracy": accuracy_data
    }
