from fastapi import APIRouter
import csv
import os
from collections import Counter
from app.utils.logger import get_file_path

router = APIRouter()

@router.get("/analysis")
def analyze(mode: str = "demo"):
    attacks = []
    target_path = get_file_path(mode)

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
