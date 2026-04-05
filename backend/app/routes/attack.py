import re
import os
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.services.ml_service import predict_attack
from app.services.ai_service import generate_ai_response
from app.services.session_store import get_session, update_stage
from app.services.report_service import generate_report
from app.services.email_service import send_email
from app.utils.settings_manager import load_settings
from app.utils.logger import log_attack
from app.utils.time_utils import get_now_ist
# from app.services.payload_service import generate_final_payload


# 🔹 Task 2: Security Layer Services
from app.services.mode_service import get_mode_behavior
from app.services.block_service import generate_block_response
from app.services.threshold_service import get_threshold_config
from app.services.siem_service import send_to_siem

# 🔹 Task 3: Analyst Monitoring Services
from app.services.shift_service import is_within_shift
from app.services.activity_service import log_analyst_activity

router = APIRouter()

class AttackRequest(BaseModel):
    input: str
    source: str
    category: Optional[str] = "unknown"
    metadata: Optional[dict] = {}

async def run_automation(log_data, settings):
    """
    Background task to generate AI report and send email.
    """
    try:
        attack_type = log_data.get('attack_type', 'unknown')
        print(f"[AUTOMATION] Starting report generation for: {attack_type}")
        
        # Fallback for email if empty in settings
        recipient = settings.get("analyst_email") or os.getenv("MAIL_USERNAME")
        
        if not recipient:
            print("[AUTOMATION] Aborted: No analyst email found in settings or .env")
            return

        report_html = generate_report(log_data, role=settings.get("report_tier", "Tier 1"))
        
        if not report_html or "[ERROR]" in report_html:
            print(f"[AUTOMATION] Failed: Could not generate report for {attack_type}")
            return

        await send_email(
            subject=f"[ALERT] {attack_type.upper()} detected - AegisTrap SOC",
            email=recipient,
            body=report_html
        )
        print(f"[AUTOMATION] Success: Alert sent to {recipient}")
        
    except Exception as e:
        print(f"[AUTOMATION] Critical Error: {str(e)}")

