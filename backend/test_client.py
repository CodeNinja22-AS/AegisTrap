import traceback
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

try:
    response = client.post("/attack?mode=live", json={"input": "1 OR 1=1", "source": "web"})
    print("Status:", response.status_code)
    print("Body:", response.text)
except Exception as e:
    print("TestClient raised exception directly:")
    traceback.print_exc()
