import os
from dotenv import load_dotenv
from app.services.ai_service import generate_ai_response

# Load environment variables
load_dotenv()

def test_ai_response(input_text, attack_type):
    print(f"\n{'='*50}")
    print(f"TESTING: {attack_type}")
    print(f"INPUT: {input_text}")
    print(f"{'='*50}")
    
    session = {
        "history": [],
        "stage": "exploitation",
        "last_table_accessed": "users",
        "leaked_data": ["username", "email"],
        "instability_level": 0.2
    }
    
    response = generate_ai_response(input_text, attack_type, session)
    print("AI RESPONSE:")
    print(response)
    print(f"{'='*50}")

if __name__ == "__main__":
    if not os.getenv("HF_TOKEN"):
        print("Error: HF_TOKEN not found. Response will be fallback.")
    
    # Test cases
    test_ai_response("1 OR 1=1", "sqli")
    test_ai_response("<script>alert('XSS')</script>", "xss")
    test_ai_response("; cat /etc/passwd", "command_injection")
    test_ai_response("../../../etc/shadow", "path_traversal")
    test_ai_response("guest", "normal")
