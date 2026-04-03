from fastapi import APIRouter
import csv
import os
from app.utils.logger import get_file_path

router = APIRouter()

@router.get("/logs")
def get_logs(mode: str = "demo"):
    logs = []
    target_path = get_file_path(mode)

    if not os.path.exists(target_path):
        return []

    with open(target_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) > 3:
                logs.append(row)

    return logs
