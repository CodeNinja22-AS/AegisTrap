from flask import Flask, request, jsonify
import requests
import threading
from datetime import datetime
import json

app = Flask(__name__)

# The Central AegisTrap Server
AEGISTRAP_CORE_URL = "http://127.0.0.1:8000/attack"

def forward_to_core(payload_data, source_node):
    """Asynchronously forwards the attack to the ML backend so the honeypot doesn't block."""
    try:
        requests.post(AEGISTRAP_CORE_URL, json={
            "input": payload_data,
            "source": source_node
        }, timeout=3)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚨 Threat forwarded to AegisTrap Core: {payload_data}")
    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ Failed to contact Core: {e}")

@app.route("/", defaults={'path': ''}, methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def catch_all(path):
    """
    The universal trap. Any HTTP request made to this server will be caught here.
    """
    # 1. Extract potential attack vectors
    method = request.method
    full_path = request.full_path.rstrip('?') # e.g. /etc/passwd
    
    # Try to grab JSON body or raw data
    raw_data = ""
    if request.is_json:
        raw_data = json.dumps(request.get_json())
    elif request.data:
        raw_data = request.data.decode('utf-8')
        
    # Combine what the attacker sent into a single analytical payload string
    # If they hit the root with no data, just log "Connection Probe"
    combined_payload = full_path if full_path != '/' else ''
    if raw_data:
        combined_payload += f" [BODY]: {raw_data}"
        
    if not combined_payload:
         combined_payload = f"[{method}] Probe"

    combined_payload = combined_payload.strip()

    # 2. Fire the thread to hit the ML Backend seamlessly
    threading.Thread(target=forward_to_core, args=(combined_payload, "http_honeypot_node_1")).start()

    # 3. Hallucinate a generic Apache/Nginx response to keep them engaged
    return """
    <html>
        <head><title>404 Not Found</title></head>
        <body>
            <center><h1>404 Not Found</h1></center>
            <hr><center>nginx/1.24.0 (Ubuntu)</center>
        </body>
    </html>
    """, 404

if __name__ == "__main__":
    print("==================================================")
    print("🕸️  HTTP AGENTIC HONEYPOT ACTIVE 🕸️")
    print("Listening on 0.0.0.0:5000")
    print("Forwarding intercepts to: " + AEGISTRAP_CORE_URL)
    print("==================================================")
    
    # Run the Flask app on all interfaces on port 5000
    app.run(host="0.0.0.0", port=5000, debug=False)
