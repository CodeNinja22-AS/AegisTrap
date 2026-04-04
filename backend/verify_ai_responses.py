import os
import sys
from dotenv import load_dotenv

# Add the project root to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.ai_service import generate_ai_response

# Load environment variables
load_dotenv()

def test_ai_response(input_text, attack_type, instability=0.2):
    print(f"\n{'='*50}")
    print(f"TESTING: {attack_type} (Instability: {instability})")
    print(f"INPUT: {input_text}")
    print(f"{'='*50}")
    
    session = {
        "history": [],
        "stage": "exploitation",
        "last_table_accessed": "users",
        "leaked_data": ["username", "email", "password_hash"],
        "instability_level": instability
    }
    
    response = generate_ai_response(input_text, attack_type, session)
    print("AI RESPONSE:")
    # Ensure raw output is shown clearly
    print(f"--- START OUTPUT ---\n{response}\n--- END OUTPUT ---")
    print(f"{'='*50}")

if __name__ == "__main__":
    if not os.getenv("HF_TOKEN"):
        print("Warning: HF_TOKEN not found. Response will be fallback.")
    
    # Standard Attack Types
    test_ai_response("1 UNION SELECT username, password FROM users--", "sqli")
    test_ai_response("<img src=x onerror=alert(document.cookie)>", "xss")
    test_ai_response("; cat /etc/passwd", "command_injection")
    test_ai_response("../../../.env", "path_traversal")
    
    # New Attack Types
    test_ai_response("eyJhbGciOiJIUzI1NiIs...", "jwt_attack")
    test_ai_response("GET /api/v1/debug/dump", "api_abuse")
    test_ai_response("SYN Flood from 192.168.1.50", "ddos_pattern")
    
    # Chaos/High Instability Test
    test_ai_response("DROP TABLE users;", "sqli", instability=0.9)