@router.post("/attack")
async def handle_attack(data: AttackRequest, background_tasks: BackgroundTasks, mode: str = "demo"):
    # 🔹 Step 1: Session Management
    session = get_session(data.source)
    
    # 🔹 Step 2: Meta-data Extraction (Smarter Context)
    table_match = re.search(r'FROM\s+([a-zA-Z0-9_]+)', data.input, re.IGNORECASE)
    if table_match:
        table_name = table_match.group(1).lower()
        session["last_table_accessed"] = table_name
        if table_name not in session["leaked_data"]:
            session["leaked_data"].append(table_name)

    # 🔹 Step 3: Track History
    session["history"].append(data.input)
    
    # 🔹 Step 4: Progressive Stage Update
    update_stage(session)

    # 🔹 Step 5: ML Classification with Threshold Logic
    settings = load_settings()
    mode = settings.get("mode", "IDS")
    threshold_lvl = settings.get("ai_threshold", "balanced")
    siem_enabled = settings.get("siem_enabled", False)

    attack_type, confidence = predict_attack(data.input)
    
    # 🔥 NEW: Payload Mutation Engine
    enhanced_payload = data.input # fallback since generate_final_payload is missing
    session["last_payload"] = enhanced_payload
    
    threshold = get_threshold_config(threshold_lvl)

    # 🔹 AI Sensitivity Check
    if confidence < threshold and attack_type != "normal":
        attack_type = "normal" 

    # 🔹 Forensics Override (High-Sensitivity Safety Net)
    input_lower = data.input.lower()
    
    # 1. SQL Injection (Comprehensive Coverage)
    sqli_patterns = [
        r"(' OR '1'='1|' OR 1=1|' --|' #|' /\*)", # Logic bypass
        r"(UNION\s+SELECT|SELECT.*FROM|INSERT\s+INTO|UPDATE.*SET|DELETE\s+FROM)", # DML
        r"(SLEEP\(|BENCHMARK\(|WAITFOR\s+DELAY)", # Time-based
        r"(HEX\(|UNHEX\(|CONCAT\(|GROUP_CONCAT\()", # Obfuscation
        r"(CHAR\(|CHR\(|ASCII\(|ORD\()", # Encoding bypass
        r"(INFORMATION_SCHEMA|MASTER\.\.|\.SYSTEM_)" # DB internal access
    ]
    if any(re.search(p, input_lower) for p in sqli_patterns):
        attack_type = "sqli"
    
    # 2. XSS (Sensitive Attribute & Tag Detection)
    elif re.search(r"(<script|onerror=|onload=|javascript:|alert\(|eval\(|document\.|<img.*src=|<iframe|<svg|onmouseover=)", input_lower):
        attack_type = "xss"
    
    # 3. Path Traversal (Deep jumps & sensitive files)
    elif re.search(r"(\.\./|\.\.\\|/etc/passwd|/etc/shadow|C:\\Windows|boot\.ini|/proc/|/var/log/)", input_lower):
        attack_type = "path_traversal"
    
    # 4. Command Injection (Shell chaining & common binaries)
    elif re.search(r"(;\s*(id|whoami|cat|ls|pwd|uname|netstat|nc|wget|curl)|&&\s*(id|whoami|cat)|\|\s*(id|whoami|cat)|`.*`)", input_lower):
        attack_type = "command_injection"
    
    # 5. JWT & Session Tampering
    elif re.search(r"(eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+|session_id=|jwt=)", data.input):
        attack_type = "jwt_attack"
        
    # 6. API Abuse & Parameter Tampering
    elif re.search(r"(\"id\"|\"user_id\"|\"admin\"):(\strue|false|[0-9]+)", data.input, re.IGNORECASE) and "/api/" in data.input:
        attack_type = "api_abuse"
        
    # 7. CSRF (Hidden form submission)
    elif "<form" in input_lower and "action=" in input_lower and "csrf" not in input_lower:
        attack_type = "csrf"
        
    # 8. Malicious File Upload (Webshell extensions)
    elif re.search(r"\.(php|jsp|asp|exe|sh|py|pl|cgi|asp|phtml)$", input_lower):
        attack_type = "file_upload_attack"

    # 🔹 Step 6: Decision Engine (IDS vs IPS)
    behavior = get_mode_behavior(mode)
    
    print(f"[DEBUG] Processing Attack Type: {attack_type}")

    
    if behavior["block"] and attack_type != "normal":
        # 🔥 IPS MODE: Return static block response
        ai_output = generate_block_response(data.input, attack_type)
    else:
        # 🔥 IDS MODE: Dynamic AI Deception
        ai_output = generate_ai_response(
            input_text=enhanced_payload, 
            attack_type=attack_type,
            session=session,
            directive=behavior["directive"]
        )

    # 🔹 Step 7: Log data preparation
    log_entry = {
        "timestamp": get_now_ist().isoformat(),
        "input": enhanced_payload,
        "original_input": data.input,
        "attack_type": attack_type,
        "response": ai_output,

        "session_id": data.source,
        "stage": session["stage"],
        "metadata": {
            "last_table": session["last_table_accessed"],
            "leaked_count": len(session["leaked_data"]),
            "instability": session["instability_level"]
        }
    }

    # 🔹 Step 8: Log to CSV
    log_attack(log_entry, mode=mode)

    # 🔹 Stage 9: External Integration (SIEM & Automation)
    if siem_enabled:
        background_tasks.add_task(send_to_siem, log_entry)

    # 🔹 Stage 10: Analyst Audit Check (Task 3)
    # Only log if inside analyst's shift and it's a priority attack
    if is_within_shift(settings.get("shift_time", "")) and attack_type in settings.get("priority_attacks", []):
        background_tasks.add_task(log_analyst_activity, log_entry, settings)

    if settings.get("automation_enabled") and attack_type in settings.get("priority_attacks", []):
        background_tasks.add_task(run_automation, log_entry, settings)

    return {
        "attack_type": attack_type,
        "ai_output": ai_output,
        "stage": session["stage"],
        "session_id": data.source
    }
