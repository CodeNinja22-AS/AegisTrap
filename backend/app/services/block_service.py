def generate_block_response(input_text, attack_type):
    """
    Returns a static, discouraging security response based on the attack type.
    """
    responses = {
        "sqli": """ERROR 403: Forbidden
[SECURITY ALERT] SQL Injection pattern detected.
Source IP logged. Access denied by Web Application Firewall (WAF).
Incident ID: SG-9284-AX
""",
        "xss": """Request Rejected.
The system has detected a potential Cross-Site Scripting (XSS) attempt.
Malicious scripts have been sanitized and blocked.
Status: 406 Not Acceptable
""",
        "command_injection": """Access Denied.
Unauthorized system command execution attempt.
The kernel has terminated the suspicious process branch.
Security log entry created.
""",
        "bruteforce": """429 Too Many Requests.
Rate limit exceeded for authentication attempts. 
Your access has been temporarily suspended.
""",
        "default": """Connection Terminated.
Your request was flagged as malicious by the AegisTrap Intrusion Prevention System (IPS).
No further communication is permitted from this session.
"""
    }
    
    return responses.get(attack_type, responses["default"])
