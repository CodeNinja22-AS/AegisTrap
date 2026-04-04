from fastapi import APIRouter
import csv
import os
from app.utils.logger import get_file_path
from app.utils.settings_manager import load_settings

router = APIRouter()

@router.get("/logs")
def get_logs(mode: str = None):
    settings = load_settings()
    current_mode = mode or settings.get("work_mode", "demo")
    
    logs = []
    target_path = get_file_path(current_mode)
    

    if not os.path.exists(target_path):
        return []

    with open(target_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) > 3:
                logs.append(row)

    return logs
