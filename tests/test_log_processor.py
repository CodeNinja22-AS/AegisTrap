import sys
import os
import json

# Add backend dir to path to import app
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.utils.log_processor import processor

def test_sqli_risk():
    print("\n--- Testing SQLi Risk Measurement ---")
    raw_log = {
        "attack_type": "sqli",
        "input": "SELECT * FROM users WHERE id=1 OR 1=1;",
        "response": "[DEBUG] mysql> query executed\n[SYSTEM] Warning: I/O bottleneck at 0x7f88",
        "timestamp": "2026-04-01T12:00:00"
    }
    structured = processor.process_log(raw_log)
    print(f"Detected Severity: {structured['severity_level']}")
    assert structured["severity_level"] == "high"
    assert "SQL_TRACE" in structured["security_flags"]
    assert "0x7f88" in structured["memory_indicators"]
    print("✅ SQLi Risk Test Passed")

def test_xss_sensitivity():
    print("\n--- Testing XSS Sensitivity ---")
    raw_log = {
        "attack_type": "xss",
        "input": "<img src=x onerror=alert(1)>",
        "response": "[SECURITY ALERT] XSS attempt blocked.\nERROR 403: Forbidden",
        "timestamp": "2026-04-01T12:05:00"
    }
    structured = processor.process_log(raw_log)
    print(f"Detected Severity: {structured['severity_level']}")
    # Alert tag in response makes it critical
    assert structured["severity_level"] == "critical"
    assert "XSS_PAYLOAD_EXECUTION" in structured["security_flags"]
    print("✅ XSS Sensitivity Test Passed")

def test_path_traversal():
    print("\n--- Testing Path Traversal ---")
    raw_log = {
        "attack_type": "path_traversal",
        "input": "../../../etc/passwd",
        "response": "root:x:0:0:root:/root:/bin/bash\n[DEBUG] File access logged.",
        "timestamp": "2026-04-01T12:10:00"
    }
    structured = processor.process_log(raw_log)
    assert "SYSTEM_FILE_READ" in structured["data_exfiltration_attempts"]
    assert structured["severity_level"] == "medium"
    print("✅ Path Traversal Test Passed")

if __name__ == "__main__":
    try:
        test_sqli_risk()
        test_xss_sensitivity()
        test_path_traversal()
        print("\nAccuracy & Risk Measurement Verification Complete!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)
