import requests
import sys

URL = "http://localhost:8000/attack"
TEST_VECTORS = [
    # Edge cases
    ("eval(atob('YWxlcnQoMSk='))", "xss", "filter_bypass_simulate"),
    ("resume.pdf.exe", "file_upload_attack", "fake_upload"),
    ("Click here to reset your compromised password", "suspicious", "monitor"),
    ("admin' OR 1=1", "sqli", "fake_db"), 
    ("whoami", "command_injection", "fake_shell_output")
]

print("Starting verification of honeypot actions...")
success = True

try:
    for payload, expected_pred, expected_action in TEST_VECTORS:
        print(f"\\nTesting payload: '{payload}'")
        res = requests.post(URL, json={"input": payload, "source": "automated_verifier"})
        
        if res.status_code == 200:
            data = res.json()
            pred = data.get("prediction")
            action = data.get("action")
            
            print(f"  Received Prediction: {pred}")
            print(f"  Received Action:     {action}")
            
            if pred == expected_pred and action == expected_action:
                print("  [SUCCESS] Match confirmed.")
            else:
                print(f"  [FAILURE] Expected ({expected_pred}, {expected_action})")
                success = False
        else:
            print(f"  [ERROR] HTTP {res.status_code}: {res.text}")
            success = False
            
    if success:
        print("\\nAll tests passed successfully.")
    else:
        print("\\nSome tests failed.")
        sys.exit(1)
except requests.exceptions.ConnectionError:
    print("\\n[ERROR] Connection failed. Is the server running at http://localhost:8000 ?")
    sys.exit(1)
