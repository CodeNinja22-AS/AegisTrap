from fastapi import APIRouter
import json
import os
from app.services.analysis_service import generate_analyst_summary

router = APIRouter()

ACTIVITY_FILE = os.path.join(os.path.dirname(__file__), "..", "database", "analyst_activity.json")

@router.get("/analyst/activity")
def get_activity():
    """
    Returns the full analyst activity log.
    """
    if not os.path.exists(ACTIVITY_FILE):
        return []
        
    with open(ACTIVITY_FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return []

@router.get("/analyst/summary")
def get_summary():
    """
    Returns an aggregated performance summary of the active analyst.
    """
    if not os.path.exists(ACTIVITY_FILE):
        return {}

    with open(ACTIVITY_FILE, "r") as f:
        try:
            data = json.load(f)
            if not data:
                return {}
            
            # Generate summary for the active analyst at index 0
            return generate_analyst_summary(data[0].get("activity_log", []))
        except:
            return {}
