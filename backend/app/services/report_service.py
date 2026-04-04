from app.services.ai_service import call_llm

def build_report_prompt(log_data, role):
    """
    Creates a detailed SOC reporting prompt based on incident data and target role.
    """
    return f"""
You are a cybersecurity incident reporting system.
Generate a professional SOC report in clean HTML format.

ROLE: {role}

Incident Details:
- Time: {log_data.get("timestamp", "N/A")}
- Attack Type: {log_data.get("attack_type", "Unknown")}
- Payload: {log_data.get("input", "N/A")}
- System Stage: {log_data.get("stage", "N/A")}

---

Report Guidelines:

For Tier 1:
- Short summary
- Basic explanation
- Immediate action

For Tier 2:
- Technical breakdown
- Attack flow
- Indicators of compromise

For Tier 3:
- Deep analysis
- Root cause
- Mitigation strategy
- Future prevention

---

Format Requirements:
- Use <h2> for Title
- Use <b> for labels
- Use <ul> for lists
- Professional tone, NO conversational filler.
- DO NOT show the thinking process.
"""

def generate_report(log_data, role="Tier 1"):
    """
    Generates a structured SOC report using LLM.
    """
    prompt = build_report_prompt(log_data, role)
    
    messages = [
        {"role": "system", "content": "You are a professional SOC Analyst reporting bot. Output only HTML."},
        {"role": "user", "content": prompt}
    ]
    
    report_html = call_llm(messages, max_tokens=800, temperature=0.6)
    return report_html
