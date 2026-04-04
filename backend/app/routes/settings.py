from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import json
import os
from app.utils.settings_manager import load_settings, save_settings

router = APIRouter()

class SettingsSchema(BaseModel):
    analyst_email: str
    priority_attacks: List[str]
    automation_enabled: bool
    report_tier: str
    mode: str
    ai_threshold: str
    siem_enabled: bool
    work_mode: str
    analyst_name: Optional[str] = "Unknown Analyst"
    shift_time: Optional[str] = "09:00 - 17:00 (Day)"

@router.get("/settings")
def get_settings():
    """
    Returns the current automation settings.
    """
    return load_settings()

@router.post("/settings")
def update_settings(data: SettingsSchema):
    """
    Updates the automation settings.
    """
    if save_settings(data.dict()):
        # 🔹 Initialize/Update Analyst Activity Profile
        activity_file = os.path.join(os.path.dirname(__file__), "..", "database", "analyst_activity.json")
        
        profile = {
            "analyst_name": data.analyst_name,
            "role": data.report_tier,
            "shift": data.shift_time,
            "email": data.analyst_email,
            "priority_attacks": data.priority_attacks,
            "activity_log": []
        }

        # Check if file exists to preserve structure
        if os.path.exists(activity_file):
            with open(activity_file, "r") as f:
                try:
                    existing_data = json.load(f)
                except:
                    existing_data = []
        else:
            existing_data = []

        # For Task 3: We replace the current active profile (index 0)
        # In a multi-analyst future, we would append or find by name.
        if existing_data:
            # Preserve old logs but update profile info
            existing_data[0]["analyst_name"] = data.analyst_name
            existing_data[0]["role"] = data.report_tier
            existing_data[0]["shift"] = data.shift_time
            existing_data[0]["email"] = data.analyst_email
            existing_data[0]["priority_attacks"] = data.priority_attacks
        else:
            existing_data = [profile]

        with open(activity_file, "w") as f:
            json.dump(existing_data, f, indent=4)

        return {"status": "success", "message": "Settings and Analyst Profile updated"}
    else:
        raise HTTPException(status_code=500, detail="Failed to save settings")
