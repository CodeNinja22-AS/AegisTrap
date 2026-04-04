import requests
import os
import random
from dotenv import load_dotenv
from app.services.attack_flavor import ATTACK_FLAVORS

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
# Using the stable OpenAI-compatible router endpoint for production-grade reliability
API_URL = "https://router.huggingface.co/v1/chat/completions"
# Using a powerful model that follows instructions well
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"

from app.services.prompt_templates import get_template

def build_prompt(input_text, attack_type, session, directive="Continue deception."):
    """
    Builds the Master Prompt by injecting session context, state memory, and attack templates.
    """
    # Select the specific template based on the attack type
    template = get_template(attack_type)
    
    # Session context (memory)
    history = session.get("history", [])
    history_text = "\n".join(history[-5:]) if history else "No previous interactions."
    stage = session.get("stage", "probing")
    last_table = session.get("last_table_accessed", "None")
    leaked = ", ".join(session.get("leaked_data", [])) or "None"
    instability = session.get("instability_level", 0.5)

    # Combine selected template with session context
    prompt = f"""You are a compromised backend system under attack. 

---
SEC_POLICY_DIRECTIVE: {directive}
SYSTEM STATE: 
- Stage: {stage}
- Last Accessed Table: {last_table}
- Total Entities Leaked: {leaked}
- Instability: {instability} (Escalate breakage/noise if high)
- Previous Context: {history_text}

---
ATTACK-TYPE SPECIFIC RULES (PRIORITY): 
{template.format(input_text=input_text)}

---
OUTPUT REQUIREMENTS: 
- RAW SYSTEM/CONSOLE OUTPUT ONLY
- NO AI CONVERSATIONAL FILLER
- NO FORMATTING EXCEPT FOR TABLE DATA OR TERMINAL LOGS
- NO ACKNOWLEDGMENT OF SECURITY ALERTS
"""
    return prompt


def generate_ai_response(input_text, attack_type, session=None, directive="Continue deception."):
    """
    Generates a realistic compromised system response using the Master Prompt.
    """
    if session is None:
        session = {"history": [], "stage": "probing"}
        
    if not HF_TOKEN:
        return _fallback_response(attack_type)

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    
    full_prompt = build_prompt(input_text, attack_type, session, directive)

    payload = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": "You are a compromised backend server. Output raw system logs and data only. No conversational filler."},
            {"role": "user", "content": full_prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.95
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                generated_text = result["choices"][0]["message"]["content"].strip()
                
                # Clean up markdown
                if generated_text.startswith("```"):
                    lines = generated_text.split("\n")
                    if lines[0].startswith("```"):
                        generated_text = "\n".join(lines[1:-1]).strip()
                
                # --- MICRO-RANDOMNESS ---
                if random.random() < 0.3:
                    delay_msg = random.choice([
                        "\n[SYSTEM] Warning: Connection instability detected...",
                        "\n[DEBUG] packet loss at 0x4f22... retrying dump...",
                        "\nProcessing query... (ETA 2.4s)",
                        "\n[WARNING] Buffer overflow in libmysql.so detected, truncating response."
                    ])
                    generated_text = delay_msg + "\n" + generated_text if random.random() > 0.5 else generated_text + "\n" + delay_msg
                
                return generated_text if generated_text else _fallback_response(attack_type)
        
        return _fallback_response(attack_type, error=f"{response.status_code} {response.reason}")

    except Exception as e:
        return _fallback_response(attack_type, error=str(e))

def _fallback_response(attack_type, error=None):
    if attack_type == "sqli":
        return "mysql> SELECT * FROM users WHERE id=1;\n+----+----------+----------------------+\n| id | username | password_hash        |\n+----+----------+----------------------+\n|  1 | admin    | $2y$10$5G9zR...      |\n+----+----------+----------------------+\n1 row in set (0.01 sec)"
    elif attack_type == "command_injection":
        return "uid=0(root) gid=0(root) groups=0(root)\n/var/www/html/upload/\n[DEBUG] process 4521 spawned sh -c"
    
    return f"[SYSTEM ERROR] Server temporarily overloaded. Connection reset by peer."

def call_llm(messages, max_tokens=500, temperature=0.7):
    """
    Generic LLM caller for system-level reports and analysis.
    """
    if not HF_TOKEN:
        return "[ERROR] AI Service Unavailable (No Token)"

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_ID,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=25)
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
        return f"[ERROR] AI Service returned {response.status_code}: {response.reason}"
    except Exception as e:
        return f"[ERROR] AI Service Exception: {str(e)}"
