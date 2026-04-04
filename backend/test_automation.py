import asyncio
import os
from app.services.email_service import send_email
from app.services.report_service import generate_report

async def test_automation():
    attack_data = {
        "timestamp": "2026-04-02 22:50:00",
        "input": "1' OR '1'='1",
        "attack_type": "sqli",
        "stage": "exploitation"
    }
    
    print("[TEST] Generating Tier 3 report...")
    report_html = generate_report(attack_data, "Tier 3")
    
    print("[TEST] Sending email to abhrantsingh2226@gmail.com...")
    await send_email("[TEST ALERT] SQLI detected - AegisTrap SOC", "abhrantsingh2226@gmail.com", report_html)
    print("[TEST] Check your inbox!")

if __name__ == "__main__":
    asyncio.run(test_automation())
