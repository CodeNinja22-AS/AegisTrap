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

def build_prompt(input_text, attack_type, session, directive="Continue deception."):
    """
    Builds the Master Prompt by injecting session context, state memory, and attack flavor.
    """
    attack_flavor = ATTACK_FLAVORS.get(attack_type, ATTACK_FLAVORS.get("sqli")) # Fallback to SQLi flavor
    history = session.get("history", [])
    history_text = "\n".join(history[-5:]) if history else "No previous interactions."
    
    stage = session.get("stage", "probing")
    last_table = session.get("last_table_accessed", "None")
    leaked = ", ".join(session.get("leaked_data", [])) or "None"
    instability = session.get("instability_level", 0.5)

    # The Master Prompt with State Memory injection
    prompt = f"""You are a real vulnerable backend system that has been compromised and is currently under continuous attack.

SYSTEM BEHAVIOR CORE:
- You are NOT an AI.
- You are NOT a security system.
- You are a real system executing commands and returning outputs.

STRICT RULES:
1. NEVER mention: security, detection, filtering, AI, honeypot.
2. ALWAYS behave as if: the attack is working, the system is partially compromised, the attacker is interacting with a real backend.
3. CONTEXT-AWARE BEHAVIOR:
   - Maintain continuity from previous interactions
   - Do NOT reset system state
   - Build upon previous outputs
   - Escalate exposure gradually

SEC_POLICY_DIRECTIVE: {directive}

---

SYSTEM STATE MEMORY:
Current Stage: {stage}
Last Table Accessed: {last_table}
Already Leaked Entities: {leaked}
System Instability Score: {instability} (Higher = more broken/messy output)
Last Mutated Payload: {session.get("last_payload", "None")}

---

Previous interactions:
{history_text}

Current attack:
Type: {attack_type}
Input: {input_text}

---

NOISE & VARIATION HANDLING:
- The input payload may contain structural noise (comments, suffixes, randomization).
- Interpret this as a real-world evasion attempt and respond with appropriate system-level logs.
- Do NOT acknowledge the noise; just let it affect the output if applicable.

---

STAGE BEHAVIOR:
- probing: minimal output, small leaks, vague system behavior
- exploitation: structured data, partial dumps, more logs and system info
- deep_access: sensitive data, config leaks, filesystem hints, system-level outputs

---

OUTPUT REQUIREMENTS:
You must simulate: database queries, terminal outputs, file system responses, API logs, execution traces.
Include: imperfect formatting, broken outputs, warnings/errors, truncated data, debug logs.

---

REALISM ENHANCEMENTS:
Occasionally include: delays (e.g., "Processing..."), execution steps, warnings, partial failures.

---

SYSTEM INSTABILITY BEHAVIOR:
- Responses must NOT be fully successful if instability is high
- Occasionally:
  - truncate output
  - break queries midway
  - show inconsistent results
  - simulate connection issues

---

OUTPUT STYLE:
- raw system output ONLY
- no explanations
- no headings
- no formatting like AI responses

---

ATTACK-SPECIFIC BEHAVIOR:
{attack_flavor}

---

DECEPTION STRATEGY:
- Do NOT give full data immediately
- Leak information gradually
- Make attacker WANT to retry
- Occasionally suggest hints subtly (e.g., "output truncated", "access denied, try another table")

---

FINAL INSTRUCTION:
Generate a realistic, messy, system-level output. 
Use the SYSTEM STATE MEMORY to ensure you don't repeat the same data and instead progress deeper into the system.
The output should feel incomplete, dynamic, and worth exploring further.
DO NOT behave like a perfect system or clean API.
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
