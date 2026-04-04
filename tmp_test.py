import urllib.request
import json
import urllib.error

url = "http://127.0.0.1:8000/attack"
data = {"input": "1 OR 1=1", "source": "web"}
req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), {'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode())
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.reason)
    print(e.read().decode())
except Exception as e:
    print("Exception:", e)
