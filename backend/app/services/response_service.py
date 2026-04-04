import time

def generate_response(action):
    if action == "fake_db":
        return {
            "data": [
                {"username": "admin", "password": "1234"},
                {"username": "user", "password": "abcd"}
            ]
        }

    elif action == "slow_response":
        time.sleep(2)
        return "Too many attempts... slowing down"

    elif action == "filter_bypass_simulate":
        return "ERROR: WAF blocked input but encoded execution <script>var a='XSS_DETECT_NODE';</script> logged."

    elif action == "fake_shell_output":
        return "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n[Warning] terminal emulated mode"

    elif action == "fake_file_system":
        return "Directory of C:\\Windows\\System32\\\n11/04/2026  10:23 AM    <DIR>          config\n11/04/2026  10:23 AM    <DIR>          drivers"

    elif action == "fake_upload":
        return "File uploaded successfully"
        
    elif action == "slow_response_ddos":
        time.sleep(2)
        return "Server overloaded, retry later"
        
    elif action == "fake_transaction":
        return "Transaction completed"
        
    elif action == "fake_auth_success":
        return "Access granted: admin"
        
    elif action == "rate_limit_simulation":
        return "Too many requests"

    elif action == "monitor":
        return "Command logged. Monitoring activity..."

    else:
        return "Login failed"
