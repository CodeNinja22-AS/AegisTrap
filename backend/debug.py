import traceback
from app.services.ml_service import predict_attack
from app.services.ai_service import generate_ai_response
from app.utils.logger import log_attack
from app.utils.time_utils import get_now_ist
from datetime import datetime

from pydantic import BaseModel

class AttackRequest(BaseModel):
    input: str
    source: str

try:
    data = AttackRequest(input="1 OR 1=1", source="web")
    print("Running ML...")
    attack_type = predict_attack(data.input)
    print("ML Output:", attack_type)
    
    print("Running AI...")
    ai_output = generate_ai_response(data.input, attack_type)
    print("AI Output:", ai_output)
    
    print("Logging...")
    log_attack({
        "timestamp": get_now_ist().isoformat(),

        "input": data.input,
        "attack_type": attack_type,
        "response": ai_output
    })
    print("Success!")
except Exception as e:
    print("EXCEPTION OCCURRED:", e)
    traceback.print_exc()
