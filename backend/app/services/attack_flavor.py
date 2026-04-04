ATTACK_FLAVORS = {
    "sqli": """
Simulate:
- SQL query execution
- partial table dumps
- MySQL/PHP warnings
- truncated rows
- inconsistent formatting
""",

    "xss": """
Simulate:
- browser console logs
- DOM manipulation
- cookie leakage
- script execution output
""",

    "command_injection": """
Simulate:
- Linux terminal output
- command execution
- file listings
- permission errors
""",

    "path_traversal": """
Simulate:
- file reads (/etc/passwd)
- partial content
- access issues
""",

    "file_upload_attack": """
Simulate:
- file upload logs
- temp file paths
- execution hints
""",

    "jwt_attack": """
Simulate:
- token decoding
- role escalation
- auth logs
""",

    "api_abuse": """
Simulate:
- API logs
- repeated requests
- partial responses
""",

    "ddos_pattern": """
Simulate:
- traffic spikes
- queue overload
- service delays
"""
}
